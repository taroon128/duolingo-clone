"use client";

import { useEffect, useRef } from "react";

interface Props {
  answer: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export default function TypeAnswerExercise({ answer, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange("");
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="text"
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer"
        className="w-full max-w-sm rounded-2xl border-2 border-b-[3px] border-duo-blue px-5 py-4 text-center font-display text-lg font-bold text-duo-text outline-none focus:border-duo-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
