/**
 * SkillPath — Task 16.
 *
 * Lays out an array of SkillNodes in the zigzag pattern Duolingo uses
 * on its learning path — the single most recognizable layout element
 * of the whole app. Nodes alternate left-of-center / center /
 * right-of-center, creating the gentle S-curve as you scroll down.
 *
 * Implementation: each node is absolutely offset from a
 * centered baseline using one of three horizontal positions
 * (left, center, right), cycling through a predefined sequence.
 * The container grows tall enough to give each node its own row.
 *
 * Server Component — SkillNode itself is "use client" for its
 * onClick; this wrapper has no interactivity of its own.
 */
import SkillNode from "./SkillNode";
import type { Skill } from "@/types";

interface SkillPathProps {
  skills: Skill[];
  color: string;
}

// Duolingo's actual zigzag offsets — 5-step repeating pattern.
// Expressed as Tailwind margin-left values applied to each node.
const ZIGZAG: string[] = [
  "ml-0",       // center
  "ml-16",      // right
  "ml-28",      // far right
  "ml-16",      // right
  "ml-0",       // center
];

export default function SkillPath({ skills, color }: SkillPathProps) {
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-6 px-8 py-2">
      {skills.map((skill, index) => (
        <div
          key={skill.id}
          className={ZIGZAG[index % ZIGZAG.length]}
        >
          <SkillNode skill={skill} color={color} />
        </div>
      ))}
    </div>
  );
}
