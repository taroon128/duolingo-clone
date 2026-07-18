from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Lesson(Base):
    """
    One playthrough-sized sequence of exercises — the "atomic" unit of
    the lesson loop. Completing a Lesson is what awards XP and advances
    the parent Skill's Progress row. Several Lessons make up one full
    pass through a Skill; finishing all of them earns one crown.
    """

    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, nullable=False)  # position within the skill
    title = Column(String(100), nullable=True)
    xp_reward = Column(Integer, nullable=False, default=10)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship(
        "Exercise",
        back_populates="lesson",
        cascade="all, delete-orphan",
        order_by="Exercise.order_index",
    )

    def __repr__(self):
        return f"<Lesson id={self.id} skill_id={self.skill_id} order={self.order_index}>"
