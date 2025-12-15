import { Router } from "express";
import handleUssdRequest from "../controllers/ussdController.js";
const router = Router();
router.post("/", handleUssdRequest);
export default router;
//# sourceMappingURL=ussdRoutes.js.map