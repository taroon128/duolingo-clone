/**
 * Shared TypeScript types for the Duolingo Clone frontend.
 *
 * Mirror the backend Pydantic schemas exactly — same field names,
 * same shapes — so connecting the real API later (Task 17+) is a
 * one-line swap in services/, not a type refactor across the whole
 * frontend. Mock data in services/mockData.ts satisfies these same
 * interfaces, not a separate "mock shape."
 */

export type SkillStatus = "locked" | "unlocked" | "completed";

export interface Skill {
  id: number;
  unit_id: number;
  title: string;
  description: string | null;
  order_index: number;
  icon_name: string | null;
  levels: number;
  crowns: number;
  status: SkillStatus;
}

export interface Unit {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  color_hex: string | null;
  skills: Skill[];
}

export interface Profile {
  name: string;
  xp: number;
  streak: number;
  hearts: number;
  achievements: Achievement[];
}

export interface Achievement {
  name: string;
  description: string;
  unlocked: boolean;
}

// ----------------------------------------------------------------
// Lesson player types — mirror backend schemas from Task 8 exactly.
// payload is intentionally typed as Record<string, unknown> here;
// each exercise component narrows it to its own concrete shape.
// ----------------------------------------------------------------
export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export interface Exercise {
  id: number;
  order_index: number;
  type: ExerciseType;
  prompt: string;
  payload: Record<string, unknown>;
}

export interface Lesson {
  id: number;
  skill_id: number;
  title: string | null;
  xp_reward: number;
  exercises: Exercise[];
}
