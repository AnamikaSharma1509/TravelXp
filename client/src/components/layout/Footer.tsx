import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Sparkles, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-midnight text-brand-ivory border-t border-brand-heritage/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-heritage/30">
          {/* Brand Vision */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-ocean to-brand-gold flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heritage tracking-wider text-brand-gold">
                TRAVELXP
              </span>
            </div>
            <p className="text-xs text-brand-sky/80 leading-relaxed">
              Every destination has a story. Every journey has a memory. Preserving Indian cultural heritage, folklore, and smart itineraries.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-brand-gold/90 font-medium pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Rooted in the Soil of India</span>
            </div>
          </div>

          {/* Core Experiences */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-4">
              Explore TravelXP
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-sky/80">
              <li><Link to="/discover" className="hover:text-white transition-colors">Discover India (Map)</Link></li>
              <li><Link to="/book" className="hover:text-white transition-colors">Book Travel Hub</Link></li>
              <li><Link to="/plan" className="hover:text-white transition-colors">Plan My Journey (AI)</Link></li>
              <li><Link to="/know" className="hover:text-white transition-colors">Know the Place (Culture)</Link></li>
              <li><Link to="/stories" className="hover:text-white transition-colors">Stories & Heritage Archive</Link></li>
            </ul>
          </div>

          {/* Cultural Preservation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-4">
              Heritage & Memory
            </h4>
            <ul className="space-y-2.5 text-xs text-brand-sky/80">
              <li><Link to="/stories/new" className="hover:text-white transition-colors">Preserve a Family Story</Link></li>
              <li><Link to="/know" className="hover:text-white transition-colors">Mythology & Sacred Legends</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">The TravelXP Philosophy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Curators</Link></li>
            </ul>
          </div>

          {/* Trust, Legal & Provenance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-4">
              Provenance & Trust
            </h4>
            <p className="text-[11px] text-brand-sky/70 leading-relaxed mb-4">
              Historical claims are cross-referenced with archaeological records. Sacred narratives and family memories are preserved with respectful provenance labels.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-brand-sky/60">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-sky/60 gap-4">
          <p>© {new Date().getFullYear()} TravelXP. All rights reserved. Cultivated with devotion for Indian Cultural Discovery.</p>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>for explorers & storytellers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
