import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import destinationRoutes from './destinationRoutes';
import storyRoutes from './storyRoutes';
import bookingRoutes from './bookingRoutes';
import tripRoutes from './tripRoutes';
import adminRoutes from './adminRoutes';
import aiRoutes from './aiRoutes';
import contactRoutes from './contactRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/destinations', destinationRoutes);
router.use('/stories', storyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/trips', tripRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/contact', contactRoutes);

router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TravelXP Core Backend API',
    database: 'PostgreSQL Active',
  });
});

export default router;
