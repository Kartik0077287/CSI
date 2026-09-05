export type Role = "STUDENT" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type ProficiencyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type Importance = "LOW" | "MEDIUM" | "HIGH";
export type RecType = "LEARN" | "PRACTICE" | "PROJECT" | "CERTIFICATION";
export type RecStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillId: string;
  proficiency: number;
  level: ProficiencyLevel;
  experience: number;
  verified: boolean;
  skill: Skill;
}

export interface CareerSkill {
  id: string;
  careerId: string;
  skillId: string;
  requiredProficiency: number;
  importance: Importance;
  skill: Skill;
}

export interface Career {
  id: string;
  name: string;
  description: string;
  industry: string;
  difficulty: string;
  requiredSkills: CareerSkill[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string | null;
  location?: string | null;
  photoUrl?: string | null;
  college?: string | null;
  degree?: string | null;
  branch?: string | null;
  graduationYear?: number | null;
  cgpa?: number | null;
  bio?: string | null;
  preferredIndustry?: string | null;
  experienceLevel?: string | null;
  targetCareerId?: string | null;
  targetCareer?: Career | null;
  status?: string;
}

export interface SkillGapEntry {
  skillId: string;
  skillName: string;
  category: string;
  current: number;
  required: number;
  gap: number;
  importance: Importance;
  status: "sufficient" | "moderate" | "major";
}

export interface SkillGapResult {
  careerId: string;
  careerName: string;
  readiness: number;
  overallGap: number;
  entries: SkillGapEntry[];
  strongSkills: SkillGapEntry[];
  weakSkills: SkillGapEntry[];
  priority: Array<{ skillName: string; priority: string; gap: number }>;
}

export interface Recommendation {
  id: string;
  studentId: string;
  skillId: string;
  skill: Skill;
  type: RecType;
  priority: string;
  status: RecStatus;
  reason: string;
}

export interface ProgressEntry {
  id: string;
  skillId: string;
  skill: Skill;
  oldProficiency: number;
  newProficiency: number;
  updatedAt: string;
}

export interface ProgressStats {
  skillsImproved: number;
  coursesCompleted: number;
  projectsCompleted: number;
  learningHours: number;
  currentStreak: number;
  inProgress: number;
}

export interface AdminStudentRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  college?: string | null;
  career: string;
  readiness: number | null;
  skillCount: number;
  status: string;
}

export interface AdminAnalytics {
  stats: {
    totalStudents: number;
    totalSkills: number;
    totalCareers: number;
    avgReadiness: number;
    mostCommonGap: string;
  };
  charts: {
    studentGrowth: Array<{ month: string; count: number }>;
    skillGaps: Array<{ skill: string; count: number }>;
    careerDistribution: Array<{ career: string; count: number }>;
  };
}
