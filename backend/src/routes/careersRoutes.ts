import { Router } from "express";
import { listCareers, getCareer, selectCareer } from "../controllers/careersController";
import { requireAuth } from "../middleware/auth";

const router = Router();
router.use(requireAuth);
router.get("/", listCareers);
router.get("/:id", getCareer);
router.post("/select", selectCareer);

export default router;
