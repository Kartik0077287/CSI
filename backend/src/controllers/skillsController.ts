import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";
import { scoreToLevel, levelToBaseScore } from "../utils/proficiency";

async function getOrCreateProfileId(userId: string) {
  let profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) profile = await prisma.studentProfile.create({ data: { userId } });
  return profile.id;
}

export async function listAllSkills(req: AuthRequest, res: Response) {
  const skills = await prisma.skill.findMany({ orderBy: { name: "asc" } });
  res.json({ skills });
}

export async function listMySkills(req: AuthRequest, res: Response) {
  const profileId = await getOrCreateProfileId(req.user!.userId);
  const skills = await prisma.studentSkill.findMany({
    where: { studentId: profileId },
    include: { skill: true },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ skills });
}

export async function addSkill(req: AuthRequest, res: Response) {
  const profileId = await getOrCreateProfileId(req.user!.userId);
  const { skillName, category, level, experience } = req.body;

  if (!skillName || !category || !level) {
    return res.status(400).json({ message: "Skill, category, and proficiency are required" });
  }

  let skill = await prisma.skill.findUnique({ where: { name: skillName } });
  if (!skill) {
    skill = await prisma.skill.create({ data: { name: skillName, category } });
  }

  const existing = await prisma.studentSkill.findUnique({
    where: { studentId_skillId: { studentId: profileId, skillId: skill.id } },
  });
  if (existing) {
    return res.status(409).json({ message: "You already have this skill. Edit it instead." });
  }

  const proficiency = levelToBaseScore(level);
  const created = await prisma.studentSkill.create({
    data: {
      studentId: profileId,
      skillId: skill.id,
      proficiency,
      level,
      experience: Number(experience) || 0,
    },
    include: { skill: true },
  });

  res.status(201).json({ skill: created, message: "Skill added successfully." });
}

export async function updateSkill(req: AuthRequest, res: Response) {
  const profileId = await getOrCreateProfileId(req.user!.userId);
  const { id } = req.params;
  const { level, proficiency, experience, verified } = req.body;

  const existing = await prisma.studentSkill.findFirst({ where: { id, studentId: profileId } });
  if (!existing) return res.status(404).json({ message: "Skill not found" });

  let newProficiency = existing.proficiency;
  if (proficiency !== undefined) newProficiency = Number(proficiency);
  else if (level) newProficiency = levelToBaseScore(level);

  const updated = await prisma.studentSkill.update({
    where: { id },
    data: {
      level: level ?? scoreToLevel(newProficiency),
      proficiency: newProficiency,
      experience: experience !== undefined ? Number(experience) : undefined,
      verified: verified !== undefined ? Boolean(verified) : undefined,
    },
    include: { skill: true },
  });

  if (updated.proficiency !== existing.proficiency) {
    await prisma.progress.create({
      data: {
        studentId: profileId,
        skillId: existing.skillId,
        oldProficiency: existing.proficiency,
        newProficiency: updated.proficiency,
      },
    });
  }

  res.json({ skill: updated, message: "Skill updated successfully." });
}

export async function deleteSkill(req: AuthRequest, res: Response) {
  const profileId = await getOrCreateProfileId(req.user!.userId);
  const { id } = req.params;
  const existing = await prisma.studentSkill.findFirst({ where: { id, studentId: profileId } });
  if (!existing) return res.status(404).json({ message: "Skill not found" });

  await prisma.studentSkill.delete({ where: { id } });
  res.json({ message: "Skill deleted." });
}
