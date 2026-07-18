"use client";
/**
 * Lesson error boundary — Task 22.
 * Catches fetchLesson / fetchProfile failures before the player mounts.
 */
import { useEffect } from "react";
import Button from "@/components/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LessonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[LessonPage error]", error.message);
  }, [error]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-[#f7f7f7] px-6 py-16">
      <span className="text-5xl">😔</span>
      <div className="text-center">
        <h2 className="font-display text-xl font-extrabold text-duo-text">
          Couldn&apos;t load this lesson
        </h2>
        <p className="mt-2 text-sm text-duo-gray-dark">
          {error.message.includes("Network") || error.message.includes("ECONNREFUSED")
            ? "Make sure the backend is running on port 8000."
            : error.message}
        </p>
      </div>
      <Button variant="primary" onClick={reset}>Try again</Button>
    </div>
  );
}
