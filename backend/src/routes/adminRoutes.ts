import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  getStudents, deactivateStudent, deleteStudent, getAnalytics,
  createSkill, updateSkillAdmin, deleteSkillAdmin,
  createCareer, updateCareer, deleteCareer,
  upsertCareerSkill, removeCareerSkill,
} from "../controllers/adminController";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));

router.get("/students", getStudents);
router.put("/students/:id/status", deactivateStudent);
router.delete("/students/:id", deleteStudent);

router.get("/analytics", getAnalytics);

router.post("/skills", createSkill);
router.put("/skills/:id", updateSkillAdmin);
router.delete("/skills/:id", deleteSkillAdmin);

router.post("/careers", createCareer);
router.put("/careers/:id", updateCareer);
router.delete("/careers/:id", deleteCareer);
router.put("/careers/:id/skills", upsertCareerSkill);
router.delete("/careers/:id/skills/:skillId", removeCareerSkill);

export default router;
