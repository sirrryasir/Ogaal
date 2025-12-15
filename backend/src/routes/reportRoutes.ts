import { Router } from "express";
import ReportController from "../controllers/reportController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticate, ReportController.getAll);
router.post("/", ReportController.create); // Public/App submission (can be authenticated or not depending on use case, allowing unauth for now for broader access or separate endpoint)
// Actually, let's make it authenticated if possible, but for 'App' likely authenticated.
// For USSD, it might come via a different gateway. Let's allow authenticated creation generally.
// But wait, create modifies 'req.user' if present.
// Let's add 'authenticate' but make it optional?
// Current authenticate middleware returns 401 if no token.
// Creating a separate "optionalAuthenticate" might be overkill.
// For now, assume App users are logged in.
router.post("/secure", authenticate, ReportController.create);

router.put(
  "/:id/verify",
  authenticate,
  authorize(["ADMIN", "GOVERNMENT", "NGO_WORKER"]),
  ReportController.verifyReport
);

export default router;
