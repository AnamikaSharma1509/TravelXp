import { Request, Response, NextFunction } from 'express';
import { DestinationService } from '../services/destination/destinationService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class DestinationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, region, category, state, featured } = req.query;
      const destinations = await DestinationService.getAll({
        search: search as string,
        region: region as string,
        category: category as string,
        state: state as string,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      });
      return sendSuccess(res, destinations);
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const destination = await DestinationService.getBySlug(slug);
      return sendSuccess(res, destination);
    } catch (err) {
      next(err);
    }
  }

  static async getMapMarkers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const markers = await DestinationService.getMapDestinations(req.user?.id);
      return sendSuccess(res, markers);
    } catch (err) {
      next(err);
    }
  }

  static async getRecommendations(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const recommendations = await DestinationService.getRecommendations(req.user?.id, limit);
      return sendSuccess(res, recommendations);
    } catch (err) {
      next(err);
    }
  }
}
