from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import get_db
import db_models
from auth import get_current_user

router = APIRouter(prefix="/wallets", tags=["wallets"])


class WalletCreate(BaseModel):
    name: str = Field(..., example="محفظة الزواج")
    goal_amount: float = Field(..., gt=0)
    target_date: Optional[datetime] = None


class WalletDeposit(BaseModel):
    amount: float = Field(..., gt=0)


class WalletResponse(BaseModel):
    id: int
    name: str
    goal_amount: float
    saved_amount: float
    progress: float
    target_date: Optional[datetime]

    class Config:
        from_attributes = True


def _to_response(wallet: db_models.Wallet) -> WalletResponse:
    progress = (wallet.saved_amount / wallet.goal_amount * 100) if wallet.goal_amount else 0
    return WalletResponse(
        id=wallet.id,
        name=wallet.name,
        goal_amount=wallet.goal_amount,
        saved_amount=wallet.saved_amount,
        progress=round(progress, 1),
        target_date=wallet.target_date,
    )


@router.get("", response_model=List[WalletResponse])
def get_wallets(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallets = db.query(db_models.Wallet).filter(db_models.Wallet.user_id == current_user.id).all()
    return [_to_response(w) for w in wallets]


@router.post("", response_model=WalletResponse)
def create_wallet(
    payload: WalletCreate,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    wallet = db_models.Wallet(
        user_id=current_user.id,
        name=payload.name,
        goal_amount=payload.goal_amount,
        target_date=payload.target_date,
        saved_amount=0.0,
    )
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return _to_response(wallet)


@router.get("/{wallet_id}", response_model=WalletResponse)
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


@router.post("/{wallet_id}/deposit", response_model=WalletResponse)
def deposit_to_wallet(
    wallet_id: int,
    payload: WalletDeposit,
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