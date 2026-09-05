import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import skillsRoutes from "./routes/skillsRoutes";
import careersRoutes from "./routes/careersRoutes";
import skillGapRoutes from "./routes/skillGapRoutes";
import recommendationsRoutes from "./routes/recommendationsRoutes";
import progressRoutes from "./routes/progressRoutes";
import adminRoutes from "./routes/adminRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SIH backend running on http://localhost:${PORT}`);
});
