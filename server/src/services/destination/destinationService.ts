import { prisma } from '../../db/prisma';

export interface DestinationFilter {
  search?: string;
  region?: string;
  category?: string;
  state?: string;
  featured?: boolean;
}

export class DestinationService {
  static async getAll(filters: DestinationFilter = {}) {
    const where: any = {
      verificationStatus: 'VERIFIED',
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { state: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.region && filters.region !== 'All') {
      where.region = filters.region;
    }

    if (filters.state) {
      where.state = filters.state;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    const destinations = await prisma.destination.findMany({
      where,
      include: {
        attractions: {
          take: 5,
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { stories: true, culturalKnowledge: true },
        },
      },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    });

    if (filters.category && filters.category !== 'All') {
      return destinations.filter((d) => {
        try {
          const cats: string[] = JSON.parse(d.categories);
          return cats.some((c) => c.toLowerCase() === filters.category?.toLowerCase());
        } catch {
          return false;
        }
      });
    }

    return destinations;
  }

  static async getBySlug(slug: string) {
    const destination = await prisma.destination.findUnique({
      where: { slug },
      include: {
        attractions: {
          orderBy: { sortOrder: 'asc' },
          include: { source: true },
        },
        culturalKnowledge: {
          include: { source: true },
        },
        stories: {
          where: { publicationStatus: 'PUBLISHED' },
          include: {
            translations: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        accommodations: true,
      },
    });

    if (!destination) {
      throw { statusCode: 404, message: `Destination '${slug}' not found` };
    }

    return destination;
  }

  static async getMapDestinations(userId?: string) {
    const destinations = await prisma.destination.findMany({
      where: { verificationStatus: 'VERIFIED' },
      include: {
        attractions: {
          take: 5,
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { stories: { where: { publicationStatus: 'PUBLISHED' } } },
        },
      },
    });

    // Check user preferences for personalization scoring
    let userInterests: string[] = [];
    if (userId) {
      const prefs = await prisma.userPreference.findUnique({
        where: { userId },
      });
      if (prefs && prefs.interests) {
        try {
          userInterests = JSON.parse(prefs.interests);
        } catch {}
      }
    }

    return destinations.map((d) => {
      let categories: string[] = [];
      try {
        categories = JSON.parse(d.categories);
      } catch {}

      // Explainable Personalization Matching
      let interestMatches = 0;
      if (userInterests.length > 0) {
        interestMatches = categories.filter((c) =>
          userInterests.some((ui) => ui.toLowerCase() === c.toLowerCase())
        ).length;
      }

      // Marker Color Category Determination
      // Green = Recommended for user (if matches preferences)
      // Blue = Best curated place (featured)
      // Gold = Heritage & Cultural Landmark
      // Terracotta = Community story highlights
      // Purple = Destinations with multiple community stories
      let markerColor = 'blue';
      let markerBadge = 'Curated Essential';

      if (d._count.stories > 2) {
        markerColor = 'purple';
        markerBadge = 'Rich Community Stories';
      } else if (interestMatches > 0) {
        markerColor = 'green';
        markerBadge = `Recommended (${interestMatches} match${interestMatches > 1 ? 'es' : ''})`;
      } else if (categories.includes('Heritage') || categories.includes('Architecture')) {
        markerColor = 'gold';
        markerBadge = 'UNESCO / Heritage Landmark';
      } else if (d._count.stories > 0) {
        markerColor = 'terracotta';
        markerBadge = 'Local Memory Highlight';
      } else if (d.featured) {
        markerColor = 'blue';
        markerBadge = 'Best Place to Visit';
      }

      return {
        id: d.id,
        slug: d.slug,
        name: d.name,
        state: d.state,
        region: d.region,
        latitude: d.latitude,
        longitude: d.longitude,
        description: d.description,
        heroImage: d.heroImage,
        categories,
        bestTimeToVisit: d.bestTimeToVisit,
        estimatedBudget: d.estimatedBudget,
        storyCount: d._count.stories,
        topAttractions: d.attractions.map((a) => a.name),
        markerColor,
        markerBadge,
        recommendationScore: interestMatches * 25 + (d.featured ? 20 : 0),
      };
    });
  }

  static async getRecommendations(userId?: string, limit = 6) {
    let userInterests: string[] = ['Heritage', 'Culture', 'Spiritual'];
    let travelStyle = 'balanced';

    if (userId) {
      const prefs = await prisma.userPreference.findUnique({
        where: { userId },
      });
      if (prefs) {
        try {
          const parsed = JSON.parse(prefs.interests);
          if (parsed.length > 0) userInterests = parsed;
        } catch {}
        if (prefs.travelStyle) travelStyle = prefs.travelStyle;
      }
    }

    const destinations = await prisma.destination.findMany({
      where: { verificationStatus: 'VERIFIED' },
      include: {
        attractions: { take: 3 },
        _count: { select: { stories: true } },
      },
    });

    const scored = destinations.map((d) => {
      let categories: string[] = [];
      try {
        categories = JSON.parse(d.categories);
      } catch {}

      const matchedInterests = categories.filter((c) =>
        userInterests.some((ui) => ui.toLowerCase() === c.toLowerCase())
      );

      const score =
        matchedInterests.length * 30 +
        (d.featured ? 20 : 0) +
        Math.min(d.storyCount * 10, 30);

      const matchReason =
        matchedInterests.length > 0
          ? `Matches your passion for ${matchedInterests.join(', ')}`
          : d.featured
          ? 'Iconic cultural destination curated for every traveler'
          : 'Celebrated cultural wonder with living oral history';

      return {
        ...d,
        categories,
        matchScore: score,
        matchReason,
        travelStyleMatch: travelStyle,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, limit);
  }
}
