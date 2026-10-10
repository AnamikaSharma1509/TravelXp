import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  User,
  Settings,
  Mail,
  Globe,
  Heart,
  Bookmark,
  Shield,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/profile');
    } else {
      setDisplayName(user.displayName);
      setPreferredLanguage(user.preferredLanguage);
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.updateProfile({ displayName, preferredLanguage });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-premium space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-midnight text-brand-gold flex items-center justify-center font-bold text-2xl font-heritage">
              {user.displayName?.[0] || user.name?.[0] || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-brand-midnight">{user.displayName || user.name}</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email}</span>
                {user.emailVerified && (
                  <span className="text-[10px] font-bold text-emerald-600 ml-2">✓ Verified</span>
                )}
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Public Display Name (Narrator Attribution)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1">
                Preferred Interface Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bho">भोजपुरी (Bhojpuri)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-brand-midnight hover:bg-brand-heritage text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-brand-gold" />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-midnight transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Edit Travel Interests & Pace Questionnaire</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-trips')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-midnight transition-colors flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              <span>View Saved Journeys</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
