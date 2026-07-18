/**
 * Learning Path API service — Task 19.
 *
 * Wraps GET /units and GET /skills. No UI connection yet (Task 20+).
 */
import { apiClient } from "./api";
import type { Unit, Skill } from "@/types";

export async function fetchUnits(): Promise<Unit[]> {
  const { data } = await apiClient.get<Unit[]>("/units");
  return data;
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<Skill[]>("/skills");
  return data;
}
