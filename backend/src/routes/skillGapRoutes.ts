import { Router } from "express";
import { getSkillGap } from "../controllers/skillGapController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/", requireAuth, getSkillGap);

export default router;
