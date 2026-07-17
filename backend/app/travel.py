from datetime import datetime, timedelta
from calendar import monthrange
import requests
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
import db_models
from auth import get_current_user

router = APIRouter(prefix="/travel", tags=["travel"])

# SAR has been fixed at this exact peg to USD since 1986 (Saudi Central Bank policy),
# it does not float, so we derive SAR rates from USD rather than asking the API for SAR directly.
SAR_PER_USD = 3.75

COUNTRY_COST_INDEX = {
    "UAE": 1.15, "Turkey": 0.55, "Egypt": 0.35, "UK": 1.75,
    "USA": 1.65, "Malaysia": 0.55, "Georgia": 0.45, "France": 1.7,
}

FRANKFURTER_BASE = "https://api.frankfurter.dev/v2"


@router.get("/exchange-insight")
def exchange_insight(target: str = Query("USD", description="3-letter currency code, e.g. USD, EUR, TRY")):
    target = target.upper()

    try:
        if target == "USD":
            current_usd_rate = 1.0
        else:
            resp = requests.get(f"{FRANKFURTER_BASE}/rate/USD/{target}", timeout=10)
            resp.raise_for_status()
            current_usd_rate = resp.json()["rate"]

        end = datetime.utcnow().date()
        start = end - timedelta(days=30)
        hist_resp = requests.get(
            f"{FRANKFURTER_BASE}/rates",
            params={"base": "USD", "quotes": target, "from": start.isoformat(), "to": end.isoformat()},
            timeout=10,
        )
        hist_resp.raise_for_status()
        
        # --- FIXED BLOCK START ---
        hist_json = hist_resp.json()  # This returns a list of dictionaries in v2

        if target == "USD":
            usd_rates = [1.0]
        else:
            # Parse the list format: extract the 'rate' from each object matching your target quote
            usd_rates = [
                item["rate"] for item in hist_json 
                if item.get("quote") == target and "rate" in item
            ]
        # --- FIXED BLOCK END ---

        if not usd_rates:
            raise ValueError(f"No historical data returned for {target}")

    except (requests.RequestException, KeyError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Currency provider error: {e}")

    # convert USD-based rates into SAR-based rates using the fixed peg
    current_rate = current_usd_rate / SAR_PER_USD
    sar_rates = [r / SAR_PER_USD for r in usd_rates]
    avg_30d = sum(sar_rates) / len(sar_rates)
    max_30d, min_30d = max(sar_rates), min(sar_rates)

    if current_rate >= avg_30d * 1.01:
        verdict = "الآن وقت جيد للتحويل — سعر الصرف أعلى من متوسط الشهر الماضي."
        good_time = True
    elif current_rate <= avg_30d * 0.99:
        verdict = "قد يكون من الأفضل الانتظار — سعر الصرف أقل من متوسط الشهر الماضي."
        good_time = False
    else:
        verdict = "سعر الصرف قريب من المعتاد هذا الشهر."
        good_time = None

    return {
        "base": "SAR",
        "target": target,
        "current_rate": round(current_rate, 4),
        "avg_30d": round(avg_30d, 4),
        "max_30d": round(max_30d, 4),
        "min_30d": round(min_30d, 4),
        "good_time_to_convert": good_time,
        "recommendation": verdict,
        "note": "SAR is pegged to USD at a fixed 3.75 rate; other rates are derived via USD.",
    }


@router.get("/trip-budget")
def trip_budget(
    destination: str = Query(..., example="Turkey"),
    days: int = Query(..., gt=0, example=7),
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    if destination not in COUNTRY_COST_INDEX:
        raise HTTPException(status_code=400, detail=f"Unsupported destination. Choose from: {list(COUNTRY_COST_INDEX)}")

    now = datetime.utcnow()
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day = monthrange(now.year, now.month)[1]

    total_spent = (
        db.query(func.coalesce(func.sum(db_models.Expense.amount), 0.0))
        .filter(db_models.Expense.user_id == current_user.id, db_models.Expense.date >= start)
        .scalar()
    )
    days_elapsed = now.day
    avg_daily_spend = (total_spent / days_elapsed) if days_elapsed else 0

    multiplier = COUNTRY_COST_INDEX[destination]
    estimated_daily_cost = round(avg_daily_spend * multiplier, 2)
    estimated_total = round(estimated_daily_cost * days, 2)

    return {
        "destination": destination,
        "days": days,
        "based_on_avg_daily_spend_sar": round(avg_daily_spend, 2),
        "cost_index_multiplier": multiplier,
        "estimated_daily_cost_sar": estimated_daily_cost,
        "estimated_total_budget_sar": estimated_total,
    }