import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";

export async function getProgress(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) return res.status(404).json({ message: "Profile not found" });

  const history = await prisma.progress.findMany({
    where: { studentId: profile.id },
    include: { skill: true },
    orderBy: { updatedAt: "asc" },
  });

  const completedRecs = await prisma.recommendation.count({
    where: { studentId: profile.id, status: "COMPLETED" },
  });
  const inProgressRecs = await prisma.recommendation.count({
    where: { studentId: profile.id, status: "IN_PROGRESS" },
  });

  const skillsImproved = new Set(history.map((h) => h.skillId)).size;

  // Learning hours are approximated from experience recorded on skills,
  // and streak is derived from distinct days with progress activity.
  const skills = await prisma.studentSkill.findMany({ where: { studentId: profile.id } });
  const learningHours = Math.round(skills.reduce((sum, s) => sum + s.experience, 0) * 10) / 10;

  const days = new Set(history.map((h) => h.updatedAt.toISOString().slice(0, 10)));
  const streak = days.size;

  res.json({
    stats: {
      skillsImproved,
      coursesCompleted: completedRecs,
      projectsCompleted: await prisma.recommendation.count({
        where: { studentId: profile.id, status: "COMPLETED", type: "PROJECT" },
      }),
      learningHours,
      currentStreak: streak,
      inProgress: inProgressRecs,
    },
    history,
  });
}
