import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Story } from '../types';
import {
  Feather,
  Globe,
  BookOpen,
  MapPin,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Heart,
  Sparkles,
} from 'lucide-react';

export const StoriesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const languages = [
    { code: 'All', label: 'All Languages' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bho', label: 'भोजपुरी (Bhojpuri)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', label: 'മലയാളം (Malayalam)' },
    { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'as', label: 'অসমীয়া (Assamese)' },
    { code: 'ur', label: 'اردو (Urdu)' },
    { code: 'sa', label: 'संस्कृतम् (Sanskrit)' },
    { code: 'kok', label: 'कोंकणी (Konkani)' },
    { code: 'mai', label: 'मैथिली (Maithili)' },
    { code: 'ks', label: 'कॉशुर (Kashmiri)' },
    { code: 'ne', label: 'नेपाली (Nepali)' },
    { code: 'sd', label: 'سنڌي (Sindhi)' },
    { code: 'fr', label: 'Français (French)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'ar', label: 'العربية (Arabic)' },
    { code: 'zh', label: '中文 (Chinese)' },
  ];

  const categories = [
    'All',
    "Grandparents' stories",
    'Family memories',
    'Local legends',
    'Temple traditions',
    'Folk tales',
  ];

  useEffect(() => {
    async function loadStories() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (selectedLanguage !== 'All') queryParams.append('language', selectedLanguage);
        if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
        if (search) queryParams.append('search', search);

        const data = await api.getStories(queryParams.toString());
        setStories(data.stories || []);
      } catch (err) {
        console.error('Failed to load stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, [selectedLanguage, selectedCategory, search]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-midnight via-purple-950 to-brand-midnight text-brand-ivory py-16 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/40 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Feather className="w-3.5 h-3.5" />
            <span>Multilingual Cultural Memory Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heritage tracking-tight">
            Every place has a story. Every family carries one.
          </h1>
          <p className="text-xs sm:text-sm text-brand-sky/80 leading-relaxed max-w-2xl mx-auto">
            Preserve the legends, memories, and grandmother's tales that deserve to travel across generations.
          </p>

          <div className="pt-2">
            <Link
              to="/stories/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gold hover:bg-amber-400 text-brand-midnight font-extrabold text-xs shadow-gold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Preserve a Family Story</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search oral stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 pl-8 pr-3 py-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand-ocean"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLanguage(l.code)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedLanguage === l.code
                      ? 'bg-brand-midnight text-brand-ivory'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-premium transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                      {story.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase font-mono">
                      {story.originalLanguage}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-brand-midnight leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-devanagari">
                    {story.body}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Preserved by</span>
                    <span className="font-bold text-brand-midnight">{story.authorDisplayName}</span>
                  </div>

                  <Link
                    to={`/stories/${story.id}`}
                    className="text-xs font-bold text-brand-ocean hover:underline flex items-center gap-1"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 max-w-md mx-auto">
            <p className="text-xs text-slate-500 mb-3">No stories match your filter selection.</p>
            <Link
              to="/stories/new"
              className="px-5 py-2.5 rounded-xl bg-brand-midnight text-white text-xs font-bold"
            >
              Write the first story
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
