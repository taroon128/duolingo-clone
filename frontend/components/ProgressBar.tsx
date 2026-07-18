/**
 * Reusable ProgressBar — Task 15.
 *
 * No "use client" — purely presentational, no event handlers, no
 * hooks. Renders fine as a Server Component, which keeps it out of
 * the client JS bundle entirely.
 *
 * Takes a plain 0-100 `value` rather than `current`/`total` — the
 * most generic shape, since a future caller might be showing lesson
 * progress (exercise index / total exercises), daily XP goal
 * progress, or anything else expressible as a percentage. The
 * caller computes the percentage; this component just renders it.
 */
interface ProgressBarProps {
  value: number; // 0-100
  color?: "green" | "blue" | "gold";
  className?: string;
}

const COLOR_STYLES: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  green: "bg-duo-green",
  blue: "bg-duo-blue",
  gold: "bg-duo-gold",
};

export default function ProgressBar({ value, color = "green", className = "" }: ProgressBarProps) {
  // Defensive clamp — a caller passing 105 or -10 shouldn't visually overflow the bar.
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-4 w-full overflow-hidden rounded-full bg-duo-gray ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${COLOR_STYLES[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
