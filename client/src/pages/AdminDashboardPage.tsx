import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Shield,
  Layers,
  Feather,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Compass,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'moderation' | 'destinations'>('moderation');

  // Destination Form State
  const [destForm, setDestForm] = useState({
    name: '',
    state: '',
    region: 'North',
    latitude: 28.6139,
    longitude: 77.2090,
    description: '',
    heroImage: '',
    categories: ['Heritage', 'Spiritual'],
    bestTimeToVisit: 'October to March',
    estimatedBudget: '₹2,500 - ₹5,000 / day',
  });
  const [destCreated, setDestCreated] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login?redirect=/admin');
      return;
    }

    async function loadAdminData() {
      try {
        setLoading(true);
        const [statsData, storiesData] = await Promise.all([
          api.getAdminStats(),
          api.getAdminStories(),
        ]);
        setStats(statsData);
        setStories(storiesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [user, navigate]);

  const handleModerate = async (storyId: string, status: string) => {
    try {
      await api.moderateStory(storyId, status);
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, moderationStatus: status } : s))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDestination(destForm);
      setDestCreated(true);
      setTimeout(() => setDestCreated(false), 3000);
      setDestForm({
        name: '',
        state: '',
        region: 'North',
        latitude: 28.6139,
        longitude: 77.2090,
        description: '',
        heroImage: '',
        categories: ['Heritage'],
        bestTimeToVisit: 'October to March',
        estimatedBudget: '₹2,500 - ₹5,000 / day',
      });
    } catch (err) {
      alert('Failed to create destination');
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-brand-midnight pb-20">
      {/* Header */}
      <div className="bg-brand-midnight text-brand-ivory py-10 px-4 sm:px-6 lg:px-8 border-b border-brand-heritage/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Curator Administrative Console</span>
            </div>
            <h1 className="text-3xl font-extrabold font-heritage">
              TravelXP Heritage & Quality Control
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Curated Destinations</span>
              <p className="text-2xl font-extrabold text-brand-midnight mt-1">{stats.destinationsCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Published Stories</span>
              <p className="text-2xl font-extrabold text-brand-midnight mt-1">{stats.storiesCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Community Members</span>
              <p className="text-2xl font-extrabold text-brand-midnight mt-1">{stats.usersCount}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase">Pending Reports</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pendingReportsCount}</p>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'moderation'
                ? 'border-brand-ocean text-brand-ocean'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Story Moderation Feed ({stories.length})
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'destinations'
                ? 'border-brand-ocean text-brand-ocean'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Add Curated Destination
          </button>
        </div>

        {/* Tab 1: Story Moderation Feed */}
        {activeTab === 'moderation' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Submitted Community Stories</h3>
            <div className="space-y-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                        {story.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        story.moderationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {story.moderationStatus}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-brand-midnight">{story.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{story.body}</p>
                    <span className="text-[11px] text-slate-400 block">
                      Author: {story.authorDisplayName} ({story.originalLanguage.toUpperCase()})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleModerate(story.id, 'APPROVED')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleModerate(story.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Destination Creator */}
        {activeTab === 'destinations' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-2xl">
            <h3 className="text-base font-bold text-brand-midnight mb-4">Register New Indian Destination</h3>
            {destCreated && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs mb-4">
                Destination created and added to interactive map successfully!
              </div>
            )}
            <form onSubmit={handleCreateDestination} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Destination Name</label>
                  <input
                    type="text"
                    value={destForm.name}
                    onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                    placeholder="e.g. Badami"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">State</label>
                  <input
                    type="text"
                    value={destForm.state}
                    onChange={(e) => setDestForm({ ...destForm, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={destForm.latitude}
                    onChange={(e) => setDestForm({ ...destForm, latitude: parseFloat(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={destForm.longitude}
                    onChange={(e) => setDestForm({ ...destForm, longitude: parseFloat(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Hero Image URL</label>
                <input
                  type="url"
                  value={destForm.heroImage}
                  onChange={(e) => setDestForm({ ...destForm, heroImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Cultural Description</label>
                <textarea
                  rows={3}
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-brand-midnight text-white text-xs font-bold hover:bg-brand-heritage transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-brand-gold" />
                <span>Save & Publish to Map</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
