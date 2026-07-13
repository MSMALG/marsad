from fastapi import APIRouter

router = APIRouter()

wallets = [
    {
        "id": 1,
        "name": "محفظة الزواج",
        "saved": 2500,
        "goal": 10000,
        "progress": 25
    },
    {
        "id": 2,
        "name": "محفظة السفر",
        "saved": 2500,
        "goal": 2000,
        "progress": 40
    }
]

@router.get("/wallets")
def get_wallets():
    return wallets

@router.get("/wallets/{wallet_id}")
def get_wallet(wallet_id: int):
    for wallet in wallets:
        if wallet["id"] == wallet_id:
            return wallet
    return {"message": "Wallet not found"}