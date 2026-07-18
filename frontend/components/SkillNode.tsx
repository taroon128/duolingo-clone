"use client";

import { Lock, Crown, BookOpen } from "lucide-react";
import type { Skill } from "@/types";

/**
 * SkillNode — one circular node on the path: gray+locked, colored+
 * unlocked, or gold+completed (crowns >= levels). Page-specific
 * composition, not one of Task 15's 5 primitives, but styled
 * consistently with them (same color tokens, same "no API" rule —
 * onSelect is just a callback prop, no fetching here).
 *
 * Icon simplification: rather than mapping each skill's arbitrary
 * icon_name string (e.g. "waving-hand") to a specific icon — fragile,
 * and not really the point of this task — every unlocked skill gets
 * the same neutral BookOpen icon. A real per-skill icon system is a
 * reasonable future addition, not attempted here.
 *
 * "use client" — has an onClick handler.
 */
interface SkillNodeProps {
  skill: Skill;
  color: string;
  onSelect: (skill: Skill) => void;
}

export default function SkillNode({ skill, color, onSelect }: SkillNodeProps) {
  const isLocked = skill.status === "locked";
  const isCompleted = skill.status === "completed";

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => onSelect(skill)}
        disabled={isLocked}
        aria-label={`${skill.title} — ${skill.status}`}
        style={!isLocked ? { backgroundColor: isCompleted ? "#FFC800" : color } : undefined}
        className={`
          flex h-16 w-16 items-center justify-center rounded-full border-4 border-white
          shadow-md transition-transform duration-100
          ${
            isLocked
              ? "cursor-not-allowed bg-duo-gray text-duo-gray-dark"
              : "cursor-pointer text-white hover:scale-105 active:scale-95"
          }
        `}
      >
        {isLocked ? (
          <Lock size={26} aria-hidden="true" />
        ) : isCompleted ? (
          <Crown size={26} aria-hidden="true" />
        ) : (
          <BookOpen size={26} aria-hidden="true" />
        )}
      </button>
      <span className="text-xs font-bold text-duo-text">{skill.title}</span>
      {skill.crowns > 0 && !isCompleted && (
        <span className="flex items-center gap-0.5 text-[10px] font-bold text-duo-gold-dark">
          <Crown size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          {skill.crowns}
        </span>
      )}
    </div>
  );
}
