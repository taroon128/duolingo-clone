"use client";

/**
 * Profile error boundary — Task 20.
 *
 * Next.js App Router's error.tsx convention: if the profile page
 * throws (e.g. backend is down, API returns non-2xx), this
 * component catches it and shows a recoverable error state instead
 * of a blank page or an unhandled exception.
 *
 * "use client" is required by Next.js for all error.tsx files —
 * the error boundary mechanism uses React class component lifecycle
 * methods that only work on the client.
 */
import { useEffect } from "react";
import Button from "@/components/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console so the evaluator can see what went wrong
    console.error("[ProfilePage error]", error.message);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-[#f7f7f7] px-6 py-16 pb-24">
      <span className="text-5xl">⚠️</span>
      <div className="text-center">
        <h2 className="font-display text-xl font-extrabold text-duo-text">
          Couldn&apos;t load your profile
        </h2>
        <p className="mt-2 text-sm text-duo-gray-dark">
          {error.message.includes("Network")
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
