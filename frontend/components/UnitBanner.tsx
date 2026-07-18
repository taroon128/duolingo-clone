import type { Unit } from "@/types";

/**
 * UnitBanner — the colored header shown above each unit's skills,
 * matching Duolingo's actual unit banner convention. Page-specific
 * composition for the Home Screen, not one of Task 15's 5 primitives.
 */
interface UnitBannerProps {
  unit: Unit;
}

export default function UnitBanner({ unit }: UnitBannerProps) {
  return (
    <div
      className="w-full max-w-xs rounded-2xl px-5 py-4 text-white shadow-sm"
      style={{ backgroundColor: unit.color_hex ?? "#58CC02" }}
    >
      <p className="text-xs font-bold uppercase tracking-wide opacity-90">
        Unit {unit.order_index + 1}
      </p>
      <h2 className="text-lg font-bold">{unit.title}</h2>
      {unit.description && <p className="text-sm opacity-90">{unit.description}</p>}
    </div>
  );
}
