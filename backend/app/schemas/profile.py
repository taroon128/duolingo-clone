"""
Pydantic schemas for the Profile API.

These describe the SHAPE of the GET /profile response — deliberately
separate from the User SQLAlchemy model (Task 2). The response is a
reshaped, filtered view of a user's data, not a 1:1 mirror of the
`users` table: it exposes computed achievements that don't exist as a
column anywhere, and it deliberately leaves out fields the model has
but this task didn't ask for (e.g. gems, max_hearts, email).
"""
from pydantic import BaseModel


class Achievement(BaseModel):
    name: str
    description: str
    unlocked: bool


class ProfileResponse(BaseModel):
    name: str
    xp: int
    streak: int
    hearts: int
    achievements: list[Achievement]
