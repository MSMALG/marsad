import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import db_models
from auth import get_current_user

router = APIRouter(prefix="/security", tags=["security"])

GENESIS_HASH = "0" * 64


def _compute_hash(prev_hash: str, user_id: int, event_type: str, details: str, timestamp: str) -> str:
    payload = f"{prev_hash}|{user_id}|{event_type}|{details}|{timestamp}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def log_security_event(db: Session, user_id: int, event_type: str, details: str) -> db_models.SecurityLog:
    """Append an event to this user's hash chain. Call this from anywhere
    in the backend that detects something worth recording immutably."""
    last_entry = (
        db.query(db_models.SecurityLog)
        .filter(db_models.SecurityLog.user_id == user_id)
        .order_by(db_models.SecurityLog.id.desc())
        .first()
    )
    prev_hash = last_entry.hash if last_entry else GENESIS_HASH
    timestamp = datetime.utcnow()
    new_hash = _compute_hash(prev_hash, user_id, event_type, details, timestamp.isoformat())

    entry = db_models.SecurityLog(
        user_id=user_id,
        event_type=event_type,
        details=details,
        prev_hash=prev_hash,
        hash=new_hash,
        timestamp=timestamp,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def check_suspicious_expense(db: Session, user_id: int, amount: float, category: str, merchant: str | None):
    """Rule-based fraud check: flags an expense as suspicious if it's far
    above the user's historical average, and logs it to the chain."""
    from sqlalchemy import func

    avg_amount = (
        db.query(func.avg(db_models.Expense.amount))
        .filter(db_models.Expense.user_id == user_id)
        .scalar()
    )

    is_suspicious = False
    reason = ""

    if avg_amount and avg_amount > 0 and amount > avg_amount * 3:
        is_suspicious = True
        reason = f"المبلغ {amount:.0f} ريال يفوق متوسط إنفاقك المعتاد ({avg_amount:.0f} ريال) بأكثر من 3 أضعاف."
    elif amount > 5000:
        is_suspicious = True
        reason = f"عملية بمبلغ كبير غير معتاد: {amount:.0f} ريال."

    if is_suspicious:
        details = f"عملية مشبوهة على {merchant or category}: {reason}"
        log_security_event(db, user_id, "suspicious_transaction", details)

    return is_suspicious


@router.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    logs = (
        db.query(db_models.SecurityLog)
        .filter(db_models.SecurityLog.user_id == current_user.id)
        .order_by(db_models.SecurityLog.id.asc())
        .all()
    )
    return [
        {
            "id": log.id,
            "event_type": log.event_type,
            "details": log.details,
            "prev_hash": log.prev_hash,
            "hash": log.hash,
            "timestamp": log.timestamp,
        }
        for log in logs
    ]


@router.get("/verify")
def verify_chain(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    """Recomputes every hash in this user's chain to confirm nothing was
    tampered with — this is the actual blockchain integrity check."""
    logs = (
        db.query(db_models.SecurityLog)
        .filter(db_models.SecurityLog.user_id == current_user.id)
        .order_by(db_models.SecurityLog.id.asc())
        .all()
    )

    expected_prev = GENESIS_HASH
    for log in logs:
        recomputed = _compute_hash(expected_prev, current_user.id, log.event_type, log.details, log.timestamp.isoformat())
        if recomputed != log.hash or log.prev_hash != expected_prev:
            return {"valid": False, "broken_at_id": log.id}
        expected_prev = log.hash

    return {"valid": True, "entries_checked": len(logs)}