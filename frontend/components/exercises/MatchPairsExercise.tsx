"use client";

import { useState, useEffect } from "react";

interface MatchPairsPayload {
  left_items: string[];
  right_items: string[];
}

interface Props {
  payload: MatchPairsPayload;
  onChange: (value: [string, string][]) => void;
  disabled: boolean;
}

export default function MatchPairsExercise({ payload, onChange, disabled }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<[string, string][]>([]);

  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatched([]);
    onChange([]);
  }, []);

  const matchedLeft = matched.map(([l]) => l);
  const matchedRight = matched.map(([, r]) => r);

  function selectLeft(item: string) {
    if (disabled || matchedLeft.includes(item)) return;
    setSelectedLeft(item);
    if (selectedRight) tryMatch(item, selectedRight);
  }

  function selectRight(item: string) {
    if (disabled || matchedRight.includes(item)) return;
    setSelectedRight(item);
    if (selectedLeft) tryMatch(selectedLeft, item);
  }

  function tryMatch(left: string, right: string) {
    const newMatched: [string, string][] = [...matched, [left, right]];
    setMatched(newMatched);
    setSelectedLeft(null);
    setSelectedRight(null);
    onChange(newMatched);
  }

  function btnClass(isSelected: boolean, isMatched: boolean) {
    return [
      "w-full rounded-2xl border-2 border-b-[3px] px-4 py-3",
      "font-display text-sm font-bold text-left transition-colors",
      isMatched
        ? "border-duo-green bg-green-50 text-duo-green cursor-default"
        : isSelected
        ? "border-duo-blue bg-blue-50 text-duo-blue"
        : "border-duo-gray bg-white text-duo-text hover:border-duo-gray-dark cursor-pointer",
      disabled && !isMatched ? "cursor-not-allowed opacity-60" : "",
    ].join(" ");
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-3">
        {payload.left_items.map((item) => (
          <button
            key={item}
            onClick={() => selectLeft(item)}
            disabled={disabled}
            className={btnClass(selectedLeft === item, matchedLeft.includes(item))}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {payload.right_items.map((item) => (
          <button
            key={item}
            onClick={() => selectRight(item)}
            disabled={disabled}
            className={btnClass(selectedRight === item, matchedRight.includes(item))}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
