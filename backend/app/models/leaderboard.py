from datetime import datetime

from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Leaderboard(Base):
    """
    One row per (User, weekly period) — mirrors Duolingo's real leagues
    mechanic, where XP standing resets every cycle for ranking purposes
    while lifetime XP (User.xp_total) never resets. Keeping these as
    two separate numbers, in two separate places, means a new
    leaderboard week can start cleanly without ever touching — or
    risking — the user's real lifetime stats.

    `rank` is cached here rather than always computed on the fly. That
    lets a seeded leaderboard (explicitly allowed — "a simple
    leaderboard (can be seeded)") render correctly with no ranking
    logic written yet. Once a ranking service exists (a later task),
    it recomputes and rewrites `rank` for everyone in a period whenever
    any of their `weekly_xp` values change.
    """

    __tablename__ = "leaderboard"
    __table_args__ = (
        # One row per user per period — prevents accidentally seeding
        # or writing two competing XP totals for the same user/week.
        UniqueConstraint("user_id", "period_start", name="uq_leaderboard_user_period"),
    )

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    period_start = Column(Date, nullable=False)  # e.g. the Monday of that leaderboard week
    weekly_xp = Column(Integer, nullable=False, default=0)
    rank = Column(Integer, nullable=True)  # cached; recomputed by the ranking service
    league = Column(Integer, nullable=False, default=1)  # simple tier number, e.g. 1=Bronze

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    user = relationship("User", back_populates="leaderboard_entries")

    def __repr__(self):
        return (
            f"<Leaderboard user_id={self.user_id} period={self.period_start} "
            f"xp={self.weekly_xp}>"
        )
