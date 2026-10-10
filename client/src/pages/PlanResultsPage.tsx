import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Calendar,
  Clock,
  MapPin,
  Wallet,
  Users,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Hotel,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const PlanResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<any>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('current_generated_trip');
    if (raw) {
      try {
        setTrip(JSON.parse(raw));
      } catch (e) {
        navigate('/plan');
      }
    } else {
      navigate('/plan');
    }
  }, [navigate]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
      </div>
    );
  }

  const handleSaveTrip = async () => {
    if (!user) {
      navigate('/login?redirect=/plan/results');
      return;
    }
    try {
      setSaving(true);
      const savedTrip = await api.saveTrip(trip);
      setSaved(true);
      // Generate share token
      const shareRes = await api.shareTrip(savedTrip.id);
      setShareLink(`${window.location.origin}/shared/${shareRes.shareToken}`);
    } catch (err) {
      console.error('Failed to save trip:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDayData = trip.days?.find((d: any) => d.dayNumber === activeDay) || trip.days?.[0];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20 print:bg-white print:p-0">
      {/* Top Banner Dashboard */}
      <div className="bg-gradient-to-r from-brand-midnight via-brand-heritage to-brand-midnight text-brand-ivory py-10 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/30 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-gold text-brand-midnight uppercase tracking-wider">
                Realistic Pacing Plan
              </span>
              <span className="text-xs text-brand-sky/80 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                {trip.destination}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heritage tracking-tight">
              {trip.tripTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-sky/80 font-medium">
              <span>{trip.startDate} to {trip.endDate}</span>
              <span>•</span>
              <span>{trip.travelerCount} Travelers</span>
              <span>•</span>
              <span className="text-brand-gold font-bold">
                Budget: ₹{trip.budget?.total?.toLocaleString('en-IN') || '30,000'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSaveTrip}
              disabled={saved || saving}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                saved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-gold hover:bg-amber-400 text-brand-midnight shadow-gold'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{saved ? 'Saved in My Trips' : saving ? 'Saving...' : 'Save Journey'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share link alert if saved */}
      {shareLink && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 print:hidden">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>Public Share Link Generated: <strong className="font-mono">{shareLink}</strong></span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Day Selector & Timeline (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Day Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 print:hidden">
              {trip.days?.map((d: any) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDay(d.dayNumber)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeDay === d.dayNumber
                      ? 'bg-brand-midnight text-brand-ivory shadow-sm'
                      : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-600'
                  }`}
                >
                  Day {d.dayNumber}
                </button>
              ))}
            </div>

            {/* Current Day Schedule */}
            {currentDayData && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-premium space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-ocean uppercase tracking-wider">
                      {currentDayData.date}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Day {currentDayData.dayNumber} of {trip.days?.length}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-brand-midnight mt-1">
                    {currentDayData.title}
                  </h2>
                  {currentDayData.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic">{currentDayData.notes}</p>
                  )}
                </div>

                {/* Timeline Items */}
                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {currentDayData.activities?.map((activity: any, idx: number) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-brand-ocean shadow-sm group-hover:scale-125 transition-transform"></span>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-ocean/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-brand-midnight flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-brand-ocean" />
                            {activity.startTime} - {activity.endTime} ({activity.durationMinutes} min)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-sky text-brand-heritage">
                            {activity.category}
                          </span>
                        </div>

                        <h4 className="text-sm font-extrabold text-brand-midnight">
                          {activity.title}
                        </h4>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {activity.description}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {activity.locationName}
                          </span>
                          {activity.travelMode && (
                            <span className="text-slate-400 font-mono">
                              Transit: {activity.travelMode} (~{activity.estimatedTravelMinutes}m)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Budget Breakdown & Accommodations (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Budget Breakdown Calculator */}
            {trip.budget && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-premium space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-brand-gold" />
                    <h3 className="font-extrabold text-sm text-brand-midnight">
                      Budget Breakdown Calculator
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-brand-ocean">
                    ₹{trip.budget.total?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Intercity Corridors (Flights / Trains)</span>
                    <span className="font-bold">₹{trip.budget.transportIntercity?.toLocaleString('en-IN') || '7,500'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Heritage Accommodation</span>
                    <span className="font-bold">₹{trip.budget.accommodation?.toLocaleString('en-IN') || '9,000'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Local Transport (Auto / Cabs)</span>
                    <span className="font-bold">₹{trip.budget.localTransport?.toLocaleString('en-IN') || '3,600'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Authentic Regional Dining</span>
                    <span className="font-bold">₹{trip.budget.food?.toLocaleString('en-IN') || '5,400'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Attractions, Guides & Tickets</span>
                    <span className="font-bold">₹{trip.budget.attractionsAndTickets?.toLocaleString('en-IN') || '2,400'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Buffer & Contingency</span>
                    <span className="font-bold">₹{trip.budget.contingency?.toLocaleString('en-IN') || '2,100'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
                  Calculated based on {trip.travelerCount} traveler{trip.travelerCount > 1 ? 's' : ''} (~₹{trip.budget.perPerson?.toLocaleString('en-IN')} / person).
                </div>
              </div>
            )}

            {/* Accommodation Suggestions */}
            {trip.accommodationSuggestions && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-premium space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Hotel className="w-5 h-5 text-brand-ocean" />
                  <h3 className="font-extrabold text-sm text-brand-midnight">
                    Curated Heritage Stays
                  </h3>
                </div>

                <div className="space-y-3">
                  {trip.accommodationSuggestions.map((acc: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-brand-midnight">{acc.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          ★ {acc.rating || 4.7}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{acc.area}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                        <span className="font-bold text-slate-700">{acc.priceRange}</span>
                        {acc.providerUrl && (
                          <a
                            href={acc.providerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-ocean font-bold hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Book</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Tips & Warnings */}
            {trip.travelTips && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-premium space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Cultural Travel Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {trip.travelTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
