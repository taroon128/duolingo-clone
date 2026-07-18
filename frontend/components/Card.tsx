"use client";

import type { ReactNode } from "react";

/**
 * Reusable Card — Task 15.
 *
 * A generic container primitive, not a specific "SkillCard" or
 * "LessonCard" — those are composed FROM this in later tasks once
 * real features get built. `onClick` is optional: pass it and the
 * card becomes an interactive, hoverable element (e.g. a future
 * clickable skill node); omit it and it's just a static panel.
 *
 * "use client" only because of the optional onClick handler — see
 * Button.tsx's note on why interactive components need it.
 */
interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Card({ children, onClick, className = "" }: CardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border-2 border-duo-gray bg-white p-4
        ${isInteractive ? "cursor-pointer transition-colors hover:border-duo-gray-dark" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
