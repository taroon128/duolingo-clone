# Duolingo Clone

A functional clone of the Duolingo web app built as an SDE Fullstack assignment. Replicates Duolingo's learning path, lesson loop, gamification mechanics (XP, hearts, streaks, crowns), and playful UI.

## Live Demo

- **Frontend:** _add Vercel URL here_
- **Backend API:** _add Render URL here_
- **API Docs:** `<backend-url>/docs`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4 |
| Backend | Python 3.12, FastAPI 0.139, SQLAlchemy 2.0 |
| Database | SQLite (via SQLAlchemy ORM) |
| HTTP Client | Axios 1.18 |
| Icons | Lucide React |
| Font | Baloo 2 (self-hosted via Fontsource) |

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m app.seed        # creates duolingo.db and seeds demo data
python -m uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`
Interactive API docs at `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## Architecture Overview

```
duolingo-clone/
├── backend/
│   └── app/
│       ├── main.py          FastAPI app, CORS, router registration
│       ├── database.py      SQLAlchemy engine, session factory, get_db()
│       ├── seed.py          Seeds one Spanish course with demo learner
│       ├── models/          SQLAlchemy ORM models (7 tables)
│       ├── schemas/         Pydantic request/response schemas
│       ├── routers/         Thin HTTP handlers — one file per resource
│       └── services/        Business logic — XP, hearts, progress, etc.
└── frontend/
    ├── app/                 Next.js App Router pages
    │   ├── page.tsx         Home screen (learning path)
    │   ├── profile/         Profile screen
    │   └── lesson/[id]/     Lesson player
    ├── components/          Reusable UI components
    │   └── exercises/       One component per exercise type
    ├── hooks/               useLessonSession — all lesson state
    ├── services/            Axios API client + typed service functions
    └── types/               Shared TypeScript interfaces
```

**Clean architecture principles applied throughout:**
- **Routers** are thin — parse request, call one service, return response. No business logic.
- **Services** own all business rules — XP calculation, heart decrement, crown logic, lock/unlock derivation.
- **Models** are separate from **Schemas** — SQLAlchemy ORM shapes never leak into API responses.
- **Frontend services** are separate from **components** — no `fetch()` calls inside JSX.

---

## Database Schema

Seven tables. All relationships are enforced at the SQLite level via `PRAGMA foreign_keys=ON` (enabled on every connection in `database.py`).

```
users
  id, username, display_name, xp_total, current_streak, longest_streak,
  last_activity_date, hearts, max_hearts, last_heart_lost_at, gems, daily_goal_xp

units
  id, title, description, order_index, color_hex

skills
  id, unit_id→units, title, description, order_index, icon_name, levels

lessons
  id, skill_id→skills, order_index, title, xp_reward

exercises
  id, lesson_id→lessons, order_index, type (enum), prompt, payload (JSON)

progress                          ← association entity: User ↔ Skill
  id, user_id→users, skill_id→skills,
  crowns, lessons_completed_in_level, last_practiced_at
  UNIQUE(user_id, skill_id)

leaderboard
  id, user_id→users, period_start, weekly_xp, rank, league
  UNIQUE(user_id, period_start)
```

**Key design decisions:**
- `progress` is an association entity (not a plain join table) because it carries real data — `crowns` and `lessons_completed_in_level` belong to the relationship, not either side.
- Skill lock/unlock status is **never stored** — computed at read time from `progress.crowns` vs the previous skill's crowns. This eliminates an entire class of stale-cache bugs.
- All 5 exercise types share one `exercises` table with a `type` discriminator + `payload` JSON column. Payload shape is validated at the API boundary (Pydantic), not the DB level.

---

## API Overview

All endpoints return JSON. Interactive docs at `/docs`.

| Method | Path | Description |
|---|---|---|
| GET | `/profile` | Current learner: name, XP, streak, hearts, achievements |
| GET | `/units` | All units with skills nested, each skill has computed status |
| GET | `/skills` | Flat list of all skills with computed locked/unlocked/completed |
| GET | `/lesson/{id}` | Lesson with exercises — **answer keys redacted** from payload |
| POST | `/answer` | Validate answer → `{result, xp_awarded, hearts_remaining}` |
| POST | `/lesson/{id}/complete` | Record lesson completion → `{crowns, crown_earned, ...}` |
| GET | `/leaderboard` | All users sorted by XP descending |

**Notable API behaviors:**
- `GET /lesson/{id}` strips correct answers from exercise payloads (e.g. `correct_option`, `correct_sequence`) so the client can never inspect the answer key before checking.
- `POST /answer` awards XP and decrements hearts server-side, returning the new values. No client-side state is trusted.
- `GET /units` and `GET /skills` compute lock/unlock/completed status fresh on every request from the current Progress rows.
- `GET /lesson/{id}` and `POST /answer` return `403 Forbidden` when the user has 0 hearts.

---

## Seeded Demo Data

Running `python -m app.seed` creates:

- **1 language course** (Spanish)
- **3 units**: Basics (green), Phrases (blue), Food (orange)
- **6 skills**: Greetings, Introductions, Common Phrases, Questions, Food & Drink, Ordering
- **6 lessons** (one per skill), **15 exercises** (all 5 types: multiple_choice, translate, match_pairs, fill_blank, type_answer — 3 of each)
- **1 demo learner**: `demo_learner`, XP=30, streak=3, hearts=4
- **Sample progress**: Greetings has 1 crown (completed once); Introductions has been attempted

The seed script is idempotent — re-running it skips if the demo user already exists.

---

## Assumptions

- **Single user**: authentication is out of scope per the assignment brief ("assume a default logged-in learner"). All endpoints operate on the first user in the database.
- **One language**: the assignment explicitly lists multiple languages as a placeholder feature. `Unit` is the content root; a `course_id` FK on `Unit` would be the minimal addition needed later.
- **Weekly leaderboard model**: the `leaderboard` table is defined with weekly XP reset support, but current endpoints query `users.xp_total` directly (total lifetime XP) since only one user exists and the reset mechanic requires multiple users.
- **No real auth**: the `/profile` endpoint returns the first user's data. Token-based auth would wrap the existing services without changing them.
- **Audio**: placeholder/optional per the brief — not implemented.
- **In-app purchases / Super**: mocked — `gems` column exists on the User model, the UI shows a static value.
