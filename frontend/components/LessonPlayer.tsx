"use client";

/**
 * LessonPlayer — Task 22.
 *
 * Task 17 changes removed:
 *   - MOCK_ANSWERS import — the API result IS the verdict now
 *   - correctAnswerText() function — the real GET /lesson/{id}
 *     response deliberately omits correct answers (Task 8 redaction),
 *     so we can't derive a "correct answer was X" hint from what the
 *     client received. The feedback bar still shows "Incorrect" with
 *     the right color; the hint text is simply omitted.
 *
 * Task 22 additions:
 *   - isChecking from the hook: disables the Check button while the
 *     API call is in flight, preventing double-submission.
 *   - handleCheck and handleContinue are now async in the hook, but
 *     onClick handlers in React accept both sync and async functions
 *     (they just return a Promise the framework ignores) — no change
 *     needed in the JSX.
 */
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import Heart from "./Heart";
import Button from "./Button";
import FeedbackBar from "./FeedbackBar";
import ExerciseRenderer from "./ExerciseRenderer";
import { useLessonSession } from "@/hooks/useLessonSession";
import type { Lesson } from "@/types";

interface LessonPlayerProps {
  lesson: Lesson;
  initialHearts?: number;
}

export default function LessonPlayer({
  lesson,
  initialHearts = 5,
}: LessonPlayerProps) {
  const router = useRouter();
  const {
    currentExercise,
    currentIndex,
    progress,
    hearts,
    xpEarned,
    feedback,
    phase,
    canCheck,
    isChecking,
    setCurrentAnswer,
    handleCheck,
    handleContinue,
  } = useLessonSession(lesson, initialHearts);

  // --- Completed modal ---
  if (phase === "completed") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-8 bg-[#f7f7f7] p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">🎉</span>
          <h1 className="font-display text-3xl font-extrabold text-duo-text">
            Lesson Complete!
          </h1>
          <p className="text-duo-gray-dark">
            You earned{" "}
            <span className="font-bold text-duo-gold-dark">{xpEarned} XP</span>
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/")}
          fullWidth
          className="max-w-sm"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  // --- Failed modal ---
  if (phase === "failed") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-8 bg-[#f7f7f7] p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-6xl">💔</span>
          <h1 className="font-display text-3xl font-extrabold text-duo-red">
            Out of Hearts!
          </h1>
          <p className="text-duo-gray-dark">
            Practice to earn more hearts, then try again.
          </p>
        </div>
        <Button
          variant="danger"
          onClick={() => router.push("/")}
          fullWidth
          className="max-w-sm"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  // --- Playing ---
  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#f7f7f7] px-4 pt-4 pb-3">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="font-display text-xl font-bold text-duo-gray-dark hover:text-duo-text"
            aria-label="Exit lesson"
          >
            ✕
          </button>
          <div className="flex-1">
            <ProgressBar value={progress} color="green" />
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: initialHearts }).map((_, i) => (
              <Heart key={i} filled={i < hearts} size={20} />
            ))}
          </div>
        </div>
      </header>

      {/* Exercise area */}
      <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8 pb-36">
        <div className="w-full max-w-2xl">
          <p className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-duo-gray-dark">
            {currentIndex + 1} / {lesson.exercises.length}
          </p>
          <h2 className="mb-6 font-display text-xl font-extrabold text-duo-text">
            {currentExercise.prompt}
          </h2>
          <ExerciseRenderer
            exercise={currentExercise}
            answer={null}
            onChange={setCurrentAnswer}
            disabled={feedback !== null || isChecking}
          />
        </div>
      </main>

      {/* Check button */}
      {!feedback && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-duo-gray bg-[#f7f7f7] px-4 py-4">
          <div className="mx-auto max-w-2xl">
            <Button
              variant="primary"
              onClick={handleCheck}
              disabled={!canCheck || isChecking}
              fullWidth
            >
              {isChecking ? "Checking…" : "Check"}
            </Button>
          </div>
        </div>
      )}

      {/* Feedback bar — no correctAnswerText since the API doesn't
          send the correct answer back to the client (Task 8 redaction) */}
      <FeedbackBar
        feedback={feedback}
        onContinue={handleContinue}
      />
    </div>
  );
}
