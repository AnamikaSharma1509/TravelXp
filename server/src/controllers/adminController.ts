import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class AdminController {
  static async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const [destinationsCount, storiesCount, usersCount, pendingReportsCount, pendingStoriesCount] =
        await Promise.all([
          prisma.destination.count(),
          prisma.story.count({ where: { publicationStatus: 'PUBLISHED' } }),
          prisma.user.count(),
          prisma.storyReport.count({ where: { status: 'PENDING' } }),
          prisma.story.count({ where: { moderationStatus: 'PENDING' } }),
        ]);

      return sendSuccess(res, {
        destinationsCount,
        storiesCount,
        usersCount,
        pendingReportsCount,
        pendingStoriesCount,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const where: any = {};
      if (status && status !== 'ALL') {
        where.moderationStatus = status as string;
      }
      const stories = await prisma.story.findMany({
        where,
        include: {
          destination: { select: { id: true, name: true } },
          reports: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return sendSuccess(res, stories);
    } catch (err) {
      next(err);
    }
  }

  static async moderateStory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body; // APPROVED, REJECTED
      const updated = await prisma.story.update({
        where: { id },
        data: {
          moderationStatus: status,
          publicationStatus: status === 'APPROVED' ? 'PUBLISHED' : 'REJECTED',
        },
      });
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async getReports(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const reports = await prisma.storyReport.findMany({
        include: {
          story: { select: { id: true, title: true, authorDisplayName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return sendSuccess(res, reports);
    } catch (err) {
      next(err);
    }
  }

  static async updateReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = await prisma.storyReport.update({
        where: { id },
        data: { status },
      });
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async createDestination(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const d = req.body;
      const created = await prisma.destination.create({
        data: {
          name: d.name,
          slug: d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          state: d.state,
          region: d.region || 'North',
          latitude: parseFloat(d.latitude),
          longitude: parseFloat(d.longitude),
          description: d.description,
          heroImage: d.heroImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
          categories: typeof d.categories === 'string' ? d.categories : JSON.stringify(d.categories || ['Heritage']),
          bestTimeToVisit: d.bestTimeToVisit || 'October to March',
          estimatedBudget: d.estimatedBudget || '₹2,500 - ₹5,000 / day',
          verificationStatus: 'VERIFIED',
          featured: !!d.featured,
        },
      });
      return sendSuccess(res, created, 201);
    } catch (err) {
      next(err);
    }
  }
}
