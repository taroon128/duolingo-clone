/**
 * StatCard — Task 18.
 *
 * A single stat tile on the profile screen: a large value above a
 * small label, tinted by the stat's color. Used for streak, total XP,
 * hearts, and crowns — four tiles in a 2×2 grid.
 *
 * Server Component — purely presentational, no interactivity.
 */
import type { ReactNode } from "react";

interface StatCardProps {
  value: ReactNode;
  label: string;
  color: "green" | "gold" | "red" | "blue";
}

const COLOR_STYLES: Record<StatCardProps["color"], string> = {
  green: "bg-green-50 text-duo-green",
  gold:  "bg-yellow-50 text-duo-gold-dark",
  red:   "bg-red-50 text-duo-red",
  blue:  "bg-blue-50 text-duo-blue",
};

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center rounded-2xl p-4",
        COLOR_STYLES[color],
      ].join(" ")}
    >
      <span className="font-display text-3xl font-extrabold leading-none">
        {value}
      </span>
      <span className="mt-1 font-display text-xs font-bold uppercase tracking-wide opacity-70">
        {label}
      </span>
    </div>
  );
}
