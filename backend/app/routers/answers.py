"""
Answer validation router.

Task 9 scope: exactly one endpoint — POST /answer, checking a
submitted answer against an exercise's stored correct answer and
returning "correct" or "wrong". No XP, hearts, or progress are touched
here — see answer_service.py's docstring for why "do not update XP" is
read as a blanket no-side-effects rule, not just "XP specifically."

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
from app.services.answer_service import check_answer

router = APIRouter(tags=["answers"])


@router.post("/answer", response_model=AnswerResult)
def submit_answer(submission: AnswerSubmission, db: Session = Depends(get_db)):
    is_correct = check_answer(db, submission.question_id, submission.answer)
    if is_correct is None:
        raise HTTPException(status_code=404, detail=f"Exercise {submission.question_id} not found")
    return AnswerResult(result="correct" if is_correct else "wrong")
