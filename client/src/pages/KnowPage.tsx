import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import {
  BookOpen,
  Search,
  Sparkles,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Feather,
} from 'lucide-react';

export const KnowPage: React.FC = () => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [aiExplanation, setAiExplanation] = useState<{
    destName: string;
    text: string;
    insights?: string[];
    provenance?: string;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Failed to load cultural knowledge:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAiExplain = async (destName: string, type: 'SIMPLIFY' | 'HISTORY_SUMMARY' | 'MYTHOLOGY_EXPLAIN') => {
    try {
      setAiLoading(true);
      const res = await api.explainCulture({ destinationName: destName, type });
      setAiExplanation({
        destName,
        text: res.explanation,
        insights: res.keyInsights,
        provenance: res.provenanceNote,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-midnight to-brand-heritage text-brand-ivory py-16 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/40 shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cultural Provenance & Heritage Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heritage tracking-tight">
            Before you visit a place, discover the stories that live within it.
          </h1>
          <p className="text-xs sm:text-sm text-brand-sky/80 leading-relaxed max-w-2xl mx-auto">
            Deep architectural context, puranic lore, temple traditions, and verified archaeological records across Indian civilization.
          </p>

          {/* Search bar */}
          <div className="pt-4 max-w-lg mx-auto relative">
            <input
              type="text"
              placeholder="Search by temple, monument, king, sage, or tradition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm rounded-full py-3.5 pl-12 pr-4 bg-white/95 text-brand-midnight placeholder-slate-400 shadow-premium focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-4" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* AI Explainer Modal / Flyout if active */}
        {aiExplanation && (
          <div className="mb-10 p-6 rounded-3xl bg-gradient-to-br from-brand-midnight to-brand-heritage text-brand-ivory shadow-premium border border-brand-gold/40 animate-fadeIn relative">
            <button
              onClick={() => setAiExplanation(null)}
              className="absolute top-4 right-4 text-xs text-brand-sky hover:text-white"
            >
              Close ✕
            </button>
            <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Cultural Heritage Synthesis for {aiExplanation.destName}</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-brand-sky font-medium mb-4">
              {aiExplanation.text}
            </p>
            {aiExplanation.insights && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {aiExplanation.insights.map((ins, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/10 text-xs text-brand-ivory backdrop-blur-sm">
                    {ins}
                  </div>
                ))}
              </div>
            )}
            <p className="text-[11px] text-brand-gold/80 italic font-mono">
              Provenance note: {aiExplanation.provenance}
            </p>
          </div>
        )}

        {/* Destination Knowledge Feed */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-premium transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img src={dest.heroImage} alt={dest.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 text-white">
                      <h3 className="text-xl font-extrabold">{dest.name}</h3>
                      <p className="text-xs text-brand-sky flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-gold" />
                        {dest.state} • {dest.region}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <p className="text-slate-600 line-clamp-3 leading-relaxed">
                      {dest.description}
                    </p>

                    {/* AI Explanation Shortcuts */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleAiExplain(dest.name, 'SIMPLIFY')}
                        disabled={aiLoading}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-brand-sky/40 text-brand-heritage hover:bg-brand-sky transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Explain Simply</span>
                      </button>
                      <button
                        onClick={() => handleAiExplain(dest.name, 'MYTHOLOGY_EXPLAIN')}
                        disabled={aiLoading}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Sacred Lore</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-brand-midnight hover:text-white text-brand-midnight border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Read Full Historical Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
