import { getProfile } from "@/services/profileService";
import { getUnits } from "@/services/learningPathService";
import TopBar from "@/components/TopBar";
import UnitBanner from "@/components/UnitBanner";
import SkillPath from "@/components/SkillPath";

/**
 * Duolingo Home Screen — Task 16.
 *
 * Async Server Component: awaits the mock service functions directly,
 * the same pattern a real fetch() call to our FastAPI backend would
 * use in a future task (see profileService.ts / learningPathService.ts
 * docstrings). No "use client" here — interactivity is isolated to
 * SkillPath/SkillNode, which each declare it themselves.
 */
export default async function Home() {
  const [profile, units] = await Promise.all([getProfile(), getUnits()]);

  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7]">
      <TopBar profile={profile} />
      <main className="flex flex-1 flex-col items-center gap-10 py-8">
        {units.map((unit) => (
          <section key={unit.id} className="flex w-full flex-col items-center gap-6">
            <UnitBanner unit={unit} />
            <SkillPath skills={unit.skills} color={unit.color_hex ?? "#58CC02"} />
          </section>
        ))}
      </main>
    </div>
  );
}
