from datetime import datetime

from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class Progress(Base):
    """
    Tracks one User's mastery of one Skill. This is an association
    entity sitting between User and Skill: conceptually a many-to-many
    (many users progress through many skills), but with real data of
    its own (crowns, how far into the current pass they are) attached
    to the *pairing* rather than to either side alone — so it gets its
    own table instead of a plain join table.

    Tracked at SKILL granularity, not per individual Lesson attempt.
    The assignment's own wording ("mark the skill's progress on
    completion", "completed skills must persist") points at the skill
    as the unit of persisted progress, and `lessons_completed_in_level`
    is enough to resume mid-skill without needing a whole additional
    per-lesson-attempt table.

    No `status` column, deliberately (see Skill's docstring for the
    same reasoning): locked / available / in-progress / mastered are
    all derivable from `crowns`, `lessons_completed_in_level`, and the
    Skill's own `levels` + lesson count — not stored redundantly here.
    """

    __tablename__ = "progress"
    __table_args__ = (
        # A user can only have ONE progress row per skill — this is
        # what makes Progress a true association entity rather than a
        # log of every attempt ever made.
        UniqueConstraint("user_id", "skill_id", name="uq_progress_user_skill"),
    )

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    crowns = Column(Integer, nullable=False, default=0)
    # How many lessons completed in the CURRENT pass toward the next
    # crown. Compared against Skill.lessons count to know when to
    # increment `crowns` and reset this back to 0.
    lessons_completed_in_level = Column(Integer, nullable=False, default=0)
    last_practiced_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("User", back_populates="progress_entries")
    skill = relationship("Skill", back_populates="progress_entries")

    def __repr__(self):
        return (
            f"<Progress user_id={self.user_id} skill_id={self.skill_id} "
            f"crowns={self.crowns}>"
        )
