import { Proficiency } from "@prisma/client";

export function scoreToLevel(score: number): Proficiency {
  if (score >= 90) return "EXPERT";
  if (score >= 70) return "ADVANCED";
  if (score >= 40) return "INTERMEDIATE";
  return "BEGINNER";
}

export function levelToBaseScore(level: Proficiency): number {
  switch (level) {
    case "EXPERT":
      return 90;
    case "ADVANCED":
      return 70;
    case "INTERMEDIATE":
      return 40;
    default:
      return 15;
  }
}
