import { Heart as HeartIcon } from "lucide-react";

/**
 * Reusable Heart — Task 15.
 *
 * Deliberately a SINGLE heart icon (filled or empty), not a
 * "HeartsRow" showing several at once — matches the task naming
 * exactly ("Heart", singular). A future component renders N of these
 * side by side to show e.g. 4 filled + 1 empty for 4/5 hearts,
 * composing this primitive rather than this one owning that layout.
 *
 * No "use client" — purely presentational, no handlers.
 */
interface HeartProps {
  filled?: boolean;
  size?: number;
}

export default function Heart({ filled = true, size = 24 }: HeartProps) {
  return (
    <HeartIcon
      size={size}
      fill={filled ? "var(--color-duo-red)" : "none"}
      stroke={filled ? "var(--color-duo-red)" : "var(--color-duo-gray-dark)"}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}
