import express from "express";
import cors from "cors";
import ussdRoutes from "./routes/ussdRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import waterSourceRoutes from "./routes/waterSourceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/ussd", ussdRoutes);
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/water-sources", waterSourceRoutes);
app.use("/api/reports", reportRoutes);
app.get("/", (req, res) => {
    res.send("Ogaal Backend Running");
});
export default app;
//# sourceMappingURL=app.js.map