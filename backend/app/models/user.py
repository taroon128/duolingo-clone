from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """
    A learner.

    Real authentication is explicitly out of scope for this assignment
    (see "Mocked / Placeholder Sections" in the brief), so `email` is
    nullable and there is no password column yet. The app runs against a
    single seeded default learner. The table is still shaped so real auth
    could be added later purely additively (e.g. a `hashed_password`
    column) without altering any existing column.

    Mutable gamification state — xp_total, streak, hearts, gems — lives
    directly as columns on User rather than in a separate "UserStats"
    table. That state is a strict 1:1 relationship with a user (every
    user has exactly one current XP total, one current heart count),
    so splitting it into its own table would only add a mandatory join
    to nearly every request (the top bar reads all of these on every
    page). A separate table earns its keep when the relationship is
    1:many or many:many — which is exactly why Progress and Leaderboard
    (below) ARE separate tables.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    avatar_url = Column(String(500), nullable=True)

    # --- Lifetime / current gamification state ---
    xp_total = Column(Integer, nullable=False, default=0)

    current_streak = Column(Integer, nullable=False, default=0)
    longest_streak = Column(Integer, nullable=False, default=0)
    # Last calendar date the user completed a lesson. Comparing this to
    # "today" is the entire streak algorithm: same day -> no change,
    # yesterday -> increment, older -> reset to 1. Deliberately a plain
    # Date (not DateTime) so "day logic can be simulated/testable"
    # (per the assignment) by just setting this field directly in tests,
    # without worrying about time-of-day.
    last_activity_date = Column(Date, nullable=True)

    hearts = Column(Integer, nullable=False, default=5)
    max_hearts = Column(Integer, nullable=False, default=5)
    # Timestamp of the most recent heart lost. Regeneration is computed
    # as (now - last_heart_lost_at) // regen_interval, so we only need
    # the one timestamp, not a log of every heart event.
    last_heart_lost_at = Column(DateTime, nullable=True)

    gems = Column(Integer, nullable=False, default=0)  # mocked currency
    daily_goal_xp = Column(Integer, nullable=False, default=20)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # --- Relationships ---
    # One user has many Progress rows (one per skill they've touched)
    # and many Leaderboard rows (one per weekly period they've been
    # ranked in). cascade="all, delete-orphan" means deleting a user
    # cleans up their progress/leaderboard rows too, instead of leaving
    # orphaned rows pointing at a user_id that no longer exists.
    progress_entries = relationship(
        "Progress", back_populates="user", cascade="all, delete-orphan"
    )
    leaderboard_entries = relationship(
        "Leaderboard", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User id={self.id} username={self.username!r} xp={self.xp_total}>"
