import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import {
  Compass,
  Mail,
  Send,
  Shield,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Wallet,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-premium space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">About TravelXP</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heritage text-brand-midnight">
            Every Destination Has a Story. Every Journey Has a Memory.
          </h1>
        </div>

        <div className="prose text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
          <p>
            TravelXP was born from personal childhood journeys across the sacred and historic landscapes of India. We grew up listening to our grandmothers recount why ancient temples stood where rivers met, and hearing guides whisper the legends hidden inside carved basalt caves.
          </p>
          <p>
            Conventional travel websites treat destinations as inventory—tickets to sell, rooms to occupy. TravelXP reconnects the fragmented facets of modern exploration:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Discover:</strong> An interactive map of India with clear semantic markers and personalized recommendations.</li>
            <li><strong>Book:</strong> Genuine transport and accommodation discovery through authorized providers.</li>
            <li><strong>Plan:</strong> Realistic day-by-day itineraries that respect human fatigue, transit duration, and temple timings.</li>
            <li><strong>Know:</strong> Archaeological and cultural provenance that separates verified history from sacred folklore.</li>
            <li><strong>Preserve Stories:</strong> A multilingual living archive for family memories in English, Hindi, Marathi, and Bhojpuri.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.submitContact(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      alert('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-premium space-y-6">
        <div className="text-center space-y-2">
          <Mail className="w-8 h-8 text-brand-ocean mx-auto" />
          <h1 className="text-2xl font-extrabold font-heritage">Contact the Curators</h1>
          <p className="text-xs text-slate-500">Inquire about heritage partnerships or submit regional suggestions.</p>
        </div>

        {sent && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thank you! Your message has been logged by our editorial desk.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Your Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Message</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-midnight text-white text-xs font-bold hover:bg-brand-heritage transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-brand-gold" />
            <span>{loading ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight py-16 px-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold font-heritage">Privacy & Cultural Consent Policy</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-4 shadow-sm">
        <p><strong>1. Respect for Contributor Identity:</strong> Authors sharing family memories retain attribution rights and may publish under their display name, a pseudonym, or anonymously.</p>
        <p><strong>2. Machine Translation Safeguards:</strong> Original texts submitted by community members are never overwritten or deleted. Translations are stored in separate relational records.</p>
        <p><strong>3. Transparent Authentication:</strong> Passwords are protected using salted cryptographic hashes. Verification and reset tokens are securely hashed on the server.</p>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight py-16 px-4 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold font-heritage">Terms of Service & Editorial Guidelines</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-4 shadow-sm">
        <p><strong>1. Cultural Sensitivity:</strong> Submissions must treat all religious traditions, monuments, and oral histories with respect.</p>
        <p><strong>2. Booking Providers:</strong> External booking links connect to authorized partners (e.g., IRCTC, airlines). TravelXP does not fabricate reservations or guarantee live pricing on external systems.</p>
      </div>
    </div>
  );
};

export const SharedTripPage: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!shareToken) return;
      try {
        setLoading(true);
        const data = await api.getSharedTrip(shareToken);
        setTrip(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F0] p-4 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Shared Itinerary Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">This share link has expired or has been revoked by the creator.</p>
          <Link to="/discover" className="px-4 py-2 bg-brand-midnight text-white rounded-xl text-xs font-bold">
            Explore Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-brand-midnight text-white p-8 rounded-3xl shadow-premium space-y-2">
          <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider">Shared Journey</span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heritage">{trip.title}</h1>
          <p className="text-xs text-brand-sky">{trip.destination} • {trip.travelerCount} Travelers</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-brand-midnight">Itinerary Schedule</h3>
          <div className="space-y-6">
            {trip.days?.map((day: any) => (
              <div key={day.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-brand-ocean">
                  <span>Day {day.dayNumber}</span>
                  <span>{new Date(day.date).toLocaleDateString()}</span>
                </div>
                <h4 className="font-extrabold text-sm">{day.title}</h4>
                <div className="space-y-2 pl-4 border-l-2 border-brand-ocean/40">
                  {day.activities?.map((a: any) => (
                    <div key={a.id} className="text-xs">
                      <strong>{a.startTime} - {a.endTime}:</strong> {a.title} ({a.category})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-4">
        <Compass className="w-16 h-16 text-brand-gold mx-auto" />
        <h1 className="text-3xl font-extrabold font-heritage text-brand-midnight">Page Not Found</h1>
        <p className="text-xs text-slate-500">The destination or story you are seeking could not be found.</p>
        <Link to="/discover" className="inline-block px-6 py-2.5 rounded-xl bg-brand-midnight text-white text-xs font-bold">
          Return to Discover Map
        </Link>
      </div>
    </div>
  );
};
