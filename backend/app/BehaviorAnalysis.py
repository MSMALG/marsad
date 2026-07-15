
from fastapi import APIRouter, HTTPException

from model import predict_expenses
from schemas import BehaviorAnalysisRequest, BehaviorAnalysisResponse
from behavior_analysis import run_full_behavior_analysis

router = APIRouter()


@router.post("/behavior/analyze", response_model=BehaviorAnalysisResponse)
def analyze_behavior(request: BehaviorAnalysisRequest):
    try:
        input_data = request.dict()
        predicted_expenses = predict_expenses(input_data)
        result = run_full_behavior_analysis(
            monthly_income=request.Monthly_Income,
            predicted_expenses=predicted_expenses,
            nationality=request.Nationality,
        )
        return BehaviorAnalysisResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Behavior analysis failed: {str(e)}")
