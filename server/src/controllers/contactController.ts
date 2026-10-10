import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess } from '../utils/response';

export class ContactController {
  static async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message } = req.body;
      const record = await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message,
          status: 'RECEIVED',
        },
      });
      return sendSuccess(res, { received: true, id: record.id }, 201);
    } catch (err) {
      next(err);
    }
  }
}
