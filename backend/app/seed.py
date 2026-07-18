"""
Seed script — populates the database with sample content and a demo
learner, so the app is immediately usable without anyone touching the
database by hand.

Run from the backend/ folder: `python -m app.seed`

Scope: this script ONLY writes data using the models and session
already built in Tasks 2 and 3. It does not define any new models and
does not create any API endpoints, per this task's instruction.
"""
from datetime import datetime, timedelta

from app.database import Base, engine, SessionLocal
from app.models import (
    User,
    Unit,
    Skill,
    Lesson,
    Exercise,
    ExerciseType,
    Progress,
)


# ---------------------------------------------------------------------------
# SECTION 1 — Ensure tables exist
# ---------------------------------------------------------------------------
# main.py deliberately never calls create_all() (Task 4 kept it to just
# FastAPI + CORS + the router scaffold). database.py's own docstring
# earmarked seeding as the other place this belongs — running this one
# script against a brand-new clone of the repo should be enough to get a
# fully working database, with no separate setup step required.
Base.metadata.create_all(engine)


def run():
    db = SessionLocal()

    # -----------------------------------------------------------------
    # SECTION 2 — Idempotency guard
    # -----------------------------------------------------------------
    # Re-running this script by accident shouldn't crash or duplicate
    # everything. We check for the demo user first — if it's already
    # there, the seed already ran, so we exit early instead of hitting
    # a UNIQUE constraint violation on User.username.
    existing = db.query(User).filter_by(username="demo_learner").first()
    if existing:
        print("Database already seeded (found user 'demo_learner') — skipping.")
        db.close()
        return

    # -----------------------------------------------------------------
    # SECTION 3 — Language
    # -----------------------------------------------------------------
    # No Language/Course table exists (see Unit's docstring in Task 2) —
    # one seeded course is all the assignment requires. "1 language"
    # is represented here as a plain constant that every Unit below
    # conceptually belongs to, not as a database row.
    LANGUAGE_NAME = "Spanish"
    print(f"Seeding one language course: {LANGUAGE_NAME}")

    # -----------------------------------------------------------------
    # SECTION 4 — Units, Skills, Lessons, Exercises
    # -----------------------------------------------------------------
    # Built as one connected Python object graph via relationships
    # (Skill(unit=...), lesson.exercises = [...]) rather than juggling
    # raw foreign key ids by hand — SQLAlchemy works out the correct
    # insert order itself once the top-level objects are added to the
    # session. 3 units x 2 skills = 6 skills. Each skill gets exactly
    # one lesson (content is allowed to be small), and the 15 exercises
    # are spread so all 5 required exercise types appear exactly 3
    # times each.

    def ex(order_index, ex_type, prompt, payload):
        return Exercise(order_index=order_index, type=ex_type, prompt=prompt, payload=payload)

    # --- Unit 1: Basics ---
    unit_basics = Unit(
        title="Basics", description="Everyday greetings and introductions",
        order_index=0, color_hex="#58CC02",
    )

    skill_greetings = Skill(
        title="Greetings", description="Say hello and goodbye",
        order_index=0, levels=5, icon_name="waving-hand", unit=unit_basics,
    )
    Lesson(order_index=0, title="Lesson 1", xp_reward=10, skill=skill_greetings).exercises = [
        ex(0, ExerciseType.MULTIPLE_CHOICE, "Select the correct translation of 'Hello'",
           {"options": ["Hola", "Adiós", "Gracias"], "correct_option": "Hola"}),
        ex(1, ExerciseType.TRANSLATE, "Translate: 'Good morning'",
           {"word_bank": ["Buenos", "días", "noches", "tardes"], "correct_sequence": ["Buenos", "días"]}),
        ex(2, ExerciseType.TYPE_ANSWER, "Type the Spanish word for 'Thank you'",
           {"correct_answer": "Gracias", "accepted_alternatives": ["gracias"]}),
    ]

    skill_introductions = Skill(
        title="Introductions", description="Introduce yourself to someone new",
        order_index=1, levels=5, icon_name="user-plus", unit=unit_basics,
    )
    Lesson(order_index=0, title="Lesson 1", xp_reward=10, skill=skill_introductions).exercises = [
        ex(0, ExerciseType.MATCH_PAIRS, "Match each phrase to its translation", {"pairs": [
            {"left": "My name is", "right": "Me llamo"},
            {"left": "Nice to meet you", "right": "Mucho gusto"},
            {"left": "How are you?", "right": "¿Cómo estás?"},
        ]}),
        ex(1, ExerciseType.FILL_BLANK, "Complete the sentence",
           {"sentence_template": "___ llamo Ana.", "correct_answer": "Me"}),
    ]

    # --- Unit 2: Phrases ---
    unit_phrases = Unit(
        title="Phrases", description="Common expressions and questions",
        order_index=1, color_hex="#1CB0F6",
    )

    skill_common_phrases = Skill(
        title="Common Phrases", description="Everyday polite expressions",
        order_index=0, levels=5, icon_name="message-2", unit=unit_phrases,
    )
    Lesson(order_index=0, title="Lesson 1", xp_reward=10, skill=skill_common_phrases).exercises = [
        ex(0, ExerciseType.MULTIPLE_CHOICE, "Select the correct translation of 'Please'",
           {"options": ["Por favor", "De nada", "Perdón"], "correct_option": "Por favor"}),
        ex(1, ExerciseType.TRANSLATE, "Translate: 'See you later'",
           {"word_bank": ["Hasta", "luego", "pronto", "mañana"], "correct_sequence": ["Hasta", "luego"]}),
        ex(2, ExerciseType.MATCH_PAIRS, "Match each phrase to its translation", {"pairs": [
            {"left": "Excuse me", "right": "Perdón"},
            {"left": "You're welcome", "right": "De nada"},
            {"left": "Good night", "right": "Buenas noches"},
        ]}),
    ]

    skill_questions = Skill(
        title="Questions", description="Ask basic questions",
        order_index=1, levels=5, icon_name="help-circle", unit=unit_phrases,
    )
    Lesson(order_index=0, title="Lesson 1", xp_reward=10, skill=skill_questions).exercises = [
        ex(0, ExerciseType.FILL_BLANK, "Complete the question",
           {"sentence_template": "¿Qué ___ tú?", "correct_answer": "quieres"}),
        ex(1, ExerciseType.TYPE_ANSWER, "Type the Spanish word for 'Where'",
           {"correct_answer": "Dónde", "accepted_alternatives": ["dónde", "donde"]}),
    ]

    # --- Unit 3: Food ---
    unit_food = Unit(
        title="Food", description="Ordering and talking about food",
        order_index=2, color_hex="#FF9600",
    )

    skill_food_drink = Skill(
        title="Food & Drink", description="Name common foods and drinks",
        order_index=0, levels=5, icon_name="cup", unit=unit_food,
    )
    Lesson(order_index=0, title="Lesson 1", xp_reward=10, skill=skill_food_drink).exercises = [
        ex(0, ExerciseType.MULTIPLE_CHOICE, "Select the correct translation of 'Water'",
           {"options": ["Agua", "Pan", "Leche"], "correct_option": "Agua"}),
        ex(1, ExerciseType.TRANSLATE, "Translate: 'I would like coffee'",
           {"word_bank": ["Quiero", "un", "café", "por favor"], "correct_sequence": ["Quiero", "un", "café"]}),
        ex(2, ExerciseType.TYPE_ANSWER, "Type the Spanish word for 'Bread'",
           {"correct_answer": "Pan", "accepted_alternatives": ["pan"]}),
    ]

    skill_ordering = Skill(
        title="Ordering", description="Order food at a restaurant",
        order_index=1, levels=5, icon_name="receipt", unit=unit_food,
    )
    Lesson(order_index=0, title="Lesson 1", xp_reward=10, skill=skill_ordering).exercises = [
        ex(0, ExerciseType.MATCH_PAIRS, "Match each phrase to its translation", {"pairs": [
            {"left": "The bill, please", "right": "La cuenta, por favor"},
            {"left": "I'll have this", "right": "Voy a pedir esto"},
            {"left": "Is it spicy?", "right": "¿Es picante?"},
        ]}),
        ex(1, ExerciseType.FILL_BLANK, "Complete the order",
           {"sentence_template": "Quiero ___ agua, por favor.", "correct_answer": "un"}),
    ]

    # Adding just the 3 top-level Units cascades the whole tree beneath
    # them (skills -> lessons -> exercises) because every relationship
    # from Task 2 was declared with cascade="all, delete-orphan".
    db.add_all([unit_basics, unit_phrases, unit_food])

    # -----------------------------------------------------------------
    # SECTION 5 — Demo user
    # -----------------------------------------------------------------
    # One learner, matching the assignment's "assume a default logged-in
    # learner" simplification. Given non-zero starting stats so the top
    # bar shows real numbers immediately, rather than every field
    # reading zero on first load.
    user = User(
        username="demo_learner",
        display_name="Demo Learner",
        xp_total=30,
        current_streak=3,
        longest_streak=5,
        last_activity_date=datetime.utcnow().date(),
        hearts=4,
        max_hearts=5,
        gems=50,
        daily_goal_xp=20,
    )
    db.add(user)

    # -----------------------------------------------------------------
    # SECTION 6 — Sample progress
    # -----------------------------------------------------------------
    # Progress rows are assigned via relationships (user=..., skill=...),
    # not raw ids — SQLAlchemy resolves the actual foreign keys itself
    # when it commits, in the correct dependency order, so no manual
    # flush is needed here just to "get an id first."
    #
    # Only 2 of the 6 skills get a Progress row at all:
    #   - Greetings: crowns=1 — completed its one lesson once already.
    #     lessons_completed_in_level resets to 0 the moment a crown is
    #     earned (this skill only has 1 lesson, so completing it always
    #     immediately mints a crown — expected with this small a seed).
    #   - Introductions: crowns=0 but last_practiced_at is recent —
    #     represents a lesson attempted but not finished (e.g. ran out
    #     of hearts partway through), a real state distinct from never
    #     having touched the skill at all.
    # The remaining 4 skills deliberately get NO Progress row — a real
    # learner wouldn't have reached them yet. Progress rows are created
    # lazily on first interaction, not pre-created for every skill.
    progress_greetings = Progress(
        user=user,
        skill=skill_greetings,
        crowns=1,
        lessons_completed_in_level=0,
        last_practiced_at=datetime.utcnow() - timedelta(days=1),
    )
    progress_introductions = Progress(
        user=user,
        skill=skill_introductions,
        crowns=0,
        lessons_completed_in_level=0,
        last_practiced_at=datetime.utcnow() - timedelta(hours=3),
    )
    db.add_all([progress_greetings, progress_introductions])

    db.commit()

    # -----------------------------------------------------------------
    # SECTION 7 — Summary
    # -----------------------------------------------------------------
    print("Seed complete:")
    print(f"  Units:      {db.query(Unit).count()}")
    print(f"  Skills:     {db.query(Skill).count()}")
    print(f"  Lessons:    {db.query(Lesson).count()}")
    print(f"  Exercises:  {db.query(Exercise).count()}")
    print(f"  Users:      {db.query(User).count()}")
    print(f"  Progress:   {db.query(Progress).count()}")

    db.close()


if __name__ == "__main__":
    run()
