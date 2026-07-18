"use client";

/**
 * useLessonSession — Task 22.
 *
 * Task 17: used local checkAnswer() against MOCK_ANSWERS.
 * Task 22: replaced with async submitAnswer() from the real API.
 *          Also calls completeLesson() when all exercises pass.
 *
 * Changes from Task 17:
 *   - handleCheck is now async (was sync)
 *   - XP and hearts come from the API response, not local state
 *   - completeLesson() is called once when phase transitions to
 *     "completed", updating the backend's Progress table
 *   - A new `isChecking` flag prevents double-submitting while the
 *     API call is in flight
 *   - No MOCK_ANSWERS import — the API response IS the verdict
 *
 * The state shape and the component interface are otherwise identical
 * to Task 17, so LessonPlayer needs only minor updates.
 */
import { useState, useCallback } from "react";
import type { Lesson } from "@/types";
import { submitAnswer } from "@/services/answerApi";
import { completeLesson } from "@/services/lessonApi";

export type FeedbackState = "correct" | "wrong" | null;
export type SessionPhase = "playing" | "completed" | "failed";

export function useLessonSession(lesson: Lesson, initialHearts: number = 5) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<unknown>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [hearts, setHearts] = useState(initialHearts);
  const [xpEarned, setXpEarned] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>("playing");
  const [isChecking, setIsChecking] = useState(false);

  const exercises = lesson.exercises;
  const currentExercise = exercises[currentIndex];
  const progress = Math.round((currentIndex / exercises.length) * 100);
  const canCheck =
    !isChecking &&
    currentAnswer !== null &&
    !(Array.isArray(currentAnswer) && (currentAnswer as unknown[]).length === 0);

  const handleCheck = useCallback(async () => {
    if (!currentExercise || !canCheck) return;

    setIsChecking(true);
    try {
      const result = await submitAnswer(currentExercise.id, currentAnswer);

      // Hearts and XP now come from the backend response —
      // they reflect the real persisted state, not a local guess.
      setHearts(result.hearts_remaining);
      setXpEarned((prev) => prev + result.xp_awarded);
      setFeedback(result.result);

      if (result.result === "wrong" && result.hearts_remaining <= 0) {
        setTimeout(() => setPhase("failed"), 1200);
      }
    } catch {
      // API error (network, 403 already-out-of-hearts, etc.) —
      // treat the current answer as wrong without crashing the UI.
      // The 403 case means hearts already hit 0 server-side before
      // this attempt; showing "wrong" + transitioning to failed is
      // the correct outcome in that case too.
      const newHearts = Math.max(0, hearts - 1);
      setHearts(newHearts);
      setFeedback("wrong");
      if (newHearts <= 0) {
        setTimeout(() => setPhase("failed"), 1200);
      }
    } finally {
      setIsChecking(false);
    }
  }, [currentExercise, currentAnswer, canCheck, hearts]);

  const handleContinue = useCallback(async () => {
    setFeedback(null);
    setCurrentAnswer(null);

    const isLastExercise = currentIndex + 1 >= exercises.length;

    if (isLastExercise) {
      // Call completeLesson before transitioning to "completed" so
      // the backend's Progress row (crowns, lessons_completed_in_level)
      // is updated while the user is still on the completion modal.
      // Failure here is non-fatal — the user already completed the
      // lesson, we just can't update the crown count right now.
      try {
        await completeLesson(lesson.id);
      } catch {
        // Progress update failed — non-fatal, carry on to completion modal
      }
      setPhase("completed");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, exercises.length, lesson.id]);

  return {
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
  };
}
