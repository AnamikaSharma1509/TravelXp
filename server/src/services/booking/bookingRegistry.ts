export interface FlightSearchParams {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  passengers: number;
  cabinClass?: string;
}

export interface TrainSearchParams {
  originStation: string;
  destinationStation: string;
  journeyDate: string;
  classPreference?: string;
  passengers: number;
}

export interface BusSearchParams {
  origin: string;
  destination: string;
  journeyDate: string;
  passengers: number;
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  rooms?: number;
  budgetRange?: string;
}

export interface ExperienceSearchParams {
  destination: string;
  category?: string;
}

export class BookingRegistry {
  static searchFlights(params: FlightSearchParams) {
    const fromCode = params.from.toUpperCase().slice(0, 3) || 'DEL';
    const toCode = params.to.toUpperCase().slice(0, 3) || 'VNS';
    const deepLinkGoogle = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(params.to)}%20from%20${encodeURIComponent(params.from)}%20on%20${params.departureDate}`;
    const deepLinkMMT = `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${params.departureDate}&tripType=${params.tripType === 'round-trip' ? 'R' : 'O'}&paxType=A-${params.passengers}_C-0_I-0&cabinClass=${params.cabinClass || 'E'}`;

    return [
      {
        id: 'fl-1',
        provider: 'IndiGo',
        flightNumber: '6E 2145',
        origin: params.from,
        destination: params.to,
        departureTime: '06:40 AM',
        arrivalTime: '08:15 AM',
        duration: '1h 35m',
        stops: 'Non-stop',
        cabinClass: params.cabinClass || 'Economy',
        priceINR: 4250,
        sourceType: 'CACHED_PROVIDER',
        updatedAt: new Date().toISOString(),
        deepLink: deepLinkMMT,
      },
      {
        id: 'fl-2',
        provider: 'Air India',
        flightNumber: 'AI 407',
        origin: params.from,
        destination: params.to,
        departureTime: '11:15 AM',
        arrivalTime: '12:45 PM',
        duration: '1h 30m',
        stops: 'Non-stop',
        cabinClass: params.cabinClass || 'Economy',
        priceINR: 4890,
        sourceType: 'CACHED_PROVIDER',
        updatedAt: new Date().toISOString(),
        deepLink: deepLinkGoogle,
      },
      {
        id: 'fl-3',
        provider: 'SpiceJet',
        flightNumber: 'SG 8192',
        origin: params.from,
        destination: params.to,
        departureTime: '05:30 PM',
        arrivalTime: '07:10 PM',
        duration: '1h 40m',
        stops: 'Non-stop',
        cabinClass: params.cabinClass || 'Economy',
        priceINR: 3950,
        sourceType: 'CACHED_PROVIDER',
        updatedAt: new Date().toISOString(),
        deepLink: deepLinkMMT,
      },
    ];
  }

  static searchTrains(params: TrainSearchParams) {
    const irctcLink = `https://www.irctc.co.in/nget/train-search`;

    return [
      {
        id: 'tr-1',
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        origin: params.originStation,
        destination: params.destinationStation,
        departureTime: '06:00 AM',
        arrivalTime: '02:00 PM',
        duration: '8h 00m',
        availableClasses: ['CC (Chair Car)', 'EC (Exec Chair)'],
        approxFareINR: 1750,
        sourceType: 'EXTERNAL_PROVIDER_LINK',
        provider: 'IRCTC Official Portal',
        deepLink: irctcLink,
        note: 'High-speed semi-high speed train with Wi-Fi and breakfast meal service.',
      },
      {
        id: 'tr-2',
        trainNumber: '12560',
        trainName: 'Shiv Ganga Express',
        origin: params.originStation,
        destination: params.destinationStation,
        departureTime: '08:05 PM',
        arrivalTime: '06:10 AM',
        duration: '10h 05m',
        availableClasses: ['1A', '2A', '3A', 'SL'],
        approxFareINR: 1250,
        sourceType: 'EXTERNAL_PROVIDER_LINK',
        provider: 'IRCTC Official Portal',
        deepLink: irctcLink,
        note: 'Superfast overnight train connecting northern heritage corridors.',
      },
      {
        id: 'tr-3',
        trainNumber: '12382',
        trainName: 'Poorva Express',
        origin: params.originStation,
        destination: params.destinationStation,
        departureTime: '05:40 PM',
        arrivalTime: '05:15 AM',
        duration: '11h 35m',
        availableClasses: ['2A', '3A', 'SL'],
        approxFareINR: 980,
        sourceType: 'EXTERNAL_PROVIDER_LINK',
        provider: 'IRCTC Official Portal',
        deepLink: irctcLink,
        note: 'Standard daily express with sleeper and air-conditioned berths.',
      },
    ];
  }

  static searchBuses(params: BusSearchParams) {
    const redbusLink = `https://www.redbus.in/bus-tickets/${encodeURIComponent(params.origin.toLowerCase())}-to-${encodeURIComponent(params.destination.toLowerCase())}?date=${params.journeyDate}`;

    return [
      {
        id: 'bus-1',
        operator: 'Zingbus Electric Intercity',
        busType: 'AC Sleeper / Seater (2+1)',
        origin: params.origin,
        destination: params.destination,
        departureTime: '08:30 PM',
        arrivalTime: '06:00 AM',
        duration: '9h 30m',
        priceINR: 899,
        rating: 4.6,
        sourceType: 'CACHED_PROVIDER',
        provider: 'RedBus Verified Partner',
        amenities: ['Charging Point', 'Blanket', 'Live Tracking', 'Water Bottle'],
        deepLink: redbusLink,
      },
      {
        id: 'bus-2',
        operator: 'UPSRTC / State Roadways AC Janrath',
        busType: 'AC Seater (2+2)',
        origin: params.origin,
        destination: params.destination,
        departureTime: '09:00 PM',
        arrivalTime: '07:15 AM',
        duration: '10h 15m',
        priceINR: 720,
        rating: 4.2,
        sourceType: 'EXTERNAL_PROVIDER_LINK',
        provider: 'UPSRTC Online',
        amenities: ['Emergency Exit', 'Air Conditioning'],
        deepLink: redbusLink,
      },
    ];
  }

  static searchHotels(params: HotelSearchParams) {
    const bookingLink = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(params.destination)}&checkin=${params.checkIn}&checkout=${params.checkOut}&group_adults=${params.adults}`;
    const mmtHotelLink = `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(params.destination)}&checkin=${params.checkIn}&checkout=${params.checkOut}`;

    return [
      {
        id: 'ht-1',
        name: `Brijrama Palace Heritage Hotel`,
        location: `${params.destination} Historic Ghats`,
        rating: 4.9,
        reviewCount: 1420,
        pricePerNightINR: 14500,
        amenities: ['Heritage Architecture', 'Rooftop Dining', 'River View', 'Classical Music'],
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        provider: 'Booking.com',
        sourceType: 'CACHED_PROVIDER',
        deepLink: bookingLink,
      },
      {
        id: 'ht-2',
        name: `Taj Gateway Heritage Retreat`,
        location: `${params.destination} City Center`,
        rating: 4.7,
        reviewCount: 2150,
        pricePerNightINR: 7800,
        amenities: ['Swimming Pool', 'Ayurvedic Spa', 'Free Breakfast', 'Wi-Fi'],
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
        provider: 'MakeMyTrip',
        sourceType: 'CACHED_PROVIDER',
        deepLink: mmtHotelLink,
      },
      {
        id: 'ht-3',
        name: `Zostel Cultural Hostel & Private Pods`,
        location: `${params.destination} Old Market`,
        rating: 4.5,
        reviewCount: 3100,
        pricePerNightINR: 1400,
        amenities: ['Community Common Room', 'Walking Tours', 'Cafe', 'High-Speed Wi-Fi'],
        imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
        provider: 'Zostel Direct',
        sourceType: 'EXTERNAL_PROVIDER_LINK',
        deepLink: `https://www.zostel.com`,
      },
    ];
  }

  static searchExperiences(params: ExperienceSearchParams) {
    return [
      {
        id: 'exp-1',
        title: `Dawn Rowboat Meditation & Ganga Aarti Viewing`,
        location: params.destination,
        duration: '2.5 Hours',
        rating: 4.9,
        priceINR: 850,
        provider: 'TravelXP Cultural Guides',
        sourceType: 'VERIFIED_EDITORIAL',
        highlights: ['Private wooden rowboat', 'Vedic chant narration', 'Morning floral offering (Deep Daan)'],
      },
      {
        id: 'exp-2',
        title: `Secret Alleys, Silk Weavers & Ancient Temple Walk`,
        location: params.destination,
        duration: '3.5 Hours',
        rating: 4.8,
        priceINR: 1200,
        provider: 'Heritage Walks India',
        sourceType: 'EXTERNAL_PROVIDER_LINK',
        highlights: ['Handloom silk workshop demonstration', 'Historic sweets tasting', 'Architectural gate exploration'],
      },
      {
        id: 'exp-3',
        title: `Classical Music Baithak & Santoor Recital`,
        location: params.destination,
        duration: '2 Hours',
        rating: 4.9,
        priceINR: 750,
        provider: 'Sangeet Heritage Trust',
        sourceType: 'VERIFIED_EDITORIAL',
        highlights: ['Intimate baithak seating', 'Introduction to Indian Ragas', 'Interaction with master artists'],
      },
    ];
  }
}
