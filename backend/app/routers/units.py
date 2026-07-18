"""
Units router.

Task 7 scope: exactly one endpoint — GET /units, returning every unit
with its skills nested inside, each skill carrying its computed
locked/unlocked/completed status.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.learning_path import UnitOut
from app.services.learning_path_service import get_units

router = APIRouter(tags=["learning-path"])


@router.get("/units", response_model=list[UnitOut])
def read_units(db: Session = Depends(get_db)):
    return get_units(db)
