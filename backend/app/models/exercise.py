import enum

from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import relationship

from app.database import Base


class ExerciseType(str, enum.Enum):
    """
    Subclassing `str` alongside `enum.Enum` means ExerciseType.TRANSLATE
    IS the string "translate" for equality/JSON purposes — so FastAPI
    can serialize it straight into API responses later, and the
    frontend's TypeScript union type can match these values exactly.
    """

    MULTIPLE_CHOICE = "multiple_choice"
    TRANSLATE = "translate"          # word-bank / tap-the-words
    MATCH_PAIRS = "match_pairs"
    FILL_BLANK = "fill_blank"
    TYPE_ANSWER = "type_answer"


class Exercise(Base):
    """
    A single question within a Lesson.

    Design choice worth defending in the interview: all 5 required
    exercise types share this ONE table (a `type` discriminator column
    + a flexible `payload` JSON column), rather than 5 separate tables
    joined to a base Exercise table (joined-table inheritance). The
    inheritance approach is the more "textbook normalized" answer, but
    it means 5 extra tables and joins for content that is fundamentally
    just structured configuration data the frontend renders — nobody
    ever needs to query "all MATCH_PAIRS exercises across every lesson"
    relationally. The JSON column is the pragmatic fit for this scale.
    The tradeoff: `payload`'s internal shape isn't validated by the
    database — that validation moves to Pydantic schemas in a later
    task, at the API boundary, which is arguably where it belongs
    anyway since that's the shape the frontend actually depends on.

    Expected `payload` shape per type (documented here, enforced later
    in Pydantic):
        MULTIPLE_CHOICE : {"options": [str, ...], "correct_option": str}
        TRANSLATE       : {"word_bank": [str, ...], "correct_sequence": [str, ...]}
        MATCH_PAIRS     : {"pairs": [{"left": str, "right": str}, ...]}
        FILL_BLANK      : {"sentence_template": str, "correct_answer": str}
        TYPE_ANSWER     : {"correct_answer": str, "accepted_alternatives": [str, ...]}
    """

    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, nullable=False)  # position within the lesson
    type = Column(
        # values_callable makes SQLAlchemy store the *value* ("multiple_choice")
        # rather than its default of storing the enum *name* ("MULTIPLE_CHOICE").
        # This keeps the DB value identical to what the API/frontend will see.
        SqlEnum(ExerciseType, values_callable=lambda enum_cls: [e.value for e in enum_cls]),
        nullable=False,
    )
    prompt = Column(String(500), nullable=False)  # the instruction/question text shown
    payload = Column(JSON, nullable=False)  # type-specific data — see docstring above

    lesson = relationship("Lesson", back_populates="exercises")

    def __repr__(self):
        return f"<Exercise id={self.id} type={self.type} lesson_id={self.lesson_id}>"
