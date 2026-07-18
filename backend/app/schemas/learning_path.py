"""
Pydantic schemas for the Learning Path APIs (GET /units, GET /skills).

Both endpoints return the same per-skill shape and the same 3-state
status classification, so it lives in one shared file rather than
being duplicated across two schema modules.
"""
from enum import Enum

from pydantic import BaseModel


class SkillStatus(str, Enum):
    LOCKED = "locked"
    UNLOCKED = "unlocked"
    COMPLETED = "completed"


class SkillOut(BaseModel):
    id: int
    unit_id: int
    title: str
    description: str | None
    order_index: int
    icon_name: str | None
    levels: int
    crowns: int
    status: SkillStatus


class UnitOut(BaseModel):
    id: int
    title: str
    description: str | None
    order_index: int
    color_hex: str | None
    skills: list[SkillOut]
