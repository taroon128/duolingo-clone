/**
 * Lesson API service — Task 19.
 *
 * Wraps GET /lesson/{id} and POST /lesson/{id}/complete.
 * Return types mirror backend schemas from Tasks 8 and 12.
 */
import { apiClient } from "./api";
import type { Lesson } from "@/types";

/** Maps to backend's LessonCompletionResult schema (Task 12). */
export interface LessonCompletionResult {
  skill_id: number;
  crowns: number;
  lessons_completed_in_level: number;
  crown_earned: boolean;
}

export async function fetchLesson(lessonId: number): Promise<Lesson> {
  const { data } = await apiClient.get<Lesson>(`/lesson/${lessonId}`);
  return data;
}

export async function completeLesson(lessonId: number): Promise<LessonCompletionResult> {
  const { data } = await apiClient.post<LessonCompletionResult>(
    `/lesson/${lessonId}/complete`
  );
  return data;
}
