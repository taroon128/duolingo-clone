"""
Pydantic schemas for the Lesson API (GET /lesson/{lesson_id}).

`ExerciseOut.payload` here is a REDACTED version of the stored
Exercise.payload — this task explicitly excludes answer validation,
which only makes sense as a scope boundary if a later task is going to
check answers server-side. That means this endpoint must not hand the
correct answer to the client up front. See lesson_service.py for the
actual per-type redaction logic.
"""
from pydantic import BaseModel

from app.models import ExerciseType


class ExerciseOut(BaseModel):
    id: int
    order_index: int
    type: ExerciseType
    prompt: str
    payload: dict


class LessonOut(BaseModel):
    id: int
    skill_id: int
    title: str | None
    xp_reward: int
    exercises: list[ExerciseOut]
