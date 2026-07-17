"""
wallets.py
Smart Wallet feature.

- GET /wallets           : full list of the user's wallets (seed demo data +
                            any wallets generated via /wallets/generate)
- GET /wallets/{id}      : single wallet detail
- POST /wallets/generate : calls Claude (server-side, API key never touches
                            the browser) with web_search enabled to build a
                            real, grounded budget allocation, THEN stores the
                            result as a new browsable wallet and returns it
                            in the same unified shape as every other wallet.
"""

import os
import json
import re
from datetime import date, timedelta

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException

from schemas import WalletGenerateRequest, WalletDetail

load_dotenv()

router = APIRouter()

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

# --- In-memory wallet store, seeded with demo data in the unified shape ---
_next_id = 3
wallets: list[dict] = [
    {
        "id": 1,
        "name": "محفظة الزواج",
        "icon_key": "wedding",
        "subtitle": "السعودية • 10 أشهر",
        "currency": "SAR",
        "target_amount": 10000,
        "saved": 2500,
        "progress": 25,
        "monthly_target": 750,
        "start_date": str(date.today() - timedelta(days=90)),
        "target_date": str(date.today() + timedelta(days=300)),
        "remaining_months": 10,
        "allocations": [
            {"category": "القاعة والتنظيم", "amount": 300, "percentage": 40, "rationale": "أكبر بند في ميزانية الزفاف عادة"},
            {"category": "الضيافة", "amount": 187.5, "percentage": 25, "rationale": "تكاليف الطعام والضيافة للضيوف"},
            {"category": "الملابس", "amount": 112.5, "percentage": 15, "rationale": "فستان وبدلة وإكسسوارات"},
            {"category": "التصوير", "amount": 90, "percentage": 12, "rationale": "توثيق المناسبة"},
            {"category": "أخرى", "amount": 60, "percentage": 8, "rationale": "مصاريف متفرقة غير متوقعة"},
        ],
        "summary": "أنت في المسار الصحيح نحو ميزانية الزفاف، استمري بنفس معدل الادخار الشهري.",
    },
    {
        "id": 2,
        "name": "محفظة السفر",
        "icon_key": "travel",
        "subtitle": "تركيا • 6 أشهر",
        "currency": "SAR",
        "target_amount": 15000,
        "saved": 6750,
        "progress": 45,
        "monthly_target": 1125,
        "start_date": str(date.today() - timedelta(days=60)),
        "target_date": str(date.today() + timedelta(days=180)),
        "remaining_months": 6,
        "allocations": [
            {"category": "تذاكر الطيران", "amount": 3500, "percentage": 23, "rationale": "متوسط سعر تذاكر الرحلات لتركيا"},
            {"category": "الفنادق", "amount": 5000, "percentage": 33, "rationale": "إقامة متوسطة المستوى لمدة الرحلة"},
            {"category": "الطعام", "amount": 2500, "percentage": 17, "rationale": "تكلفة الطعام اليومي المقدرة"},
            {"category": "المواصلات", "amount": 1500, "percentage": 10, "rationale": "تنقل داخل الوجهة"},
            {"category": "التسوق", "amount": 1500, "percentage": 10, "rationale": "هدايا ومشتريات شخصية"},
            {"category": "الطوارئ", "amount": 1000, "percentage": 7, "rationale": "هامش أمان لأي مصاريف غير متوقعة"},
        ],
        "summary": "أنت في المسار الصحيح. إذا ادخرت 1,125 ر.س شهرياً ستصل لهدفك قبل موعد السفر.",
    },
]


@router.get("/wallets", response_model=list[WalletDetail])
def get_wallets():
    return wallets


@router.get("/wallets/{wallet_id}", response_model=WalletDetail)
def get_wallet(wallet_id: int):
    for wallet in wallets:
        if wallet["id"] == wallet_id:
            return wallet
    raise HTTPException(status_code=404, detail="Wallet not found")


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


@router.post("/wallets/generate", response_model=WalletDetail)
async def generate_wallet(request: WalletGenerateRequest):
    global _next_id

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

    # --- Assemble the unified wallet object and persist it ---
    timeframe_months = request.timeframe_months
    target_date = None
    if timeframe_months:
        target_date = str(date.today() + timedelta(days=30 * timeframe_months))

    label = ICON_LABELS.get(request.goal_type, "هدف")
    name = f"محفظة {label}"
    subtitle_parts = []
    if request.goal_description:
        subtitle_parts.append(request.goal_description[:24])
    if timeframe_months:
        subtitle_parts.append(f"{timeframe_months} أشهر")
    subtitle = " • ".join(subtitle_parts) if subtitle_parts else request.currency

    new_wallet = {
        "id": _next_id,
        "name": name,
        "icon_key": request.goal_type,
        "subtitle": subtitle,
        "currency": request.currency,
        "target_amount": request.target_amount,
        "saved": 0,
        "progress": 0,
        "monthly_target": request.monthly_budget,
        "start_date": str(date.today()),
        "target_date": target_date,
        "remaining_months": timeframe_months,
        "allocations": parsed.get("allocations", []),
        "summary": parsed.get("summary", ""),
    }

    try:
        validated = WalletDetail(**new_wallet)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Model JSON did not match expected schema: {str(e)}")

    wallets.append(new_wallet)
    _next_id += 1

    return validated
