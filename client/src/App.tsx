import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Lazy-loaded page components for optimal bundle splitting and performance
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })));
const DestinationDetailPage = lazy(() => import('./pages/DestinationDetailPage').then((m) => ({ default: m.DestinationDetailPage })));
const BookTravelPage = lazy(() => import('./pages/BookTravelPage').then((m) => ({ default: m.BookTravelPage })));
const PlanTripPage = lazy(() => import('./pages/PlanTripPage').then((m) => ({ default: m.PlanTripPage })));
const PlanResultsPage = lazy(() => import('./pages/PlanResultsPage').then((m) => ({ default: m.PlanResultsPage })));
const MyTripsPage = lazy(() => import('./pages/MyTripsPage').then((m) => ({ default: m.MyTripsPage })));
const KnowPage = lazy(() => import('./pages/KnowPage').then((m) => ({ default: m.KnowPage })));
const StoriesPage = lazy(() => import('./pages/StoriesPage').then((m) => ({ default: m.StoriesPage })));
const CreateStoryPage = lazy(() => import('./pages/CreateStoryPage').then((m) => ({ default: m.CreateStoryPage })));
const StoryDetailPage = lazy(() => import('./pages/StoryDetailPage').then((m) => ({ default: m.StoryDetailPage })));
const LoginPage = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.RegisterPage })));
const VerifyEmailPage = lazy(() => import('./pages/AuthPages').then((m) => ({ default: m.VerifyEmailPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AboutPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.TermsPage })));
const SharedTripPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.SharedTripPage })));
const NotFoundPage = lazy(() => import('./pages/StaticPages').then((m) => ({ default: m.NotFoundPage })));

// Heritage loading placeholder to prevent layout shifts
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF7F0] text-[#102A43]">
    <div className="w-12 h-12 rounded-2xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center animate-pulse shadow-gold mb-3">
      <div className="w-6 h-6 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin"></div>
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-[#174A7E]">
      Loading Journey Experience...
    </span>
  </div>
);

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-[#FAF7F0] dark:bg-[#0B192C] text-[#102A43] dark:text-[#FAF7F0] transition-colors duration-200">
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/explore" element={<DiscoverPage />} />
                    <Route path="/destinations" element={<DiscoverPage />} />
                    <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                    <Route path="/book" element={<BookTravelPage />} />
                    <Route path="/plan" element={<PlanTripPage />} />
                    <Route path="/plan/results" element={<PlanResultsPage />} />
                    <Route path="/know" element={<KnowPage />} />
                    <Route path="/know/:slug" element={<DestinationDetailPage />} />
                    <Route path="/stories" element={<StoriesPage />} />
                    <Route path="/stories/:id" element={<StoryDetailPage />} />
                    <Route path="/stories/new" element={<CreateStoryPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/shared/:shareToken" element={<SharedTripPage />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />

                    {/* Authenticated / User Routes */}
                    <Route path="/my-trips" element={<MyTripsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<ProfilePage />} />

                    {/* Administrative Routes */}
                    <Route path="/admin" element={<AdminDashboardPage />} />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
