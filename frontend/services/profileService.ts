import type { Profile } from "@/types";
import { mockProfile } from "./mockData";

/**
 * Returns the current learner's profile stats for the top bar.
 *
 * MOCK IMPLEMENTATION — Task 16 says "mock data only, do not connect
 * backend." Deliberately async and Promise-returning even though
 * there's no real request yet: this is the exact shape a real
 * `fetch(".../profile")` call will have (Task 6's GET /profile),
 * so a future task only needs to replace this function's BODY —
 * no consuming component changes at all.
 */
export async function getProfile(): Promise<Profile> {
  return mockProfile;
}
