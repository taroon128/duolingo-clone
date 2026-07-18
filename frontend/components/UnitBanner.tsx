/**
 * UnitBanner — Task 16.
 *
 * Colored band separating units on the skill path, matching
 * Duolingo's actual section headers: a rounded pill of the unit
 * color containing the unit title and description. The color comes
 * from unit.color_hex, which matches the same hex values from seed.py
 * (Basics: #58CC02, Phrases: #1CB0F6, Food: #FF9600).
 *
 * Server Component — no interactivity.
 */
import type { Unit } from "@/types";

interface UnitBannerProps {
  unit: Unit;
}

export default function UnitBanner({ unit }: UnitBannerProps) {
  const color = unit.color_hex ?? "#58CC02";

  return (
    <div
      className="w-full max-w-sm rounded-2xl px-6 py-4 text-white"
      style={{ backgroundColor: color }}
    >
      <p className="font-display text-xs font-bold uppercase tracking-wider opacity-80">
        Section {unit.order_index + 1}
      </p>
      <h2 className="font-display text-xl font-extrabold leading-tight">
        {unit.title}
      </h2>
      {unit.description && (
        <p className="mt-0.5 text-sm font-medium opacity-90">
          {unit.description}
        </p>
      )}
    </div>
  );
}
