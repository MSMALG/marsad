"""
model.py
Loads the trained Mersad AI pipeline (preprocessing + CatBoostRegressor)
and exposes a predict() function for use by the FastAPI endpoints.

The pipeline was saved with joblib and expects a pandas DataFrame with
the exact raw column names below (no manual scaling/encoding needed —
the pipeline handles that internally).
"""

import os
import joblib
import pandas as pd

# Path to the model file, relative to this file's location (backend/app/model.py -> backend/ml/mersad_model.pkl)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "mersad_model.pkl")

# Lazy-loaded singleton so the .pkl is only read from disk once per server run
_model = None


def get_model():
    """Load the model once and cache it in memory."""
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


# Exact column names/order the pipeline's ColumnTransformer expects
REQUIRED_COLUMNS = [
    "Age",
    "Monthly_Income",
    "Monthly_Salary",
    "Household_Size",
    "CPI",
    "Gender",
    "Region",
    "Nationality",
    "Marital_Status",
    "Education",
    "Employment_Status",
    "Occupation",
    "Housing_Type",
    "Housing_Ownership",
    "Investment_Profile",
    "Risk_Level",
    "Goal_Type",
]


def predict_expenses(input_data: dict) -> float:
    """
    Run a single prediction through the pipeline.

    input_data: dict with keys matching REQUIRED_COLUMNS
    returns: predicted Monthly_Expenses as a float
    """
    model = get_model()

    # Build a single-row DataFrame in the exact expected format
    df = pd.DataFrame([input_data], columns=REQUIRED_COLUMNS)

    prediction = model.predict(df)
    return float(prediction[0])
