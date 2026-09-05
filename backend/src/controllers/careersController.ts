import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";

export async function listCareers(req: AuthRequest, res: Response) {
  const careers = await prisma.career.findMany({
    include: { requiredSkills: { include: { skill: true } } },
    orderBy: { name: "asc" },
  });
  res.json({ careers });
}

export async function getCareer(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const career = await prisma.career.findUnique({
    where: { id },
    include: { requiredSkills: { include: { skill: true } } },
  });
  if (!career) return res.status(404).json({ message: "Career not found" });
  res.json({ career });
}

export async function selectCareer(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const { careerId } = req.body;
  if (!careerId) return res.status(400).json({ message: "careerId is required" });

  const career = await prisma.career.findUnique({ where: { id: careerId } });
  if (!career) return res.status(404).json({ message: "Career not found" });

  let profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) profile = await prisma.studentProfile.create({ data: { userId } });

  const updated = await prisma.studentProfile.update({
    where: { userId },
    data: { targetCareerId: careerId },
  });

  res.json({ profile: updated, message: "Career goal updated." });
}
