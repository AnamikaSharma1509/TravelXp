import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Feather,
  Globe,
  MapPin,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Eye,
} from 'lucide-react';

export const CreateStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [form, setForm] = useState({
    title: '',
    body: '',
    destinationId: searchParams.get('destinationId') || '',
    originalLanguage: 'en',
    category: "Grandparents' stories",
    attributionPreference: 'DISPLAY_NAME',
    authorDisplayName: user?.displayName || user?.name || '',
    approximatePeriod: '1980s',
    sourceContextNotes: '',
    consent: false,
  });

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await api.getDestinations();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadDestinations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      alert('Please confirm the consent checkbox before submitting your story.');
      return;
    }
    try {
      setLoading(true);
      const story = await api.createStory({
        title: form.title,
        body: form.body,
        destinationId: form.destinationId || undefined,
        originalLanguage: form.originalLanguage,
        category: form.category,
        attributionPreference: form.attributionPreference,
        authorDisplayName: form.authorDisplayName,
        approximatePeriod: form.approximatePeriod,
        sourceContextNotes: form.sourceContextNotes,
      });
      navigate(`/stories/${story.id}`);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit story.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-midnight via-purple-950 to-brand-midnight text-brand-ivory py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/40 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>Preserve a Heritage Memory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heritage">
              Write & Archive Your Family Story
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
        {previewMode ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-premium space-y-4 animate-fadeIn">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
              {form.category}
            </span>
            <h2 className="text-2xl font-extrabold text-brand-midnight">{form.title || 'Untitled Story'}</h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-devanagari">
              {form.body || 'Story narrative text...'}
            </p>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              Preserved by: <strong>{form.authorDisplayName || 'Anonymous'}</strong> ({form.originalLanguage.toUpperCase()})
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-premium space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                Story Title (Original Language)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. दादी की गंगा आरती और मणिकर्णिका की सीख / Grandfather's Waghur river memory..."
                className="w-full p-3.5 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50 focus:ring-2 focus:ring-brand-ocean outline-none font-devanagari"
                required
              />
            </div>

            {/* Language & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                  Original Language / Script
                </label>
                <select
                  value={form.originalLanguage}
                  onChange={(e) => setForm({ ...form, originalLanguage: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="bho">भोजपुरी (Bhojpuri)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                  Story Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
                >
                  <option value="Grandparents' stories">Grandparents' stories</option>
                  <option value="Family memories">Family memories</option>
                  <option value="Local legends">Local legends</option>
                  <option value="Temple traditions">Temple traditions</option>
                  <option value="Folk tales">Folk tales</option>
                </select>
              </div>
            </div>

            {/* Destination Link */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                Associated Indian Destination
              </label>
              <select
                value={form.destinationId}
                onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
              >
                <option value="">-- General Cultural Memory (Not linked to single city) --</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Story Body */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                Story Narrative (Write naturally in your mother tongue)
              </label>
              <textarea
                rows={7}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write the story as it was shared with you..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs leading-relaxed bg-slate-50 focus:ring-2 focus:ring-brand-ocean outline-none font-devanagari"
                required
              ></textarea>
            </div>

            {/* Attribution Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                  Attribution Style
                </label>
                <select
                  value={form.attributionPreference}
                  onChange={(e) => setForm({ ...form, attributionPreference: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
                >
                  <option value="DISPLAY_NAME">Public Display Name</option>
                  <option value="PSEUDONYM">Custom Pseudonym</option>
                  <option value="ANONYMOUS">Anonymous Community Voice</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">
                  Author / Narrator Name to Show
                </label>
                <input
                  type="text"
                  value={form.authorDisplayName}
                  onChange={(e) => setForm({ ...form, authorDisplayName: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50"
                />
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                className="mt-1 w-4 h-4 text-brand-ocean rounded"
                required
              />
              <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                I confirm that this oral memory, story, or legend is shared with respectful intentions for cultural preservation. I consent to its public archiving on TravelXP.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-midnight to-brand-heritage hover:bg-brand-midnight text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Feather className="w-4 h-4 text-brand-gold" />
              <span>{loading ? 'Submitting to Archive...' : 'Publish Story to Heritage Archive'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
