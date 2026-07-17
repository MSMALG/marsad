"""
schemas.py
Pydantic models for validating requests to the /predict endpoint,
and for shaping the JSON response.
"""

from pydantic import BaseModel, Field


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
"""
Add these to schemas.py (append at the bottom of the existing file).
Schemas for the Smart Wallet (محفظة ذكية) generation feature.
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class WalletGenerateRequest(BaseModel):
    goal_type: str = Field(
        ...,
        description="One of: travel, wedding, car, house, emergency_fund, custom",
        example="travel",
    )
    goal_description: Optional[str] = Field(
        None,
        description="Free-text description, required/used when goal_type is 'custom' "
                    "or to add specifics (e.g. destination for travel)",
        example="A 7-day trip to Japan for two people",
    )
    target_amount: float = Field(..., gt=0, example=15000)
    monthly_budget: float = Field(..., gt=0, description="Amount available per month to allocate", example=3000)
    timeframe_months: Optional[int] = Field(None, gt=0, example=6)
    currency: str = Field("SAR", example="SAR")

    class Config:
        json_schema_extra = {
            "example": {
                "goal_type": "travel",
                "goal_description": "A 7-day trip to Japan for two people",
                "target_amount": 15000,
                "monthly_budget": 3000,
                "timeframe_months": 6,
                "currency": "SAR",
            }
        }


class WalletAllocation(BaseModel):
    category: str
    amount: float
    percentage: float
    rationale: str


class WalletGenerateResponse(BaseModel):
    goal_type: str
    target_amount: float
    monthly_budget: float
    timeframe_months: Optional[int]
    currency: str
    allocations: List[WalletAllocation]
    summary: str
"""
Add these to schemas.py (append at the bottom of the existing file).
Schemas for the Behavior Analysis feature.
"""

from typing import List
from pydantic import BaseModel


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
    Age: int = Field(..., ge=18, le=100, example=30)
    Monthly_Income: float = Field(..., ge=0, example=12000)
    Monthly_Salary: float = Field(..., ge=0, example=10000)
    Household_Size: int = Field(..., ge=1, le=20, example=4)
    CPI: float = Field(..., example=1.02)

    Gender: str = Field(..., min_length=1, max_length=20)
    Region: str = Field(..., min_length=1, max_length=50)
    Nationality: str = Field(..., min_length=1, max_length=50)
    Marital_Status: str = Field(..., min_length=1, max_length=50)
    Education: str = Field(..., min_length=1, max_length=50)
    Employment_Status: str = Field(..., min_length=1, max_length=50)
    Occupation: str = Field(..., min_length=1, max_length=100)
    Housing_Type: str = Field(..., min_length=1, max_length=50)
    Housing_Ownership: str = Field(..., min_length=1, max_length=50)
    Investment_Profile: str = Field(..., min_length=1, max_length=50)
    Risk_Level: str = Field(..., min_length=1, max_length=20)
    Goal_Type: str = Field(..., min_length=1, max_length=100)

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
"""
Add these to schemas.py (append at the bottom of the existing file).
Unified "full wallet" shape so generated wallets can be browsed/displayed
with the same detail view as the existing hardcoded travel wallet card.
"""

from typing import List, Optional
from pydantic import BaseModel


class WalletAllocationDetail(BaseModel):
    category: str
    amount: float
    percentage: float
    rationale: str


class WalletDetail(BaseModel):
    id: int
    name: str
    icon_key: str          # goal_type: travel / wedding / car / house / emergency_fund / custom
    subtitle: str          # e.g. "اليابان • 6 أشهر"
    currency: str
    target_amount: float
    saved: float
    progress: float        # 0-100
    monthly_target: float
    start_date: str
    target_date: Optional[str]
    remaining_months: Optional[int]
    allocations: List[WalletAllocationDetail]
    summary: str
"""
Add these to schemas.py (append at the bottom of the existing file).
Schemas for the "اسأل مرصاد" AI chat assistant feature.
"""

from typing import List, Optional
from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class WalletContext(BaseModel):
    name: str
    saved: float
    goal: float
    progress: float


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    wallets: Optional[List[WalletContext]] = None
    blockchain_hash: str | None = None
