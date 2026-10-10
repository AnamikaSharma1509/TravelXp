import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, UserController.getMe);
router.patch('/me', requireAuth, UserController.updateMe);
router.get('/me/preferences', requireAuth, UserController.getPreferences);
router.put('/me/preferences', requireAuth, UserController.updatePreferences);

export default router;
