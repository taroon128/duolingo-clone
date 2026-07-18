"""
Leaderboard router.

Task 13 scope: exactly one endpoint — GET /leaderboard — returning
every user ranked by XP, highest first.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.leaderboard import LeaderboardEntry
from app.services.leaderboard_service import get_leaderboard

router = APIRouter(tags=["leaderboard"])


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def read_leaderboard(db: Session = Depends(get_db)):
    return get_leaderboard(db)
