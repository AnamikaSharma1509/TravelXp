import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Trip } from '../types';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Trash2,
  Share2,
  ArrowRight,
  Plus,
  Compass,
} from 'lucide-react';

export const MyTripsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadTrips() {
      if (!user) {
        navigate('/login?redirect=/my-trips');
        return;
      }
      try {
        setLoading(true);
        const data = await api.getMyTrips();
        setTrips(data);
      } catch (err) {
        console.error('Failed to load trips:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, [user, navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this journey from your saved trips?')) {
      try {
        await api.deleteTrip(id);
        setTrips(trips.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Failed to delete trip:', err);
      }
    }
  };

  const filteredTrips = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-midnight to-brand-heritage text-brand-ivory py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-heritage tracking-tight mb-2">
              My Saved Journeys
            </h1>
            <p className="text-xs sm:text-sm text-brand-sky/80">
              Manage your upcoming adventures, past travels, and tailored itineraries.
            </p>
          </div>
          <Link
            to="/plan"
            className="py-3 px-5 rounded-xl bg-brand-gold hover:bg-amber-400 text-brand-midnight font-bold text-xs shadow-gold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Journey</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-sky text-brand-heritage">
                      {trip.days?.length || 3} Days Plan
                    </span>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Delete Journey"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-base text-brand-midnight leading-snug">
                    {trip.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-ocean shrink-0" />
                      <span>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        ₹{typeof trip.budget === 'number' ? trip.budget.toLocaleString('en-IN') : '25,000'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {trip.travelerCount} Travelers
                  </span>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('current_generated_trip', JSON.stringify(trip));
                      navigate('/plan/results');
                    }}
                    className="text-xs font-bold text-brand-ocean hover:underline flex items-center gap-1"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-sky/40 text-brand-ocean flex items-center justify-center mx-auto">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-brand-midnight">No journeys planned yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use our AI-assisted planner to design realistic, pace-aware cultural itineraries for any destination across India.
            </p>
            <Link
              to="/plan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-midnight hover:bg-brand-heritage text-white text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
