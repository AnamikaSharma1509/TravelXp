import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Destination } from '../types';
import { api } from '../api/client';
import {
  MapPin,
  Clock,
  Wallet,
  Calendar,
  Ticket,
  Feather,
  BookOpen,
  Sparkles,
  Share2,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'attractions' | 'history' | 'mythology' | 'stories'>('attractions');

  useEffect(() => {
    async function loadDestination() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await api.getDestination(slug);
        setDestination(data);
      } catch (err) {
        console.error('Error fetching destination:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-ocean"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F0] p-4 text-center">
        <h2 className="text-2xl font-bold text-brand-midnight mb-2">Destination Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The destination you are exploring is not in our registry.</p>
        <Link to="/discover" className="px-6 py-2.5 rounded-xl bg-brand-midnight text-white text-xs font-bold">
          Return to Discover Map
        </Link>
      </div>
    );
  }

  const historyKnowledge = destination.culturalKnowledge?.filter((k) => k.contentType === 'HISTORY' || k.contentType === 'ARCHITECTURE') || [];
  const mythKnowledge = destination.culturalKnowledge?.filter((k) => k.contentType === 'MYTHOLOGY' || k.contentType === 'LEGEND') || [];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Destination Hero */}
      <div className="relative h-[480px] bg-brand-midnight overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight via-brand-midnight/40 to-transparent"></div>

        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <button
            onClick={() => navigate('/discover')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Map</span>
          </button>
        </div>

        <div className="absolute bottom-10 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto text-brand-ivory">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-gold text-brand-midnight">
              {destination.region} India
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white">
              {destination.state}
            </span>
            <span className="text-xs text-brand-sky/80 flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              {destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heritage tracking-tight mb-3">
            {destination.name}
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-brand-sky/90 leading-relaxed font-medium">
            {destination.description}
          </p>
        </div>
      </div>

      {/* Action Strip */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 shadow-sm sticky top-20 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-brand-slate">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-ocean" />
              <span><strong>Best Season:</strong> {destination.bestTimeToVisit}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-brand-gold" />
              <span><strong>Daily Budget:</strong> {destination.estimatedBudget}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/plan?destination=${destination.slug}`)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-gold text-brand-midnight font-bold text-xs shadow-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan Itinerary</span>
            </button>
            <button
              onClick={() => navigate(`/book?destination=${destination.name}`)}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-ocean text-white font-bold text-xs shadow-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              <span>Find Flights & Hotels</span>
            </button>
            <button
              onClick={() => navigate(`/stories/new?destinationId=${destination.id}`)}
              className="px-4 py-2.5 rounded-xl bg-brand-midnight text-white font-bold text-xs hover:bg-brand-heritage transition-colors flex items-center justify-center gap-1.5"
            >
              <Feather className="w-4 h-4 text-brand-gold" />
              <span>Add Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4 mb-8">
          <button
            onClick={() => setActiveTab('attractions')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'attractions'
                ? 'border-brand-ocean text-brand-ocean'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Top Attractions ({destination.attractions?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-brand-ocean text-brand-ocean'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>History & Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('mythology')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'mythology'
                ? 'border-brand-ocean text-brand-ocean'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Mythology & Legends</span>
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'stories'
                ? 'border-brand-ocean text-brand-ocean'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span>Community Stories ({destination.stories?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Top Attractions */}
        {activeTab === 'attractions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.attractions?.map((a, idx) => (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sky text-brand-heritage">
                    {a.category}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">#{idx + 1}</span>
                </div>
                <h3 className="font-extrabold text-base text-brand-midnight mb-2">{a.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{a.description}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>GPS: {a.latitude.toFixed(3)}, {a.longitude.toFixed(3)}</span>
                  <span className="text-brand-ocean font-semibold">Verified ASI Record</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: History & Architecture */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-4xl">
            {historyKnowledge.length > 0 ? (
              historyKnowledge.map((k) => (
                <div key={k.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      {k.provenanceType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">Verified Citation Record</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-midnight mb-3">{k.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">{k.body}</p>
                  {k.source && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-100 flex items-center justify-between">
                      <span>Source: <strong>{k.source.title}</strong> ({k.source.publisher})</span>
                      {k.source.url && (
                        <a href={k.source.url} target="_blank" rel="noopener noreferrer" className="text-brand-ocean hover:underline font-semibold">
                          View Citation
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Historical records are undergoing curation for this location.</p>
            )}
          </div>
        )}

        {/* Tab 3: Mythology & Legends */}
        {activeTab === 'mythology' && (
          <div className="space-y-6 max-w-4xl">
            {mythKnowledge.length > 0 ? (
              mythKnowledge.map((k) => (
                <div key={k.id} className="bg-white rounded-2xl border border-amber-200/60 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wide">
                      {k.provenanceType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-amber-700/80">Sacred Puranic / Oral Tradition</span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-midnight mb-3">{k.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{k.body}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Sacred oral narratives are being verified by community curators.</p>
            )}
          </div>
        )}

        {/* Tab 4: Community Stories */}
        {activeTab === 'stories' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-brand-midnight">Living Memories of {destination.name}</h3>
                <p className="text-xs text-slate-500">Multilingual memories contributed by families and travelers.</p>
              </div>
              <button
                onClick={() => navigate(`/stories/new?destinationId=${destination.id}`)}
                className="px-4 py-2 rounded-xl bg-brand-gold text-brand-midnight font-bold text-xs"
              >
                + Write a Story
              </button>
            </div>

            {destination.stories && destination.stories.length > 0 ? (
              destination.stories.map((story) => (
                <div key={story.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                      {story.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Language: {story.originalLanguage.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-brand-midnight mb-2">{story.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-devanagari mb-4">
                    {story.body}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <span className="text-slate-500">Contributed by: <strong>{story.authorDisplayName}</strong></span>
                    <button
                      onClick={() => navigate(`/stories/${story.id}`)}
                      className="text-brand-ocean font-bold hover:underline"
                    >
                      Read Translations →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500 mb-3">No stories have been published for {destination.name} yet.</p>
                <button
                  onClick={() => navigate(`/stories/new?destinationId=${destination.id}`)}
                  className="px-4 py-2 rounded-xl bg-brand-midnight text-white text-xs font-bold"
                >
                  Be the first to share a family memory
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
