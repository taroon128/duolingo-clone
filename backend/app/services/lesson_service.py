"""
Business logic for the Lesson API.

The core job here is redacting each exercise's payload so the correct
answer is never sent to the client on GET — answer checking is
explicitly deferred to a later task, which only makes sense if this
endpoint doesn't leak the answer key up front.
"""
import random

from sqlalchemy.orm import Session

from app.models import Lesson, ExerciseType
from app.schemas.lesson import ExerciseOut, LessonOut


def _redact_payload(exercise_type: ExerciseType, payload: dict) -> dict:
    """
    Strips whatever part of `payload` constitutes the answer key,
    keeping only what's needed to actually render and interact with
    the exercise. Handled per-type, because "what counts as the
    answer" is structurally different for each of the 5 exercise types
    (see Exercise's own docstring in Task 2 for the full payload shapes).
    """
    if exercise_type == ExerciseType.MULTIPLE_CHOICE:
        # Safe to show every option; "correct_option" is the answer.
        return {"options": payload["options"]}

    if exercise_type == ExerciseType.TRANSLATE:
        # The word bank IS the interactive content (tiles to tap/drag);
        # "correct_sequence" is the answer.
        return {"word_bank": payload["word_bank"]}

    if exercise_type == ExerciseType.MATCH_PAIRS:
        # "pairs" is simultaneously the content AND the answer key — a
        # {"left": X, "right": Y} entry directly states the correct
        # match. Split into two independent, shuffled lists instead, so
        # the user actually has to do the matching, and array position
        # can't be used to infer which pairs go together.
        pairs = payload["pairs"]
        left_items = [p["left"] for p in pairs]
        right_items = [p["right"] for p in pairs]
        random.shuffle(right_items)
        return {"left_items": left_items, "right_items": right_items}

    if exercise_type == ExerciseType.FILL_BLANK:
        # The template (with its blank) is safe; "correct_answer" is not.
        return {"sentence_template": payload["sentence_template"]}

    if exercise_type == ExerciseType.TYPE_ANSWER:
        # Every key in this payload IS the answer key — the prompt text
        # alone (e.g. "Type the Spanish word for 'Thank you'") already
        # carries all the content needed to render this exercise, so
        # nothing from payload is safe to include.
        return {}

    return {}


def get_lesson(db: Session, lesson_id: int) -> LessonOut | None:
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if lesson is None:
        return None

    return LessonOut(
        id=lesson.id,
        skill_id=lesson.skill_id,
        title=lesson.title,
        xp_reward=lesson.xp_reward,
        exercises=[
            ExerciseOut(
                id=exercise.id,
                order_index=exercise.order_index,
                type=exercise.type,
                prompt=exercise.prompt,
                payload=_redact_payload(exercise.type, exercise.payload),
            )
            # lesson.exercises is already ordered by order_index — see
            # the relationship definition in app/models/lesson.py
            for exercise in lesson.exercises
        ],
    )
