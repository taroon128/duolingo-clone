"use client";

/**
 * Home screen error boundary — Task 21.
 *
 * Catches errors thrown by the home page Server Component (e.g.
 * backend is down, fetchProfile or fetchUnits fails). Shows a
 * friendly message and a "Try again" button that retries without
 * a full browser reload.
 *
 * "use client" is required by Next.js for all error.tsx files.
 */
import { useEffect } from "react";
import Button from "@/components/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[HomePage error]", error.message);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-[#f7f7f7] px-6 py-16 pb-24">
      <span className="text-5xl">🦉</span>
      <div className="text-center">
        <h2 className="font-display text-xl font-extrabold text-duo-text">
          Couldn&apos;t load your learning path
        </h2>
        <p className="mt-2 text-sm text-duo-gray-dark">
          {error.message.includes("Network") || error.message.includes("ECONNREFUSED")
            ? "Make sure the backend is running on port 8000."
            : error.message}
        </p>
      </div>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
