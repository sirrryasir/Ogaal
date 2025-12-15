import { Router } from "express";
import WaterSourceController from "../controllers/waterSourceController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

// Public read
router.get("/", WaterSourceController.getAll);

// Protected write
router.post(
  "/",
  authenticate,
  authorize(["ADMIN", "GOVERNMENT", "NGO_WORKER"]),
  WaterSourceController.create
);
router.put(
  "/:id/status",
  authenticate,
  authorize(["ADMIN", "GOVERNMENT", "NGO_WORKER"]),
  WaterSourceController.updateStatus
);

export default router;
