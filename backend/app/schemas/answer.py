"""
Pydantic schemas for the Answer Validation API (POST /answer).

Naming note: the task calls this "Question ID", but there is no
Question model in our schema — Task 2 defined User, Unit, Skill,
Lesson, Exercise, Progress, Leaderboard, and no Question table. The
closest existing concept is Exercise (each Exercise IS one question
within a lesson), so `question_id` here refers to Exercise.id.

`answer`'s expected shape depends on which exercise type is being
answered (see answer_service.py for the full per-type contract):
  multiple_choice -> str        (the chosen option)
  translate       -> list[str]  (the tapped word order)
  match_pairs     -> list[dict] ([{"left": ..., "right": ...}, ...])
  fill_blank      -> str
  type_answer     -> str
A loose type is used here rather than 5 separate request schemas,
mirroring how Exercise.payload itself is a flexible JSON blob whose
shape is interpreted per-type in the service layer, not the schema
layer.

`xp_awarded` added in Task 10 — 0 for a wrong answer, or
xp_service.XP_PER_CORRECT_ANSWER for a correct one. Surfacing this in
the response is how a caller (or future frontend) actually observes
that XP was awarded, rather than the award happening silently
server-side with no visible confirmation.

`hearts_remaining` added in Task 11 — the user's heart count after
this submission (unchanged if correct, decremented by 1 if wrong,
never below 0). Lets a caller detect "that answer just cost the last
heart" without a separate GET /profile call.
"""
from typing import Literal

from pydantic import BaseModel


class AnswerSubmission(BaseModel):
    question_id: int
    answer: str | list


class AnswerResult(BaseModel):
    result: Literal["correct", "wrong"]
    xp_awarded: int
    hearts_remaining: int
