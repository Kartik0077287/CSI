import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { prisma } from "../utils/prisma";

async function ensureProfile(userId: string) {
  let profile = await prisma.studentProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.studentProfile.create({ data: { userId } });
  }
  return profile;
}

export async function getProfile(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const profile = await ensureProfile(userId);
  const full = await prisma.studentProfile.findUnique({
    where: { userId },
    include: { targetCareer: true },
  });
  res.json({ profile: { ...full, name: user?.name, email: user?.email } });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  await ensureProfile(userId);

  const {
    name, phone, location, photoUrl,
    college, degree, branch, graduationYear, cgpa,
    bio, preferredIndustry, experienceLevel,
  } = req.body;

  if (name) {
    await prisma.user.update({ where: { id: userId }, data: { name } });
  }

  const updated = await prisma.studentProfile.update({
    where: { userId },
    data: {
      phone, location, photoUrl,
      college, degree, branch,
      graduationYear: graduationYear !== undefined ? Number(graduationYear) : undefined,
      cgpa: cgpa !== undefined ? Number(cgpa) : undefined,
      bio, preferredIndustry, experienceLevel,
    },
  });

  res.json({ profile: updated, message: "Profile updated successfully." });
}

// Simple, transparent profile-completion calculation based on filled fields.
export async function getProfileCompletion(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const profile = await ensureProfile(userId);
  const fields = [
    profile.phone, profile.location, profile.college, profile.degree,
    profile.branch, profile.graduationYear, profile.cgpa, profile.bio,
    profile.preferredIndustry, profile.experienceLevel, profile.targetCareerId,
  ];
  const filled = fields.filter((f) => f !== null && f !== undefined && f !== "").length;
  const completion = Math.round((filled / fields.length) * 100);
  res.json({ completion });
}
