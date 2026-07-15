from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from wallets import router as wallet_router
from Budget import router as budget_router
from Alert import router as alerts_router
from blockchain import get_blockchain
from smart_contract import record_suspicious

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
    return {"message": "Marsad Backend Running"}

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

@app.post("/analyze-transaction")
def analyze_transaction(data: dict = Body(...)):
    result, proof = record_suspicious(-1, data)
    return {
        'suspicious': result,
        'proof_hash': proof
    }

@app.get("/blockchain-log")
def blockchain_log():
    return get_blockchain()

app.include_router(wallet_router)
app.include_router(budget_router)
app.include_router(alerts_router)