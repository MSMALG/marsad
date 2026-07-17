from datetime import datetime
from calendar import monthrange
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import db_models
from auth import get_current_user

router = APIRouter()

DOMINANT_CATEGORY_SHARE = 0.45   # a single category eating >=45% of spend
SPIKE_THRESHOLD = 0.20           # 20%+ increase vs last month
MERCHANT_ALERT_THRESHOLD = 300   # SAR spent at one merchant this month


def _month_bounds(now: datetime, months_back: int = 0):
    year, month = now.year, now.month
    for _ in range(months_back):
        month -= 1
        if month == 0:
            month, year = 12, year - 1
    start = datetime(year, month, 1)
    last_day = monthrange(year, month)[1]
    end = datetime(year, month, last_day, 23, 59, 59)
    return start, end


@router.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    now = datetime.utcnow()
    start, end = _month_bounds(now)
    prev_start, prev_end = _month_bounds(now, months_back=1)

    alerts = []

    # --- category breakdown this month ---
    rows = (
        db.query(db_models.Expense.category, func.sum(db_models.Expense.amount))
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= start,
            db_models.Expense.date <= end,
        )
        .group_by(db_models.Expense.category)
        .all()
    )
    total_this_month = sum(amount for _, amount in rows) or 0.0

    if total_this_month > 0:
        for category, amount in rows:
            share = amount / total_this_month
            if share >= DOMINANT_CATEGORY_SHARE:
                alerts.append({
                    "النوع": "تنبيه الميزانية",
                    "العنوان": f"إنفاق مرتفع على {category}",
                    "التفاصيل": f"لقد صرفت {amount:.0f} ريال على {category}، وهذا يشكل {share:.0%} من إجمالي مصروفاتك هذا الشهر.",
                })

    # --- month-over-month spike ---
    prev_total = (
        db.query(func.coalesce(func.sum(db_models.Expense.amount), 0.0))
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= prev_start,
            db_models.Expense.date <= prev_end,
        )
        .scalar()
    )
    if prev_total and prev_total > 0 and total_this_month > 0:
        change = (total_this_month - prev_total) / prev_total
        if change >= SPIKE_THRESHOLD:
            alerts.append({
                "النوع": "تنبيه سلوك الإنفاق",
                "العنوان": "زيادة ملحوظة في الإنفاق",
                "التفاصيل": f"إنفاقك هذا الشهر ({total_this_month:.0f} ريال) زاد بنسبة {change:.0%} مقارنة بالشهر الماضي ({prev_total:.0f} ريال).",
            })

    # --- merchant-specific overspending (e.g. coffee shops) ---
    merchant_rows = (
        db.query(db_models.Expense.merchant, func.sum(db_models.Expense.amount))
        .filter(
            db_models.Expense.user_id == current_user.id,
            db_models.Expense.date >= start,
            db_models.Expense.date <= end,
            db_models.Expense.merchant.isnot(None),
        )
        .group_by(db_models.Expense.merchant)
        .all()
    )
    for merchant, amount in merchant_rows:
        if amount >= MERCHANT_ALERT_THRESHOLD:
            alerts.append({
                "النوع": "تنبيه الميزانية",
                "العنوان": f"تجاوزت ميزانية {merchant}",
                "التفاصيل": f"لقد صرفت {amount:.0f} ريال على {merchant} هذا الشهر، جرّب بدائل أقل تكلفة.",
            })

    if not alerts:
        alerts.append({
            "النوع": "تنبيه إيجابي",
            "العنوان": "لا توجد تنبيهات",
            "التفاصيل": "إنفاقك هذا الشهر ضمن الحدود الطبيعية، استمر على هذا المسار.",
        })

    return alerts