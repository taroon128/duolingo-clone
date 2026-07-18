"""
Lessons router.

Task 8 scope: GET /lesson/{lesson_id}, returning a lesson with its
exercises. No answer validation (that's answers.py) — which is exactly
why this endpoint redacts each exercise's correct-answer fields rather
than returning them as-is (see lesson_service._redact_payload).

Task 11 adds a hearts gate here: a user with 0 hearts can't open any
lesson at all, not just submit wrong answers. This check is
deliberately done HERE in the router (via hearts_service.require_hearts)
rather than inside lesson_service.get_lesson — get_lesson is a pure
content-fetcher with no other side effects or concerns, and mixing an
access-control rule into it would blur that. Contrast with
answer_service.evaluate_submission, which is already an orchestrator
juggling multiple concerns for one action, so the same hearts check
fits naturally inside it instead.

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
from app.services.user_service import get_default_user
from app.services.hearts_service import require_hearts, OutOfHeartsError

router = APIRouter(tags=["lessons"])


@router.get("/lesson/{lesson_id}", response_model=LessonOut)
def read_lesson(lesson_id: int, db: Session = Depends(get_db)):
    try:
        require_hearts(get_default_user(db))
    except OutOfHeartsError:
        raise HTTPException(
            status_code=403,
            detail="Out of hearts — wait for them to regenerate before starting a lesson.",
        )

    lesson = get_lesson(db, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")
    return lesson
