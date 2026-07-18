/**
 * TopBar — Task 16.
 *
 * Sticky top bar showing the learner's streak, hearts, gems, and
 * daily XP goal progress. Matches Duolingo's actual top bar layout:
 * logo left, gamification stats right, XP progress bar below the
 * stats row (visible on scroll).
 *
 * Server Component — all values arrive as props, no interactivity.
 */
import { Flame, Gem } from "lucide-react";
import Heart from "./Heart";
import ProgressBar from "./ProgressBar";
import type { Profile } from "@/types";

interface TopBarProps {
  profile: Profile;
  dailyGoal?: number;
}

export default function TopBar({ profile, dailyGoal = 20 }: TopBarProps) {
  const xpProgress = Math.min(100, Math.round((profile.xp % dailyGoal) / dailyGoal * 100));

  return (
    <header className="sticky top-0 z-30 border-b-2 border-duo-gray bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <span
          className="font-display text-2xl font-extrabold tracking-tight"
          style={{ color: "#58CC02" }}
        >
          duolingo
        </span>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-1">
            <Flame size={22} className="text-orange-400" fill="currentColor" />
            <span className="font-display text-base font-bold text-duo-text">
              {profile.streak}
            </span>
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            <Heart size={22} filled />
            <span className="font-display text-base font-bold text-duo-text">
              {profile.hearts}
            </span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1">
            <Gem size={22} className="text-duo-blue" fill="currentColor" />
            <span className="font-display text-base font-bold text-duo-text">
              500
            </span>
          </div>
        </div>
      </div>

      {/* Daily XP progress bar */}
      <div className="mx-auto max-w-2xl px-4 pb-2">
        <div className="flex items-center gap-2">
          <ProgressBar value={xpProgress} color="gold" className="flex-1" />
          <span className="font-display text-xs font-bold text-duo-gray-dark whitespace-nowrap">
            {profile.xp % dailyGoal}/{dailyGoal} XP
          </span>
        </div>
      </div>
    </header>
  );
}
