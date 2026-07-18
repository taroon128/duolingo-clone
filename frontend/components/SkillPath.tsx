"use client";

import { useState } from "react";
import SkillNode from "./SkillNode";
import type { Skill } from "@/types";

/**
 * SkillPath — renders one unit's skills as Duolingo's signature
 * zigzag path (alternating horizontal offset per node).
 *
 * "use client" — tracks which node was last selected, to show simple
 * inline feedback. Real lesson navigation isn't implemented here: no
 * lesson player page exists yet, and this task explicitly says "do
 * not connect backend" — so selecting a node is intentionally inert
 * beyond this lightweight feedback line, not a placeholder bug.
 */
interface SkillPathProps {
  skills: Skill[];
  color: string;
}

const OFFSETS = ["translate-x-0", "-translate-x-16", "translate-x-16"]; // center, left, right — cycles

export default function SkillPath({ skills, color }: SkillPathProps) {
  const [selected, setSelected] = useState<Skill | null>(null);

  return (
    <div className="flex flex-col items-center gap-6">
      {skills.map((skill, index) => (
        <div key={skill.id} className={OFFSETS[index % OFFSETS.length]}>
          <SkillNode skill={skill} color={color} onSelect={setSelected} />
        </div>
      ))}
      {selected && (
        <p className="text-sm text-duo-text">
          {selected.status === "locked"
            ? `${selected.title} is locked — complete the previous skill first.`
            : `Selected: ${selected.title} (${selected.crowns}/${selected.levels} crowns)`}
        </p>
      )}
    </div>
  );
}
