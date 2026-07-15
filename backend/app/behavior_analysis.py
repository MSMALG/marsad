
import json
from pathlib import Path

BUSINESS_RULES_PATH = Path(__file__).parent / "business_rules.json"

_business_rules = None


def get_business_rules():
    global _business_rules
    if _business_rules is None:
        with open(BUSINESS_RULES_PATH, encoding="utf-8") as f:
            _business_rules = json.load(f)
    return _business_rules


CATEGORY_LABELS_AR = {
    "Food_Expense": "الطعام",
    "Housing_Expense": "السكن",
    "Transportation_Expense": "المواصلات",
    "Entertainment_Expense": "الترفيه",
    "Healthcare_Expense": "الصحة",
    "Other_Expense": "أخرى",
}


def get_category_breakdown(predicted_expenses: float, nationality: str) -> list[dict]:
    """
    Split predicted_expenses into the 6 Mersad categories using real
    GASTAT-derived shares for the user's nationality group.
    """
    rules = get_business_rules()
    shares_by_nat = rules["mersad_expense_category_mapping"]["shares_by_nationality"]
    key = "saudi" if nationality == "Saudi" else "non_saudi"
    shares = shares_by_nat.get(key, shares_by_nat["total"])

    breakdown = []
    for cat, share in shares.items():
        breakdown.append({
            "category": CATEGORY_LABELS_AR.get(cat, cat),
            "category_key": cat,
            "amount": round(predicted_expenses * share, 2),
            "share": round(share, 4),
        })
    return sorted(breakdown, key=lambda x: -x["amount"])


# --- Behavior classification thresholds ---
# Based on commonly cited personal-finance savings-rate benchmarks
# (e.g. a savings rate below ~5% is considered financially strained,
# above ~20% is considered strong). Documented explicitly so the
# thresholds can be defended/adjusted, not hidden magic numbers.
FRUGAL_THRESHOLD = 0.20    # savings_rate >= 20% -> مقتصد
SPENDER_THRESHOLD = 0.05   # savings_rate < 5%  -> مسرف


def classify_behavior(monthly_income: float, predicted_expenses: float) -> dict:
    savings = monthly_income - predicted_expenses
    savings_rate = savings / monthly_income if monthly_income > 0 else 0

    if savings_rate >= FRUGAL_THRESHOLD:
        label = "مقتصد"
        description = "تنفقين أقل من دخلك بشكل ملحوظ وتدخرين نسبة قوية شهريًا."
    elif savings_rate < SPENDER_THRESHOLD:
        label = "مسرف"
        description = "إنفاقك الشهري يستهلك تقريبًا كامل دخلك، مع هامش ادخار ضعيف جدًا."
    else:
        label = "متوازن"
        description = "إنفاقك متوازن مع دخلك، مع هامش ادخار معقول."

    return {
        "label": label,
        "description": description,
        "savings_rate": round(savings_rate, 4),
        "monthly_savings": round(savings, 2),
    }


# --- Anomaly / risk flags ---
# Transparent rule checks, each documented with its trigger condition.
HIGH_EXPENSE_RATIO = 0.90   # expenses >= 90% of income
DOMINANT_CATEGORY_SHARE = 0.45  # any single category >= 45% of total expenses


def detect_anomalies(monthly_income: float, predicted_expenses: float, breakdown: list[dict]) -> list[dict]:
    flags = []

    if monthly_income > 0 and predicted_expenses / monthly_income >= HIGH_EXPENSE_RATIO:
        flags.append({
            "type": "high_expense_ratio",
            "severity": "high",
            "message": f"الإنفاق المتوقع يستهلك {predicted_expenses / monthly_income:.0%} من الدخل الشهري — هامش أمان منخفض جدًا.",
        })

    for item in breakdown:
        if item["share"] >= DOMINANT_CATEGORY_SHARE:
            flags.append({
                "type": "dominant_category",
                "severity": "medium",
                "message": f"فئة \"{item['category']}\" تستحوذ على {item['share']:.0%} من إجمالي الإنفاق — نسبة أعلى من المعتاد.",
            })

    if monthly_income > 0 and predicted_expenses > monthly_income:
        flags.append({
            "type": "negative_savings",
            "severity": "high",
            "message": "الإنفاق المتوقع يتجاوز الدخل الشهري — لا يوجد هامش ادخار متبقٍ.",
        })

    return flags


def run_full_behavior_analysis(monthly_income: float, predicted_expenses: float, nationality: str) -> dict:
    breakdown = get_category_breakdown(predicted_expenses, nationality)
    behavior = classify_behavior(monthly_income, predicted_expenses)
    anomalies = detect_anomalies(monthly_income, predicted_expenses, breakdown)

    return {
        "predicted_monthly_expenses": round(predicted_expenses, 2),
        "monthly_income": monthly_income,
        "category_breakdown": breakdown,
        "behavior_classification": behavior,
        "anomaly_flags": anomalies,
    }
