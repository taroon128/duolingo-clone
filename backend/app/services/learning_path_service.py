"""
Business logic for the Learning Path APIs.

This is where the lock/unlock/completed computation that Task 2's
Skill and Progress models explicitly deferred — "status is intentionally
NOT stored... derived at read-time" — actually gets implemented, for
the first time.
"""
from sqlalchemy.orm import Session

from app.models import Unit, Skill
from app.schemas.learning_path import SkillOut, SkillStatus, UnitOut
from app.services.user_service import get_default_user


def _crowns_by_skill_id(db: Session) -> dict[int, int]:
    """
    Progress is per (user, skill), but there's no real auth yet — so,
    matching the same "first user in the table" convention already used
    in profile_service.get_profile, this looks up whichever user exists
    and returns their crowns keyed by skill_id.

    Returns an empty dict if no user exists yet (e.g. seed.py hasn't
    run). The caller below treats that as "0 crowns everywhere" rather
    than an error — an unseeded path is still valid to display, just at
    its starting state, unlike the Profile API which had nothing
    meaningful to show at all without a user.

    Uses the shared get_default_user() helper (Task 10) — this lookup
    used to be duplicated inline here and in profile_service.py, with a
    note that a third call site would be the right trigger to extract
    it. answer_service.py's XP awarding is that third place.
    """
    user = get_default_user(db)
    if user is None:
        return {}
    return {progress.skill_id: progress.crowns for progress in user.progress_entries}


def _compute_skill_statuses(db: Session) -> list[SkillOut]:
    """
    The actual lock/unlock/completed algorithm.

    All skills across every unit are treated as ONE continuous
    sequence, ordered by (unit.order_index, skill.order_index) — not
    reset per-unit. This matches real Duolingo: a unit's first skill
    unlocks because the skill immediately before it in the overall path
    earned a crown, not just because that unit was opened.

    Rules, evaluated in sequence order:
      - The very first skill overall is always reachable.
      - Any other skill is reachable only if the skill immediately
        before it in this same sequence has crowns >= 1.
      - A reachable skill is "completed" once its own crowns reach
        skill.levels (full mastery — the same threshold given in the
        Task 2 models Q&A), otherwise it's "unlocked".
      - An unreachable skill is "locked" regardless of its own crowns
        (crowns can't be earned on a skill you can't play yet).
    """
    crowns_by_skill = _crowns_by_skill_id(db)

    skills = (
        db.query(Skill)
        .join(Unit, Skill.unit_id == Unit.id)
        .order_by(Unit.order_index, Skill.order_index)
        .all()
    )

    results: list[SkillOut] = []
    previous_crowns: int | None = None

    for skill in skills:
        crowns = crowns_by_skill.get(skill.id, 0)
        reachable = previous_crowns is None or previous_crowns >= 1

        if not reachable:
            status = SkillStatus.LOCKED
        elif crowns >= skill.levels:
            status = SkillStatus.COMPLETED
        else:
            status = SkillStatus.UNLOCKED

        results.append(SkillOut(
            id=skill.id,
            unit_id=skill.unit_id,
            title=skill.title,
            description=skill.description,
            order_index=skill.order_index,
            icon_name=skill.icon_name,
            levels=skill.levels,
            crowns=crowns,
            status=status,
        ))
        previous_crowns = crowns

    return results


def get_skills(db: Session) -> list[SkillOut]:
    """Flat list of every skill across every unit, each with its computed status."""
    return _compute_skill_statuses(db)


def get_units(db: Session) -> list[UnitOut]:
    """Every unit, each with its own skills nested inside, in path order."""
    skills = _compute_skill_statuses(db)
    skills_by_unit_id: dict[int, list[SkillOut]] = {}
    for skill in skills:
        skills_by_unit_id.setdefault(skill.unit_id, []).append(skill)

    units = db.query(Unit).order_by(Unit.order_index).all()
    return [
        UnitOut(
            id=unit.id,
            title=unit.title,
            description=unit.description,
            order_index=unit.order_index,
            color_hex=unit.color_hex,
            skills=skills_by_unit_id.get(unit.id, []),
        )
        for unit in units
    ]
