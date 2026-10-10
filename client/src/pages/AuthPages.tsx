import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/discover';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login({ email, password });
      navigate(redirect);
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate(redirect);
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-premium max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-midnight text-brand-gold flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-midnight font-heritage">
            Welcome to TravelXP
          </h1>
          <p className="text-xs text-slate-500">Sign in to access your saved journeys and family stories.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. anamika@travelxp.local"
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-ocean"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold uppercase text-slate-500">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-brand-ocean hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-ocean"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-midnight hover:bg-brand-heritage text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative border-t border-slate-200 pt-4 text-center">
          <span className="text-[11px] bg-white px-2 text-slate-400 absolute top-[-10px] left-1/2 -translate-x-1/2">
            or continue with
          </span>
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-ocean hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(form);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-premium max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-midnight font-heritage">
            Join the TravelXP Community
          </h1>
          <p className="text-xs text-slate-500">
            Create an account to preserve family oral folklore and plan smart journeys.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Your Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Anamika Sharma"
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-ocean"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. anamika@example.com"
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-ocean"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-ocean"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-midnight to-brand-heritage text-white text-xs font-bold shadow-md hover:bg-brand-midnight transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-ocean hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  React.useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error');
        return;
      }
      try {
        await api.verifyEmail(token);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    }
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-premium max-w-md w-full text-center space-y-4">
        {status === 'verifying' && (
          <div>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-ocean mx-auto mb-4"></div>
            <h2 className="text-lg font-bold">Verifying Your Email...</h2>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold">Email Verified Successfully!</h2>
            <p className="text-xs text-slate-500">Your account is fully confirmed and ready for your journeys.</p>
            <Link to="/discover" className="block py-2.5 px-4 rounded-xl bg-brand-midnight text-white text-xs font-bold">
              Explore Destinations
            </Link>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-600">Verification Link Expired</h2>
            <p className="text-xs text-slate-500">The verification token is either invalid or has expired.</p>
            <Link to="/login" className="block py-2.5 px-4 rounded-xl bg-slate-100 text-brand-midnight text-xs font-bold">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
