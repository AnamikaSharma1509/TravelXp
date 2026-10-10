import { prisma } from '../../db/prisma';
import { AIService } from '../ai/aiService';

export interface StoryFilter {
  search?: string;
  destinationSlug?: string;
  language?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export class StoryService {
  static async getStories(filters: StoryFilter = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(50, Math.max(1, filters.limit || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      publicationStatus: 'PUBLISHED',
      visibility: 'PUBLIC',
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { body: { contains: filters.search, mode: 'insensitive' } },
        { authorDisplayName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.destinationSlug) {
      where.destination = { slug: filters.destinationSlug };
    }

    if (filters.language && filters.language !== 'All') {
      where.originalLanguage = filters.language;
    }

    if (filters.category && filters.category !== 'All') {
      where.category = filters.category;
    }

    const [total, stories] = await Promise.all([
      prisma.story.count({ where }),
      prisma.story.findMany({
        where,
        include: {
          destination: {
            select: { id: true, name: true, slug: true, state: true, heroImage: true },
          },
          translations: true,
          images: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      stories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            slug: true,
            state: true,
            latitude: true,
            longitude: true,
            heroImage: true,
          },
        },
        translations: true,
        images: true,
        author: {
          select: { id: true, displayName: true, name: true },
        },
      },
    });

    if (!story) throw { statusCode: 404, message: 'Story not found' };
    return story;
  }

  static async create(
    data: {
      title: string;
      body: string;
      destinationId?: string;
      originalLanguage: string;
      category: string;
      attributionPreference?: string;
      authorDisplayName?: string;
      approximatePeriod?: string;
      sourceContextNotes?: string;
    },
    userId?: string
  ) {
    let authorDisplayName = data.authorDisplayName || 'Anonymous Traveler';

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        if (data.attributionPreference === 'ANONYMOUS') {
          authorDisplayName = 'A Community Voice';
        } else if (data.attributionPreference === 'PSEUDONYM' && data.authorDisplayName) {
          authorDisplayName = data.authorDisplayName;
        } else {
          authorDisplayName = user.displayName || user.name;
        }
      }
    }

    const story = await prisma.story.create({
      data: {
        authorId: userId,
        destinationId: data.destinationId || null,
        title: data.title,
        body: data.body,
        originalLanguage: data.originalLanguage || 'en',
        category: data.category,
        attributionPreference: data.attributionPreference || 'DISPLAY_NAME',
        authorDisplayName,
        approximatePeriod: data.approximatePeriod,
        sourceContextNotes: data.sourceContextNotes,
        publicationStatus: 'PUBLISHED', // Auto-publish for verified community engagement
        visibility: 'PUBLIC',
        moderationStatus: 'APPROVED',
      },
      include: { destination: true },
    });

    // Update destination story count if associated
    if (data.destinationId) {
      await prisma.destination.update({
        where: { id: data.destinationId },
        data: { storyCount: { increment: 1 } },
      });
    }

    return story;
  }

  static async translateStory(storyId: string, targetLanguage: string) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { translations: true },
    });

    if (!story) throw { statusCode: 404, message: 'Story not found' };

    // If target language is original language, return original
    if (story.originalLanguage === targetLanguage) {
      return {
        storyId,
        language: targetLanguage,
        translatedTitle: story.title,
        translatedBody: story.body,
        isOriginal: true,
      };
    }

    // Check cached translations
    const existing = story.translations.find((t) => t.language === targetLanguage);
    if (existing) {
      return {
        storyId,
        language: targetLanguage,
        translatedTitle: existing.translatedTitle,
        translatedBody: existing.translatedBody,
        isOriginal: false,
      };
    }

    // Perform AI translation preserving nuances
    const translated = await AIService.translateStoryContent({
      title: story.title,
      body: story.body,
      sourceLanguage: story.originalLanguage,
      targetLanguage,
    });

    // Persist translation separately
    const record = await prisma.storyTranslation.create({
      data: {
        storyId,
        language: targetLanguage,
        translatedTitle: translated.translatedTitle,
        translatedBody: translated.translatedBody,
        translationProvider: 'AI_TRANSLATION',
        translationStatus: 'COMPLETED',
      },
    });

    return {
      storyId,
      language: targetLanguage,
      translatedTitle: record.translatedTitle,
      translatedBody: record.translatedBody,
      isOriginal: false,
    };
  }

  static async reportStory(storyId: string, reason: string, details?: string, reporterId?: string) {
    return await prisma.storyReport.create({
      data: {
        storyId,
        reporterId,
        reason,
        details,
        status: 'PENDING',
      },
    });
  }

  static async saveStory(storyId: string, userId: string) {
    return await prisma.savedStory.upsert({
      where: { userId_storyId: { userId, storyId } },
      create: { userId, storyId },
      update: {},
    });
  }

  static async unsaveStory(storyId: string, userId: string) {
    return await prisma.savedStory.deleteMany({
      where: { userId, storyId },
    });
  }

  static async getUserSaved(userId: string) {
    const saved = await prisma.savedStory.findMany({
      where: { userId },
      include: {
        story: {
          include: {
            destination: { select: { id: true, name: true, slug: true, heroImage: true } },
            translations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return saved.map((s) => s.story);
  }

  static async getUserStories(userId: string) {
    return await prisma.story.findMany({
      where: { authorId: userId },
      include: {
        destination: { select: { id: true, name: true, slug: true } },
        translations: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
