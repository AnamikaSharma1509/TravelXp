import { Request, Response, NextFunction } from 'express';
import { BookingRegistry } from '../services/booking/bookingRegistry';
import { sendSuccess } from '../utils/response';

export class BookingController {
  static async searchFlights(req: Request, res: Response, next: NextFunction) {
    try {
      const results = BookingRegistry.searchFlights(req.body);
      return sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async searchTrains(req: Request, res: Response, next: NextFunction) {
    try {
      const results = BookingRegistry.searchTrains(req.body);
      return sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async searchBuses(req: Request, res: Response, next: NextFunction) {
    try {
      const results = BookingRegistry.searchBuses(req.body);
      return sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async searchHotels(req: Request, res: Response, next: NextFunction) {
    try {
      const results = BookingRegistry.searchHotels(req.body);
      return sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async searchExperiences(req: Request, res: Response, next: NextFunction) {
    try {
      const results = BookingRegistry.searchExperiences(req.body);
      return sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getProviders(_req: Request, res: Response) {
    return sendSuccess(res, [
      { id: 'indigo', name: 'IndiGo Airlines', type: 'FLIGHT', status: 'ACTIVE_DEEP_LINK' },
      { id: 'airindia', name: 'Air India', type: 'FLIGHT', status: 'ACTIVE_DEEP_LINK' },
      { id: 'irctc', name: 'IRCTC (Indian Railways)', type: 'TRAIN', status: 'AUTHORIZED_PORTAL' },
      { id: 'redbus', name: 'RedBus', type: 'BUS', status: 'AUTHORIZED_PARTNER_LINK' },
      { id: 'booking', name: 'Booking.com', type: 'HOTEL', status: 'AFFILIATE_SEARCH' },
      { id: 'mmt', name: 'MakeMyTrip', type: 'HOTEL', status: 'DEEP_LINK' },
    ]);
  }
}
