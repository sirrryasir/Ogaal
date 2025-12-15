import express from "express";
import cors from "cors";
import ussdRoutes from "./routes/ussdRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import waterSourceRoutes from "./routes/waterSourceRoutes.js";
import interventionRoutes from "./routes/interventionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/ussd", ussdRoutes);
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/water-sources", waterSourceRoutes);
app.use("/api/interventions", interventionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("AquaGuard Backend Running");
});

export default app;
