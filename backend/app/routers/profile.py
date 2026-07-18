"""
Profile API router.

Task 6 scope: exactly one endpoint — GET /profile, returning name, XP,
streak, hearts, and achievements for the current (default) learner.
No other endpoints, no frontend — matching this task's instruction.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.profile import ProfileResponse
from app.services.profile_service import get_profile

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=ProfileResponse)
def read_profile(db: Session = Depends(get_db)):
    profile = get_profile(db)
    if profile is None:
        raise HTTPException(
            status_code=404,
            detail="No user found — run 'python -m app.seed' to create the demo learner first.",
        )
    return profile
