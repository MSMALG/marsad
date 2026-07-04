from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Marsad API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Marsad Backend Running 🚀"}

@app.get("/dashboard")
def dashboard():
    return {
        "user": "بك",
        "balance": 24650,
        "income": 12000,
        "expenses": 5300,
        "savings": 6700,
        "risk": "Low",
        "recommendation": "Excellent saving habits! Keep it up."
    }