/**
 * Answer API service — Task 19.
 *
 * Wraps POST /answer. Return type mirrors backend's AnswerResult
 * schema (Tasks 9–11): result, xp_awarded, hearts_remaining.
 *
 * `answer` accepts `string | string[] | [string, string][]` to cover
 * the per-type shapes the backend expects:
 *   multiple_choice / fill_blank / type_answer → string
 *   translate                                  → string[]
 *   match_pairs                                → {left, right}[]
 * Using `unknown` here rather than a discriminated union keeps this
 * function signature consistent with how useLessonSession stores
 * answers, and avoids a large type switch at the call site.
 */
import { apiClient } from "./api";

export interface AnswerResult {
  result: "correct" | "wrong";
  xp_awarded: number;
  hearts_remaining: number;
}

export async function submitAnswer(
  questionId: number,
  answer: unknown
): Promise<AnswerResult> {
  const { data } = await apiClient.post<AnswerResult>("/answer", {
    question_id: questionId,
    answer,
  });
  return data;
}
