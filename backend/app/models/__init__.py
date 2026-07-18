"""
Central import point for all SQLAlchemy models.

Importing `app.models` (rather than each model file separately)
guarantees every model class is registered on `Base.metadata` before
anything calls `Base.metadata.create_all(engine)` — which will happen
in a later task (main.py on startup, or seed.py), not here.
"""
from app.models.user import User
from app.models.unit import Unit
from app.models.skill import Skill
from app.models.lesson import Lesson
from app.models.exercise import Exercise, ExerciseType
from app.models.progress import Progress
from app.models.leaderboard import Leaderboard

__all__ = [
    "User",
    "Unit",
    "Skill",
    "Lesson",
    "Exercise",
    "ExerciseType",
    "Progress",
    "Leaderboard",
]
