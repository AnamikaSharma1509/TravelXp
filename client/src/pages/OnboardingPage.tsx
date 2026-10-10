import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Heart,
  Compass,
  Wallet,
  Clock,
  Globe,
  ArrowRight,
  Check,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updatePreferences } = useAuth();

  const [interests, setInterests] = useState<string[]>([
    'Heritage',
    'Mythology',
    'Temples',
    'Architecture',
  ]);
  const [travelStyle, setTravelStyle] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [budgetRange, setBudgetRange] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [travelType, setTravelType] = useState<'solo' | 'couple' | 'family' | 'friends'>('family');
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(['en', 'hi']);
  const [saving, setSaving] = useState(false);

  const interestOptions = [
    'Heritage',
    'Mythology',
    'Temples',
    'Architecture',
    'Nature',
    'Mountains',
    'Beaches',
    'Adventure',
    'Food',
    'Museums',
    'Festivals',
    'Local Folklore',
  ];

  const handleInterestToggle = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleLanguageToggle = (lang: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePreferences({
        interests,
        travelStyle,
        budgetRange,
        travelType,
        preferredLanguages,
      });
      navigate('/discover');
    } catch (err) {
      console.error(err);
      navigate('/discover');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalize Your Travel Experience</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heritage text-brand-midnight">
            What is your Indian Travel Style?
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            These preferences customize your map pins (Green markers) and personalize AI itinerary generation.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-premium space-y-8">
          {/* 1. Interests */}
          <div>
            <h3 className="text-sm font-extrabold text-brand-midnight mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Select Your Core Interests</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {interestOptions.map((opt) => {
                const active = interests.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleInterestToggle(opt)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                      active
                        ? 'bg-brand-midnight text-white border-brand-midnight shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pacing */}
          <div>
            <h3 className="text-sm font-extrabold text-brand-midnight mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-ocean" />
              <span>Preferred Travel Pace</span>
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'relaxed', label: 'Relaxed', desc: 'Slow exploration' },
                { id: 'balanced', label: 'Balanced', desc: 'Paced sight & rest' },
                { id: 'packed', label: 'Packed', desc: 'Cover maximum ground' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTravelStyle(p.id as any)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    travelStyle === p.id
                      ? 'border-brand-gold bg-amber-50 text-brand-midnight font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs block">{p.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Budget & Travel Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-extrabold text-brand-midnight mb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span>Budget Tier</span>
              </h3>
              <div className="flex gap-2">
                {['budget', 'moderate', 'luxury'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudgetRange(b as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border ${
                      budgetRange === b
                        ? 'border-brand-ocean bg-brand-ocean/10 text-brand-ocean'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-brand-midnight mb-2">Travel Group</h3>
              <div className="flex gap-2">
                {['solo', 'couple', 'family', 'friends'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTravelType(t as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border ${
                      travelType === t
                        ? 'border-brand-ocean bg-brand-ocean/10 text-brand-ocean'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Skip for now
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="py-3 px-8 rounded-xl bg-brand-midnight hover:bg-brand-heritage text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span>{saving ? 'Saving...' : 'Apply & Explore Map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
