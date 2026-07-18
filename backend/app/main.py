"""
Application entry point.

Scope, per Task 4's explicit requirements — exactly these three things,
nothing more:
  1. Initialize the FastAPI app instance
  2. Enable CORS so the Next.js frontend (a different origin) can call this API
  3. Register routers

On (3): no router files exist yet — Task 2 explicitly excluded building
APIs, and only models + database.py have been built so far. You can't
register something that doesn't exist. What's below is the exact
registration *mechanism* routers will use the moment they exist —
written as real code, commented out, so this file runs cleanly today
and needs zero restructuring later; each line just gets uncommented as
its router is built.

Deliberately NOT included, to honor "nothing else": no
Base.metadata.create_all(...) call (that belongs to the seed script),
no custom endpoints of our own, no startup/shutdown event handlers, no
exception handlers, no logging config.
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --- CORS ---
# Browsers enforce the "same-origin policy": a page served from one
# origin (scheme + host + port) cannot read the response from a fetch()
# to a different origin, unless that server explicitly opts in via CORS
# response headers. Our Next.js frontend (http://localhost:3000 in dev,
# a Vercel URL in production) and this API (a different port, and a
# different domain once deployed) are different origins — without this
# middleware, every request the frontend makes to this API would be
# blocked by the browser before our code ever saw it.
#
# Allowed origins are read from an environment variable (comma-separated),
# defaulting to the two local URLs Next.js's dev server uses. This is the
# same pattern as DATABASE_URL in database.py: identical code for local
# dev and production, changed only via environment, never via editing
# this file.
_default_origins = "http://localhost:3000,http://127.0.0.1:3000"
origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", _default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # exact origins allowed to call this API
    allow_credentials=True,  # allow cookies / auth headers to be sent cross-origin
    allow_methods=["*"],     # GET, POST, PUT, DELETE, PATCH, OPTIONS all allowed
    allow_headers=["*"],     # any request header allowed (e.g. Content-Type, Authorization)
)

# --- Routers ---
# The Task 4 scaffold anticipated a generic "users" router; this task
# calls the feature "Profile APIs" with a specific GET /profile route,
# so it gets its own dedicated router file instead of being folded into
# that placeholder. "users" stays reserved below for future generic
# account-management endpoints, if any get added beyond just the
# profile view.
from app.routers import profile

app.include_router(profile.router)

# Task 7: Learning Path APIs
from app.routers import units, skills

app.include_router(units.router)
app.include_router(skills.router)

# Task 8: Lesson APIs
from app.routers import lessons

app.include_router(lessons.router)

# Remaining routers not built yet — uncomment each pair as it's built.
# from app.routers import exercises, progress, users, leaderboard
# app.include_router(exercises.router)
# app.include_router(progress.router)
# app.include_router(users.router)
# app.include_router(leaderboard.router)
