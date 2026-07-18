from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Skill(Base):
    """
    A single node on the skill tree (e.g. "Greetings", "Food"). Belongs
    to exactly one Unit, and contains an ordered set of Lessons.

    Deliberately NOT stored here: whether this skill is locked,
    available, or completed. That state is fully derivable at read
    time from this skill's `order_index` plus the previous skill's own
    Progress row (has it reached at least one crown?). Storing a
    `status` column instead would mean keeping a derived value in sync
    across potentially every skill in the tree every time ANY skill's
    progress changes — a classic source of stale-state bugs. Compute,
    don't cache, when the source data is this cheap to read.

    `levels` mirrors Duolingo's "crowns" mechanic: how many full passes
    through this skill's lessons are required to fully master it.
    """

    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    order_index = Column(Integer, nullable=False)  # position within the unit
    icon_name = Column(String(50), nullable=True)  # cosmetic, e.g. "book", "chat-bubble"
    levels = Column(Integer, nullable=False, default=5)  # crowns needed for full mastery

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship(
        "Lesson",
        back_populates="skill",
        cascade="all, delete-orphan",
        order_by="Lesson.order_index",
    )
    # A skill can have progress rows for many different users — this is
    # the "many" side of the User <-> Skill relationship that Progress
    # sits in the middle of.
    progress_entries = relationship(
        "Progress", back_populates="skill", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Skill id={self.id} title={self.title!r} unit_id={self.unit_id}>"
