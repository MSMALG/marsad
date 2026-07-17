from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import db_models  # noqa: F401 (needed so tables are registered before create_all)
from auth_routes import router as auth_router
from expenses import router as expenses_router
from wallets import router as wallet_router
from Budget import router as budget_router
from Alert import router as alerts_router
from BehaviorAnalysis import router as behavior_router
from cheaper_alternative import router as cheaper_alternative_router
from rewards import router as rewards_router
from security import router as security_router
from travel import router as travel_router

# Creates marsad.db and all tables on first run if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Marsad API", version="1.0.0")

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


app.include_router(auth_router)
app.include_router(expenses_router)
app.include_router(wallet_router)
app.include_router(budget_router)
app.include_router(alerts_router)
app.include_router(behavior_router)
app.include_router(cheaper_alternative_router)
app.include_router(rewards_router)
app.include_router(security_router)
app.include_router(travel_router)