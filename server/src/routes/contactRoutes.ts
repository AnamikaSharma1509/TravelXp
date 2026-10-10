import { Router } from 'express';
import { ContactController } from '../controllers/contactController';
import { z } from 'zod';
import { validateBody } from '../middleware/validate';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

router.post('/', validateBody(contactSchema), ContactController.submit);

export default router;
