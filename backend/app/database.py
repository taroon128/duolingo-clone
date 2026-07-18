"""
Database engine, session factory, session dependency, and declarative base.

Scope: this file owns the full SQLAlchemy connection layer for the app —
the engine, the session factory, the FastAPI session dependency
(`get_db`), and the `Base` class every model inherits from. It does NOT
define any models (that's `app/models/`) and does NOT call
`Base.metadata.create_all(...)` — table creation is the job of whichever
entry point boots the app (main.py) or the seed script, neither of
which exist yet.
"""
import os

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

# Read the database location from an environment variable if one is
# set (e.g. a deployment platform pointing at a different path or file),
# otherwise fall back to a local file named duolingo.db in whatever
# directory the app is run from. This keeps local dev and deployment
# using the exact same code path with zero changes.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./duolingo.db")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # SQLite only allows a connection to be used by the thread that
    # created it, by default. FastAPI can serve a single request's
    # dependencies across threads, so this relaxes that restriction.
    # Safe here because get_db() below opens a fresh Session per
    # request rather than sharing one connection across threads.
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    """
    SQLite does NOT enforce FOREIGN KEY constraints unless told to, on
    every single connection. Without this, e.g. inserting a Progress row
    with a skill_id that doesn't exist would silently succeed instead of
    raising an error — which would defeat the point of declaring the
    foreign keys on the models at all.
    """
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency: yields exactly one Session per request and
    guarantees it's closed afterward, even if the request raised an
    exception partway through. Routers will use this as
    `db: Session = Depends(get_db)` once they exist (Task 4+) — nothing
    calls it yet, but session lifecycle is a database-layer concern, so
    it lives here rather than being duplicated in every router file.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
