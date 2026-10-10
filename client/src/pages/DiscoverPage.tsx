import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IndiaMap } from '../components/map/IndiaMap';
import { MapMarker } from '../types';
import { api } from '../api/client';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  Wallet,
  BookOpen,
  ArrowRight,
  Layers,
  List,
  Compass,
} from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [filterColor, setFilterColor] = useState<string | undefined>(undefined);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  const regions = ['All', 'North', 'South', 'East', 'West', 'Central'];

  useEffect(() => {
    async function loadMarkers() {
      try {
        setLoading(true);
        const data = await api.getMapMarkers();
        setMarkers(data);
        if (data.length > 0) {
          // If query param search exists, select matched marker, otherwise default to first
          const query = searchParams.get('search')?.toLowerCase();
          const matched = query
            ? data.find((m) => m.name.toLowerCase().includes(query) || m.state.toLowerCase().includes(query))
            : data[0];
          setSelectedMarker(matched || data[0]);
        }
      } catch (err) {
        console.error('Failed to load map markers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMarkers();
  }, [searchParams]);

  const filteredMarkers = markers.filter((m) => {
    const matchesRegion = selectedRegion === 'All' || m.region === selectedRegion;
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor = !filterColor || m.markerColor === filterColor;
    return matchesRegion && matchesSearch && matchesColor;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight flex flex-col">
      {/* Sub-header Controls */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-brand-midnight text-brand-gold flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-brand-midnight">
                Discover India
              </h1>
              <p className="text-xs text-brand-slate">
                Explore sacred geography, living traditions, and regional legends.
              </p>
            </div>
          </div>

          {/* Region Tabs & Search */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                placeholder="Search state, place..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-ocean bg-slate-50"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    selectedRegion === r
                      ? 'bg-brand-midnight text-brand-ivory'
                      : 'bg-slate-100 hover:bg-slate-200 text-brand-slate'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Mobile View Toggle */}
            <div className="lg:hidden flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setMobileView('map')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                  mobileView === 'map' ? 'bg-white shadow-sm text-brand-ocean' : 'text-slate-600'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> Map
              </button>
              <button
                onClick={() => setMobileView('list')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                  mobileView === 'list' ? 'bg-white shadow-sm text-brand-ocean' : 'text-slate-600'
                }`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Panel Discovery Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[680px]">
          {/* LEFT PANEL: Interactive Leaflet Map of India */}
          <div
            className={`lg:col-span-7 h-[500px] lg:h-[720px] ${
              mobileView === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            {loading ? (
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
              </div>
            ) : (
              <IndiaMap
                markers={filteredMarkers}
                selectedMarkerId={selectedMarker?.id}
                onSelectMarker={(m) => setSelectedMarker(m)}
                filterColor={filterColor}
              />
            )}
          </div>

          {/* RIGHT PANEL: Selected Destination Preview & Discovery Feed */}
          <div
            className={`lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[720px] pr-1 ${
              mobileView === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {selectedMarker ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-premium p-6 space-y-5 animate-fadeIn">
                <div className="relative h-56 rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={selectedMarker.heroImage}
                    alt={selectedMarker.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-midnight/90 text-brand-ivory backdrop-blur-md">
                      {selectedMarker.markerBadge}
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white">
                    <h2 className="text-2xl font-extrabold">{selectedMarker.name}</h2>
                    <p className="text-xs text-brand-sky flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                      {selectedMarker.state} • {selectedMarker.region} India
                    </p>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-brand-ocean shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Best Season</span>
                      <span className="font-bold text-brand-midnight">{selectedMarker.bestTimeToVisit}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                    <Wallet className="w-4 h-4 text-brand-gold shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Est. Budget</span>
                      <span className="font-bold text-brand-midnight">{selectedMarker.estimatedBudget}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Overview</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedMarker.description}</p>
                </div>

                {/* Top 5 Attractions Preview */}
                {selectedMarker.topAttractions && selectedMarker.topAttractions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Top Curated Attractions ({selectedMarker.topAttractions.length})
                    </h4>
                    <div className="space-y-1.5">
                      {selectedMarker.topAttractions.map((attraction, i) => (
                        <div
                          key={attraction}
                          className="flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-lg bg-brand-sky/20 border border-brand-sky/40 text-brand-midnight font-medium"
                        >
                          <span className="w-4 h-4 rounded-full bg-brand-heritage text-white flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <span>{attraction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Community Stories Indicator */}
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-purple-900">
                    <BookOpen className="w-4 h-4 text-purple-700" />
                    <span className="font-bold">
                      {selectedMarker.storyCount} Community {selectedMarker.storyCount === 1 ? 'Story' : 'Stories'} Preserved
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/stories?destination=${selectedMarker.slug}`)}
                    className="text-[11px] font-bold text-purple-700 hover:underline"
                  >
                    Read Stories →
                  </button>
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => navigate(`/destinations/${selectedMarker.slug}`)}
                    className="flex-1 py-3 px-4 rounded-xl bg-brand-midnight hover:bg-brand-heritage text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore in Detail</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate(`/plan?destination=${selectedMarker.slug}`)}
                    className="py-3 px-4 rounded-xl bg-brand-gold hover:bg-amber-400 text-brand-midnight font-bold text-xs shadow-sm transition-all"
                  >
                    Add to Itinerary
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Select any marker on the map to view curated details.
              </div>
            )}

            {/* Quick Destination List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-brand-slate uppercase tracking-wider mb-3">
                All Destinations in Selection ({filteredMarkers.length})
              </h3>
              <div className="space-y-2">
                {filteredMarkers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMarker(m)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 ${
                      selectedMarker?.id === m.id
                        ? 'bg-brand-ocean/10 border border-brand-ocean text-brand-midnight font-bold'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <img src={m.heroImage} alt={m.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs truncate font-bold">{m.name}</h4>
                      <p className="text-[10px] text-slate-400">{m.state} • {m.markerBadge}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
