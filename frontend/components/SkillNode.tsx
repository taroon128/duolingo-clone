"use client";

/**
 * SkillNode — Task 16, updated Task 17.
 *
 * Task 17 change: replaced the alert() placeholder with real
 * navigation to /lesson/1 (lesson id hardcoded since this is still
 * mock data — a real implementation would look up the first incomplete
 * lesson for this skill from the API).
 */
import { Lock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Skill } from "@/types";

interface SkillNodeProps {
  skill: Skill;
  color: string;
}

export default function SkillNode({ skill, color }: SkillNodeProps) {
  const router = useRouter();
  const isLocked = skill.status === "locked";
  const isCompleted = skill.status === "completed";
  const showCrowns = skill.crowns > 0;

  function handleClick() {
    if (isLocked) return;
    // Mock: all unlocked/completed skills navigate to lesson 1
    // (the only lesson in mock data). Real: fetch first incomplete
    // lesson for this skill from the API.
    router.push("/lesson/1");
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* The circular node itself */}
      <button
        onClick={handleClick}
        disabled={isLocked}
        aria-label={`${skill.title} — ${skill.status}`}
        className={[
          "h-16 w-16 rounded-full border-b-4 transition-transform duration-100",
          "flex items-center justify-center",
          "font-bold text-white text-xl",
          isLocked
            ? "cursor-not-allowed border-duo-gray-dark bg-duo-gray"
            : [
                "cursor-pointer active:translate-y-1 active:border-b-0",
                "hover:brightness-110",
              ].join(" "),
        ].join(" ")}
        style={
          isLocked
            ? {}
            : {
                backgroundColor: color,
                borderColor: `color-mix(in srgb, ${color} 70%, black)`,
              }
        }
      >
        {isLocked ? (
          <Lock size={22} strokeWidth={2.5} className="text-duo-gray-dark" />
        ) : isCompleted ? (
          <Star size={22} fill="white" strokeWidth={0} />
        ) : (
          <span className="font-display font-extrabold text-2xl leading-none">
            {skill.title.charAt(0)}
          </span>
        )}
      </button>

      {/* Skill title */}
      <span
        className={[
          "font-display text-xs font-bold text-center leading-tight max-w-[72px]",
          isLocked ? "text-duo-gray-dark" : "text-duo-text",
        ].join(" ")}
      >
        {skill.title}
      </span>

      {/* Crown rings — only shown when crowns > 0 */}
      {showCrowns && (
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: skill.levels }).map((_, i) => (
            <div
              key={i}
              className={[
                "h-2 w-2 rounded-full border",
                i < skill.crowns
                  ? "border-transparent"
                  : "border-duo-gray-dark bg-transparent",
              ].join(" ")}
              style={i < skill.crowns ? { backgroundColor: color } : {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
