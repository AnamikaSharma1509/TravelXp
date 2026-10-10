import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', AdminController.getStats);
router.get('/stories', AdminController.getStories);
router.patch('/stories/:id/moderate', AdminController.moderateStory);
router.get('/reports', AdminController.getReports);
router.patch('/reports/:id', AdminController.updateReport);
router.post('/destinations', AdminController.createDestination);

export default router;
