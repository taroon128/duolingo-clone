/**
 * Profile API service — Task 19.
 *
 * Wraps GET /profile. No UI connection yet (Task 20+).
 * Return type matches backend's ProfileResponse Pydantic schema exactly
 * (name, xp, streak, hearts, achievements[]) — same as the existing
 * frontend Profile interface in types/index.ts, so no adapter needed.
 */
import { apiClient } from "./api";
import type { Profile } from "@/types";

export async function fetchProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>("/profile");
  return data;
}
