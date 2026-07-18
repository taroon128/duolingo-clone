/**
 * Profile Screen — Task 20.
 *
 * Task 18: used MOCK_PROFILE and MOCK_UNITS.
 * Task 20: replaced with real API calls — fetchProfile() and
 * fetchSkills() — both from the Axios layer built in Task 19.
 *
 * Why still a Server Component (no "use client"):
 *   Next.js Server Components can `await` fetch calls directly at
 *   the top level. The framework handles the loading state via
 *   loading.tsx (shown automatically while this component suspends)
 *   and error recovery via error.tsx (shown if either fetch throws).
 *   No useState, no useEffect, no manual loading flag — the App
 *   Router convention does all of that for free.
 *
 * Two separate awaits vs Promise.all:
 *   Promise.all([fetchProfile(), fetchSkills()]) would be slightly
 *   faster, but either call failing would silently kill both. Two
 *   separate awaits means a /skills failure (non-critical — just the
 *   crown count) doesn't take down the whole profile page.
 *   Crowns default to 0 if fetchSkills throws, instead of showing
 *   the error boundary for a non-essential number.
 */
import StatCard from "@/components/StatCard";
import AchievementCard from "@/components/AchievementCard";
import { fetchProfile } from "@/services/profileApi";
import { fetchSkills } from "@/services/learningPathApi";
import { Flame } from "lucide-react";

// Tell Next.js to always render this at request time, never at
// build time. Without this, Next.js tries to pre-render the page
// during `next build` when no backend is running, which fails
// with a connection error. The profile data is per-user and
// real-time anyway — static pre-rendering doesn't make sense here.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // fetchProfile is critical — if it throws, error.tsx takes over.
  const profile = await fetchProfile();

  // fetchSkills is non-critical (just the crown count) — if it
  // fails, show 0 instead of crashing the whole page.
  let totalCrowns = 0;
  try {
    const skills = await fetchSkills();
    totalCrowns = skills.reduce((sum, s) => sum + s.crowns, 0);
  } catch {
    // Crown count unavailable — non-fatal, page still renders
  }

  const { name, xp, streak, hearts, achievements } = profile;

  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7] pb-24">
      {/* Header */}
      <header className="bg-white border-b-2 border-duo-gray px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-duo-green text-4xl font-extrabold text-white select-none">
            {name.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <h1 className="font-display text-2xl font-extrabold text-duo-text">
            {name}
          </h1>

          {/* Streak pill */}
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-1.5">
            <Flame
              size={18}
              className="text-orange-400"
              fill="currentColor"
            />
            <span className="font-display text-sm font-extrabold text-orange-500">
              {streak} day streak
            </span>
          </div>
        </div>
      </header>

      {/* Stats grid */}
      <section className="mx-auto w-full max-w-2xl px-4 pt-6">
        <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-duo-gray-dark">
          Stats
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard value={xp} label="Total XP" color="gold" />
          <StatCard value={`🔥 ${streak}`} label="Day Streak" color="green" />
          <StatCard value={hearts} label="Hearts" color="red" />
          <StatCard value={totalCrowns} label="Crowns" color="blue" />
        </div>
      </section>

      {/* Achievements */}
      <section className="mx-auto w-full max-w-2xl px-4 pt-8">
        <h2 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-duo-gray-dark">
          Achievements
        </h2>
        <div className="flex flex-col gap-3">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.name}
              achievement={achievement}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
