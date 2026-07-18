"""
Leaderboard Service.

Task 13 scope: sort all users by XP. That's it — three bullets in the
task ("Implement Leaderboard", "Sort users by XP", "SQLite only"), and
this satisfies all three with a single query.

Deliberately queries the User table directly (ORDER BY xp_total DESC)
rather than using the Leaderboard model built in Task 2. That table's
weekly_xp / period_start / league columns were designed for a
"resets every week" mechanic — the real-Duolingo-style leagues
described in Task 2's own docstring — which isn't what this task asks
for. Using it here would mean either fabricating weekly-reset logic
nobody requested, or just mirroring xp_total into weekly_xp for a
single "always current" period, which adds a write and a second table
read for zero behavioral difference over querying User directly. The
Leaderboard table stays defined and ready for whichever future task
actually wants the weekly-reset behavior; this one satisfies "sort
users by XP" directly, against the table that actually holds it.

"SQLite only" is satisfied by not introducing anything else to answer
this — no Redis sorted set, no in-memory cache, no separate ranking
service. Just a plain SQL ORDER BY against the same SQLite database
every other endpoint already uses.
"""
from sqlalchemy.orm import Session

from app.models import User
from app.schemas.leaderboard import LeaderboardEntry


def get_leaderboard(db: Session) -> list[LeaderboardEntry]:
    """
    Highest XP first. User.id is a secondary sort key purely so ties
    resolve consistently on every call, rather than however SQLite
    happens to return equally-ranked rows.
    """
    users = db.query(User).order_by(User.xp_total.desc(), User.id.asc()).all()
    return [
        LeaderboardEntry(rank=index + 1, name=user.display_name, xp=user.xp_total)
        for index, user in enumerate(users)
    ]
