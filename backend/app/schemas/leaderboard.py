"""
Pydantic schema for the Leaderboard API (GET /leaderboard).
"""
from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    xp: int
