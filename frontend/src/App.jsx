/**
 * Main Application Component with Route-based Code Splitting
 * Implements lazy loading for improved performance
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Deployments from './pages/Deployments'
import TemplateGallery from "./pages/TemplateGallery";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { SocketProvider } from './context/SocketProvider';
import { ThemeProvider } from './context/ThemeProvider';
import AppLayout from './components/AppLayout';
import Footer from './components/ui/Footer';

import CommandPalette from './components/CommandPalette';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
const Dashboard = lazy(() => import('./pages/Dashboard'));
import Upload from './pages/Upload';
import Enhance from './pages/Enhance';
import ResumeView from './pages/ResumeView';
const JobSearch = lazy(() => import('./pages/JobSearch'));
import JobAlerts from './pages/JobAlerts';
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
import TextToResume from './pages/TextToResume';
import About from './components/portfolio/templates/Tech_Startup/About';
import ChatbotPortfolio from "./components/portfolio/templates/Chatbot_Portfolio";
import GamifiedXP from "./components/portfolio/templates/Gamified_XP";

import JobTracker from './pages/JobTracker';
const Community = lazy(() => import('./pages/Community'));
import { NotFound } from './pages';
import InterviewPrep from './pages/InterviewPrep';
import UserProfile from './pages/UserProfile';
import EmailGenerator from './pages/EmailGenerator';
import LinkedInOptimizer from './pages/LinkedInOptimizer';
import FellowshipLayout from './pages/fellowship/FellowshipLayout';
import Onboarding from './pages/fellowship/Onboarding';
import Challenges from './pages/fellowship/Challenges';
import Settings from './pages/Settings';
import ChallengeDetail from './pages/fellowship/ChallengeDetail';
import CreateChallenge from './pages/fellowship/CreateChallenge';
import MyProposals from './pages/fellowship/MyProposals';
import MyChallenges from './pages/fellowship/MyChallenges';
import ChallengeProposals from './pages/fellowship/ChallengeProposals';
import Verify from './pages/fellowship/Verify';
import FellowshipMessages from './pages/fellowship/FellowshipMessages';
import FellowshipChat from './pages/fellowship/FellowshipChat';
import SecuritySettings from './pages/SecuritySettings';
import LinkedInCallback from './pages/LinkedInCallback';
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
import OpenRouterCallback from './pages/OpenRouterCallback';
import LegalPageErrorBoundary from './components/LegalPageErrorBoundary';

// Hub Imports
import ResumeHub from './pages/hubs/ResumeHub';
import JobsHub from './pages/hubs/JobsHub';
import PortfolioHub from './pages/hubs/PortfolioHub';
import CareerGrowthHub from './pages/hubs/CareerGrowthHub';
import CommunityHub from './pages/hubs/CommunityHub';
const GitHubDashboard = lazy(() => import('./pages/GitHubDashboard'));
const RepoAnalyzerLanding = lazy(() => import('./pages/RepoAnalyzer/Landing'));
const RepoAnalyzerDashboard = lazy(() => import('./pages/RepoAnalyzer/Dashboard'));
const RepoAnalyzerWorkspace = lazy(() => import('./pages/RepoAnalyzer/Workspace'));
import ScrollToTop from "./components/ScrollToTop";
import RainforestCanopy from './components/portfolio/templates/Rainforest_Canopy/index.jsx';
import TestSocialLinks from './pages/TestSocialLinks';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading CareerPilot...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}


function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading CareerPilot...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!!user && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          setIsOpen={setIsCommandPaletteOpen}
        />
      )}
      <div className="bg-mesh" />
      <BackToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "careerpilot-toast",
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(8px)",
          },
          success: {
            iconTheme: { primary: "#10B981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#fff" },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/auth/openrouter/callback" element={<OpenRouterCallback />} />

        {/* Legal Pages (Public) */}
        <Route path="/privacy" element={<LegalPageErrorBoundary><Suspense fallback={null}><PrivacyPolicy /></Suspense></LegalPageErrorBoundary>} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<LegalPageErrorBoundary><Suspense fallback={null}><TermsOfService /></Suspense></LegalPageErrorBoundary>} />
        <Route path="/cookies" element={<LegalPageErrorBoundary><Suspense fallback={null}><CookiePolicy /></Suspense></LegalPageErrorBoundary>} />

        {/* Template Gallery Route (Registered at /templates) */}
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/templates/chatbot" element={<ChatbotPortfolio />} />
        <Route path="/templates/gamified-xp" element={<GamifiedXP />} />
        {/* Core Protected Routes */}
        <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Dashboard...</div>}>
        <Dashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route 
  path="/resume-builder" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Resume Builder...</div>}>
        <ResumeBuilder />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/text-to-resume" element={<ProtectedRoute><TextToResume /></ProtectedRoute>} />
        <Route path="/enhance/:resumeId" element={<ProtectedRoute><Enhance /></ProtectedRoute>} />
        <Route path="/resume/:resumeId" element={<ProtectedRoute><ResumeView /></ProtectedRoute>} />
        <Route 
  path="/jobs" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Jobs...</div>}>
        <JobSearch />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/job-alerts" element={<ProtectedRoute><JobAlerts /></ProtectedRoute>} />
        <Route path="/job-tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
        <Route 
  path="/community" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Community...</div>}>
        <Community />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/:uid" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
        <Route path="/email-generator" element={<ProtectedRoute><EmailGenerator /></ProtectedRoute>} />
        <Route path="/linkedin-optimizer" element={<ProtectedRoute><LinkedInOptimizer /></ProtectedRoute>} />
        <Route path="/deployments" element={<ProtectedRoute><Deployments /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Hub Routes */}
        <Route path="/hub/resume" element={<ProtectedRoute><ResumeHub /></ProtectedRoute>} />
        <Route path="/hub/jobs" element={<ProtectedRoute><JobsHub /></ProtectedRoute>} />
        <Route path="/hub/portfolio" element={<ProtectedRoute><PortfolioHub /></ProtectedRoute>} />
        <Route path="/hub/career" element={<ProtectedRoute><CareerGrowthHub /></ProtectedRoute>} />
        <Route path="/hub/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
        <Route 
  path="/github-dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading GitHub Dashboard...</div>}>
        <GitHubDashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>

        <Route 
  path="/repo-analyzer" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Analyzer...</div>}>
        <RepoAnalyzerLanding />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route 
  path="/repo-analyzer/dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Analyzer Dashboard...</div>}>
        <RepoAnalyzerDashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route 
  path="/repo-analyzer/workspace" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading Analyzer Workspace...</div>}>
        <RepoAnalyzerWorkspace />
      </Suspense>
    </ProtectedRoute>
  } 
/>

        {/* Nested Fellowship Routes */}
        <Route path="/fellowship" element={<ProtectedRoute><FellowshipLayout /></ProtectedRoute>}>
          <Route index element={<Challenges />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="challenges/:id/proposals" element={<ChallengeProposals />} />
          <Route path="create-challenge" element={<CreateChallenge />} />
          <Route path="my-proposals" element={<MyProposals />} />
          <Route path="my-challenges" element={<MyChallenges />} />
          <Route path="verify" element={<Verify />} />
          <Route path="messages" element={<FellowshipMessages />} />
          <Route path="messages/:roomId" element={<FellowshipChat />} />
        </Route>

        <Route path="/test-social-links" element={<TestSocialLinks />} />

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
