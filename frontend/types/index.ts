/**
 * Shared TypeScript interfaces — mirror the backend Pydantic schemas
 * from Tasks 6 (ProfileResponse) and 7 (SkillOut/UnitOut), so mock
 * data (Task 16) and real API responses (a later task) share the
 * exact same shape without any consuming component needing to change.
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
  /**
   * Gems are explicitly listed as a mockable feature in the
   * assignment brief ("Super subscription / gems can be mocked") —
   * unlike xp/streak/hearts, this field has no backing column in the
   * real Profile API (Task 6) and isn't expected to ever need one.
   */
  gems: number;
}
