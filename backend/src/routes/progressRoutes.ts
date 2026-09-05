import { Router } from "express";
import { getProgress } from "../controllers/progressController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.get("/", requireAuth, getProgress);

export default router;
