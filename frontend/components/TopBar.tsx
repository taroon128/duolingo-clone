import { Flame, Gem } from "lucide-react";
import Heart from "./Heart";
import XPBadge from "./XPBadge";
import type { Profile } from "@/types";

/**
 * TopBar — the persistent stats bar across the top of the learning
 * experience: streak, gems, hearts, XP. Composed from the Heart and
 * XPBadge primitives built in Task 15; streak/gems get an inline
 * treatment styled to match them (Task 15 only named 5 components,
 * not a separate "StreakBadge"/"GemBadge").
 *
 * No "use client" — purely presentational, just renders the profile
 * prop it's given.
 */
interface TopBarProps {
  profile: Profile;
}

export default function TopBar({ profile }: TopBarProps) {
  return (
    <header className="flex items-center justify-center gap-6 border-b-2 border-duo-gray bg-white px-4 py-3">
      <div className="flex items-center gap-1 font-bold text-duo-gold-dark">
        <Flame size={22} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        {profile.streak}
      </div>
      <div className="flex items-center gap-1 font-bold text-duo-blue">
        <Gem size={22} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        {profile.gems}
      </div>
      <div className="flex items-center gap-1 font-bold text-duo-red">
        <Heart filled size={22} />
        {profile.hearts}
      </div>
      <XPBadge amount={profile.xp} />
    </header>
  );
}
