"""
Progress Service.

Owns exactly one responsibility: recording that a lesson was
completed, and updating the owning skill's Progress row accordingly
(lessons_completed_in_level, crowns, last_practiced_at).

"Unlock next skill" needs ZERO additional code here — it isn't a
separate action to implement. learning_path_service's lock/unlock
computation (Task 7) was deliberately built to derive a skill's status
from Progress.crowns at read time, never stored (see Skill's and
Progress's own docstrings from Task 2 on why). The moment this
function increments crowns from 0 to 1 on a skill, the very next
GET /skills or GET /units call already computes the following skill as
"unlocked" — because that computation reads crowns fresh, every time,
from whatever this function just wrote. This is the actual payoff of
that Task 2/7 design decision, not a coincidence.
"""
from datetime import datetime

from sqlalchemy.orm import Session

from app.models import Lesson, Progress
from app.services.user_service import get_default_user


class NoDefaultUserError(Exception):
    """Raised when there's no user in the database to record progress against."""


def complete_lesson(db: Session, lesson_id: int) -> tuple[Progress, bool] | None:
    """
    Returns None if the lesson doesn't exist. Raises NoDefaultUserError
    if there's no user in the database at all — unlike other services'
    "still show something meaningful with 0 crowns" fallback, there's
    genuinely nothing to persist progress FOR without a user. Otherwise
    returns (progress, crown_earned).
    """
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        return None

    user = get_default_user(db)
    if user is None:
        raise NoDefaultUserError()

    skill = lesson.skill

    progress = (
        db.query(Progress)
        .filter_by(user_id=user.id, skill_id=skill.id)
        .first()
    )
    if progress is None:
        # Lazily created on first interaction with this skill — matches
        # seed.py's own note that Progress rows aren't pre-created for
        # every skill up front.
        progress = Progress(user_id=user.id, skill_id=skill.id, crowns=0, lessons_completed_in_level=0)
        db.add(progress)

    progress.lessons_completed_in_level += 1
    progress.last_practiced_at = datetime.utcnow()

    crown_earned = False
    total_lessons_in_skill = len(skill.lessons)
    if progress.lessons_completed_in_level >= total_lessons_in_skill:
        # A full pass through the skill's lessons is complete — reset
        # the counter and mint a crown, capped at the skill's max
        # (further completions of an already-maxed skill still reset
        # the counter for "practice," but stop adding crowns).
        progress.lessons_completed_in_level = 0
        if progress.crowns < skill.levels:
            progress.crowns += 1
            crown_earned = True

    db.commit()
    db.refresh(progress)

    return progress, crown_earned
