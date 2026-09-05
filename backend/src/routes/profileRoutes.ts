import { Router } from "express";
import { getProfile, updateProfile, getProfileCompletion } from "../controllers/profileController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", getProfile);
router.put("/", updateProfile);
router.get("/completion", getProfileCompletion);

export default router;
