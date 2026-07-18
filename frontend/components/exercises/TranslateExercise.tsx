"use client";

import { useState, useEffect } from "react";

interface TranslatePayload {
  word_bank: string[];
}

interface Props {
  payload: TranslatePayload;
  onChange: (value: string[]) => void;
  disabled: boolean;
}

export default function TranslateExercise({ payload, onChange, disabled }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(payload.word_bank);

  useEffect(() => {
    setSelected([]);
    setAvailable(payload.word_bank);
    onChange([]);
  }, []);

  function addWord(word: string) {
    if (disabled) return;
    const newSelected = [...selected, word];
    const idx = available.indexOf(word);
    const newAvailable = [...available.slice(0, idx), ...available.slice(idx + 1)];
    setSelected(newSelected);
    setAvailable(newAvailable);
    onChange(newSelected);
  }

  function removeWord(idx: number) {
    if (disabled) return;
    const word = selected[idx];
    const newSelected = selected.filter((_, i) => i !== idx);
    setSelected(newSelected);
    setAvailable([...available, word]);
    onChange(newSelected);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Answer tray */}
      <div className="min-h-[56px] rounded-2xl border-2 border-dashed border-duo-gray bg-white p-3 flex flex-wrap gap-2">
        {selected.length === 0 && (
          <span className="text-sm text-duo-gray-dark italic">Tap words to build your answer</span>
        )}
        {selected.map((word, i) => (
          <button
            key={i}
            onClick={() => removeWord(i)}
            disabled={disabled}
            className="rounded-xl border-2 border-b-[3px] border-duo-blue bg-white px-3 py-1.5 font-display text-sm font-bold text-duo-blue disabled:cursor-not-allowed"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((word, i) => (
          <button
            key={i}
            onClick={() => addWord(word)}
            disabled={disabled}
            className="rounded-xl border-2 border-b-[3px] border-duo-gray bg-white px-3 py-1.5 font-display text-sm font-bold text-duo-text hover:border-duo-gray-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
