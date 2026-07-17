from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import db_models
from auth import get_current_user

router = APIRouter(prefix="/rewards", tags=["rewards"])

# points required per tier — real thresholds, easy to tune later
TIERS = [
    (0, "برونزي"),
    (100, "فضي"),
    (500, "ذهبي"),
    (1500, "بلاتيني"),
]


def _current_tier(points: int) -> str:
    tier = TIERS[0][1]
    for threshold, name in TIERS:
        if points >= threshold:
            tier = name
    return tier


@router.get("")
def get_rewards(
    db: Session = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user),
):
    reward = (
        db.query(db_models.RewardAccount)
        .filter(db_models.RewardAccount.user_id == current_user.id)
        .first()
    )
    if not reward:
        raise HTTPException(status_code=404, detail="Reward account not found")

    next_tier = next((t for t in TIERS if t[0] > reward.points), None)
    points_to_next = (next_tier[0] - reward.points) if next_tier else 0

    return {
        "points": reward.points,
        "tier": _current_tier(reward.points),
        "next_tier": next_tier[1] if next_tier else None,
        "points_to_next_tier": points_to_next,
    }