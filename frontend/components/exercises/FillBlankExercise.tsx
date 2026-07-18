"use client";

import { useEffect, useRef } from "react";

interface FillBlankPayload {
  sentence_template: string;
}

interface Props {
  payload: FillBlankPayload;
  answer: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function FillBlankExercise({ payload, answer, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange("");
    inputRef.current?.focus();
  }, []);

  const parts = payload.sentence_template.split("___");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 font-display text-xl font-bold text-duo-text">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-2">
          {part}
          {i < parts.length - 1 && (
            <input
              ref={i === 0 ? inputRef : undefined}
              type="text"
              value={answer}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="..."
              className="w-28 rounded-xl border-2 border-b-[3px] border-duo-blue px-3 py-1.5 text-center text-lg font-bold text-duo-text outline-none focus:border-duo-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
            />
          )}
        </span>
      ))}
    </div>
  );
}
