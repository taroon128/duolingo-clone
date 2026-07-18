"""
Skills router.

Task 7 scope: exactly one endpoint — GET /skills, returning a flat list
of every skill across every unit, each with its computed
locked/unlocked/completed status.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.learning_path import SkillOut
from app.services.learning_path_service import get_skills

router = APIRouter(tags=["learning-path"])


@router.get("/skills", response_model=list[SkillOut])
def read_skills(db: Session = Depends(get_db)):
    return get_skills(db)
