from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from wallets import router as wallet_router
from Budget import router as budget_router
from Alert import router as alerts_router
from blockchain import get_blockchain
from smart_contract import record_suspicious

from BehaviorAnalysis import router as behavior_router

app = FastAPI(
    title="Marsad API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

last_transaction = None

@app.post("/analyze-transaction")
def analyze_transaction(data: dict = Body(...)):
    global last_transaction

    amount = data.get("amount", 0)
    device = data.get("device", "")
    transaction_type = data.get("type", "")

    suspicious = False

    if amount >= 5000:
        suspicious = True

    if device == "جهاز غير معروف":
        suspicious = True

    if transaction_type == "تحويل خارجي":
        suspicious = True

    if suspicious:
        last_transaction = data

    return {
        "suspicious": suspicious,
        "transaction": data
    }


@app.post("/report-transaction")
def report_transaction(data: dict = Body(...)):
    result, proof = record_suspicious(True, data)

    return {
        "reported": result,
        "proof_hash": proof
    }
@app.get("/last-transaction")
def get_last_transaction():
    return last_transaction

@app.get("/blockchain-log")
def blockchain_log():
    return get_blockchain()

app.include_router(wallet_router)
app.include_router(budget_router)
app.include_router(alerts_router)
app.include_router(behavior_router)