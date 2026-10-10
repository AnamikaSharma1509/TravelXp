import { Router, Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai/aiService';
import { sendSuccess } from '../utils/response';

const router = Router();

router.post('/explain', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AIService.explainCulture(req.body);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
});

router.post('/translate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AIService.translateStoryContent(req.body);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
});

export default router;
