"use client";

import { useEffect } from "react";

interface MultipleChoicePayload {
  options: string[];
}

interface Props {
  payload: MultipleChoicePayload;
  answer: string | null;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function MultipleChoiceExercise({
  payload, answer, onChange, disabled,
}: Props) {
  useEffect(() => { onChange(null as unknown as string); }, []);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {payload.options.map((option) => {
        const selected = answer === option;
        return (
          <button
            key={option}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={[
              "rounded-2xl border-2 border-b-4 px-5 py-4 text-left",
              "font-display text-base font-bold transition-colors",
              selected
                ? "border-duo-blue bg-blue-50 text-duo-blue"
                : "border-duo-gray bg-white text-duo-text hover:border-duo-gray-dark",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            ].join(" ")}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
