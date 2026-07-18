/**
 * Profile loading skeleton — Task 20.
 *
 * Next.js App Router's loading.tsx convention: shown automatically
 * while the profile Server Component is awaiting the API responses
 * (fetchProfile + fetchSkills). Mirrors the real page's layout so
 * there's no jarring layout shift when data arrives.
 *
 * Server Component — no interactivity, no "use client" needed.
 */
export default function ProfileLoading() {
  return (
    <div className="flex min-h-full flex-col bg-[#f7f7f7] pb-24 animate-pulse">
      {/* Header skeleton */}
      <header className="bg-white border-b-2 border-duo-gray px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <div className="h-20 w-20 rounded-full bg-duo-gray" />
          <div className="h-7 w-36 rounded-xl bg-duo-gray" />
          <div className="h-8 w-32 rounded-full bg-duo-gray" />
        </div>
      </header>

      {/* Stats skeleton */}
      <section className="mx-auto w-full max-w-2xl px-4 pt-6">
        <div className="mb-3 h-4 w-12 rounded bg-duo-gray" />
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-duo-gray" />
          ))}
        </div>
      </section>

      {/* Achievements skeleton */}
      <section className="mx-auto w-full max-w-2xl px-4 pt-8">
        <div className="mb-3 h-4 w-28 rounded bg-duo-gray" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-duo-gray" />
          ))}
        </div>
      </section>
    </div>
  );
}
