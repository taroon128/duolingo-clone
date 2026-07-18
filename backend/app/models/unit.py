from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Unit(Base):
    """
    A top-level chapter on the learning path (e.g. "Basics", "Phrases",
    "Travel"), containing an ordered set of Skills.

    No separate `Course` table exists yet: the assignment seeds exactly
    one language course, and "Multiple languages" is explicitly listed
    as a placeholder feature, not a required one. Unit is therefore the
    root of the content hierarchy for now. If multi-course support were
    ever needed, the natural extension is a `course_id` FK column added
    to this table alone — nothing below Unit in the hierarchy would
    need to change.
    """

    __tablename__ = "units"

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    # 0-based position of this unit on the path. Rendering order and
    # (indirectly, via the first skill's own order_index) unlock order
    # both derive from this — it is never recalculated, only assigned
    # once at seed time / content-authoring time.
    order_index = Column(Integer, nullable=False)
    color_hex = Column(String(7), nullable=True)  # e.g. "#58CC02" — cosmetic only

    # order_by here means `unit.skills` always comes back in path order
    # without every caller having to remember to sort it themselves.
    skills = relationship(
        "Skill",
        back_populates="unit",
        cascade="all, delete-orphan",
        order_by="Skill.order_index",
    )

    def __repr__(self):
        return f"<Unit id={self.id} title={self.title!r} order={self.order_index}>"
