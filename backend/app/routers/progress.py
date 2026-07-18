"""
Progress router.

Task 12 scope: exactly one endpoint — POST /lesson/{lesson_id}/complete
— recording that a lesson was finished and updating the owning
skill's Progress accordingly. "Unlock next skill" isn't a separate
step implemented here; see progress_service.py for why.

Router naming: the URL is nested under /lesson/{id}, but this lives in
its own progress.py file rather than lessons.py — "progress" is
exactly the router name Task 4's scaffold anticipated, and grouping by
business concept (this endpoint is fundamentally about Progress, not
lesson content) matches how profile/answers/units/skills were each
already split into their own dedicated files by concept rather than by
URL prefix.

Not gated behind hearts (unlike GET /lesson/{id} and POST /answer in
Task 11) — this endpoint records a fact ("this lesson was completed"),
it doesn't consume a resource the way answering a question does.

Note: this endpoint does not award Lesson.xp_reward. Task 10 already
covers XP, awarded per correct answer; this task's two bullets ("save
completed lesson", "unlock next skill") are about progress, not XP.
Lesson.xp_reward stays defined on the model but unused for now — a
lesson-completion XP bonus stacked on top of per-answer XP would be a
small, separately-scoped addition if wanted later.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.progress import LessonCompletionResult
from app.services.progress_service import complete_lesson, NoDefaultUserError

router = APIRouter(tags=["progress"])


@router.post("/lesson/{lesson_id}/complete", response_model=LessonCompletionResult)
def complete_lesson_endpoint(lesson_id: int, db: Session = Depends(get_db)):
    try:
        outcome = complete_lesson(db, lesson_id)
    except NoDefaultUserError:
        raise HTTPException(
            status_code=404,
            detail="No user found — run 'python -m app.seed' to create the demo learner first.",
        )

    if outcome is None:
        raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")

    progress, crown_earned = outcome
    return LessonCompletionResult(
        skill_id=progress.skill_id,
        crowns=progress.crowns,
        lessons_completed_in_level=progress.lessons_completed_in_level,
        crown_earned=crown_earned,
    )
