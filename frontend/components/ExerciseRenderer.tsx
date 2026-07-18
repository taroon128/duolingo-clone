"use client";

/**
 * ExerciseRenderer — Task 17.
 *
 * Routes each exercise to its specific component by type. Keeps
 * LessonPlayer free of a large type-switch. Each exercise component
 * receives only what it needs — a narrowed payload shape — so each
 * component is TypeScript-safe without casting at the call site.
 *
 * The `answer` and `onChange` props are typed loosely here (unknown)
 * and narrowed inside each exercise component, matching how the hook
 * stores answers as `unknown` too.
 */
import type { Exercise } from "@/types";
import MultipleChoiceExercise from "./exercises/MultipleChoiceExercise";
import TranslateExercise from "./exercises/TranslateExercise";
import MatchPairsExercise from "./exercises/MatchPairsExercise";
import FillBlankExercise from "./exercises/FillBlankExercise";
import TypeAnswerExercise from "./exercises/TypeAnswerExercise";

interface ExerciseRendererProps {
  exercise: Exercise;
  answer: unknown;
  onChange: (value: unknown) => void;
  disabled: boolean;
}

export default function ExerciseRenderer({
  exercise, answer, onChange, disabled,
}: ExerciseRendererProps) {
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceExercise
          payload={exercise.payload as { options: string[] }}
          answer={answer as string | null}
          onChange={onChange as (v: string) => void}
          disabled={disabled}
        />
      );
    case "translate":
      return (
        <TranslateExercise
          payload={exercise.payload as { word_bank: string[] }}
          onChange={onChange as (v: string[]) => void}
          disabled={disabled}
        />
      );
    case "match_pairs":
      return (
        <MatchPairsExercise
          payload={exercise.payload as { left_items: string[]; right_items: string[] }}
          onChange={onChange as (v: [string, string][]) => void}
          disabled={disabled}
        />
      );
    case "fill_blank":
      return (
        <FillBlankExercise
          payload={exercise.payload as { sentence_template: string }}
          answer={(answer as string) ?? ""}
          onChange={onChange as (v: string) => void}
          disabled={disabled}
        />
      );
    case "type_answer":
      return (
        <TypeAnswerExercise
          answer={(answer as string) ?? ""}
          onChange={onChange as (v: string) => void}
          disabled={disabled}
        />
      );
    default:
      return (
        <p className="text-duo-gray-dark">Unknown exercise type: {exercise.type}</p>
      );
  }
}
