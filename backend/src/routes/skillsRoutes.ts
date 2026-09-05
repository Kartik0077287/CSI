import { Router } from "express";
import { listAllSkills, listMySkills, addSkill, updateSkill, deleteSkill } from "../controllers/skillsController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/catalog", listAllSkills);
router.get("/", listMySkills);
router.post("/", addSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
