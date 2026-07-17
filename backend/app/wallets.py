"""
wallets.py
Smart Wallet feature — DB-backed, per authenticated user.

- GET    /wallets              : all of the current user's wallets
- GET    /wallets/{id}         : single wallet detail
- POST   /wallets              : create a plain wallet manually
- POST   /wallets/{id}/deposit : add money toward a wallet's goal
- DELETE /wallets/{id}
- POST   /wallets/generate     : calls Claude (server-side; API key never
                                  touches the browser) with web_search enabled
                                  to build a grounded budget allocation, then
                                  saves the result as a real DB row for the
                                  current user and returns it in the same
                                  unified shape as every other wallet.
"""

import os
import re
import json
from datetime import datetime, timedelta, date as date_cls
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import get_db
import db_models
from auth import get_current_user
from schemas import WalletGenerateRequest, WalletDetail, WalletAllocationDetail

load_dotenv()

router = APIRouter(prefix="/wallets", tags=["wallets"])

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_MODEL = "claude-sonnet-5"

ICON_LABELS = {
    "travel": "السفر",
    "wedding": "الزواج",
    "car": "السيارة",
    "house": "المنزل",
    "emergency_fund": "الطوارئ",
    "custom": "هدف مخصص",
}


# ---------- request models for the plain (manual) wallet endpoints ----------

class WalletCreateRequest(BaseModel):
    name: str = Field(..., example="محفظة الزواج")
    goal_amount: float = Field(..., gt=0)
    target_date: Optional[datetime] = None
    icon_key: str = "custom"
    currency: str = "SAR"


class WalletDepositRequest(BaseModel):
    amount: float = Field(..., gt=0)


# ---------- shared helper ----------

def _to_response(wallet: db_models.Wallet) -> WalletDetail:
    progress = (wallet.saved_amount / wallet.goal_amount * 100) if wallet.goal_amount else 0
    return WalletDetail(
        id=wallet.id,
        name=wallet.name,
        icon_key=wallet.icon_key or "custom",
        subtitle=wallet.subtitle or "",
        currency=wallet.currency or "SAR",
        target_amount=wallet.goal_amount,
        saved=wallet.saved_amount,
        progress=round(progress, 1),
        monthly_target=wallet.monthly_target or 0.0,
        start_date=wallet.start_date.date().isoformat() if wallet.start_date else date_cls.today().isoformat(),
        target_date=wallet.target_date.date().isoformat() if wallet.target_date else None,
        remaining_months=wallet.remaining_months,
        allocations=wallet.allocations or [],
        summary=wallet.summary or "",
    )


# ---------- plain CRUD ----------

@router.get("", response_model=list[WalletDetail])
def get_wallets(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallets = db.query(db_models.Wallet).filter(db_models.Wallet.user_id == current_user.id).all()
    return [_to_response(w) for w in wallets]


@router.get("/{wallet_id}", response_model=WalletDetail)
def get_wallet(
    wallet_id: int,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallet = (
        db.query(db_models.Wallet)
        .filter(db_models.Wallet.id == wallet_id, db_models.Wallet.user_id == current_user.id)
        .first()
    )
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    return _to_response(wallet)


@router.post("", response_model=WalletDetail)
def create_wallet(
    payload: WalletCreateRequest,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallet = db_models.Wallet(
        user_id=current_user.id,
        name=payload.name,
        goal_amount=payload.goal_amount,
        target_date=payload.target_date,
        saved_amount=0.0,
        icon_key=payload.icon_key,
        currency=payload.currency,
        start_date=datetime.utcnow(),
    )
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return _to_response(wallet)


@router.post("/{wallet_id}/deposit", response_model=WalletDetail)
def deposit_to_wallet(
    wallet_id: int,
    payload: WalletDepositRequest,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallet = (
        db.query(db_models.Wallet)
        .filter(db_models.Wallet.id == wallet_id, db_models.Wallet.user_id == current_user.id)
        .first()
    )
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    wallet.saved_amount += payload.amount
    db.commit()
    db.refresh(wallet)

    # +1 reward point per 10 riyals saved toward a goal
    reward = db.query(db_models.RewardAccount).filter(db_models.RewardAccount.user_id == current_user.id).first()
    if reward:
        reward.points += int(payload.amount // 10)
        db.commit()

    return _to_response(wallet)


@router.delete("/{wallet_id}")
def delete_wallet(
    wallet_id: int,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallet = (
        db.query(db_models.Wallet)
        .filter(db_models.Wallet.id == wallet_id, db_models.Wallet.user_id == current_user.id)
        .first()
    )
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    db.delete(wallet)
    db.commit()
    return {"message": "Wallet deleted"}


# ---------- Claude-generated wallet ----------

def _build_prompt(request: WalletGenerateRequest) -> str:
    goal_label_map = {
        "travel": "travel / trip",
        "wedding": "wedding",
        "car": "car purchase",
        "house": "house / real estate",
        "emergency_fund": "emergency fund",
        "custom": "custom goal",
    }
    goal_label = goal_label_map.get(request.goal_type, request.goal_type)

    extra_desc = f"\nAdditional details from the user: {request.goal_description}" if request.goal_description else ""
    timeframe_line = f"\nTimeframe: {request.timeframe_months} months" if request.timeframe_months else ""

    return f"""You are a financial planning assistant for a Saudi personal finance app called Mersad AI.

A user wants help allocating their monthly budget toward this savings goal:
- Goal type: {goal_label}
- Target amount: {request.target_amount} {request.currency}
- Available monthly budget to allocate: {request.monthly_budget} {request.currency}{timeframe_line}{extra_desc}

Use web search to check current, real cost-of-living information and, if the goal involves a
foreign destination or currency, current exchange rates, so your allocation is grounded in
up-to-date real numbers rather than guesses.

Then split the monthly_budget across relevant spending categories for this goal
(e.g. for travel: flights, accommodation, food, activities, buffer; for a wedding: venue,
catering, attire, photography, misc; adapt categories sensibly to the goal type).
Category names must be in Arabic.

Respond with ONLY a single valid JSON object and nothing else — no preamble, no markdown
code fences, no explanation outside the JSON. The JSON must match exactly this shape:

{{
  "allocations": [
    {{
      "category": "اسم الفئة بالعربي",
      "amount": number,
      "percentage": number,
      "rationale": "one short sentence explaining this allocation, grounded in what you found"
    }}
  ],
  "summary": "2-3 sentence plain-language summary of the plan, in Arabic"
}}

The amounts in "allocations" must sum to monthly_budget. Percentages must sum to 100.
"""


def _extract_json(text: str) -> dict:
    """Claude may occasionally wrap the JSON in ```json fences despite instructions; handle that safely."""
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


@router.post("/generate", response_model=WalletDetail)
async def generate_wallet(
    request: WalletGenerateRequest,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY is not configured on the server (.env)")

    payload = {
        "model": ANTHROPIC_MODEL,
        "max_tokens": 2000,
        "messages": [
            {"role": "user", "content": _build_prompt(request)}
        ],
        "tools": [
            {"type": "web_search_20250305", "name": "web_search", "max_uses": 5}
        ],
    }
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(ANTHROPIC_API_URL, headers=headers, json=payload)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"Anthropic API error: {e.response.text}")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Could not reach Anthropic API: {str(e)}")

    data = response.json()
    text_parts = [block["text"] for block in data.get("content", []) if block.get("type") == "text"]
    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise HTTPException(status_code=502, detail="Model returned no text content")

    try:
        parsed = _extract_json(full_text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail=f"Model response was not valid JSON: {full_text[:500]}")

    timeframe_months = request.timeframe_months
    target_date = None
    if timeframe_months:
        target_date = datetime.utcnow() + timedelta(days=30 * timeframe_months)

    label = ICON_LABELS.get(request.goal_type, "هدف")
    name = f"محفظة {label}"
    subtitle_parts = []
    if request.goal_description:
        subtitle_parts.append(request.goal_description[:24])
    if timeframe_months:
        subtitle_parts.append(f"{timeframe_months} أشهر")
    subtitle = " • ".join(subtitle_parts) if subtitle_parts else request.currency

    allocations = parsed.get("allocations", [])
    summary = parsed.get("summary", "")

    # validate the model's output shape BEFORE writing anything to the DB
    try:
        [WalletAllocationDetail(**a) for a in allocations]
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Model JSON did not match expected schema: {str(e)}")

    wallet = db_models.Wallet(
        user_id=current_user.id,
        name=name,
        icon_key=request.goal_type,
        subtitle=subtitle,
        currency=request.currency,
        goal_amount=request.target_amount,
        saved_amount=0.0,
        monthly_target=request.monthly_budget,
        start_date=datetime.utcnow(),
        target_date=target_date,
        remaining_months=timeframe_months,
        allocations=allocations,
        summary=summary,
    )
    db.add(wallet)
    db.commit()
    db.refresh(wallet)

    return _to_response(wallet)