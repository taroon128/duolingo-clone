/**
 * Leaderboard API service — Task 19.
 *
 * Wraps GET /leaderboard. Return type mirrors backend's
 * LeaderboardEntry schema (Task 13): rank, name, xp.
 */
import { apiClient } from "./api";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const { data } = await apiClient.get<LeaderboardEntry[]>("/leaderboard");
  return data;
}
