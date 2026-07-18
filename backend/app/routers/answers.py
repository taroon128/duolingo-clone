"""
Answer validation router.

Task 9 gave this exactly one endpoint — POST /answer — checking a
submitted answer and returning "correct" or "wrong". Task 10 added XP
awarding. Task 11 adds the hearts rule: catching
hearts_service.OutOfHeartsError (raised inside evaluate_submission if
the user already has 0 hearts) and turning it into a 403, and
including the resulting heart count in the response. The router
itself still does no business logic — it calls one service function,
translates domain-level outcomes into HTTP responses, and shapes the
result, same as every other router in this project.

Router naming note: "exercises" was the name Task 4's scaffold
anticipated, but that's reserved for plausible future generic
exercise-resource endpoints (e.g. fetching one exercise directly).
POST /answer is a distinct action/feature — validating a submission —
so it gets its own dedicated router file, the same reasoning Task 6
used for "profile" vs the anticipated "users" placeholder.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.answer import AnswerSubmission, AnswerResult
from app.services.answer_service import evaluate_submission
from app.services.hearts_service import OutOfHeartsError

router = APIRouter(tags=["answers"])


@router.post("/answer", response_model=AnswerResult)
def submit_answer(submission: AnswerSubmission, db: Session = Depends(get_db)):
    try:
        outcome = evaluate_submission(db, submission.question_id, submission.answer)
    except OutOfHeartsError:
        raise HTTPException(
            status_code=403,
            detail="Out of hearts — wait for them to regenerate before continuing.",
        )

    if outcome is None:
        raise HTTPException(status_code=404, detail=f"Exercise {submission.question_id} not found")

    is_correct, xp_awarded, hearts_remaining = outcome
    return AnswerResult(
        result="correct" if is_correct else "wrong",
        xp_awarded=xp_awarded,
        hearts_remaining=hearts_remaining,
    )
