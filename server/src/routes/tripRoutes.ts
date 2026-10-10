import { Router } from 'express';
import { TripController } from '../controllers/tripController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/generate', TripController.generate);
router.post('/', requireAuth, TripController.save);
router.get('/', requireAuth, TripController.getMyTrips);
router.get('/:id', optionalAuth, TripController.getById);
router.delete('/:id', requireAuth, TripController.delete);
router.post('/:id/share', requireAuth, TripController.createShare);
router.get('/shared/:shareToken', TripController.getShared);

export default router;
