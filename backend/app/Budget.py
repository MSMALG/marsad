from datetime import datetime
from calendar import monthrange
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import db_models
from auth import get_current_user
from model import predict_expenses
from schemas import PredictionRequest, PredictionResponse

router = APIRouter()


def _month_bounds(now: datetime):
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day = monthrange(now.year, now.month)[1]
    end = now.replace(day=last_day, hour=23, minute=59, second=59)
    return start, end, last_day


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    now = datetime.utcnow()
    start, end, last_day = _month_bounds(now)

    spent_this_month = (
        db.query(func.coalesce(func.sum(db_models.Expense.amount), 0.0))
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= start,
            db_models.Expense.date <= end,
        )
        .scalar()
    )

    income = current_user.monthly_income or 0.0
    savings = income - spent_this_month
    days_elapsed = now.day
    days_remaining = last_day - days_elapsed
    daily_rate = spent_this_month / days_elapsed if days_elapsed else 0
    projected_month_end_spend = round(daily_rate * last_day, 2)

    total_saved_in_wallets = (
        db.query(func.coalesce(func.sum(db_models.Wallet.saved_amount), 0.0))
        .filter(db_models.Wallet.user_id == current_user.id)
        .scalar()
    )

    if income > 0:
        savings_rate = savings / income
        if savings_rate >= 0.20:
            risk, recommendation = "Low", "Excellent saving habits! Keep it up."
        elif savings_rate >= 0.05:
            risk, recommendation = "Medium", "You're on track, but watch discretionary spending."
        else:
            risk, recommendation = "High", "Spending is close to income — consider cutting non-essentials."
    else:
        risk, recommendation = "Unknown", "Add your monthly income to get personalized insights."

    return {
        "user": current_user.full_name,
        "balance": round(income - spent_this_month, 2),
        "income": income,
        "expenses": round(spent_this_month, 2),
        "savings": round(savings, 2),
        "saved_in_wallets": round(total_saved_in_wallets, 2),
        "projected_month_end_expenses": projected_month_end_spend,
        "days_remaining_in_month": days_remaining,
        "risk": risk,
        "recommendation": recommendation,
    }


@router.get("/budget")
def get_budget(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    now = datetime.utcnow()
    start, end, last_day = _month_bounds(now)

    spent_this_month = (
        db.query(func.coalesce(func.sum(db_models.Expense.amount), 0.0))
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= start,
            db_models.Expense.date <= end,
        )
        .scalar()
    )

    income = current_user.monthly_income or 0.0
    savings = income - spent_this_month
    budget_goal_pct = round((savings / income) * 100, 1) if income > 0 else 0

    days_committed = (
        db.query(func.count(func.distinct(func.strftime("%Y-%m-%d", db_models.Expense.date))))
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= start,
            db_models.Expense.date <= end,
        )
        .scalar()
    )

    return {
        "الرصيد_الحالي": round(income - spent_this_month, 2),
        "التوفير_هذا_الشهر": round(savings, 2),
        "المتوقع_نهاية_الشهر": round(spent_this_month, 2),
        "هدف_الميزانية": budget_goal_pct,
        "عدد_الأيام_الملتزم_بها": days_committed,
    }


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        input_data = request.dict()
        prediction = predict_expenses(input_data)
        return PredictionResponse(predicted_monthly_expenses=prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")