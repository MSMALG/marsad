"""
schemas.py
Pydantic models for validating requests to the /predict endpoint,
and for shaping the JSON response.
"""

from pydantic import BaseModel, Field
from typing import List
from pydantic import BaseModel

class PredictionRequest(BaseModel):
    Age: int = Field(..., ge=18, le=100, example=30)
    Monthly_Income: float = Field(..., ge=0, example=12000)
    Monthly_Salary: float = Field(..., ge=0, example=10000)
    Household_Size: int = Field(..., ge=1, le=20, example=4)
    CPI: float = Field(..., example=1.02)

    Gender: str = Field(..., example="Male")
    Region: str = Field(..., example="Riyadh")
    Nationality: str = Field(..., example="Saudi")
    Marital_Status: str = Field(..., example="Married")
    Education: str = Field(..., example="Bachelor")
    Employment_Status: str = Field(..., example="Employed")
    Occupation: str = Field(..., example="Engineer")
    Housing_Type: str = Field(..., example="Apartment")
    Housing_Ownership: str = Field(..., example="Owned")
    Investment_Profile: str = Field(..., example="Moderate")
    Risk_Level: str = Field(..., example="Medium")
    Goal_Type: str = Field(..., example="Emergency Fund")

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 30,
                "Monthly_Income": 12000,
                "Monthly_Salary": 10000,
                "Household_Size": 4,
                "CPI": 1.02,
                "Gender": "Male",
                "Region": "Riyadh",
                "Nationality": "Saudi",
                "Marital_Status": "Married",
                "Education": "Bachelor",
                "Employment_Status": "Employed",
                "Occupation": "Engineer",
                "Housing_Type": "Apartment",
                "Housing_Ownership": "Owned",
                "Investment_Profile": "Moderate",
                "Risk_Level": "Medium",
                "Goal_Type": "Emergency Fund",
            }
        }


class PredictionResponse(BaseModel):
    predicted_monthly_expenses: float

 
 
class BehaviorAnalysisRequest(BaseModel):
    Age: int
    Monthly_Income: float
    Monthly_Salary: float
    Household_Size: int
    CPI: float
    Gender: str
    Region: str
    Nationality: str
    Marital_Status: str
    Education: str
    Employment_Status: str
    Occupation: str
    Housing_Type: str
    Housing_Ownership: str
    Investment_Profile: str
    Risk_Level: str
    Goal_Type: str
 
    class Config:
        json_schema_extra = {
            "example": {
                "Age": 30, "Monthly_Income": 12000, "Monthly_Salary": 10000,
                "Household_Size": 4, "CPI": 1.02, "Gender": "Male", "Region": "Riyadh",
                "Nationality": "Saudi", "Marital_Status": "Married", "Education": "Bachelor",
                "Employment_Status": "Employed", "Occupation": "Engineer",
                "Housing_Type": "Apartment", "Housing_Ownership": "Owned",
                "Investment_Profile": "Moderate", "Risk_Level": "Medium",
                "Goal_Type": "Emergency Fund"
            }
        }
 
 
class CategoryBreakdownItem(BaseModel):
    category: str
    category_key: str
    amount: float
    share: float
 
 
class BehaviorClassification(BaseModel):
    label: str
    description: str
    savings_rate: float
    monthly_savings: float
 
 
class AnomalyFlag(BaseModel):
    type: str
    severity: str
    message: str
 
 
class BehaviorAnalysisResponse(BaseModel):
    predicted_monthly_expenses: float
    monthly_income: float
    category_breakdown: List[CategoryBreakdownItem]
    behavior_classification: BehaviorClassification
    anomaly_flags: List[AnomalyFlag]
 