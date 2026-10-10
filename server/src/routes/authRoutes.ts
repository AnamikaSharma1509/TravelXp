import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { optionalAuth } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  displayName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.post('/google', AuthController.google);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', optionalAuth, AuthController.me);
router.post('/logout', AuthController.logout);

export default router;
