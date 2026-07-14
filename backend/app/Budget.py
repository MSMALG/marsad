from fastapi import APIRouter, HTTPException

from model import predict_expenses
from schemas import PredictionRequest, PredictionResponse

router = APIRouter()

# Keeping the old dummy endpoint for now in case the frontend still points to it
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


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Real prediction endpoint.
    Accepts user financial/demographic data and returns the model's
    predicted Monthly_Expenses.
    """
    try:
        input_data = request.dict()
        prediction = predict_expenses(input_data)
        return PredictionResponse(predicted_monthly_expenses=prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
