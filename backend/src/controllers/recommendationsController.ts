import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";
import { calculateSkillGap, deriveRecommendations } from "../services/skillGapService";

// Regenerates recommendations from the latest skill-gap calculation and
// upserts them, preserving status for skills that already have a recommendation.
export async function getRecommendations(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  if (!profile.targetCareerId) {
    return res.json({ recommendations: [] });
  }

  const gap = await calculateSkillGap(profile.id, profile.targetCareerId);
  const derived = deriveRecommendations(gap);

  const results = [];
  for (const d of derived) {
    const existing = await prisma.recommendation.findFirst({
      where: { studentId: profile.id, skillId: d.skillId },
    });
    if (existing) {
      const updated = await prisma.recommendation.update({
        where: { id: existing.id },
        data: { type: d.type, priority: d.priority, reason: d.reason },
        include: { skill: true },
      });
      results.push(updated);
    } else {
      const created = await prisma.recommendation.create({
        data: {
          studentId: profile.id,
          skillId: d.skillId,
          type: d.type,
          priority: d.priority,
          reason: d.reason,
          status: "NOT_STARTED",
        },
        include: { skill: true },
      });
      results.push(created);
    }
  }

  // Remove stale recommendations for skills no longer in the gap list
  const activeSkillIds = derived.map((d) => d.skillId);
  await prisma.recommendation.deleteMany({
    where: { studentId: profile.id, skillId: { notIn: activeSkillIds.length ? activeSkillIds : [""] } },
  });

  res.json({ recommendations: results });
}

export async function updateRecommendationStatus(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { status } = req.body;

  if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ message: "Profile not found" });

  const rec = await prisma.recommendation.findFirst({ where: { id, studentId: profile.id } });
  if (!rec) return res.status(404).json({ message: "Recommendation not found" });

  const updated = await prisma.recommendation.update({
    where: { id },
    data: { status },
    include: { skill: true },
  });

  res.json({ recommendation: updated, message: "Recommendation marked as " + status.toLowerCase().replace("_", " ") + "." });
}
