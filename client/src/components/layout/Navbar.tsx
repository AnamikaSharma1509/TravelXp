import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/LanguageContext';
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
  Sun,
  Moon,
  ChevronDown,
  Settings,
  HelpCircle,
  Info,
  Check,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { t, language, setLanguage, supportedLanguages, currentOption } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { label: t('nav.discover', 'Discover India'), path: '/discover', icon: Compass },
    { label: t('nav.book', 'Book Travel'), path: '/book', icon: Ticket },
    { label: t('nav.plan', 'Plan My Journey'), path: '/plan', icon: Calendar },
    { label: t('nav.know', 'Know the Place'), path: '/know', icon: BookOpen },
    { label: t('nav.stories', 'Stories & Heritage'), path: '/stories', icon: Feather },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchInput(false);
    }
  };

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#102A43] dark:bg-[#071320] text-[#FAF7F0] border-b border-[#174A7E]/40 dark:border-[#1E3A5F] shadow-premium transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
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
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center max-w-3xl">
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
                  <Icon className="w-4 h-4 shrink-0 text-[#C89B3C]" />
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
                    placeholder={t('nav.searchPlaceholder', 'Search destinations...')}
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
                  title={t('common.search', 'Search')}
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Selector (24 Languages, Solid Opaque Dropdown) */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#D9EAF7] hover:text-white hover:bg-[#174A7E]/50 border border-[#174A7E]/40 whitespace-nowrap transition-colors"
                aria-haspopup="true"
                aria-expanded={langDropdownOpen}
                title={t('nav.language', 'Language')}
              >
                <Globe className="w-3.5 h-3.5 text-[#C89B3C]" />
                <span>{currentOption.nativeName}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white dark:bg-[#102A43] text-[#102A43] dark:text-[#FAF7F0] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1E3A5F] py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-[#1E3A5F] text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    {t('profile.language', 'Interface Language')} ({supportedLanguages.length})
                  </div>
                  <div className="py-1">
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between font-medium ${
                          language === l.code
                            ? 'bg-[#246BCE]/10 text-[#246BCE] dark:text-[#D9EAF7] font-bold'
                            : 'hover:bg-slate-50 dark:hover:bg-[#174A7E]/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-semibold">{l.nativeName}</span>
                          <span className="text-[10px] text-slate-400">({l.label})</span>
                        </span>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-[#246BCE]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Complete Profile Dropdown (Sole account trigger) */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C89B3C] hover:bg-amber-400 text-[#102A43] font-bold text-xs shadow-subtle transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#C89B3C]/50"
                  aria-haspopup="true"
                  aria-expanded={profileDropdownOpen}
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-[#102A43] text-[#C89B3C] flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.displayName || user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                </button>

                {/* SOLID OPAQUE PROFILE DROPDOWN */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#102A43] text-[#102A43] dark:text-[#FAF7F0] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1E3A5F] py-2 z-50 animate-fadeIn">
                    {/* User Header Section */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-[#1E3A5F] bg-slate-50 dark:bg-[#071320]/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#174A7E] to-[#246BCE] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                          {(user.displayName || user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold truncate text-[#102A43] dark:text-white">
                            {user.displayName || user.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C89B3C]/20 text-[#C89B3C] border border-[#C89B3C]/40">
                            {user.role === 'ADMIN' ? 'Curator Admin' : 'Heritage Explorer'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Navigation Links */}
                    <div className="py-2 px-2 space-y-0.5">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t('profile.accountSection', 'Account')}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#246BCE]" />
                        <span>{t('profile.myAccount', 'My Profile')}</span>
                      </Link>
                      <Link
                        to="/my-trips"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#347A55]" />
                        <span>{t('profile.myTrips', 'My Saved Trips')}</span>
                      </Link>
                      <Link
                        to="/stories/new"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <Feather className="w-4 h-4 text-[#C89B3C]" />
                        <span>{t('profile.preserveStory', 'Preserve Family Story')}</span>
                      </Link>
                      <Link
                        to="/stories"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>{t('nav.stories', 'Stories & Heritage Archive')}</span>
                      </Link>
                    </div>

                    {/* Preferences & Theme Toggle */}
                    <div className="py-2 px-2 border-t border-slate-100 dark:border-[#1E3A5F] space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t('profile.preferencesSection', 'Preferences')}
                      </div>

                      {/* Theme Toggle Button */}
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                        role="menuitem"
                      >
                        <div className="flex items-center gap-2.5">
                          {isDark ? (
                            <Moon className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-500" />
                          )}
                          <span>{isDark ? t('nav.darkMode', 'Dark Mode') : t('nav.lightMode', 'Light Mode')}</span>
                        </div>
                        <div className="w-8 h-4 bg-slate-300 dark:bg-[#246BCE] rounded-full p-0.5 flex items-center transition-colors">
                          <div
                            className={`w-3 h-3 rounded-full bg-white transition-transform ${
                              isDark ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </button>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>{t('profile.settings', 'Account Settings')}</span>
                      </Link>
                    </div>

                    {/* Other Navigation */}
                    <div className="py-2 px-2 border-t border-slate-100 dark:border-[#1E3A5F] space-y-0.5">
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#C89B3C] hover:bg-amber-50 dark:hover:bg-[#174A7E]/50 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-[#C89B3C]" />
                          <span>{t('profile.adminDashboard', 'Curator Admin Console')}</span>
                        </Link>
                      )}
                      <Link
                        to="/about"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <Info className="w-4 h-4 text-slate-400" />
                        <span>{t('profile.about', 'About TravelXP')}</span>
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-[#174A7E]/50 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        <span>{t('profile.help', 'Help & Contact')}</span>
                      </Link>
                    </div>

                    {/* Account Action: Sign Out at Bottom */}
                    <div className="pt-2 px-2 border-t border-slate-100 dark:border-[#1E3A5F]">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span>{t('profile.signOut', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-[#D9EAF7]/80 hover:text-white hover:bg-[#174A7E]/40 transition-colors"
                  title="Toggle Light/Dark Theme"
                  aria-label="Toggle Theme"
                >
                  {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </button>
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl text-[#FAF7F0] hover:text-white hover:bg-[#174A7E]/40 transition-colors whitespace-nowrap"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#C89B3C] text-[#102A43] hover:bg-amber-400 shadow-subtle transition-all whitespace-nowrap"
                >
                  {t('nav.join', 'Join TravelXP')}
                </Link>
              </div>
            )}
          </div>

          {/* Tablet & Mobile Menu Button (Visible below xl breakpoint) */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-[#FAF7F0] hover:bg-[#174A7E]/50 rounded-xl transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {isDark ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </button>
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
        <div className="xl:hidden bg-[#102A43] dark:bg-[#071320] border-t border-[#174A7E]/40 dark:border-[#1E3A5F] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder={t('nav.searchPlaceholder', 'Search destinations...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#174A7E]/40 text-white placeholder-slate-300 rounded-xl pl-9 pr-3 py-2.5 border border-[#174A7E]"
            />
            <Search className="w-4 h-4 text-slate-300 absolute left-3 top-3" />
          </form>

          {/* Mobile Navigation Links */}
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

          {/* Mobile Language Selector */}
          <div className="pt-2 border-t border-[#174A7E]/40 dark:border-[#1E3A5F]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
              {t('profile.language', 'Language')} ({currentOption.nativeName})
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full text-xs bg-[#174A7E]/50 text-white border border-[#174A7E] rounded-xl p-2.5 outline-none font-semibold"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code} className="bg-[#102A43] text-white">
                  {l.nativeName} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile User Controls */}
          <div className="pt-3 border-t border-[#174A7E]/40 dark:border-[#1E3A5F] flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3.5 py-2 bg-[#174A7E]/40 rounded-xl">
                  <p className="text-xs font-bold text-white">{user.displayName || user.name}</p>
                  <p className="text-[10px] text-slate-300">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#C89B3C] hover:text-white"
                >
                  {t('profile.myAccount', 'My Profile & Preferences')}
                </Link>
                <Link
                  to="/my-trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#D9EAF7] hover:text-white"
                >
                  {t('profile.myTrips', 'My Saved Trips')}
                </Link>
                <Link
                  to="/stories/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3.5 py-2.5 text-xs font-semibold text-[#D9EAF7] hover:text-white"
                >
                  {t('profile.preserveStory', 'Preserve Family Story')}
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3.5 py-2.5 text-xs font-semibold text-[#C89B3C]"
                  >
                    {t('profile.adminDashboard', 'Curator Admin Console')}
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3.5 py-2.5 text-xs text-red-400 font-bold"
                >
                  {t('profile.signOut', 'Sign Out')}
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-semibold rounded-xl bg-[#174A7E]/60 text-white"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold rounded-xl bg-[#C89B3C] text-[#102A43]"
                >
                  {t('nav.join', 'Join TravelXP')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
