import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FullWidthIndiaMap } from '../components/map/FullWidthIndiaMap';
import { api } from '../api/client';
import { MapMarker, Story } from '../types';
import {
  Compass,
  MapPin,
  Calendar,
  Ticket,
  BookOpen,
  Feather,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Languages,
  CheckCircle2,
  ChevronDown,
  Clock,
  Wallet,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  // Compact Planner CTA State
  const [plannerDestination, setPlannerDestination] = useState('Varanasi');
  const [plannerDuration, setPlannerDuration] = useState('3');
  const [plannerBudget, setPlannerBudget] = useState('30000');

  useEffect(() => {
    async function loadLandingData() {
      try {
        setLoading(true);
        const [markersData, storiesData] = await Promise.all([
          api.getMapMarkers(),
          api.getStories('limit=3'),
        ]);
        setMarkers(markersData);
        setFeaturedStories(storiesData.stories || []);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLandingData();
  }, []);

  const scrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/plan?destination=${encodeURIComponent(plannerDestination)}&duration=${plannerDuration}&budget=${plannerBudget}`
    );
  };

  const corePillars = [
    {
      title: 'Discover India',
      desc: 'Explore destinations through an interactive map and personalized recommendations.',
      icon: Compass,
      link: '/discover',
      badge: 'Interactive Map',
    },
    {
      title: 'Book Travel',
      desc: 'Find transport, accommodation, and authorized booking-provider links.',
      icon: Ticket,
      link: '/book',
      badge: 'Verified Corridors',
    },
    {
      title: 'Plan My Journey',
      desc: 'Generate a realistic itinerary with travel times, budgets, and rest breaks.',
      icon: Calendar,
      link: '/plan',
      badge: 'Rest-Aware AI',
    },
    {
      title: 'Know the Place',
      desc: 'Discover history, mythology, architecture, and local legends.',
      icon: BookOpen,
      link: '/know',
      badge: 'Citation Provenance',
    },
    {
      title: 'Stories & Heritage',
      desc: 'Read and preserve stories passed down through families and communities.',
      icon: Feather,
      link: '/stories',
      badge: 'Multilingual Archive',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#102A43] overflow-x-hidden">
      {/* ========================================== */}
      {/* SECTION 1: CULTURAL HERO                   */}
      {/* ========================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#102A43] text-[#FAF7F0] px-4 sm:px-6 lg:px-8 py-20">
        {/* Background Video / Optimized Heritage Imagery */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1920&q=80"
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-opacity duration-1000"
          >
            {/* Cinematic India heritage footage */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-temple-complex-41487-large.mp4"
              type="video/mp4"
            />
          </video>
          {/* Refined Cultural Blue Overlay to ensure high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#102A43]/90 via-[#102A43]/85 to-[#102A43]"></div>
          {/* Subtle Classical Indian Architectural Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C89B3C_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TravelXP • Cultural Discovery & Smart Travel</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heritage leading-[1.15] text-[#FAF7F0]">
            Every destination has a story. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#C89B3C] via-[#D9EAF7] to-white bg-clip-text text-transparent">
              Every journey creates a memory.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#D9EAF7]/90 leading-relaxed font-medium">
            Your one-stop platform to discover India's heritage, uncover its mythology, plan meaningful journeys, and find travel and booking options, all in one place.
          </p>

          <p className="text-xs sm:text-sm text-[#C89B3C] font-semibold tracking-wide">
            Explore places. Discover legends. Plan your journey.
          </p>

          {/* Primary Call to Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToMap}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C89B3C] to-amber-500 hover:from-amber-500 hover:to-[#C89B3C] text-[#102A43] font-extrabold text-xs sm:text-sm shadow-gold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore India</span>
            </button>

            <Link
              to="/plan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#174A7E]/60 hover:bg-[#174A7E] text-white font-bold text-xs sm:text-sm border border-[#D9EAF7]/30 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C89B3C]" />
              <span>Plan My Journey</span>
            </Link>
          </div>

          {/* Tertiary Text Link */}
          <div className="pt-2">
            <Link
              to="/stories"
              className="text-xs text-[#D9EAF7]/80 hover:text-white font-semibold underline underline-offset-4 decoration-[#C89B3C] transition-colors inline-flex items-center gap-1.5"
            >
              <Feather className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Discover stories from generations past →</span>
            </Link>
          </div>
        </div>

        {/* Scroll down indicator */}
        <button
          onClick={scrollToMap}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#D9EAF7]/60 hover:text-white animate-bounce p-2"
          aria-label="Scroll to India Map"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </section>

      {/* ========================================== */}
      {/* SECTION 2: FULL-WIDTH INTERACTIVE INDIA MAP*/}
      {/* ========================================== */}
      <section ref={mapSectionRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174A7E]/10 text-[#174A7E] text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Sacred & Heritage Geography</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heritage text-[#102A43]">
            Discover India, one story at a time.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Explore destinations, find places worth visiting, and uncover the cultural stories connected to every journey.
          </p>
        </div>

        {/* Full-width Map Container */}
        <FullWidthIndiaMap markers={markers} />
      </section>

      {/* ========================================== */}
      {/* SECTION 3: EXPLORE TRAVELXP (5 Core Cards) */}
      {/* ========================================== */}
      <section className="py-20 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B3C]">
              The TravelXP Ecosystem
            </span>
            <h2 className="text-3xl font-extrabold font-heritage text-[#102A43]">
              Five Connected Experiences
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to discover, understand, and travel through India's living cultural heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {corePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.title}
                  to={pillar.link}
                  className="bg-[#FAF7F0] rounded-2xl p-6 border border-[#174A7E]/15 hover:border-[#C89B3C] shadow-subtle hover:shadow-premium hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center shadow-sm group-hover:bg-[#246BCE] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#102A43] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-5 flex items-center gap-1.5 text-xs font-bold text-[#246BCE] group-hover:text-[#C89B3C] transition-colors">
                    <span>Explore Experience</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 4: CULTURAL STORY SPOTLIGHT        */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>Living Community Archive</span>
            </div>
            <h2 className="text-3xl font-extrabold font-heritage text-[#102A43]">
              Stories from Generations Past
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Oral traditions, grandmother's tales, and sacred memories preserved in original scripts.
            </p>
          </div>

          <Link
            to="/stories"
            className="text-xs font-bold text-[#246BCE] hover:text-[#102A43] flex items-center gap-1 underline underline-offset-4 shrink-0"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-premium transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                      {story.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">
                      {story.originalLanguage}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#102A43] leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-devanagari">
                    {story.body}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    By <strong>{story.authorDisplayName}</strong>
                  </span>
                  <Link
                    to={`/stories/${story.id}`}
                    className="font-bold text-[#246BCE] hover:underline"
                  >
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
            Stories are currently being curated. Be the first to share an oral family memory.
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* SECTION 5: PLAN YOUR NEXT JOURNEY (CTA)    */}
      {/* ========================================== */}
      <section className="py-16 bg-[#102A43] text-[#FAF7F0] px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#174A7E] to-[#102A43] rounded-3xl p-8 sm:p-12 border border-[#C89B3C]/30 shadow-premium">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C89B3C]">
              Intelligent Itinerary Architect
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heritage">
              Plan Your Next Cultural Journey
            </h2>
            <p className="text-xs sm:text-sm text-[#D9EAF7]/80">
              Generate a realistic day-by-day schedule with travel times, budgets, and rest periods.
            </p>
          </div>

          <form onSubmit={handleQuickPlan} className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#D9EAF7]/70 block mb-1.5">
                Destination
              </label>
              <input
                type="text"
                value={plannerDestination}
                onChange={(e) => setPlannerDestination(e.target.value)}
                placeholder="e.g. Varanasi, Hampi"
                className="w-full text-xs font-bold p-3 rounded-xl bg-white text-[#102A43] border border-slate-200 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#D9EAF7]/70 block mb-1.5">
                Duration
              </label>
              <select
                value={plannerDuration}
                onChange={(e) => setPlannerDuration(e.target.value)}
                className="w-full text-xs font-bold p-3 rounded-xl bg-white text-[#102A43] border border-slate-200 outline-none"
              >
                <option value="2">2 Days (Weekend)</option>
                <option value="3">3 Days (Immersive)</option>
                <option value="5">5 Days (Grand Tour)</option>
                <option value="7">7 Days (Corridor)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#D9EAF7]/70 block mb-1.5">
                Approx. Budget (₹)
              </label>
              <select
                value={plannerBudget}
                onChange={(e) => setPlannerBudget(e.target.value)}
                className="w-full text-xs font-bold p-3 rounded-xl bg-white text-[#102A43] border border-slate-200 outline-none"
              >
                <option value="15000">₹15,000 (Budget)</option>
                <option value="30000">₹30,000 (Comfort)</option>
                <option value="60000">₹60,000 (Premium)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C89B3C] to-amber-500 hover:from-amber-500 hover:to-[#C89B3C] text-[#102A43] font-extrabold text-xs shadow-gold transition-transform hover:scale-105 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Plan Journey</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================== */}
      {/* SECTION 6: ABOUT TRAVELXP                  */}
      {/* ========================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B3C]">
            Our Mission & Purpose
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heritage text-[#102A43]">
            Preserving Cultural Memory. Traveling Smarter.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
            TravelXP brings together travel discovery, intelligent planning, genuine booking options, and the cultural stories that make places meaningful. We honor the oral memories passed down by grandmothers, temple guardians, and local elders, ensuring they remain discoverable alongside verified historical citations and modern transit schedules.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Archaeological Provenance
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#246BCE]" />
              Multilingual Memory Preservation
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C89B3C]" />
              Official Authorized Booking Links
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
