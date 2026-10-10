import { Request, Response, NextFunction } from 'express';
import { ItineraryPlanner } from '../services/itinerary/itineraryPlanner';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class TripController {
  static async generate(req: Request, res: Response, next: NextFunction) {
    try {
      const generated = await ItineraryPlanner.generate(req.body);
      return sendSuccess(res, generated);
    } catch (err) {
      next(err);
    }
  }

  static async save(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const saved = await ItineraryPlanner.saveTrip(req.user!.id, req.body);
      return sendSuccess(res, saved, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getMyTrips(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const trips = await ItineraryPlanner.getUserTrips(req.user!.id);
      return sendSuccess(res, trips);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const trip = await ItineraryPlanner.getTripById(id, req.user?.id);
      return sendSuccess(res, trip);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await ItineraryPlanner.deleteTrip(id, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async createShare(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const result = await ItineraryPlanner.createShareLink(id, req.user!.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async getShared(req: Request, res: Response, next: NextFunction) {
    try {
      const shareToken = req.params.shareToken as string;
      const trip = await ItineraryPlanner.getSharedTrip(shareToken);
      return sendSuccess(res, trip);
    } catch (err) {
      next(err);
    }
  }
}
