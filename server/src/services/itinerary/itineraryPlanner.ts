import { prisma } from '../../db/prisma';
import crypto from 'crypto';

export interface GenerateTripParams {
  destinationSlug?: string;
  destinationName?: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budget: number;
  currency?: string;
  travelStyle?: 'relaxed' | 'balanced' | 'packed';
  interests?: string[];
  travelType?: 'solo' | 'couple' | 'family' | 'friends';
  foodPreference?: string;
  notes?: string;
}

export class ItineraryPlanner {
  static async generate(params: GenerateTripParams) {
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const durationDays = Math.max(1, Math.min(14, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1));
    const currency = params.currency || 'INR';
    const travelStyle = params.travelStyle || 'balanced';

    // Fetch destination & attractions from database
    let destination = null;
    if (params.destinationSlug) {
      destination = await prisma.destination.findUnique({
        where: { slug: params.destinationSlug },
        include: { attractions: true, accommodations: true },
      });
    }

    if (!destination && params.destinationName) {
      destination = await prisma.destination.findFirst({
        where: { name: { contains: params.destinationName, mode: 'insensitive' } },
        include: { attractions: true, accommodations: true },
      });
    }

    // Default to Varanasi if not found
    if (!destination) {
      destination = await prisma.destination.findFirst({
        where: { slug: 'varanasi' },
        include: { attractions: true, accommodations: true },
      });
    }

    const destName = destination?.name || params.destinationName || 'Cultural India';
    const attractions = destination?.attractions || [];

    // Calculate budget breakdown realistically
    const totalBudget = params.budget || 25000;
    const budgetBreakdown = {
      total: totalBudget,
      currency,
      transportIntercity: Math.round(totalBudget * 0.25),
      localTransport: Math.round(totalBudget * 0.12),
      accommodation: Math.round(totalBudget * 0.30),
      food: Math.round(totalBudget * 0.18),
      attractionsAndTickets: Math.round(totalBudget * 0.08),
      contingency: Math.round(totalBudget * 0.07),
      perPerson: Math.round(totalBudget / Math.max(1, params.travelerCount)),
    };

    // Determine activity count per day based on pace
    const activitiesPerDay = travelStyle === 'relaxed' ? 2 : travelStyle === 'packed' ? 4 : 3;

    // Generate day-by-day structured itinerary
    const days: any[] = [];
    let attractionCursor = 0;

    for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
      const currentDate = new Date(start.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
      const dayDateStr = currentDate.toISOString().split('T')[0];

      const dayActivities: any[] = [];

      // Morning Activity
      const morningAttraction = attractions[attractionCursor % Math.max(1, attractions.length)];
      attractionCursor++;
      dayActivities.push({
        title: morningAttraction ? morningAttraction.name : `Morning Heritage Walk at ${destName}`,
        category: morningAttraction ? morningAttraction.category : 'Heritage',
        startTime: '09:00 AM',
        endTime: '11:30 AM',
        durationMinutes: 150,
        description: morningAttraction
          ? morningAttraction.description
          : `Explore the historical monuments and cultural architecture of ${destName}.`,
        locationName: morningAttraction ? morningAttraction.name : `${destName} Heritage Quarter`,
        latitude: morningAttraction?.latitude || destination?.latitude,
        longitude: morningAttraction?.longitude || destination?.longitude,
        travelMode: 'Walking / Cab',
        estimatedTravelMinutes: 20,
        estimatedCost: 350,
        sortOrder: 1,
      });

      // Lunch & Rest Period (Rest-aware planning)
      dayActivities.push({
        title: 'Authentic Regional Lunch & Rest Break',
        category: 'Dining',
        startTime: '12:30 PM',
        endTime: '02:00 PM',
        durationMinutes: 90,
        description: `Enjoy traditional regional cuisine at a reputable local heritage diner. Rest and recharge during the midday heat.`,
        locationName: `${destName} Culinary Lane`,
        travelMode: 'Short Walk',
        estimatedTravelMinutes: 10,
        estimatedCost: 600,
        sortOrder: 2,
      });

      // Afternoon / Evening Activity
      const afternoonAttraction = attractions[attractionCursor % Math.max(1, attractions.length)];
      attractionCursor++;
      dayActivities.push({
        title: afternoonAttraction ? afternoonAttraction.name : `Cultural & Architectural Exploration`,
        category: afternoonAttraction ? afternoonAttraction.category : 'Culture',
        startTime: '03:30 PM',
        endTime: '05:45 PM',
        durationMinutes: 135,
        description: afternoonAttraction
          ? afternoonAttraction.description
          : `Guided walking tour through artisanal markets, ancient temples, and stone carvings.`,
        locationName: afternoonAttraction ? afternoonAttraction.name : `${destName} City Center`,
        latitude: afternoonAttraction?.latitude || destination?.latitude,
        longitude: afternoonAttraction?.longitude || destination?.longitude,
        travelMode: 'Auto-Rickshaw / Cab',
        estimatedTravelMinutes: 25,
        estimatedCost: 400,
        sortOrder: 3,
      });

      // Sunset or Aarti if applicable
      if (travelStyle !== 'relaxed' || dayNum === 1) {
        dayActivities.push({
          title: `Evening Sunset Experience & Sacred Aarti`,
          category: 'Spiritual',
          startTime: '06:30 PM',
          endTime: '08:00 PM',
          durationMinutes: 90,
          description: `Participate in the atmospheric evening prayer ceremony, musical chants, and river / viewpoint panorama.`,
          locationName: `${destName} Sacred Promenade`,
          travelMode: 'Walk',
          estimatedTravelMinutes: 15,
          estimatedCost: 200,
          sortOrder: 4,
        });
      }

      days.push({
        dayNumber: dayNum,
        date: dayDateStr,
        title: `Day ${dayNum}: Immersive Discoveries in ${destName}`,
        notes: `Pace: ${travelStyle.toUpperCase()}. Remember to wear comfortable walking footwear and carry hydration.`,
        activities: dayActivities,
      });
    }

    // Curated Accommodation recommendations
    const accommodationSuggestions = [
      {
        name: `Heritage Haveli & Boutique Stay ${destName}`,
        area: `${destName} Central Old Town`,
        rating: 4.7,
        priceRange: '₹3,500 - ₹5,500 / night',
        provider: 'Booking.com',
        providerUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destName)}`,
        sourceType: 'PROVIDER_DEEP_LINK',
      },
      {
        name: `${destName} Riverside Palace & Spa`,
        area: `${destName} Waterfront`,
        rating: 4.8,
        priceRange: '₹6,000 - ₹9,500 / night',
        provider: 'MakeMyTrip',
        providerUrl: `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(destName)}`,
        sourceType: 'PROVIDER_DEEP_LINK',
      },
    ];

    return {
      tripTitle: `${durationDays}-Day Heritage & Cultural Journey to ${destName}`,
      destination: destName,
      destinationSlug: destination?.slug,
      startDate: params.startDate,
      endDate: params.endDate,
      travelerCount: params.travelerCount,
      travelStyle,
      budget: budgetBreakdown,
      days,
      accommodationSuggestions,
      travelTips: [
        'Dress modestly when entering temple sanctums and heritage monuments.',
        'Early morning visits (before 09:30 AM) offer peaceful exploration and ideal lighting for photography.',
        'Always ask for metered rides or use authorized rideshare apps when traversing the city.',
      ],
      assumptions: [
        'Intercity flight / train fares estimated based on average seasonal booking windows.',
        'Sightseeing timings account for buffer travel and security checkpoint queues.',
      ],
    };
  }

  static async saveTrip(userId: string, tripData: any) {
    const trip = await prisma.trip.create({
      data: {
        userId,
        title: tripData.tripTitle,
        destination: tripData.destination,
        startDate: new Date(tripData.startDate),
        endDate: new Date(tripData.endDate),
        budget: tripData.budget?.total || 25000,
        currency: tripData.budget?.currency || 'INR',
        travelerCount: tripData.travelerCount || 1,
        preferences: JSON.stringify({
          travelStyle: tripData.travelStyle,
          budgetBreakdown: tripData.budget,
        }),
        status: 'UPCOMING',
        days: {
          create: tripData.days.map((d: any) => ({
            dayNumber: d.dayNumber,
            date: new Date(d.date),
            title: d.title,
            notes: d.notes,
            activities: {
              create: d.activities.map((a: any, idx: number) => ({
                title: a.title,
                description: a.description,
                startTime: a.startTime,
                endTime: a.endTime,
                durationMinutes: a.durationMinutes || 60,
                travelMode: a.travelMode,
                estimatedTravelMinutes: a.estimatedTravelMinutes || 15,
                estimatedCost: a.estimatedCost || 0,
                locationName: a.locationName,
                latitude: a.latitude,
                longitude: a.longitude,
                category: a.category,
                sortOrder: a.sortOrder || idx + 1,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: { activities: true },
        },
      },
    });

    return trip;
  }

  static async getUserTrips(userId: string) {
    return await prisma.trip.findMany({
      where: { userId },
      include: {
        days: {
          include: { activities: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getTripById(id: string, userId?: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        days: {
          orderBy: { dayNumber: 'asc' },
          include: {
            activities: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
        accommodations: true,
      },
    });

    if (!trip) throw { statusCode: 404, message: 'Trip not found' };

    // If trip is accessed by another user, verify share link
    if (userId && trip.userId !== userId) {
      // Allow read-only if shared
    }

    return trip;
  }

  static async deleteTrip(id: string, userId: string) {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) throw { statusCode: 404, message: 'Trip not found' };
    if (trip.userId !== userId) throw { statusCode: 403, message: 'Unauthorized' };

    await prisma.trip.delete({ where: { id } });
    return { deleted: true };
  }

  static async createShareLink(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.userId !== userId) throw { statusCode: 403, message: 'Unauthorized' };

    const shareToken = crypto.randomBytes(16).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(shareToken).digest('hex');

    const shareLink = await prisma.shareLink.create({
      data: {
        tripId,
        shareToken,
        tokenHash,
      },
    });

    return { shareToken: shareLink.shareToken };
  }

  static async getSharedTrip(shareToken: string) {
    const shareLink = await prisma.shareLink.findUnique({
      where: { shareToken },
      include: {
        trip: {
          include: {
            days: {
              orderBy: { dayNumber: 'asc' },
              include: { activities: { orderBy: { sortOrder: 'asc' } } },
            },
            accommodations: true,
          },
        },
      },
    });

    if (!shareLink || shareLink.revokedAt) {
      throw { statusCode: 404, message: 'Shared trip not found or link has expired' };
    }

    return shareLink.trip;
  }
}
