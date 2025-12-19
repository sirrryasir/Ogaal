import { Router } from 'express';
import AuthController from '../controllers/authController.js';

const router = Router();

// POST /auth/register
router.post('/register', AuthController.register);

// POST /auth/admin/register - for creating admin users
router.post('/admin/register', (req, res) => {
  // Set role to admin for admin registration
  req.body.role = 'admin';
  AuthController.register(req, res);
});

// POST /auth/login
router.post('/login', AuthController.login);

export default router;
