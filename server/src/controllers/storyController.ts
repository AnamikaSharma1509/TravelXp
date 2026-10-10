import { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/story/storyService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class StoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, destinationSlug, language, category, page, limit } = req.query;
      const result = await StoryService.getStories({
        search: search as string,
        destinationSlug: destinationSlug as string,
        language: language as string,
        category: category as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 12,
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const story = await StoryService.getById(id);
      return sendSuccess(res, story);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const story = await StoryService.create(req.body, req.user?.id);
      return sendSuccess(res, story, 201);
    } catch (err) {
      next(err);
    }
  }

  static async translate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { language } = req.body;
      const translation = await StoryService.translateStory(id, language || 'en');
      return sendSuccess(res, translation);
    } catch (err) {
      next(err);
    }
  }

  static async report(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { reason, details } = req.body;
      const report = await StoryService.reportStory(id, reason, details, req.user?.id);
      return sendSuccess(res, report, 201);
    } catch (err) {
      next(err);
    }
  }

  static async save(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await StoryService.saveStory(id, req.user!.id);
      return sendSuccess(res, { saved: true });
    } catch (err) {
      next(err);
    }
  }

  static async unsave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await StoryService.unsaveStory(id, req.user!.id);
      return sendSuccess(res, { saved: false });
    } catch (err) {
      next(err);
    }
  }

  static async getMyStories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stories = await StoryService.getUserStories(req.user!.id);
      return sendSuccess(res, stories);
    } catch (err) {
      next(err);
    }
  }

  static async getMySaved(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stories = await StoryService.getUserSaved(req.user!.id);
      return sendSuccess(res, stories);
    } catch (err) {
      next(err);
    }
  }
}
