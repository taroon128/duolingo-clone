import type { Unit, Profile } from "@/types";

/**
 * Mock data for Task 16 — deliberately mirrors the REAL seed.py values
 * (Tasks 5, 7, 12) exactly: same 3 units, same 6 skills, same crowns
 * (Greetings=1, everything else=0, matching the demo user's actual
 * progress). When a later task swaps profileService/learningPathService
 * to real fetch() calls, the home screen should render IDENTICALLY —
 * that sameness is the actual proof the wiring worked, not a coincidence.
 */
export const mockProfile: Profile = {
  name: "Demo Learner",
  xp: 30,
  streak: 3,
  hearts: 4,
  gems: 50,
};

export const mockUnits: Unit[] = [
  {
    id: 1,
    title: "Basics",
    description: "Everyday greetings and introductions",
    order_index: 0,
    color_hex: "#58CC02",
    skills: [
      {
        id: 1,
        unit_id: 1,
        title: "Greetings",
        description: "Say hello and goodbye",
        order_index: 0,
        icon_name: "waving-hand",
        levels: 5,
        crowns: 1,
        status: "unlocked",
      },
      {
        id: 2,
        unit_id: 1,
        title: "Introductions",
        description: "Introduce yourself to someone new",
        order_index: 1,
        icon_name: "user-plus",
        levels: 5,
        crowns: 0,
        status: "unlocked",
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
        id: 3,
        unit_id: 2,
        title: "Common Phrases",
        description: "Everyday polite expressions",
        order_index: 0,
        icon_name: "message-2",
        levels: 5,
        crowns: 0,
        status: "locked",
      },
      {
        id: 4,
        unit_id: 2,
        title: "Questions",
        description: "Ask basic questions",
        order_index: 1,
        icon_name: "help-circle",
        levels: 5,
        crowns: 0,
        status: "locked",
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
        id: 5,
        unit_id: 3,
        title: "Food & Drink",
        description: "Name common foods and drinks",
        order_index: 0,
        icon_name: "cup",
        levels: 5,
        crowns: 0,
        status: "locked",
      },
      {
        id: 6,
        unit_id: 3,
        title: "Ordering",
        description: "Order food at a restaurant",
        order_index: 1,
        icon_name: "receipt",
        levels: 5,
        crowns: 0,
        status: "locked",
      },
    ],
  },
];
