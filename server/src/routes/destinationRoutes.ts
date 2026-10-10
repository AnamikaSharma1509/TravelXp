import { Router } from 'express';
import { DestinationController } from '../controllers/destinationController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/', DestinationController.getAll);
router.get('/map', optionalAuth, DestinationController.getMapMarkers);
router.get('/recommendations', optionalAuth, DestinationController.getRecommendations);
router.get('/:slug', DestinationController.getBySlug);

export default router;
