export interface User {
  id: string;
  name: string;
  displayName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  preferredLanguage: string;
  emailVerified: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  interests: string[];
  travelStyle: 'relaxed' | 'balanced' | 'packed';
  budgetRange: 'budget' | 'moderate' | 'luxury';
  preferredLanguages: string[];
  travelType: 'solo' | 'couple' | 'family' | 'friends';
  accessibilityPreferences?: string;
}

export interface Attraction {
  id: string;
  destinationId: string;
  name: string;
  slug: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface CulturalKnowledge {
  id: string;
  destinationId: string;
  title: string;
  body: string;
  contentType: 'HISTORY' | 'MYTHOLOGY' | 'LEGEND' | 'ARCHITECTURE' | 'CULTURE' | 'TRADITION';
  language: string;
  provenanceType: 'HISTORICALLY_DOCUMENTED' | 'SCRIPTURAL_LITERARY' | 'RELIGIOUS_TRADITION' | 'REGIONAL_FOLKLORE' | 'AI_SUMMARY';
  verificationStatus: string;
  source?: {
    title: string;
    publisher: string;
    url?: string;
    sourceType: string;
  };
}

export interface StoryTranslation {
  id: string;
  storyId: string;
  language: string;
  translatedTitle: string;
  translatedBody: string;
  translationProvider: string;
  translationStatus: string;
}

export interface Story {
  id: string;
  destinationId?: string;
  title: string;
  body: string;
  originalLanguage: string;
  category: string;
  attributionPreference: string;
  authorDisplayName: string;
  approximatePeriod?: string;
  sourceContextNotes?: string;
  publicationStatus: string;
  createdAt: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
    state: string;
    heroImage?: string;
    latitude?: number;
    longitude?: number;
  };
  translations?: StoryTranslation[];
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  heroImage: string;
  categories: string | string[];
  bestTimeToVisit: string;
  estimatedBudget: string;
  storyCount: number;
  featured: boolean;
  attractions?: Attraction[];
  culturalKnowledge?: CulturalKnowledge[];
  stories?: Story[];
}

export interface MapMarker {
  id: string;
  slug: string;
  name: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
  description: string;
  heroImage: string;
  categories: string[];
  bestTimeToVisit: string;
  estimatedBudget: string;
  storyCount: number;
  topAttractions: string[];
  markerColor: 'green' | 'blue' | 'gold' | 'terracotta' | 'purple';
  markerBadge: string;
  recommendationScore: number;
}

export interface TripActivity {
  id?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  travelMode?: string;
  estimatedTravelMinutes?: number;
  estimatedCost?: number;
  locationName: string;
  latitude?: number;
  longitude?: number;
  category: string;
  sortOrder: number;
}

export interface TripDay {
  id?: string;
  dayNumber: number;
  date: string;
  title: string;
  notes?: string;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number | { total: number; [key: string]: any };
  currency: string;
  travelerCount: number;
  travelStyle?: string;
  days: TripDay[];
  accommodationSuggestions?: any[];
  travelTips?: string[];
  assumptions?: string[];
}
