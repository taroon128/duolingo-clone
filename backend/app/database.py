"""
Database engine, session factory, and declarative base.

Scope note: this file intentionally contains ONLY the SQLAlchemy plumbing
that models require to be defined at all (a `Base` class to inherit from).
It does NOT include FastAPI dependency-injection helpers (e.g. a `get_db()`
generator) or `Base.metadata.create_all(...)` calls — those belong to the
routers task and the seed script respectively, which don't exist yet.
Keeping this file this thin means every line in it is already in use,
rather than scaffolding for tasks we haven't done.
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./duolingo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # SQLite only allows a connection to be used by the thread that created
    # it by default. FastAPI can hand requests to different threads, so this
    # relaxes that restriction. Safe here because we open a fresh session
    # per request rather than sharing one connection across threads.
    connect_args={"check_same_thread": False},
)


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    """
    SQLite does NOT enforce FOREIGN KEY constraints unless told to, per
    connection. Without this, e.g. inserting a Progress row with a
    skill_id that doesn't exist would silently succeed instead of raising
    an error — which would defeat the point of declaring the FKs at all.
    """
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
