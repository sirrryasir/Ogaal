import { Router } from 'express';
import AuthController from '../controllers/authController.js';
const router = Router();
// POST /auth/register
router.post('/register', AuthController.register);
// POST /auth/login
router.post('/login', AuthController.login);
export default router;
//# sourceMappingURL=authRoutes.js.map