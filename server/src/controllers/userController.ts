import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuthService } from '../services/auth/authService';
import { sendSuccess } from '../utils/response';
import { prisma } from '../db/prisma';

export class UserController {
  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getUserProfile(req.user!.id);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, displayName, preferredLanguage } = req.body;
      const updated = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(name ? { name } : {}),
          ...(displayName ? { displayName } : {}),
          ...(preferredLanguage ? { preferredLanguage } : {}),
        },
      });
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const prefs = await prisma.userPreference.findUnique({
        where: { userId: req.user!.id },
      });
      return sendSuccess(res, prefs);
    } catch (err) {
      next(err);
    }
  }

  static async updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await AuthService.updatePreferences(req.user!.id, req.body);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }
}
