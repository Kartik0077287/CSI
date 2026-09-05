import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";
import { calculateSkillGap } from "../services/skillGapService";

export async function getSkillGap(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ message: "Profile not found" });

  const careerId = (req.query.careerId as string) || profile.targetCareerId;
  if (!careerId) {
    return res.status(400).json({ message: "Select a target career first to view your skill gap." });
  }

  const gap = await calculateSkillGap(profile.id, careerId);
  res.json({ gap });
}
