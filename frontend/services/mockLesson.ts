/**
 * Mock lesson data for Task 17 — no backend connection.
 *
 * Matches lesson 1 (Greetings) from seed.py exactly: same prompts,
 * same options, same correct answers. Payloads match the REDACTED
 * shape Task 8 sends to clients — no correct_option, correct_sequence,
 * correct_answer in the payload since Task 17 uses client-side
 * validation only (no API yet). Correct answers live separately in
 * MOCK_ANSWERS below, not embedded in the payload.
 *
 * All 5 exercise types covered: the 3 from lesson 1 in seed.py
 * (multiple_choice, translate, type_answer) plus one match_pairs
 * and one fill_blank added here so every type is testable in the UI.
 */
import type { Lesson } from "@/types";

export const MOCK_LESSON: Lesson = {
  id: 1,
  skill_id: 1,
  title: "Lesson 1 — Greetings",
  xp_reward: 10,
  exercises: [
    {
      id: 1,
      order_index: 0,
      type: "multiple_choice",
      prompt: "Select the correct translation of 'Hello'",
      payload: { options: ["Hola", "Adiós", "Gracias"] },
    },
    {
      id: 2,
      order_index: 1,
      type: "translate",
      prompt: "Translate: 'Good morning'",
      payload: { word_bank: ["Buenos", "días", "noches", "tardes"] },
    },
    {
      id: 3,
      order_index: 2,
      type: "match_pairs",
      prompt: "Match each word to its translation",
      payload: {
        left_items: ["Hello", "Thank you", "Goodbye"],
        right_items: ["Adiós", "Hola", "Gracias"],
      },
    },
    {
      id: 4,
      order_index: 3,
      type: "fill_blank",
      prompt: "Complete the sentence: ___ llamo Ana.",
      payload: { sentence_template: "___ llamo Ana." },
    },
    {
      id: 5,
      order_index: 4,
      type: "type_answer",
      prompt: "Type the Spanish word for 'Thank you'",
      payload: {},
    },
  ],
};

/**
 * Client-side answer key — the "validation" this task uses instead
 * of POST /answer. Keyed by exercise id to avoid positional coupling.
 * When the real backend is connected (Task 18+), this object is
 * deleted and validation moves to the API response instead.
 *
 * match_pairs answers are arrays of [left, right] pairs — the
 * client-side checker converts the user's pairing into the same shape.
 */
export const MOCK_ANSWERS: Record<number, unknown> = {
  1: "Hola",
  2: ["Buenos", "días"],
  3: [
    ["Hello", "Hola"],
    ["Thank you", "Gracias"],
    ["Goodbye", "Adiós"],
  ],
  4: "Me",
  5: "Gracias",
};
