import { api } from "./api";
import type {
  User, StudentProfile, StudentSkill, Skill, Career,
  SkillGapResult, Recommendation, ProgressStats, ProgressEntry,
  AdminStudentRow, AdminAnalytics,
} from "../types";

// ---- Auth ----
export async function registerUser(payload: {
  name: string; email: string; password: string; confirmPassword: string;
  college?: string; course?: string; graduationYear?: number;
}) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/register", payload);
  return data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const { data } = await api.post<{ token: string; user: User }>("/auth/login", payload);
  return data;
}

// ---- Profile ----
export async function fetchProfile() {
  const { data } = await api.get<{ profile: StudentProfile }>("/profile");
  return data.profile;
}

export async function updateProfileApi(payload: Partial<StudentProfile>) {
  const { data } = await api.put<{ profile: StudentProfile; message: string }>("/profile", payload);
  return data;
}

export async function fetchProfileCompletion() {
  const { data } = await api.get<{ completion: number }>("/profile/completion");
  return data.completion;
}

// ---- Skills ----
export async function fetchSkillCatalog() {
  const { data } = await api.get<{ skills: Skill[] }>("/skills/catalog");
  return data.skills;
}

export async function fetchMySkills() {
  const { data } = await api.get<{ skills: StudentSkill[] }>("/skills");
  return data.skills;
}

export async function addSkillApi(payload: {
  skillName: string; category: string; level: string; experience: number;
}) {
  const { data } = await api.post<{ skill: StudentSkill; message: string }>("/skills", payload);
  return data;
}

export async function updateSkillApi(id: string, payload: Partial<{
  level: string; proficiency: number; experience: number; verified: boolean;
}>) {
  const { data } = await api.put<{ skill: StudentSkill; message: string }>(`/skills/${id}`, payload);
  return data;
}

export async function deleteSkillApi(id: string) {
  const { data } = await api.delete<{ message: string }>(`/skills/${id}`);
  return data;
}

// ---- Careers ----
export async function fetchCareers() {
  const { data } = await api.get<{ careers: Career[] }>("/careers");
  return data.careers;
}

export async function selectCareerApi(careerId: string) {
  const { data } = await api.post<{ profile: StudentProfile; message: string }>("/careers/select", { careerId });
  return data;
}

// ---- Skill Gap ----
export async function fetchSkillGap(careerId?: string) {
  const { data } = await api.get<{ gap: SkillGapResult }>("/skill-gap", {
    params: careerId ? { careerId } : undefined,
  });
  return data.gap;
}

// ---- Recommendations ----
export async function fetchRecommendations() {
  const { data } = await api.get<{ recommendations: Recommendation[] }>("/recommendations");
  return data.recommendations;
}

export async function updateRecommendationApi(id: string, status: string) {
  const { data } = await api.put<{ recommendation: Recommendation; message: string }>(`/recommendations/${id}`, { status });
  return data;
}

// ---- Progress ----
export async function fetchProgress() {
  const { data } = await api.get<{ stats: ProgressStats; history: ProgressEntry[] }>("/progress");
  return data;
}

// ---- Admin ----
export async function fetchAdminStudents() {
  const { data } = await api.get<{ students: AdminStudentRow[] }>("/admin/students");
  return data.students;
}

export async function toggleStudentStatusApi(id: string) {
  const { data } = await api.put<{ message: string }>(`/admin/students/${id}/status`, {});
  return data;
}

export async function deleteStudentApi(id: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/students/${id}`);
  return data;
}

export async function fetchAdminAnalytics() {
  const { data } = await api.get<AdminAnalytics>("/admin/analytics");
  return data;
}

export async function createSkillAdminApi(payload: { name: string; category: string }) {
  const { data } = await api.post<{ skill: Skill; message: string }>("/admin/skills", payload);
  return data;
}

export async function updateSkillAdminApi(id: string, payload: { name: string; category: string }) {
  const { data } = await api.put<{ skill: Skill; message: string }>(`/admin/skills/${id}`, payload);
  return data;
}

export async function deleteSkillAdminApi(id: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/skills/${id}`);
  return data;
}

export async function createCareerAdminApi(payload: {
  name: string; description: string; industry: string; difficulty?: string;
  requiredSkills?: Array<{ skillId: string; requiredProficiency: number; importance: string }>;
}) {
  const { data } = await api.post<{ career: Career; message: string }>("/admin/careers", payload);
  return data;
}

export async function updateCareerAdminApi(id: string, payload: Partial<{
  name: string; description: string; industry: string; difficulty: string;
}>) {
  const { data } = await api.put<{ career: Career; message: string }>(`/admin/careers/${id}`, payload);
  return data;
}

export async function deleteCareerAdminApi(id: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/careers/${id}`);
  return data;
}

export async function upsertCareerSkillApi(careerId: string, payload: {
  skillId: string; requiredProficiency: number; importance: string;
}) {
  const { data } = await api.put(`/admin/careers/${careerId}/skills`, payload);
  return data;
}

export async function removeCareerSkillApi(careerId: string, skillId: string) {
  const { data } = await api.delete(`/admin/careers/${careerId}/skills/${skillId}`);
  return data;
}
