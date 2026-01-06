import express from "express";
import apiController from "../controllers/apiController.js";
import waterSourceController from "../controllers/waterSourceController.js";
const router = express.Router();
// Get all Regions
router.get("/regions", apiController.getRegions);
// Get all Districts
router.get("/districts", apiController.getDistricts);
// Get all Villages
router.get("/villages", apiController.getVillages);
// Get all Water Sources (with Village data)
router.get("/water-sources", waterSourceController.getAll);
// Submit Report (Agent App)
router.post("/reports", apiController.submitReport);
// Get Reports
router.get("/reports", apiController.getReports);
// Get Alerts
router.get("/alerts", apiController.getAlerts);
// Create Alert (Admin/AI)
router.post("/alerts", apiController.createAlert);
// Add Water Source (Dashboard)
router.post("/water-sources", apiController.addWaterSource);
// Send SMS Mock
router.post("/sms/send", apiController.sendSms);
// AI Simulation Endpoint
router.post("/ai/update-risk", apiController.updateRisk);
// Dashboard Stats
router.get("/stats", apiController.getDashboardStats);
// Analytics Data (Charts)
router.get("/analytics", apiController.getAnalyticsData);
// Admin Water Sources (hierarchical)
router.get("/admin/water-sources", apiController.getAdminWaterSources);
export default router;
//# sourceMappingURL=apiRoutes.js.map