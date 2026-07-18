"use client";

/**
 * FeedbackBar — Task 17.
 *
 * The signature Duolingo feedback panel: slides up from the bottom of
 * the screen after an answer is checked. Green for correct (with a
 * checkmark and "Great!" text), red for wrong (with an X and "Correct
 * answer:" hint). Always has a Continue button in the matching color.
 *
 * Positioned as a fixed bottom panel so it overlays the exercise
 * content without reflowing it — matches Duolingo's exact behavior.
 */
import { CheckCircle, XCircle } from "lucide-react";
import Button from "./Button";
import type { FeedbackState } from "@/hooks/useLessonSession";

interface FeedbackBarProps {
  feedback: FeedbackState;
  correctAnswerText?: string;
  onContinue: () => void;
}

export default function FeedbackBar({
  feedback,
  correctAnswerText,
  onContinue,
}: FeedbackBarProps) {
  if (!feedback) return null;

  const isCorrect = feedback === "correct";

  return (
    <div
      className={[
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t-2 px-6 py-5",
        "animate-in slide-in-from-bottom duration-200",
        isCorrect
          ? "border-duo-green bg-[#d7ffb8]"
          : "border-duo-red bg-[#ffdfe0]",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        {/* Status */}
        <div className="flex items-start gap-3">
          {isCorrect ? (
            <CheckCircle
              size={28}
              className="mt-0.5 shrink-0 text-duo-green"
              strokeWidth={2.5}
            />
          ) : (
            <XCircle
              size={28}
              className="mt-0.5 shrink-0 text-duo-red"
              strokeWidth={2.5}
            />
          )}
          <div>
            <p
              className={[
                "font-display text-base font-extrabold",
                isCorrect ? "text-duo-green" : "text-duo-red",
              ].join(" ")}
            >
              {isCorrect ? "Great!" : "Incorrect"}
            </p>
            {!isCorrect && correctAnswerText && (
              <p className="mt-0.5 text-sm font-medium text-duo-text">
                Correct answer:{" "}
                <span className="font-bold">{correctAnswerText}</span>
              </p>
            )}
          </div>
        </div>

        {/* Continue */}
        <Button
          variant={isCorrect ? "primary" : "danger"}
          onClick={onContinue}
          className="shrink-0"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
