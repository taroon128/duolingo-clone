"""
Business logic for the Answer Validation API.

Task 9 gave this module exactly one job: check a submitted answer
against the exercise's stored correct answer and return a verdict —
`_check_answer` and `check_answer` below are UNCHANGED since that task
and remain a pure, side-effect-free validator. Task 10 added XP
awarding as a separate `evaluate_submission` function that composes
`check_answer` with `xp_service.award_xp`. Task 11 extends that same
`evaluate_submission` orchestrator with the hearts rule: check hearts
before doing anything else, and lose one on a wrong answer — see
hearts_service.py for why that logic lives there and not here.
"""
from sqlalchemy.orm import Session

from app.models import Exercise, ExerciseType
from app.services.user_service import get_default_user
from app.services.xp_service import award_xp, XP_PER_CORRECT_ANSWER
from app.services.hearts_service import require_hearts, lose_heart


def _check_answer(exercise_type: ExerciseType, payload: dict, submitted_answer) -> bool:
    """
    Per-type comparison, run against the exercise's REAL, unredacted
    payload straight from the database — never against the redacted
    version Task 8's GET /lesson/{id} sends to clients.

    Malformed or unexpected answer shapes (e.g. a plain string
    submitted where a list was expected) are treated as simply wrong,
    not an error — a malformed answer can never be correct, so there's
    no need to fail the request itself over it.
    """
    if exercise_type == ExerciseType.MULTIPLE_CHOICE:
        # Selecting from a fixed set of options — exact match, no case
        # folding needed since the user picks rather than types.
        return isinstance(submitted_answer, str) and submitted_answer.strip() == payload["correct_option"]

    if exercise_type == ExerciseType.TRANSLATE:
        # Order matters — the user is reconstructing a sentence by
        # tapping word-bank tiles in sequence.
        if not isinstance(submitted_answer, list):
            return False
        return [str(word).strip() for word in submitted_answer] == payload["correct_sequence"]

    if exercise_type == ExerciseType.MATCH_PAIRS:
        # Order doesn't matter here — compare the SET of proposed
        # (left, right) pairs against the true set.
        if not isinstance(submitted_answer, list):
            return False
        try:
            submitted_set = {(pair["left"], pair["right"]) for pair in submitted_answer}
        except (TypeError, KeyError):
            return False
        correct_set = {(pair["left"], pair["right"]) for pair in payload["pairs"]}
        return submitted_set == correct_set

    if exercise_type == ExerciseType.FILL_BLANK:
        # Free text — trim and case-fold so "me", "Me", " me " all match.
        if not isinstance(submitted_answer, str):
            return False
        return submitted_answer.strip().lower() == payload["correct_answer"].strip().lower()

    if exercise_type == ExerciseType.TYPE_ANSWER:
        # Free text, with alternates — same normalization, checked
        # against correct_answer OR any accepted_alternatives entry.
        if not isinstance(submitted_answer, str):
            return False
        normalized = submitted_answer.strip().lower()
        accepted = [payload["correct_answer"], *payload.get("accepted_alternatives", [])]
        return normalized in {alt.strip().lower() for alt in accepted}

    return False


def check_answer(db: Session, exercise_id: int, submitted_answer) -> bool | None:
    """
    Returns True/False for correct/wrong, or None if the exercise
    doesn't exist — mirroring the same None-means-"not found"
    convention already used in profile_service.get_profile and
    lesson_service.get_lesson, leaving it to the router (not this
    function) to translate that into an actual 404 response.

    Unchanged since Task 9. Task 10's XP awarding is added via
    evaluate_submission() below, which CALLS this function rather than
    editing it — a tested, pure validator shouldn't need to change just
    because a new concern (rewards) is being layered on top of it.
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if exercise is None:
        return None
    return _check_answer(exercise.type, exercise.payload, submitted_answer)


def evaluate_submission(db: Session, exercise_id: int, submitted_answer) -> tuple[bool, int, int] | None:
    """
    Task 10: composes check_answer with XP awarding.
    Task 11: also composes it with the hearts rule.

    Returns None if the exercise doesn't exist (same convention as
    check_answer). Raises hearts_service.OutOfHeartsError if the user
    already has 0 hearts — checked BEFORE looking at the submitted
    answer at all, since being out of hearts blocks any submission,
    not just this specific exercise. Otherwise returns
    (is_correct, xp_awarded, hearts_remaining).
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if exercise is None:
        return None

    user = get_default_user(db)
    require_hearts(user)  # raises OutOfHeartsError if the user exists and has 0 hearts

    is_correct = _check_answer(exercise.type, exercise.payload, submitted_answer)

    xp_awarded = 0
    hearts_remaining = user.hearts if user is not None else 0

    if user is not None:
        if is_correct:
            award_xp(db, user, XP_PER_CORRECT_ANSWER)
            xp_awarded = XP_PER_CORRECT_ANSWER
        else:
            hearts_remaining = lose_heart(db, user)

    return is_correct, xp_awarded, hearts_remaining
