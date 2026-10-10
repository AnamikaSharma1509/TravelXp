import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Story } from '../types';
import {
  Feather,
  Globe,
  MapPin,
  Calendar,
  Bookmark,
  Share2,
  Flag,
  ArrowLeft,
  Sparkles,
  Check,
} from 'lucide-react';

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetLang, setTargetLang] = useState<string>('original');
  const [translatedContent, setTranslatedContent] = useState<{ title: string; body: string } | null>(null);
  const [translating, setTranslating] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadStory() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getStory(id);
        setStory(data);
      } catch (err) {
        console.error('Failed to load story:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStory();
  }, [id]);

  const handleTranslate = async (lang: string) => {
    if (lang === 'original' || !id) {
      setTargetLang('original');
      setTranslatedContent(null);
      return;
    }

    try {
      setTranslating(true);
      setTargetLang(lang);
      const res = await api.translateStory(id, lang);
      setTranslatedContent({
        title: res.translatedTitle,
        body: res.translatedBody,
      });
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      if (saved) {
        await api.unsaveStory(id);
        setSaved(false);
      } else {
        await api.saveStory(id);
        setSaved(true);
      }
    } catch {
      alert('Please log in to save stories to your personal library.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F0] p-4 text-center">
        <h2 className="text-xl font-bold mb-2">Story not found</h2>
        <Link to="/stories" className="text-xs font-bold text-brand-ocean hover:underline">
          Return to Stories Archive
        </Link>
      </div>
    );
  }

  const currentTitle = translatedContent ? translatedContent.title : story.title;
  const currentBody = translatedContent ? translatedContent.body : story.body;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <button
          onClick={() => navigate('/stories')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-midnight mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stories & Heritage</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-premium space-y-6">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900">
                {story.category}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Original Script: {story.originalLanguage.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  saved ? 'bg-amber-100 border-amber-300 text-amber-900' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Translation Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <Globe className="w-4 h-4 text-brand-ocean" />
              <span>Read in:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleTranslate('original')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  targetLang === 'original'
                    ? 'bg-brand-midnight text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                Original ({story.originalLanguage.toUpperCase()})
              </button>
              <button
                onClick={() => handleTranslate('en')}
                disabled={translating}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  targetLang === 'en'
                    ? 'bg-brand-midnight text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleTranslate('hi')}
                disabled={translating}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  targetLang === 'hi'
                    ? 'bg-brand-midnight text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleTranslate('mr')}
                disabled={translating}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  targetLang === 'mr'
                    ? 'bg-brand-midnight text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          {translating && (
            <div className="p-3 bg-brand-sky/30 rounded-xl text-xs text-brand-midnight flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-brand-ocean" />
              <span>Translating while preserving cultural idioms and regional names...</span>
            </div>
          )}

          {/* Story Body */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-midnight font-heritage leading-tight">
              {currentTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-devanagari whitespace-pre-line">
              {currentBody}
            </p>
          </div>

          {/* Contributor Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">Oral Tradition Contributor</span>
              <strong className="text-brand-midnight text-sm">{story.authorDisplayName}</strong>
            </div>
            {story.approximatePeriod && (
              <span className="font-mono text-slate-400">Period: {story.approximatePeriod}</span>
            )}
          </div>

          {/* Destination Connection */}
          {story.destination && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-midnight to-brand-heritage text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-gold block">Associated Cultural Hub</span>
                <h4 className="text-lg font-extrabold">{story.destination.name} ({story.destination.state})</h4>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/destinations/${story.destination.slug}`}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                >
                  Explore Place
                </Link>
                <Link
                  to={`/plan?destination=${story.destination.slug}`}
                  className="px-4 py-2 rounded-xl bg-brand-gold text-brand-midnight font-bold text-xs"
                >
                  Add to Itinerary
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
