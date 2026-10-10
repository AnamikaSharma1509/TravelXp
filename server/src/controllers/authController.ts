import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/authService';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async google(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, googleId } = req.body;
      const result = await AuthService.googleAuth({
        email: email || 'traveler@gmail.com',
        name: name || 'Google Traveler',
        googleId: googleId || `google_${Date.now()}`,
      });
      return sendSuccess(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token);
      return sendSuccess(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return sendSuccess(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      const result = await AuthService.resetPassword(token, newPassword);
      return sendSuccess(res, result, 200);
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendSuccess(res, null);
      }
      const user = await AuthService.getUserProfile(req.user.id);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  static async logout(_req: Request, res: Response) {
    return sendSuccess(res, { loggedOut: true });
  }
}
