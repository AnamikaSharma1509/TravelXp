import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapMarker } from '../../types';
import { Compass, Sparkles, BookOpen, Layers } from 'lucide-react';

interface IndiaMapProps {
  markers: MapMarker[];
  selectedMarkerId?: string;
  onSelectMarker: (marker: MapMarker) => void;
  filterColor?: string;
}

// Custom Leaflet DivIcon for pins
const createCustomIcon = (colorClass: string, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="custom-pin ${colorClass} ${isSelected ? 'ring-4 ring-brand-gold scale-125' : ''}">
        <div class="custom-pin-inner"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const MapController: React.FC<{ center?: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 6, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

export const IndiaMap: React.FC<IndiaMapProps> = ({
  markers,
  selectedMarkerId,
  onSelectMarker,
  filterColor,
}) => {
  const [activeCenter, setActiveCenter] = useState<[number, number] | undefined>(undefined);

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId);

  useEffect(() => {
    if (selectedMarker) {
      setActiveCenter([selectedMarker.latitude, selectedMarker.longitude]);
    }
  }, [selectedMarkerId]);

  const filteredMarkers = filterColor
    ? markers.filter((m) => m.markerColor === filterColor)
    : markers;

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-premium border border-brand-heritage/15 bg-slate-100">
      <MapContainer
        center={[22.3511, 78.6677]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={activeCenter} zoom={7} />

        {filteredMarkers.map((marker) => {
          const isSelected = marker.id === selectedMarkerId;
          const colorClass = `pin-${marker.markerColor}`;
          const icon = createCustomIcon(colorClass, isSelected);

          return (
            <Marker
              key={marker.id}
              position={[marker.latitude, marker.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectMarker(marker),
              }}
            >
              <Popup>
                <div className="w-64 p-3 bg-white text-brand-midnight">
                  <div className="relative h-28 rounded-lg overflow-hidden mb-2">
                    <img
                      src={marker.heroImage}
                      alt={marker.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-midnight/80 text-brand-ivory backdrop-blur-sm">
                      {marker.markerBadge}
                    </span>
                  </div>
                  <h4 className="font-bold text-base leading-snug">{marker.name}</h4>
                  <p className="text-xs text-brand-slate mb-2">
                    {marker.state} • {marker.region} India
                  </p>
                  <p className="text-xs line-clamp-2 text-slate-600 mb-3">{marker.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-medium text-brand-heritage flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {marker.storyCount} Stories
                    </span>
                    <button
                      onClick={() => onSelectMarker(marker)}
                      className="text-xs font-semibold text-brand-ocean hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-brand-heritage/15 shadow-premium text-xs text-brand-midnight max-w-xs">
        <div className="flex items-center gap-1.5 font-bold mb-2 text-brand-heritage">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Map Guide</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#347A55]"></span>
            <span className="text-[11px]">Recommended for You</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#246BCE]"></span>
            <span className="text-[11px]">Curated Essential</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#C89B3C]"></span>
            <span className="text-[11px]">Heritage Landmark</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#B86B4B]"></span>
            <span className="text-[11px]">Community Memory</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <span className="w-3 h-3 rounded-full bg-[#7A3E9D]"></span>
            <span className="text-[11px]">Multiple Published Stories</span>
          </div>
        </div>
      </div>
    </div>
  );
};
