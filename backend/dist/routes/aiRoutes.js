import { Router } from "express";
import AIController from "../controllers/aiController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/forecast", authenticate, AIController.getForecast);
router.post("/forecast", AIController.saveForecast); // Called by AI Engine service (internal or secured via key)
export default router;
//# sourceMappingURL=aiRoutes.js.map