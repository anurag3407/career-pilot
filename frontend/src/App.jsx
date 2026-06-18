
/**
 * Main Application Component with Route-based Code Splitting
 * Implements lazy loading for improved performance
 */
import CoverLetter from "./pages/CoverLetter";
import VercelDeploy from "./components/portfolio/templates/Vercel_Deploy/index";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import StockTicker from "./components/portfolio/templates/Finance_Corporate/StockTicker";
import Deployments from './pages/Deployments'
import TemplateGallery from "./pages/TemplateGallery";
import TemplatePreviewOnly from "./pages/TemplatePreviewOnly";

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
const Analytics = lazy(() => import('./pages/Analytics'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
import TextToResume from './pages/TextToResume';
import About from './components/portfolio/templates/Tech_Startup/About';
import ChatbotPortfolio from "./components/portfolio/templates/Chatbot_Portfolio";
import GlassmorphismTemplate from "./components/portfolio/templates/Glassmorphism/index";

import JobTracker from './pages/JobTracker';

const Outreach = lazy(() => import('./pages/Outreach'));
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
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const InterviewReplay = lazy(() => import("./pages/InterviewReplay"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const EmailGenerator = lazy(() => import("./pages/EmailGenerator"));
const LinkedInOptimizer = lazy(() => import("./pages/LinkedInOptimizer"));
const Settings = lazy(() => import("./pages/Settings"));
const CareerRoadmap = lazy(() => import("./pages/CareerRoadmap"));
const SkillGap = lazy(() => import("./pages/SkillGap"));
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
const AdminLogins = lazy(() => import("./pages/admin/views/AdminLogins"));
const AdminBugs = lazy(() => import("./pages/admin/views/AdminBugs"));

import { NotFound } from './pages';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));


import LegalPageErrorBoundary from './components/LegalPageErrorBoundary';
import RouteErrorBoundary from './components/RouteErrorBoundary';


// Hub Imports
const GitHubDashboard = lazy(() => import('./pages/GitHubDashboard'));
const LinkedInDashboard = lazy(() => import('./pages/LinkedInDashboard'));
const RepoAnalyzerLanding = lazy(() => import('./pages/RepoAnalyzer/Landing'));
const RepoAnalyzerDashboard = lazy(() => import('./pages/RepoAnalyzer/Dashboard'));
const RepoAnalyzerWorkspace = lazy(() => import('./pages/RepoAnalyzer/Workspace'));
const ProjectVisualizerLanding = lazy(() => import('./pages/ProjectVisualizer/Landing'));
const ProjectVisualizerDashboard = lazy(() => import('./pages/ProjectVisualizer/Dashboard'));
import ScrollToTop from "./components/ScrollToTop";
import NorthernFjords from './components/portfolio/templates/Northern_Fjords';
import RainforestCanopy from './components/portfolio/templates/Rainforest_Canopy/index.jsx';
import DuotoneBold from './components/portfolio/templates/Duotone_Bold/index.jsx';
import ChromaticGlitch from './components/portfolio/templates/Chromatic_Glitch/index.jsx';
import SwissTypography from './components/portfolio/templates/Swiss_Typography/index.jsx';
import DesertDunes from './components/portfolio/templates/Desert_Dunes/index.jsx';
import PsychedelicSwirl from './components/portfolio/templates/Psychedelic_Swirl/index.jsx';
import MemphisPop from './components/portfolio/templates/Memphis_Pop/index.jsx';
import HiddenEasterEggScavengerHunt from './components/portfolio/templates/Hidden_Easter_Egg_Scavenger_Hunt/index.jsx';
import CassetteMixtape from './components/portfolio/templates/Cassette_Mixtape/index.jsx';
import MagneticDock from './components/portfolio/templates/Magnetic_Dock/index.jsx';
import Hero from './components/portfolio/templates/Magazine_Editorial/Hero';
import ColorBlock from './components/portfolio/templates/Color_Block/index.jsx';
import OceanDepths from './components/portfolio/templates/Ocean_Depths/index.jsx';
import NeonCityscape from './components/portfolio/templates/Neon_Cityscape/index.jsx';
import PlanetaryOrbit from './components/portfolio/templates/Planetary_Orbit/index.jsx';
import LowPolyTerrain from './components/portfolio/templates/Low_Poly_Terrain/index.jsx';
import HighFashion from './components/portfolio/templates/High_Fashion/index.jsx';
import TypographicWheatpastePosterWall from './components/portfolio/templates/Typographic_Wheatpaste_Poster_Wall/index.jsx';
import DigitalManifestoScroll from './components/portfolio/templates/Digital_Manifesto_Scroll/index.jsx';
import TestSocialLinks from './pages/TestSocialLinks';
import ZineCollage from './components/portfolio/templates/ZineCollage';
import TransparentDesktopOverlayOS from './components/portfolio/templates/Transparent_Desktop_Overlay_OS/index.jsx';
import Commercial_Pilot_Cockpit from './components/portfolio/templates/Commercial_Pilot_Cockpit/index.jsx';
import Book_Page_Flip_3D_Render from './components/portfolio/templates/Book_Page_Flip_3D_Render/index.jsx';
import IKEA_Assembly_Manual from './components/portfolio/templates/IKEA_Assembly_Manual/index.jsx';
import MichelinStarChefPlating from './components/portfolio/templates/Michelin_Star_Chef_Plating/index.jsx';
import SommelierWineCellarRacks from './components/portfolio/templates/Sommelier_Wine_Cellar_Racks/index.jsx';
import SharedResumeView from './pages/SharedResumeView.jsx'
import MinimalDarkFluid from './components/portfolio/templates/Minimal_Dark_Fluid/index.jsx';
import TerminalSkills from './components/portfolio/templates/Terminal_Skills/index.jsx';
import ChiragChrgTheme from './components/portfolio/templates/ChiragChrg_Theme/index.jsx';
import InspiredDevJadiya from "./components/portfolio/templates/Inspired_Dev_Jadiya";

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
        <Route path="/preview/:templateId" element={<TemplatePreviewOnly />} />
        <Route path="/preview-inspired-dev-jadiya" element={<InspiredDevJadiya />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        

               {/* <Route path="/templates/day-night-cycle" element={<DayNightCycle />} /> */}

        <Route path="/templates/rainforest-canopy" element={<RainforestCanopy />} />
        <Route path="/templates/northern-fjords" element={<NorthernFjords />} />
        <Route path="/templates/duotone-bold" element={<DuotoneBold />} />
        <Route path="/templates/chromatic-glitch" element={<ChromaticGlitch />} />
        <Route path="/templates/swiss-typography" element={<SwissTypography />} />
      
        <Route path="/templates/desert-dunes" element={<DesertDunes />} />
        <Route path="/templates/psychedelic-swirl" element={<PsychedelicSwirl />} />
        <Route path="/templates/memphis-pop" element={<MemphisPop />} />
        <Route path="/templates/cassette-mixtape" element={<CassetteMixtape />} />
        <Route path="/templates/hidden-easter-egg-scavenger-hunt" element={<HiddenEasterEggScavengerHunt />} />
        <Route path="/templates/magnetic-dock" element={<MagneticDock />} />
        <Route path="/templates/ocean-depths" element={<OceanDepths />} />
        <Route path="/templates/neon-cityscape" element={<NeonCityscape />} />
        <Route path="/templates/planetary-orbit" element={<PlanetaryOrbit />} />
        <Route path="/templates/low-poly-terrain" element={<LowPolyTerrain />} />
        <Route path="/templates/high-fashion" element={<HighFashion />} />
        <Route path="/templates/typographic-wheatpaste-poster-wall" element={<TypographicWheatpastePosterWall />} />
        <Route path="/templates/digital-manifesto-scroll" element={<DigitalManifestoScroll />} />

        <Route path="/templates/zine-collage" element={<ZineCollage />} />
        <Route path="/templates/chatbot" element={<ChatbotPortfolio />} /> 
        <Route path="/templates/glassmorphism" element={<GlassmorphismTemplate/>} />
        <Route path="/templates/transparent-desktop-overlay-os" element={<TransparentDesktopOverlayOS />} />
        <Route path="/templates/commercial-pilot-cockpit" element={<Commercial_Pilot_Cockpit />} />
        <Route path="/templates/book-page-flip-3d-render" element={<Book_Page_Flip_3D_Render />} />
        <Route path="/templates/ikea-assembly-manual" element={<IKEA_Assembly_Manual />} />
        <Route path="/templates/michelin-star-chef-plating" element={<MichelinStarChefPlating />} />
        <Route path="/templates/sommelier-wine-cellar-racks" element={<SommelierWineCellarRacks />} />
        <Route path="/templates/minimal-dark-fluid" element={<MinimalDarkFluid />} />
        <Route path="/templates/terminal-skills" element={<TerminalSkills />} />
        <Route path="/templates/chiragchrg-theme" element={<ChiragChrgTheme />} />
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
        <Route
  path="/dashboard/analytics"
  element={
    <Suspense fallback={<LoadingScreen label="Loading Analytics..." />}>
      <Analytics />
    </Suspense>
  }
/>
        <Route path="/upload" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Upload..." />}><Upload /></Suspense></ProtectedRoute>} />
        <Route 
  path="/shared/:shareToken" element={<SharedResumeView />} />
          <Route path="/resume-builder" 
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
        <Route path="/shared/:shareToken" element={<SharedResumeView />} />
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
        <Route path="/outreach" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Outreach..." />}><Outreach /></Suspense></ProtectedRoute>} />
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
        <Route
  path="/interview-history"
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Interview History..." />}>
        <InterviewHistory />
      </Suspense>
    </ProtectedRoute>
  }
/>

<Route
  path="/interview-history/:id"
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingScreen label="Loading Interview Replay..." />}>
        <InterviewReplay />
      </Suspense>
    </ProtectedRoute>
  }
/>
        <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Profile..." />}><UserProfile /></Suspense></ProtectedRoute>} />
        <Route path="/profile/:uid" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Profile..." />}><UserProfile /></Suspense></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Security Settings..." />}><SecuritySettings /></Suspense></ProtectedRoute>} />
        <Route path="/email-generator" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Email Generator..." />}><EmailGenerator /></Suspense></ProtectedRoute>} />
        <Route path="/linkedin-optimizer" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading LinkedIn Optimizer..." />}><LinkedInOptimizer /></Suspense></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Skill Gap Analyzer..." />}><SkillGap /></Suspense></ProtectedRoute>} />
        <Route path="/deployments" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Deployments..." />}><Deployments /></Suspense></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Settings..." />}><Settings /></Suspense></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Roadmap..." />}><CareerRoadmap /></Suspense></ProtectedRoute>} />

        
        {/* Admin Routes */}
        <Route path="/admin" element={
            <AdminRoute>
              <Suspense fallback={<LoadingScreen label="Loading Admin..." />}>
                <AdminLayout />
              </Suspense>
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="logins" element={<AdminLogins />} />
            <Route path="bugs" element={<AdminBugs />} />
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
          path="/linkedin-dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen label="Loading LinkedIn Dashboard..." />}>
                <LinkedInDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading LinkedIn Dashboard...</div>}>
                <LinkedInDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route path="/repo-analyzer" element={<Navigate to="/project-visualizer" replace />} />
        <Route path="/repo-analyzer/dashboard" element={<Navigate to="/project-visualizer" replace />} />
        <Route path="/repo-analyzer/workspace" element={<Navigate to="/project-visualizer" replace />} />
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
        <Route path="/templates/color-block" element={<ColorBlock />} />
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
