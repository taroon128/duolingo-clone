"""
Lessons router.

Task 8 scope: exactly one endpoint — GET /lesson/{lesson_id}, returning
a lesson with its exercises. No answer validation (that's a later
task) — which is exactly why this endpoint redacts each exercise's
correct-answer fields rather than returning them as-is (see
lesson_service._redact_payload).

Path note: the task specifies "GET /lesson/{id}" (singular, matching
the resource name) — kept exactly as given, even though /units and
/skills use the plural convention. The path parameter itself is named
`lesson_id` rather than `id` purely to avoid shadowing Python's builtin
id() inside the function body; the actual URL a client calls
(e.g. GET /lesson/3) is identical either way.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.lesson import LessonOut
from app.services.lesson_service import get_lesson

router = APIRouter(tags=["lessons"])


@router.get("/lesson/{lesson_id}", response_model=LessonOut)
def read_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = get_lesson(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")
    return lesson
