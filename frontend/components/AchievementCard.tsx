/**
 * AchievementCard — Task 18.
 *
 * A single achievement tile: a trophy/lock icon, the achievement name,
 * and its description. Unlocked tiles are fully colored; locked ones
 * are grayed out with a padlock — same visual language as the
 * locked/unlocked SkillNode on the home screen.
 *
 * Server Component — purely presentational, no interactivity.
 */
import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "@/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const { unlocked, name, description } = achievement;

  return (
    <div
      className={[
        "flex items-center gap-4 rounded-2xl border-2 p-4",
        unlocked
          ? "border-duo-gold bg-yellow-50"
          : "border-duo-gray bg-white opacity-60",
      ].join(" ")}
    >
      {/* Icon */}
      <div
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          unlocked ? "bg-duo-gold/20" : "bg-duo-gray",
        ].join(" ")}
      >
        {unlocked ? (
          <Trophy
            size={24}
            className="text-duo-gold-dark"
            strokeWidth={2}
          />
        ) : (
          <Lock
            size={20}
            className="text-duo-gray-dark"
            strokeWidth={2}
          />
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-extrabold text-duo-text">
          {name}
        </p>
        <p className="mt-0.5 text-xs text-duo-gray-dark leading-snug">
          {description}
        </p>
      </div>

      {/* Unlocked badge */}
      {unlocked && (
        <span className="shrink-0 rounded-full bg-duo-gold/30 px-2.5 py-0.5 font-display text-xs font-bold text-duo-gold-dark">
          ✓
        </span>
      )}
    </div>
  );
}
