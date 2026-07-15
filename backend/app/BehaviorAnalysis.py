
from fastapi import APIRouter, HTTPException

from model import predict_expenses
from schemas import BehaviorAnalysisRequest, BehaviorAnalysisResponse
from behavior_analysis import run_full_behavior_analysis
from smart_contract import record_suspicious

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

        proof_hash = None

        if result["anomaly_flags"]:
            _, proof_hash = record_suspicious(
                True,
                {
                    "amount": predicted_expenses,
                    "time": "Unknown",
                    "device": "Unknown",
                },
            )

        result["blockchain_hash"] = proof_hash

        return BehaviorAnalysisResponse(**result)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Behavior analysis failed: {str(e)}"
        )