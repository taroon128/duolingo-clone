"""
Business logic for the Profile API.

Kept separate from the router (app/routers/profile.py) so the actual
rules — which user counts as "the" profile without real auth, and how
achievements get computed — live in one plain-Python, easily testable
place, rather than inline inside an HTTP handler.
"""
from sqlalchemy.orm import Session

from app.models import User
from app.schemas.profile import Achievement, ProfileResponse
from app.services.user_service import get_default_user


def _compute_achievements(user: User) -> list[Achievement]:
    """
    Small, derived achievement rules computed from columns that already
    exist — there is no Achievement/Badge table. Task 2 defined exactly
    7 models, and a real badges system is explicitly listed as a Bonus
    feature in the assignment, not a Must-Have. Each rule below is just
    a boolean check against data already on User/Progress, so
    "achievements" costs zero schema changes.

    Includes a mix of unlocked and locked results against the seeded
    demo data on purpose — "Perfect Week" needs a 7-day streak, and the
    seed only gives the demo user a 3-day one, so this demonstrates the
    locked state actually working, not just the happy path.
    """
    total_crowns = sum(progress.crowns for progress in user.progress_entries)

    definitions = [
        ("Getting Started", "Earn your first XP", user.xp_total > 0),
        ("3-Day Streak", "Practice 3 days in a row", user.current_streak >= 3),
        ("First Crown", "Earn your first crown on any skill", total_crowns >= 1),
        ("Perfect Week", "Practice 7 days in a row", user.current_streak >= 7),
    ]
    return [
        Achievement(name=name, description=description, unlocked=unlocked)
        for name, description, unlocked in definitions
    ]


def get_profile(db: Session) -> ProfileResponse | None:
    """
    Returns the profile of "the" learner. Real authentication is out of
    scope for this assignment — the brief says to "assume a default
    logged-in learner" — so this returns whichever user is first in the
    table, rather than hardcoding the specific seeded username. That
    keeps this working even if the seed data's username ever changes.

    Returns None if no user exists yet (e.g. seed.py hasn't been run) —
    deliberately NOT raising an HTTPException here, since that's a web
    framework concept and this function has no idea it's being called
    from an HTTP router. Translating "no profile" into an actual 404
    response is the router's job, not this function's.
    """
    user = get_default_user(db)
    if user is None:
        return None

    return ProfileResponse(
        name=user.display_name,
        xp=user.xp_total,
        streak=user.current_streak,
        hearts=user.hearts,
        achievements=_compute_achievements(user),
    )
