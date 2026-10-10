import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import {
  Ticket,
  Plane,
  Train,
  Bus,
  Hotel,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Users,
  Search,
  Sparkles,
  Info,
} from 'lucide-react';

export const BookTravelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultDestination = searchParams.get('destination') || 'Varanasi';

  const [activeCategory, setActiveCategory] = useState<'flights' | 'trains' | 'buses' | 'hotels' | 'experiences'>('flights');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Flight form state
  const [flightForm, setFlightForm] = useState({
    from: 'Delhi',
    to: defaultDestination,
    departureDate: '2026-11-15',
    tripType: 'one-way' as 'one-way' | 'round-trip',
    passengers: 2,
    cabinClass: 'Economy',
  });

  // Train form state
  const [trainForm, setTrainForm] = useState({
    originStation: 'New Delhi (NDLS)',
    destinationStation: `${defaultDestination} Cantt`,
    journeyDate: '2026-11-15',
    passengers: 2,
    classPreference: 'All Classes',
  });

  // Bus form state
  const [busForm, setBusForm] = useState({
    origin: 'Delhi',
    destination: defaultDestination,
    journeyDate: '2026-11-15',
    passengers: 2,
  });

  // Hotel form state
  const [hotelForm, setHotelForm] = useState({
    destination: defaultDestination,
    checkIn: '2026-11-15',
    checkOut: '2026-11-18',
    adults: 2,
    budgetRange: 'Moderate',
  });

  // Search handlers
  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await api.searchFlights(flightForm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await api.searchTrains(trainForm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await api.searchBuses(busForm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await api.searchHotels(hotelForm);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySwitch = (cat: any) => {
    setActiveCategory(cat);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-midnight to-brand-heritage text-brand-ivory py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Ticket className="w-3.5 h-3.5" />
            <span>Authorized Booking Integrations & Verified Corridors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heritage tracking-tight mb-2">
            Book Travel & Heritage Corridors
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm text-brand-sky/80 leading-relaxed font-medium">
            Discover verified transport corridors, check train routes, explore boutique havelis, and continue safely to official provider booking engines.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-premium border border-slate-200 flex flex-wrap gap-1.5 mb-8">
          <button
            onClick={() => handleCategorySwitch('flights')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'flights'
                ? 'bg-brand-midnight text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plane className="w-4 h-4" /> Flights
          </button>
          <button
            onClick={() => handleCategorySwitch('trains')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'trains'
                ? 'bg-brand-midnight text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Train className="w-4 h-4" /> Trains (IRCTC)
          </button>
          <button
            onClick={() => handleCategorySwitch('buses')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'buses'
                ? 'bg-brand-midnight text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-4 h-4" /> Buses
          </button>
          <button
            onClick={() => handleCategorySwitch('hotels')}
            className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeCategory === 'hotels'
                ? 'bg-brand-midnight text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Hotel className="w-4 h-4" /> Heritage Hotels
          </button>
        </div>

        {/* Dynamic Search Forms */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10">
          {activeCategory === 'flights' && (
            <form onSubmit={handleFlightSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Departure City</label>
                <input
                  type="text"
                  value={flightForm.from}
                  onChange={(e) => setFlightForm({ ...flightForm, from: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Destination City</label>
                <input
                  type="text"
                  value={flightForm.to}
                  onChange={(e) => setFlightForm({ ...flightForm, to: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Travel Date</label>
                <input
                  type="date"
                  value={flightForm.departureDate}
                  onChange={(e) => setFlightForm({ ...flightForm, departureDate: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Passengers</label>
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={flightForm.passengers}
                  onChange={(e) => setFlightForm({ ...flightForm, passengers: parseInt(e.target.value) || 1 })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-ocean hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Searching...' : 'Search Flights'}</span>
                </button>
              </div>
            </form>
          )}

          {activeCategory === 'trains' && (
            <form onSubmit={handleTrainSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Origin Station</label>
                <input
                  type="text"
                  value={trainForm.originStation}
                  onChange={(e) => setTrainForm({ ...trainForm, originStation: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Destination Station</label>
                <input
                  type="text"
                  value={trainForm.destinationStation}
                  onChange={(e) => setTrainForm({ ...trainForm, destinationStation: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Journey Date</label>
                <input
                  type="date"
                  value={trainForm.journeyDate}
                  onChange={(e) => setTrainForm({ ...trainForm, journeyDate: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-ocean hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Searching...' : 'Find Trains'}</span>
                </button>
              </div>
            </form>
          )}

          {activeCategory === 'buses' && (
            <form onSubmit={handleBusSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">From City</label>
                <input
                  type="text"
                  value={busForm.origin}
                  onChange={(e) => setBusForm({ ...busForm, origin: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">To City</label>
                <input
                  type="text"
                  value={busForm.destination}
                  onChange={(e) => setBusForm({ ...busForm, destination: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Date</label>
                <input
                  type="date"
                  value={busForm.journeyDate}
                  onChange={(e) => setBusForm({ ...busForm, journeyDate: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-ocean hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Searching...' : 'Search Buses'}</span>
                </button>
              </div>
            </form>
          )}

          {activeCategory === 'hotels' && (
            <form onSubmit={handleHotelSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Destination</label>
                <input
                  type="text"
                  value={hotelForm.destination}
                  onChange={(e) => setHotelForm({ ...hotelForm, destination: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Check-in</label>
                <input
                  type="date"
                  value={hotelForm.checkIn}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkIn: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1.5">Check-out</label>
                <input
                  type="date"
                  value={hotelForm.checkOut}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkOut: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-ocean hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Searching...' : 'Explore Hotels'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Search Results Display */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-brand-midnight">
                Available Provider Listings ({results.length})
              </h2>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-brand-ocean" />
                Verified External Provider Deep Links
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-brand-ocean transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.provider || item.operator || 'Verified Partner'}
                      </span>
                      <span className="text-xs text-brand-slate font-medium">
                        {item.flightNumber || item.trainName || item.busType || item.location}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-brand-midnight">
                      {item.name || `${item.origin} → ${item.destination}`}
                    </h3>

                    {item.departureTime && (
                      <p className="text-xs text-slate-600">
                        Departure: <strong>{item.departureTime}</strong> • Arrival: <strong>{item.arrivalTime}</strong> ({item.duration})
                      </p>
                    )}

                    {item.amenities && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.amenities.map((am: string) => (
                          <span key={am} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                            {am}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Pricing & Direct Booking Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block">Estimated Fare</span>
                      <span className="text-lg font-extrabold text-brand-midnight">
                        ₹{(item.priceINR || item.approxFareINR || item.pricePerNightINR || 1200).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {item.deepLink && (
                      <a
                        href={item.deepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-5 rounded-xl bg-brand-gold hover:bg-amber-400 text-brand-midnight font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <span>Continue to Provider</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
