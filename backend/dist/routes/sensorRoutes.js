import { Router } from "express";
import SensorController from "../controllers/sensorController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = Router();
// Devices might use a different auth or API key, but for now we can use standard auth or public for simulation
router.post("/", SensorController.reportData);
router.get("/:id/history", authenticate, SensorController.getHistory);
export default router;
//# sourceMappingURL=sensorRoutes.js.map