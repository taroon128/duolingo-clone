"""
Shared user-lookup helper.

Real authentication is out of scope for this assignment (the brief
says to "assume a default logged-in learner"), so every service that
needs "the current user" resolves it the same way: whichever User row
is first in the table.

This exact lookup was duplicated inline in profile_service.py and
learning_path_service.py, each with a comment noting it should be
extracted "if a third place ends up needing it too." Task 10's XP
awarding is that third place, so it's extracted here now, and the
other two services are updated to use it instead of their own copies.
"""
from sqlalchemy.orm import Session

from app.models import User


def get_default_user(db: Session) -> User | None:
    return db.query(User).first()
