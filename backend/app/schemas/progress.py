"""
Pydantic schema for the Progress API (POST /lesson/{lesson_id}/complete).
"""
from pydantic import BaseModel


class LessonCompletionResult(BaseModel):
    skill_id: int
    crowns: int
    lessons_completed_in_level: int
    crown_earned: bool
