from datetime import datetime
from calendar import monthrange
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import db_models
from auth import get_current_user

router = APIRouter()

# merchant name (substring match) -> cheaper local alternative + its avg price per visit
KNOWN_ALTERNATIVES = {
    "ستاربكس": {"alternative": "قهوة محلية", "cheaper_avg_price": 12},
    "starbucks": {"alternative": "قهوة محلية", "cheaper_avg_price": 12},
    "كوستا": {"alternative": "قهوة محلية", "cheaper_avg_price": 12},
    "دانكن": {"alternative": "قهوة محلية", "cheaper_avg_price": 10},
}


def _month_bounds(now: datetime):
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day = monthrange(now.year, now.month)[1]
    end = now.replace(day=last_day, hour=23, minute=59, second=59)
    return start, end


@router.get("/cheaper-alternatives")
def get_cheaper_alternatives(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    now = datetime.utcnow()
    start, end = _month_bounds(now)

    rows = (
        db.query(
            db_models.Expense.merchant,
            func.sum(db_models.Expense.amount),
            func.count(db_models.Expense.id),
        )
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= start,
            db_models.Expense.date <= end,
            db_models.Expense.merchant.isnot(None),
        )
        .group_by(db_models.Expense.merchant)
        .all()
    )

    suggestions = []
    for merchant, total_spent, visit_count in rows:
        merchant_lower = merchant.strip().lower()
        match = None
        for known, info in KNOWN_ALTERNATIVES.items():
            if known.lower() in merchant_lower:
                match = info
                break
        if not match:
            continue

        estimated_cheaper_cost = visit_count * match["cheaper_avg_price"]
        monthly_savings = round(total_spent - estimated_cheaper_cost, 2)
        if monthly_savings <= 0:
            continue

        suggestions.append({
            "merchant": merchant,
            "alternative": match["alternative"],
            "visits_this_month": visit_count,
            "monthly_spent": round(total_spent, 2),
            "estimated_cost_with_alternative": round(estimated_cheaper_cost, 2),
            "monthly_savings": monthly_savings,
            "annual_savings": round(monthly_savings * 12, 2),
        })

    return suggestions