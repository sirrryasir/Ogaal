import { Router } from "express";
import InterventionController from "../controllers/interventionController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/", authenticate, InterventionController.getAll);
router.post("/", authenticate, authorize(["ADMIN", "GOVERNMENT", "NGO_WORKER"]), InterventionController.create);
router.put("/:id/status", authenticate, authorize(["ADMIN", "GOVERNMENT", "NGO_WORKER"]), InterventionController.updateStatus);
export default router;
//# sourceMappingURL=interventionRoutes.js.map