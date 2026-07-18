/**
 * Lesson loading state — Task 22.
 * Shown while fetchLesson + fetchProfile resolve before
 * the LessonPlayer mounts.
 */
export default function LessonLoading() {
  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7] animate-pulse">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#f7f7f7] px-4 pt-4 pb-3">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="h-6 w-6 rounded bg-duo-gray" />
          <div className="flex-1 h-4 rounded-full bg-duo-gray" />
          <div className="flex gap-1">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="h-5 w-5 rounded-full bg-duo-gray" />
            ))}
          </div>
        </div>
      </header>
      {/* Exercise area */}
      <main className="flex flex-1 flex-col items-center gap-8 px-4 py-8">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="h-4 w-16 rounded bg-duo-gray" />
          <div className="h-8 w-3/4 rounded-xl bg-duo-gray" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="h-16 rounded-2xl bg-duo-gray" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
