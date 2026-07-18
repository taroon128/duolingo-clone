import type { Unit } from "@/types";
import { mockUnits } from "./mockData";

/**
 * Returns every unit with its skills nested inside, in path order.
 *
 * MOCK IMPLEMENTATION — see profileService.ts's docstring for why
 * this is structured as an async function returning mock data rather
 * than a plain exported constant. Mirrors Task 7's GET /units shape
 * exactly.
 */
export async function getUnits(): Promise<Unit[]> {
  return mockUnits;
}
