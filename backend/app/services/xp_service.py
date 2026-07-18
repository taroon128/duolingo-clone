"""
XP Service.

Owns exactly one responsibility: adding XP to a user's running total
and persisting it. Kept deliberately separate from answer_service.py
(which owns "is this answer right or wrong") and from any future
lesson-completion service (which will own "how much XP does finishing
a whole lesson award, and does that also update crowns/streak") —
each service knows about its own slice of the gamification rules, and
nothing else. Reusable: the future lesson-completion flow can call
this same award_xp() rather than re-implementing "add to xp_total"
a second time.
"""
from sqlalchemy.orm import Session

from app.models import User

# Placeholder value — the assignment doesn't specify an exact XP
# figure per correct answer. Kept as one named constant rather than a
# magic number inline, so it's a single, obvious place to tune later.
XP_PER_CORRECT_ANSWER = 10


def award_xp(db: Session, user: User, amount: int) -> int:
    """
    Adds `amount` to the user's running XP total and commits.
    Returns the new xp_total, in case a caller wants to react to the
    resulting value (e.g. checking it against a daily goal later).
    """
    user.xp_total += amount
    db.commit()
    db.refresh(user)
    return user.xp_total
