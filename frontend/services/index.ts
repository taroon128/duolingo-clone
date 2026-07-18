/**
 * API layer barrel export — Task 19.
 *
 * Import from "@/services" to get the typed API functions.
 * The mock data files (mockData.ts, mockLesson.ts) are intentionally
 * NOT re-exported here — they're imported directly by the components
 * that still use them, making it easy to track which imports need to
 * switch from mock to real in the next task.
 */
export { apiClient, ApiError } from "./api";

export { fetchProfile } from "./profileApi";
export { fetchUnits, fetchSkills } from "./learningPathApi";
export { fetchLesson, completeLesson } from "./lessonApi";
export type { LessonCompletionResult } from "./lessonApi";
export { submitAnswer } from "./answerApi";
export type { AnswerResult } from "./answerApi";
export { fetchLeaderboard } from "./leaderboardApi";
export type { LeaderboardEntry } from "./leaderboardApi";
