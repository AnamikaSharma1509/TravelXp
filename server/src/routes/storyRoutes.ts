import { Router } from 'express';
import { StoryController } from '../controllers/storyController';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const router = Router();

const createStorySchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  destinationId: z.string().optional(),
  originalLanguage: z.string().default('en'),
  category: z.string().min(2),
  attributionPreference: z.enum(['DISPLAY_NAME', 'PSEUDONYM', 'ANONYMOUS']).optional(),
  authorDisplayName: z.string().optional(),
  approximatePeriod: z.string().optional(),
  sourceContextNotes: z.string().optional(),
});

router.get('/', StoryController.getAll);
router.post('/', optionalAuth, validateBody(createStorySchema), StoryController.create);
router.get('/my', requireAuth, StoryController.getMyStories);
router.get('/saved', requireAuth, StoryController.getMySaved);
router.get('/:id', StoryController.getById);
router.post('/:id/translate', StoryController.translate);
router.post('/:id/report', optionalAuth, StoryController.report);
router.post('/:id/save', requireAuth, StoryController.save);
router.delete('/:id/save', requireAuth, StoryController.unsave);

export default router;
