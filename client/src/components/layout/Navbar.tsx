import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Calendar,
  Ticket,
  BookOpen,
  Feather,
  Globe,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Shield,
  Search,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navItems = [
    { label: 'Discover India', path: '/discover', icon: Compass },
    { label: 'Book Travel', path: '/book', icon: Ticket },
    { label: 'Plan My Journey', path: '/plan', icon: Calendar },
    { label: 'Know the Place', path: '/know', icon: BookOpen },
    { label: 'Stories & Heritage', path: '/stories', icon: Feather },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bho', label: 'भोजपुरी (Bhojpuri)' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchInput(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#102A43] text-[#FAF7F0] border-b border-[#174A7E]/40 shadow-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo - shrink-0 to prevent layout squeezing */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#174A7E] via-[#246BCE] to-[#C89B3C] flex items-center justify-center shadow-gold transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-heritage bg-gradient-to-r from-[#FAF7F0] via-[#D9EAF7] to-[#C89B3C] bg-clip-text text-transparent leading-tight">
                TRAVELXP
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#C89B3C] font-semibold">
                Culture • Journeys • Stories
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - xl:flex prevents awkward wrapping */}
          <nav className="hidden xl:flex items-center gap-1.5 flex-1 justify-center max-w-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#246BCE] text-white shadow-subtle'
                      : 'text-[#FAF7F0]/85 hover:text-white hover:bg-[#174A7E]/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Quick Search */}
            <div className="relative">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center animate-fadeIn">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setShowSearchInput(false)}
                    className="w-44 lg:w-52 text-xs bg-[#174A7E]/50 text-white placeholder-slate-300 rounded-full pl-8 pr-3 py-1.5 border border-[#174A7E] focus:outline-none focus:ring-1 focus:ring-[#C89B3C]"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-300 absolute left-2.5 top-2.5" />
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 rounded-xl text-[#D9EAF7]/80 hover:text-white hover:bg-[#174A7E]/40 transition-colors"
                  title="Search places"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D9EAF7]/90 hover:text-white hover:bg-[#174A7E]/50 border border-[#174A7E]/40 whitespace-nowrap transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{selectedLanguage}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-[#102A43] rounded-xl shadow-premium border border-slate-200 py-1.5 z-50 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLanguage(l.label.split(' ')[0]);
                        setLangDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#D9EAF7]/30 transition-colors font-medium flex items-center justify-between"
                    >
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="p-2 rounded-xl text-[#C89B3C] hover:bg-[#174A7E]/50 transition-colors"
                    title="Curator Admin Dashboard"
                  >
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  to="/my-trips"
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#174A7E]/60 hover:bg-[#174A7E] transition-colors text-white whitespace-nowrap"
                >
                  My Trips
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C89B3C] text-[#102A43] font-bold text-xs hover:bg-amber-400 transition-colors whitespace-nowrap"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{user.displayName || user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-[#D9EAF7]/70 hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl text-[#FAF7F0] hover:text-white hover:bg-[#174A7E]/40 transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#C89B3C] text-[#102A43] hover:bg-amber-400 shadow-subtle transition-all whitespace-nowrap"
                >
                  Join TravelXP
                </Link>
              </div>
            )}
          </div>

          {/* Tablet & Mobile Menu Button (Visible below xl breakpoint) */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FAF7F0] hover:bg-[#174A7E]/50 rounded-xl transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#102A43] border-t border-[#174A7E]/40 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#174A7E]/40 text-white placeholder-slate-300 rounded-xl pl-9 pr-3 py-2.5 border border-[#174A7E]"
            />
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-3" />
          </form>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#246BCE] text-white'
                      : 'text-[#FAF7F0] hover:bg-[#174A7E]/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C89B3C]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-[#174A7E]/40 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/my-trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#D9EAF7] hover:text-white"
                >
                  My Saved Journeys
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#C89B3C]"
                >
                  Profile & Preferences ({user.displayName || user.name})
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 text-xs font-semibold text-[#C89B3C]"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3.5 py-2.5 text-xs text-red-400 font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-semibold rounded-xl bg-[#174A7E]/60 text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold rounded-xl bg-[#C89B3C] text-[#102A43]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
