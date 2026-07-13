from fastapi import APIRouter

router = APIRouter()

budget = {
    "الرصيد_الحالي": 24650,
    "التوفير_هذا_الشهر": 6700,
    "المتوقع_نهاية_الشهر": 8100,
    "هدف_الميزانية": 78,
    "عدد_الأيام_الملتزم_بها": 12
}

@router.get("/budget")
def get_budget():
    return budget