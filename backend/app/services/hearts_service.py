"""
Hearts Service.

Owns exactly one responsibility: managing a user's heart count —
decrementing it on wrong answers, and enforcing the "blocked once it
hits zero" rule everywhere hearts matter. Mirrors xp_service.py's
shape: small, single-purpose, and reusable from multiple call sites
(POST /answer, GET /lesson/{id}) rather than each one reimplementing
the same check independently.

Deliberately does NOT implement heart regeneration/refill — the
assignment lists that as its own distinct mechanic ("Hearts
regeneration over time or via a mocked practice/refill"), separate
from this task's two requirements (decrease on wrong, block at zero).
Once a user hits 0 hearts here, they stay at 0 until a future task
adds that back.
"""
from sqlalchemy.orm import Session

from app.models import User


class OutOfHeartsError(Exception):
    """Raised when an action that requires hearts is attempted with 0 remaining."""


def has_hearts(user: User) -> bool:
    return user.hearts > 0


def require_hearts(user: User | None) -> None:
    """
    Raises OutOfHeartsError if `user` exists and has 0 hearts.

    A missing user (unseeded database) is NOT treated as "out of
    hearts" — there's no one to block. This matches the same
    permissive stance already taken elsewhere (e.g.
    learning_path_service showing an unseeded path rather than
    erroring) when no user exists yet.
    """
    if user is not None and not has_hearts(user):
        raise OutOfHeartsError()


def lose_heart(db: Session, user: User) -> int:
    """
    Decrements hearts by 1, clamped at 0 (never negative), commits, and
    returns the new heart count.
    """
    if user.hearts > 0:
        user.hearts -= 1
        db.commit()
        db.refresh(user)
    return user.hearts
