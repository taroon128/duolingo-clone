/**
 * Lesson route — Task 22.
 *
 * Task 17: used MOCK_LESSON for all lesson ids.
 * Task 22: fetches the real lesson from GET /lesson/{id} and the
 * current heart count from GET /profile, both in parallel.
 *
 * `params.id` is a string (all Next.js URL params are) — parsed to
 * int before passing to fetchLesson. An invalid id (NaN) falls back
 * to lesson 1 rather than crashing, since the seeded data always has
 * lesson 1 and an invalid URL shouldn't show a blank error screen.
 *
 * Why fetch /profile here: the lesson player shows the user's actual
 * current heart count (which may have decreased from earlier wrong
 * answers), not a hardcoded 5. Without this fetch, a user who already
 * lost hearts today would see a misleading full-heart display.
 */
import LessonPlayer from "@/components/LessonPlayer";
import { fetchLesson } from "@/services/lessonApi";
import { fetchProfile } from "@/services/profileApi";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lessonId = parseInt(id, 10) || 1;

  const [lesson, profile] = await Promise.all([
    fetchLesson(lessonId),
    fetchProfile(),
  ]);

  return (
    <LessonPlayer
      lesson={lesson}
      initialHearts={profile.hearts}
    />
  );
}
