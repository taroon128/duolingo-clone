/**
 * Duolingo Home Screen — Task 21.
 *
 * Task 16: used MOCK_PROFILE and MOCK_UNITS.
 * Task 21: replaced with real API calls — fetchProfile() and
 * fetchUnits() — both from the Axios layer built in Task 19.
 *
 * Both fetches run in parallel via Promise.all: they're independent
 * requests and both are load-bearing (TopBar needs profile,
 * the path needs units), so there's no reason to await them
 * sequentially. Total wait time is max(profile, units) not their sum.
 *
 * export const dynamic: same reason as profile/page.tsx in Task 20 —
 * Next.js would try to pre-render this page at build time, fail with
 * ECONNREFUSED, and abort the build. The home screen is always
 * user-specific and real-time anyway.
 */
import TopBar from "@/components/TopBar";
import UnitBanner from "@/components/UnitBanner";
import SkillPath from "@/components/SkillPath";
import { fetchProfile } from "@/services/profileApi";
import { fetchUnits } from "@/services/learningPathApi";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, units] = await Promise.all([
    fetchProfile(),
    fetchUnits(),
  ]);

  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7]">
      <TopBar profile={profile} dailyGoal={20} />

      <main className="flex flex-1 flex-col items-center gap-10 py-8 pb-24">
        {units.map((unit) => (
          <section
            key={unit.id}
            className="flex w-full flex-col items-center gap-4"
          >
            <UnitBanner unit={unit} />
            <SkillPath
              skills={unit.skills}
              color={unit.color_hex ?? "#58CC02"}
            />
          </section>
        ))}
      </main>
    </div>
  );
}
