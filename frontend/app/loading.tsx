/**
 * Home screen loading skeleton — Task 21.
 *
 * Shown automatically while the home page Server Component awaits
 * fetchProfile() + fetchUnits() from the backend. Mirrors the real
 * layout so there's no jarring shift when data arrives.
 */
export default function HomeLoading() {
  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7] animate-pulse">
      {/* TopBar skeleton */}
      <header className="sticky top-0 z-30 border-b-2 border-duo-gray bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="h-7 w-24 rounded-xl bg-duo-gray" />
          <div className="flex gap-4">
            <div className="h-6 w-10 rounded-lg bg-duo-gray" />
            <div className="h-6 w-10 rounded-lg bg-duo-gray" />
            <div className="h-6 w-10 rounded-lg bg-duo-gray" />
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-2xl px-0 pb-2">
          <div className="h-4 w-full rounded-full bg-duo-gray" />
        </div>
      </header>

      {/* Unit sections skeleton */}
      <main className="flex flex-1 flex-col items-center gap-10 py-8">
        {[0, 1, 2].map((i) => (
          <section key={i} className="flex w-full flex-col items-center gap-6">
            {/* UnitBanner skeleton */}
            <div className="h-20 w-full max-w-sm rounded-2xl bg-duo-gray" />
            {/* SkillPath skeleton */}
            <div className="flex w-full max-w-sm flex-col items-start gap-6 px-8">
              {[0, 1].map((j) => (
                <div
                  key={j}
                  className={[
                    "flex flex-col items-center gap-2",
                    j % 2 === 1 ? "ml-16" : "ml-0",
                  ].join(" ")}
                >
                  <div className="h-16 w-16 rounded-full bg-duo-gray" />
                  <div className="h-3 w-16 rounded bg-duo-gray" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
