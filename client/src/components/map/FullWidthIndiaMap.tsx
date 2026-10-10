import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapMarker } from '../../types';
import { useTranslation } from '../../context/LanguageContext';
import {
  Compass,
  Sparkles,
  BookOpen,
  Layers,
  MapPin,
  Clock,
  Wallet,
  ArrowRight,
  X,
  Calendar,
  Info,
} from 'lucide-react';

interface FullWidthIndiaMapProps {
  markers: MapMarker[];
  onSelectMarker?: (marker: MapMarker) => void;
  className?: string;
}

// Custom Marker styling with distinct colors
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="custom-pin pin-${color}">
        <div class="custom-pin-inner"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const FlyToController: React.FC<{ center?: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 6, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

export const FullWidthIndiaMap: React.FC<FullWidthIndiaMapProps> = ({
  markers,
  onSelectMarker,
  className = '',
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [activeCenter, setActiveCenter] = useState<[number, number] | undefined>(undefined);
  const [filterTag, setFilterTag] = useState<string>('ALL');

  // Check if Google Maps API key exists
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    setActiveCenter([marker.latitude, marker.longitude]);
    if (onSelectMarker) {
      onSelectMarker(marker);
    }
  };

  const filteredMarkers = markers.filter((m) => {
    if (filterTag === 'ALL') return true;
    if (filterTag === 'RECOMMENDED') return m.markerColor === 'green';
    if (filterTag === 'CURATED') return m.markerColor === 'blue';
    if (filterTag === 'HERITAGE') return m.markerColor === 'gold';
    if (filterTag === 'STORIES') return m.markerColor === 'purple' || m.markerColor === 'terracotta';
    return true;
  });

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-premium border border-[#174A7E]/20 dark:border-[#1E3A5F] bg-slate-100 dark:bg-[#071320] ${className}`}>
      {/* Top Filter Bar inside Map */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 bg-white/95 dark:bg-[#102A43]/95 backdrop-blur-md p-1.5 rounded-2xl shadow-subtle border border-slate-200 dark:border-[#1E3A5F] pointer-events-auto text-xs">
          {[
            { id: 'ALL', label: t('map.all', 'All Destinations') },
            { id: 'RECOMMENDED', label: t('map.recommended', '🟢 Recommended') },
            { id: 'CURATED', label: t('map.curated', '🔵 Curated Places') },
            { id: 'HERITAGE', label: t('map.heritage', '🟡 Heritage Landmarks') },
            { id: 'STORIES', label: t('map.stories', '🟣 Community Stories') },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setFilterTag(tag.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterTag === tag.id
                  ? 'bg-[#102A43] dark:bg-[#246BCE] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#174A7E]/50'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Google Maps API status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-[#102A43]/90 backdrop-blur-md border border-slate-200 dark:border-[#1E3A5F] text-[10px] text-slate-500 dark:text-slate-400 shadow-sm pointer-events-auto">
          <Info className="w-3 h-3 text-[#246BCE]" />
          <span>
            {googleApiKey ? 'Google Maps API Enabled' : 'Carto / OpenStreetMap (Cultural Theme)'}
          </span>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="w-full h-[580px] lg:h-[680px]">
        <MapContainer
          center={[22.3511, 78.6677]}
          zoom={5}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToController center={activeCenter} zoom={7} />

          {filteredMarkers.map((marker) => {
            const icon = createMarkerIcon(marker.markerColor);

            return (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={icon}
                eventHandlers={{
                  click: (e: any) => {
                    if (e && e.target && e.target.openPopup) {
                      e.target.openPopup();
                    }
                    handleMarkerClick(marker);
                  },
                }}
              >
                {/* Anchored Leaflet Popup */}
                <Popup className="travelxp-leaflet-popup" closeButton={true}>
                  <div className="w-72 sm:w-80 p-3 bg-white text-[#102A43] rounded-2xl overflow-hidden font-sans space-y-2.5">
                    <div className="relative h-32 rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={marker.heroImage}
                        alt={marker.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#102A43]/90 text-[#FAF7F0] backdrop-blur-md">
                        {marker.markerBadge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base leading-tight text-[#102A43]">
                        {marker.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {marker.state} • {marker.region} India
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {marker.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/destinations/${marker.slug}`)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#102A43] hover:bg-[#174A7E] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Explore in Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => navigate(`/plan?destination=${marker.slug}`)}
                        className="py-2 px-3 rounded-xl bg-[#C89B3C] hover:bg-amber-400 text-[#102A43] font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Plan</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating Anchored Information Modal / Card (Task 3 requirement: NOT a permanent side panel) */}
      {selectedMarker && (
        <div className="absolute top-16 right-4 sm:right-6 bottom-auto max-w-sm sm:max-w-md w-[calc(100%-2rem)] z-[450] bg-white/95 dark:bg-[#102A43]/95 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-[#1E3A5F] shadow-2xl p-5 space-y-4 animate-fadeIn pointer-events-auto max-h-[85%] overflow-y-auto">
          {/* Header & Close Button */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#102A43] dark:bg-[#246BCE] text-[#FAF7F0]">
              {selectedMarker.markerBadge}
            </span>
            <button
              onClick={() => setSelectedMarker(null)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#174A7E] hover:bg-slate-200 dark:hover:bg-[#174A7E]/80 text-slate-600 dark:text-slate-200 flex items-center justify-center transition-colors shadow-sm"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hero image */}
          <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={selectedMarker.heroImage}
              alt={selectedMarker.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-3 left-3 text-white">
              <h3 className="text-xl font-extrabold font-heritage leading-tight">
                {selectedMarker.name}
              </h3>
              <p className="text-xs text-[#D9EAF7] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>{selectedMarker.state} • {selectedMarker.region} India</span>
              </p>
            </div>
          </div>

          {/* Description & Cultural Highlight */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
              {t('map.culturalHighlight', 'Cultural & Historical Highlight')}
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedMarker.description}
            </p>
          </div>

          {/* Verified Top 5 Attractions */}
          {selectedMarker.topAttractions && selectedMarker.topAttractions.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1.5">
                {t('map.topAttractions', 'Top Verified Attractions')} ({selectedMarker.topAttractions.slice(0, 5).length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMarker.topAttractions.slice(0, 5).map((attraction, i) => (
                  <span
                    key={attraction}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF7F0] dark:bg-[#071320] border border-[#174A7E]/20 dark:border-[#1E3A5F] text-[#102A43] dark:text-[#FAF7F0] font-medium"
                  >
                    #{i + 1} {attraction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Community Stories Indicator */}
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/40 flex items-center justify-between text-xs text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-700 dark:text-purple-400 shrink-0" />
              <span className="font-bold">
                {selectedMarker.storyCount} {t('map.communityStories', 'Community Stories')}
              </span>
            </div>
            <button
              onClick={() => navigate(`/stories?destination=${selectedMarker.slug}`)}
              className="text-[11px] font-bold text-purple-700 dark:text-purple-400 hover:underline"
            >
              {t('map.readStories', 'Read Stories →')}
            </button>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#1E3A5F] flex items-center gap-2.5">
            <button
              onClick={() => navigate(`/destinations/${selectedMarker.slug}`)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#102A43] dark:bg-[#246BCE] hover:bg-[#174A7E] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t('map.exploreDetail', 'Explore in Detail')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate(`/plan?destination=${selectedMarker.slug}`)}
              className="py-3 px-4 rounded-xl bg-[#C89B3C] hover:bg-amber-400 text-[#102A43] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('map.addItinerary', 'Add to Itinerary')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Map Legend in Bottom Corner */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 dark:bg-[#102A43]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-[#1E3A5F] shadow-premium text-xs text-[#102A43] dark:text-[#FAF7F0] max-w-sm pointer-events-auto">
        <div className="flex items-center gap-1.5 font-bold mb-2 text-[#174A7E] dark:text-[#C89B3C]">
          <Layers className="w-3.5 h-3.5" />
          <span>{t('map.legend', 'Map Marker Legend')}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#347A55]"></span>
            <span>{t('map.recommended', 'Recommended')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#246BCE]"></span>
            <span>{t('map.curated', 'Curated Places')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C89B3C]"></span>
            <span>{t('map.heritage', 'Heritage Landmarks')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7A3E9D]"></span>
            <span>{t('map.stories', 'Community Stories')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
