/**
 * Mock data for Task 16 (home screen) — no backend connection.
 *
 * Values deliberately match what seed.py actually inserts:
 * - Same unit titles, colors, and order_index values
 * - Same skill titles and levels=5 per skill
 * - Greetings: crowns=1 (completed once), status=unlocked
 * - Introductions: crowns=0, status=unlocked (in progress in seed)
 * - Everything else: crowns=0, status=locked
 *
 * This means when the real API is connected (Task 17+), the screen
 * will look identical to what it does now — no visual surprise.
 */
import type { Profile, Unit } from "@/types";

export const MOCK_PROFILE: Profile = {
  name: "Demo Learner",
  xp: 30,
  streak: 3,
  hearts: 4,
  achievements: [
    { name: "Getting Started", description: "Earn your first XP", unlocked: true },
    { name: "3-Day Streak", description: "Practice 3 days in a row", unlocked: true },
    { name: "First Crown", description: "Earn your first crown", unlocked: true },
    { name: "Perfect Week", description: "Practice 7 days in a row", unlocked: false },
  ],
};

export const MOCK_UNITS: Unit[] = [
  {
    id: 1,
    title: "Basics",
    description: "Everyday greetings and introductions",
    order_index: 0,
    color_hex: "#58CC02",
    skills: [
      {
        id: 1, unit_id: 1, title: "Greetings",
        description: "Say hello and goodbye",
        order_index: 0, icon_name: "message-circle",
        levels: 5, crowns: 1, status: "unlocked",
      },
      {
        id: 2, unit_id: 1, title: "Introductions",
        description: "Introduce yourself",
        order_index: 1, icon_name: "user",
        levels: 5, crowns: 0, status: "unlocked",
      },
    ],
  },
  {
    id: 2,
    title: "Phrases",
    description: "Common expressions and questions",
    order_index: 1,
    color_hex: "#1CB0F6",
    skills: [
      {
        id: 3, unit_id: 2, title: "Common Phrases",
        description: "Everyday polite expressions",
        order_index: 0, icon_name: "message-square",
        levels: 5, crowns: 0, status: "locked",
      },
      {
        id: 4, unit_id: 2, title: "Questions",
        description: "Ask basic questions",
        order_index: 1, icon_name: "help-circle",
        levels: 5, crowns: 0, status: "locked",
      },
    ],
  },
  {
    id: 3,
    title: "Food",
    description: "Ordering and talking about food",
    order_index: 2,
    color_hex: "#FF9600",
    skills: [
      {
        id: 5, unit_id: 3, title: "Food & Drink",
        description: "Name common foods and drinks",
        order_index: 0, icon_name: "coffee",
        levels: 5, crowns: 0, status: "locked",
      },
      {
        id: 6, unit_id: 3, title: "Ordering",
        description: "Order food at a restaurant",
        order_index: 1, icon_name: "utensils",
        levels: 5, crowns: 0, status: "locked",
      },
    ],
  },
];
