
/**
 * Main Application Component with Route-based Code Splitting
 * Implements lazy loading for improved performance
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';
import StockTicker from "./components/portfolio/templates/Finance_Corporate/StockTicker";
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
const Dashboard = lazy(() => import('./pages/Dashboard'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
import TextToResume from './pages/TextToResume';
import About from './components/portfolio/templates/Tech_Startup/About';
import ChatbotPortfolio from "./components/portfolio/templates/Chatbot_Portfolio";
import GamifiedXP from "./components/portfolio/templates/Gamified_XP";
import TelescopeZoom from "./components/portfolio/templates/Telescope_Zoom";
import DayNightCycle from './components/portfolio/templates/Day_Night_Cycle/index.jsx';
import JobTracker from './pages/JobTracker';

const Community = lazy(() => import('./pages/Community'));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LinkedInCallback = lazy(() => import("./pages/LinkedInCallback"));
const OpenRouterCallback = lazy(() => import("./pages/OpenRouterCallback"));
const Upload = lazy(() => import("./pages/Upload"));
const Enhance = lazy(() => import("./pages/Enhance"));
const ResumeView = lazy(() => import("./pages/ResumeView"));
const JobAlerts = lazy(() => import("./pages/JobAlerts"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const EmailGenerator = lazy(() => import("./pages/EmailGenerator"));
const LinkedInOptimizer = lazy(() => import("./pages/LinkedInOptimizer"));
const Settings = lazy(() => import("./pages/Settings"));
const ResumeHub = lazy(() => import("./pages/hubs/ResumeHub"));
const JobsHub = lazy(() => import("./pages/hubs/JobsHub"));
const PortfolioHub = lazy(() => import("./pages/hubs/PortfolioHub"));
const CareerGrowthHub = lazy(() => import("./pages/hubs/CareerGrowthHub"));
const CommunityHub = lazy(() => import("./pages/hubs/CommunityHub"));
const FellowshipLayout = lazy(() => import("./pages/fellowship/FellowshipLayout"));
const Challenges = lazy(() => import("./pages/fellowship/Challenges"));
const Onboarding = lazy(() => import("./pages/fellowship/Onboarding"));
const ChallengeDetail = lazy(() => import("./pages/fellowship/ChallengeDetail"));
const ChallengeProposals = lazy(() => import("./pages/fellowship/ChallengeProposals"));
const CreateChallenge = lazy(() => import("./pages/fellowship/CreateChallenge"));
const MyProposals = lazy(() => import("./pages/fellowship/MyProposals"));
const MyChallenges = lazy(() => import("./pages/fellowship/MyChallenges"));
const Verify = lazy(() => import("./pages/fellowship/Verify"));
const FellowshipMessages = lazy(() => import("./pages/fellowship/FellowshipMessages"));
const FellowshipChat = lazy(() => import("./pages/fellowship/FellowshipChat"));


const AdminLayout = lazy(() => import("./pages/admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/views/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/views/AdminUsers"));

import { NotFound } from './pages';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));


import LegalPageErrorBoundary from './components/LegalPageErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';


// Hub Imports
const GitHubDashboard = lazy(() => import('./pages/GitHubDashboard'));
const RepoAnalyzerLanding = lazy(() => import('./pages/RepoAnalyzer/Landing'));
const RepoAnalyzerDashboard = lazy(() => import('./pages/RepoAnalyzer/Dashboard'));
const RepoAnalyzerWorkspace = lazy(() => import('./pages/RepoAnalyzer/Workspace'));
const ProjectVisualizerLanding = lazy(() => import('./pages/ProjectVisualizer/Landing'));
const ProjectVisualizerDashboard = lazy(() => import('./pages/ProjectVisualizer/Dashboard'));
import ScrollToTop from "./components/ScrollToTop";
import NorthernFjords from './components/portfolio/templates/Northern_Fjords';
import RainforestCanopy from './components/portfolio/templates/Rainforest_Canopy/index.jsx';
import Hero from './components/portfolio/templates/Magazine_Editorial/Hero';
import TestSocialLinks from './pages/TestSocialLinks';


function LoadingScreen({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}


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


// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen label="Checking permissions..." />;
  }
  
  // Note: we trust the backend to enforce the real check.
  // We can just check if they are logged in here, and rely on the backend.
  // Ideally, the user object would have a role property from the decoded token.
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

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
        <Route path="/login" element={<PublicRoute><Suspense fallback={<LoadingScreen label="Loading Login..." />}><Login /></Suspense></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Suspense fallback={<LoadingScreen label="Loading Registration..." />}><Register /></Suspense></PublicRoute>} />
        <Route path="/auth/linkedin/callback" element={<Suspense fallback={<LoadingScreen label="Loading callback..." />}><LinkedInCallback /></Suspense>} />
        <Route path="/auth/openrouter/callback" element={<Suspense fallback={<LoadingScreen label="Loading callback..." />}><OpenRouterCallback /></Suspense>} />

        {/* Legal Pages (Public) */}
        <Route path="/privacy" element={<LegalPageErrorBoundary><Suspense fallback={null}><PrivacyPolicy /></Suspense></LegalPageErrorBoundary>} />
        <Route path="/about" element={<Suspense fallback={<LoadingScreen label="Loading About..." />}><About /></Suspense>} />
        <Route path="/terms" element={<LegalPageErrorBoundary><Suspense fallback={null}><TermsOfService /></Suspense></LegalPageErrorBoundary>} />
        <Route path="/cookies" element={<LegalPageErrorBoundary><Suspense fallback={null}><CookiePolicy /></Suspense></LegalPageErrorBoundary>} />

        {/* Template Gallery Route (Registered at /templates) */}
        <Route path="/templates" element={<TemplateGallery />} />

        

        <Route path="/templates/chatbot" element={<ChatbotPortfolio />} />

        {/* <Route path="/templates/day-night-cycle" element={<DayNightCycle />} /> */}
        <Route path="/templates/rainforest-canopy" element={<RainforestCanopy />} />
        <Route path="/templates/northern-fjords" element={<NorthernFjords />} />
        {/* Core Protected Routes */}
        <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Dashboard..." />}>
        <Dashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/upload" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Upload..." />}><Upload /></Suspense></ProtectedRoute>} />
        <Route 
  path="/resume-builder" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Resume Builder..." />}>
        <ResumeBuilder />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/text-to-resume" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Text to Resume..." />}><TextToResume /></Suspense></ProtectedRoute>} />
        <Route path="/enhance/:resumeId" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Resume Enhancer..." />}><Enhance /></Suspense></ProtectedRoute>} />
        <Route path="/resume/:resumeId" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Resume..." />}><ResumeView /></Suspense></ProtectedRoute>} />
        <Route 
  path="/jobs" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Jobs..." />}>
        <JobSearch />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/job-alerts" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Job Alerts..." />}><JobAlerts /></Suspense></ProtectedRoute>} />
        <Route path="/job-tracker" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Job Tracker..." />}><JobTracker /></Suspense></ProtectedRoute>} />
        <Route 
  path="/community" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Community..." />}>
        <Community />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route path="/interview-prep" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Interview Prep..." />}><InterviewPrep /></Suspense></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Profile..." />}><UserProfile /></Suspense></ProtectedRoute>} />
        <Route path="/profile/:uid" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Profile..." />}><UserProfile /></Suspense></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Security Settings..." />}><SecuritySettings /></Suspense></ProtectedRoute>} />
        <Route path="/email-generator" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Email Generator..." />}><EmailGenerator /></Suspense></ProtectedRoute>} />
        <Route path="/linkedin-optimizer" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading LinkedIn Optimizer..." />}><LinkedInOptimizer /></Suspense></ProtectedRoute>} />
        <Route path="/deployments" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Deployments..." />}><Deployments /></Suspense></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Settings..." />}><Settings /></Suspense></ProtectedRoute>} />

        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><Suspense fallback={<LoadingScreen label="Loading Admin..." />}><AdminLayout /></Suspense></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Hub Routes */}
        <Route path="/hub/resume" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Resume Hub..." />}><ResumeHub /></Suspense></ProtectedRoute>} />
        <Route path="/hub/jobs" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Jobs Hub..." />}><JobsHub /></Suspense></ProtectedRoute>} />
        <Route path="/hub/portfolio" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Portfolio Hub..." />}><PortfolioHub /></Suspense></ProtectedRoute>} />
        <Route path="/hub/career" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Career Hub..." />}><CareerGrowthHub /></Suspense></ProtectedRoute>} />
        <Route path="/hub/community" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Community Hub..." />}><CommunityHub /></Suspense></ProtectedRoute>} />
        <Route 
  path="/github-dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading GitHub Dashboard..." />}>
        <GitHubDashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route
          path="/github"
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
      <Suspense fallback={<LoadingScreen label="Loading Analyzer..." />}>
        <RepoAnalyzerLanding />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route 
  path="/repo-analyzer/dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Analyzer Dashboard..." />}>
        <RepoAnalyzerDashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route 
  path="/repo-analyzer/workspace" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Analyzer Workspace..." />}>
        <RepoAnalyzerWorkspace />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route 
  path="/project-visualizer" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Project Visualizer..." />}>
        <ProjectVisualizerLanding />
      </Suspense>
    </ProtectedRoute>
  } 
/>
        <Route 
  path="/project-visualizer/dashboard/:sessionId" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Analysis Dashboard..." />}>
        <ProjectVisualizerDashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>


        {/* Nested Fellowship Routes */}
        <Route path="/fellowship" element={<ProtectedRoute><FellowshipLayout /></ProtectedRoute>}>
          <Route index element={<Suspense fallback={<LoadingScreen label="Loading Challenges..." />}><Challenges /></Suspense>} />
          <Route path="onboarding" element={<Suspense fallback={<LoadingScreen label="Loading Onboarding..." />}><Onboarding /></Suspense>} />
          <Route path="challenges" element={<Suspense fallback={<LoadingScreen label="Loading Challenges..." />}><Challenges /></Suspense>} />
          <Route path="challenges/:id" element={<Suspense fallback={<LoadingScreen label="Loading Challenge..." />}><ChallengeDetail /></Suspense>} />
          <Route path="challenges/:id/proposals" element={<Suspense fallback={<LoadingScreen label="Loading Proposals..." />}><ChallengeProposals /></Suspense>} />
          <Route path="create-challenge" element={<Suspense fallback={<LoadingScreen label="Loading Challenge Creator..." />}><CreateChallenge /></Suspense>} />
          <Route path="my-proposals" element={<Suspense fallback={<LoadingScreen label="Loading My Proposals..." />}><MyProposals /></Suspense>} />
          <Route path="my-challenges" element={<Suspense fallback={<LoadingScreen label="Loading My Challenges..." />}><MyChallenges /></Suspense>} />
          <Route path="verify" element={<Suspense fallback={<LoadingScreen label="Loading Verification..." />}><Verify /></Suspense>} />
          <Route path="messages" element={<Suspense fallback={<LoadingScreen label="Loading Fellowship Messages..." />}><FellowshipMessages /></Suspense>} />
          <Route path="messages/:roomId" element={<Suspense fallback={<LoadingScreen label="Loading Chat..." />}><FellowshipChat /></Suspense>} />
        </Route>


        <Route path="/test-social-links" element={<Suspense fallback={<LoadingScreen label="Loading Test Social Links..." />}><TestSocialLinks /></Suspense>} />


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
