from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from database import get_db
import db_models
from auth import get_current_user
from security import check_suspicious_expense

router = APIRouter(prefix="/expenses", tags=["expenses"])


class ExpenseCreate(BaseModel):
    category: str = Field(..., example="Food")
    merchant: Optional[str] = Field(None, example="ستاربكس")
    amount: float = Field(..., gt=0)
    note: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    category: str
    merchant: Optional[str]
    amount: float
    note: Optional[str]
    date: datetime

    class Config:
        from_attributes = True


@router.post("", response_model=ExpenseResponse)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    expense = db_models.Expense(
        user_id=current_user.id,
        category=payload.category,
        merchant=payload.merchant,
        amount=payload.amount,
        note=payload.note,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)

    check_suspicious_expense(db, current_user.id, payload.amount, payload.category, payload.merchant)

    return expense


@router.get("", response_model=List[ExpenseResponse])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    return (
        db.query(db_models.Expense)
        .filter(db_models.Expense.user_id == current_user.id)
        .order_by(db_models.Expense.date.desc())
        .all()
    )


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    expense = (
        db.query(db_models.Expense)
        .filter(db_models.Expense.id == expense_id, db_models.Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted"}