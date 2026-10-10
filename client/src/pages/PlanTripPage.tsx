import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  Calendar,
  Sparkles,
  MapPin,
  Users,
  Wallet,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Compass,
} from 'lucide-react';

export const PlanTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    destinationName: searchParams.get('destination') || 'Varanasi',
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    travelerCount: 2,
    travelType: 'family',
    budget: 35000,
    travelStyle: 'balanced' as 'relaxed' | 'balanced' | 'packed',
    interests: ['Heritage', 'Mythology', 'Temples', 'Culture'],
    foodPreference: 'Vegetarian',
    notes: '',
  });

  const availableInterests = [
    'Heritage & History',
    'Mythology & Sacred Sites',
    'Ancient Temples',
    'Architecture & Carvings',
    'Regional Food & Sweets',
    'Nature & River Walks',
    'Artisans & Handloom',
    'Photography & Views',
    'Meditation & Wellness',
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest],
      };
    });
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const generatedTrip = await api.generateTrip(formData);
      // Pass data to results page via sessionStorage or state
      sessionStorage.setItem('current_generated_trip', JSON.stringify(generatedTrip));
      navigate('/plan/results');
    } catch (err) {
      console.error('Failed to generate trip:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Wizard Header */}
      <div className="bg-gradient-to-r from-brand-midnight via-brand-heritage to-brand-midnight text-brand-ivory py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/30">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary Architect • Rest & Pace-Aware</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heritage tracking-tight">
            Plan My Realistic Journey
          </h1>
          <p className="text-xs sm:text-sm text-brand-sky/80 max-w-xl mx-auto font-medium">
            Step-by-step smart travel planning that accounts for transit times, temple opening hours, meal pauses, and realistic human pacing.
          </p>

          {/* Progress Bar */}
          <div className="pt-6">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-sky/90 mb-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-brand-heritage/60 rounded-full h-2">
              <div
                className="bg-brand-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Card Body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-premium space-y-6">
          {/* STEP 1: Destination */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-brand-midnight flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-ocean" />
                <span>Where would you like to explore?</span>
              </h2>
              <p className="text-xs text-slate-500">
                Choose an Indian destination or region with rich cultural heritage.
              </p>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Destination City / Landmark</label>
                <input
                  type="text"
                  value={formData.destinationName}
                  onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                  placeholder="e.g. Varanasi, Hampi, Ajanta Caves, Jaipur..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-bold text-sm text-brand-midnight bg-slate-50 focus:ring-2 focus:ring-brand-ocean outline-none"
                  required
                />
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2">Popular Heritage Hubs:</span>
                <div className="flex flex-wrap gap-2">
                  {['Varanasi', 'Hampi', 'Ajanta Caves', 'Konark', 'Jaipur', 'Madurai', 'Kochi'].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setFormData({ ...formData, destinationName: dest })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-brand-sky hover:text-brand-midnight transition-colors"
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Travel Dates */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-brand-midnight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-ocean" />
                <span>When are you traveling?</span>
              </h2>
              <p className="text-xs text-slate-500">
                Specify your travel window so we can balance activities across each day.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-xs bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-xs bg-slate-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Travelers & Group Type */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-brand-midnight flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-ocean" />
                <span>Who is traveling with you?</span>
              </h2>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Total Number of Travelers</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={formData.travelerCount}
                  onChange={(e) => setFormData({ ...formData, travelerCount: parseInt(e.target.value) || 1 })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Travel Group Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {['solo', 'couple', 'family', 'friends'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelType: type })}
                      className={`p-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                        formData.travelType === type
                          ? 'border-brand-ocean bg-brand-ocean/10 text-brand-ocean'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Budget & Pacing */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-brand-midnight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-brand-gold" />
                <span>Budget & Travel Pace</span>
              </h2>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                  Total Trip Budget (INR ₹)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 20000 })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                  Select Travel Pace (Rest-Aware Scheduling)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'relaxed', label: 'Relaxed', desc: '2 sights / day, ample rest' },
                    { key: 'balanced', label: 'Balanced', desc: '3 sights / day, leisurely lunch' },
                    { key: 'packed', label: 'Packed', desc: '4 sights / day, sunrise to sunset' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, travelStyle: p.key as any })}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        formData.travelStyle === p.key
                          ? 'border-brand-gold bg-amber-50 text-brand-midnight shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <h4 className="font-extrabold text-xs">{p.label}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Interests */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-brand-midnight flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>What are your cultural interests?</span>
              </h2>
              <p className="text-xs text-slate-500">
                Select topics that you want the itinerary to prioritize.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableInterests.map((interest) => {
                  const selected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                        selected
                          ? 'bg-brand-midnight text-white border-brand-midnight shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Review & Confirmation */}
          {step === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-xl font-extrabold text-brand-midnight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Review Your Journey Parameters</span>
              </h2>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Destination:</span>
                  <span className="font-bold">{formData.destinationName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Dates:</span>
                  <span className="font-bold">{formData.startDate} to {formData.endDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Travelers:</span>
                  <span className="font-bold">{formData.travelerCount} ({formData.travelType})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Pacing:</span>
                  <span className="font-bold capitalize">{formData.travelStyle}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Budget:</span>
                  <span className="font-bold text-brand-ocean">₹{formData.budget.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : <div></div>}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="py-2.5 px-6 rounded-xl bg-brand-midnight hover:bg-brand-heritage text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-brand-gold to-amber-500 hover:scale-105 text-brand-midnight text-xs font-extrabold shadow-gold transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Synthesizing Itinerary...' : 'Generate Itinerary Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
