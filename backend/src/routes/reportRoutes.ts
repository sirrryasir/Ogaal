import { Router } from "express";
import ReportController from "../controllers/reportController.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticate, ReportController.getAll);
router.post("/", ReportController.create); // Allow public submission
router.post("/secure", authenticate, ReportController.create); // Authenticated submission

router.put("/:id/verify", ReportController.verifyReport);

router.delete("/:id", ReportController.deleteReport);

export default router;
