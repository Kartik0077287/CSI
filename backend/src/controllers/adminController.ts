import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";
import { calculateSkillGap } from "../services/skillGapService";

export async function getStudents(req: AuthRequest, res: Response) {
  const profiles = await prisma.studentProfile.findMany({
    include: { user: true, targetCareer: true, skills: true },
    orderBy: { createdAt: "desc" },
  });

  const results = [];
  for (const p of profiles) {
    let readiness: number | null = null;
    if (p.targetCareerId) {
      const gap = await calculateSkillGap(p.id, p.targetCareerId);
      readiness = gap.readiness;
    }
    results.push({
      id: p.id,
      userId: p.userId,
      name: p.user.name,
      email: p.user.email,
      college: p.college,
      career: p.targetCareer?.name ?? "Not selected",
      readiness,
      skillCount: p.skills.length,
      status: p.status,
    });
  }
  res.json({ students: results });
}

export async function deactivateStudent(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const profile = await prisma.studentProfile.findUnique({ where: { id } });
  if (!profile) return res.status(404).json({ message: "Student not found" });

  const updated = await prisma.studentProfile.update({
    where: { id },
    data: { status: profile.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
  });
  res.json({ profile: updated, message: "Student status updated." });
}

export async function deleteStudent(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const profile = await prisma.studentProfile.findUnique({ where: { id } });
  if (!profile) return res.status(404).json({ message: "Student not found" });
  await prisma.user.delete({ where: { id: profile.userId } });
  res.json({ message: "Student deleted." });
}

export async function getAnalytics(req: AuthRequest, res: Response) {
  const totalStudents = await prisma.studentProfile.count();
  const totalSkills = await prisma.skill.count();
  const totalCareers = await prisma.career.count();

  const profiles = await prisma.studentProfile.findMany();
  let readinessSum = 0;
  let readinessCount = 0;
  const gapCounter = new Map<string, number>();

  for (const p of profiles) {
    if (p.targetCareerId) {
      const gap = await calculateSkillGap(p.id, p.targetCareerId);
      readinessSum += gap.readiness;
      readinessCount++;
      for (const w of gap.weakSkills) {
        gapCounter.set(w.skillName, (gapCounter.get(w.skillName) ?? 0) + 1);
      }
    }
  }
  const avgReadiness = readinessCount ? Math.round(readinessSum / readinessCount) : 0;

  const mostCommonGap = [...gapCounter.entries()].sort((a, b) => b[1] - a[1])[0];

  const studentGrowth = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  const growthByMonth = new Map<string, number>();
  let running = 0;
  for (const s of studentGrowth) {
    const key = s.createdAt.toISOString().slice(0, 7);
    running++;
    growthByMonth.set(key, running);
  }

  const careerDistribution = await prisma.studentProfile.groupBy({
    by: ["targetCareerId"],
    _count: { targetCareerId: true },
  });
  const careers = await prisma.career.findMany();
  const careerDistLabeled = careerDistribution
    .filter((c) => c.targetCareerId)
    .map((c) => ({
      career: careers.find((car) => car.id === c.targetCareerId)?.name ?? "Unknown",
      count: c._count.targetCareerId,
    }));

  const gapChart = [...gapCounter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  res.json({
    stats: {
      totalStudents,
      totalSkills,
      totalCareers,
      avgReadiness,
      mostCommonGap: mostCommonGap ? mostCommonGap[0] : "N/A",
    },
    charts: {
      studentGrowth: [...growthByMonth.entries()].map(([month, count]) => ({ month, count })),
      skillGaps: gapChart,
      careerDistribution: careerDistLabeled,
    },
  });
}

// --- Skill management ---
export async function createSkill(req: AuthRequest, res: Response) {
  const { name, category } = req.body;
  if (!name || !category) return res.status(400).json({ message: "Name and category are required" });
  const existing = await prisma.skill.findUnique({ where: { name } });
  if (existing) return res.status(409).json({ message: "Skill already exists" });
  const skill = await prisma.skill.create({ data: { name, category } });
  res.status(201).json({ skill, message: "Skill created." });
}

export async function updateSkillAdmin(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { name, category } = req.body;
  const skill = await prisma.skill.update({ where: { id }, data: { name, category } });
  res.json({ skill, message: "Skill updated." });
}

export async function deleteSkillAdmin(req: AuthRequest, res: Response) {
  const { id } = req.params;
  await prisma.skill.delete({ where: { id } });
  res.json({ message: "Skill deleted." });
}

// --- Career management ---
export async function createCareer(req: AuthRequest, res: Response) {
  const { name, description, industry, difficulty, requiredSkills } = req.body;
  if (!name || !description || !industry) {
    return res.status(400).json({ message: "Name, description, and industry are required" });
  }
  const career = await prisma.career.create({
    data: {
      name, description, industry,
      difficulty: difficulty || "Medium",
      requiredSkills: {
        create: (requiredSkills || []).map((rs: any) => ({
          skillId: rs.skillId,
          requiredProficiency: Number(rs.requiredProficiency),
          importance: rs.importance || "MEDIUM",
        })),
      },
    },
    include: { requiredSkills: { include: { skill: true } } },
  });
  res.status(201).json({ career, message: "Career created." });
}

export async function updateCareer(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { name, description, industry, difficulty } = req.body;
  const career = await prisma.career.update({
    where: { id },
    data: { name, description, industry, difficulty },
  });
  res.json({ career, message: "Career updated." });
}

export async function deleteCareer(req: AuthRequest, res: Response) {
  const { id } = req.params;
  await prisma.career.delete({ where: { id } });
  res.json({ message: "Career deleted." });
}

// Update or add a required skill for a career - this is what lets an admin
// change requirements and have all student skill-gap calculations reflect it live.
export async function upsertCareerSkill(req: AuthRequest, res: Response) {
  const { id } = req.params; // career id
  const { skillId, requiredProficiency, importance } = req.body;
  if (!skillId || requiredProficiency === undefined) {
    return res.status(400).json({ message: "skillId and requiredProficiency are required" });
  }

  const careerSkill = await prisma.careerSkill.upsert({
    where: { careerId_skillId: { careerId: id, skillId } },
    update: { requiredProficiency: Number(requiredProficiency), importance: importance || "MEDIUM" },
    create: { careerId: id, skillId, requiredProficiency: Number(requiredProficiency), importance: importance || "MEDIUM" },
    include: { skill: true },
  });

  res.json({ careerSkill, message: "Career skill requirement updated." });
}

export async function removeCareerSkill(req: AuthRequest, res: Response) {
  const { id, skillId } = req.params;
  await prisma.careerSkill.delete({ where: { careerId_skillId: { careerId: id, skillId } } });
  res.json({ message: "Requirement removed." });
}
