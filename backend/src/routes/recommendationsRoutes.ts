import { Router } from "express";
import { getRecommendations, updateRecommendationStatus } from "../controllers/recommendationsController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", getRecommendations);
router.put("/:id", updateRecommendationStatus);

export default router;
