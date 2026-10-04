
/**
 * Main Application Component with Route-based Code Splitting
 * Implements lazy loading for improved performance
 */
import React, { useState, useEffect, lazy, Suspense } from 'react';

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
const CoverLetter = lazy(() => import("./pages/CoverLetter"));
const Deployments = lazy(() => import("./pages/Deployments"));
const TemplateGallery = lazy(() => import("./pages/TemplateGallery"));
const TemplatePreviewOnly = lazy(() => import("./pages/TemplatePreviewOnly"));
const TextToResume = lazy(() => import("./pages/TextToResume"));
const About = lazy(() => import("./components/portfolio/templates/Tech_Startup/About"));
const ChatbotPortfolio = lazy(() => import("./components/portfolio/templates/Chatbot_Portfolio"));
const GlassmorphismTemplate = lazy(() => import("./components/portfolio/templates/Glassmorphism/index"));
const JobTracker = lazy(() => import("./pages/JobTracker"));
const TestSocialLinks = lazy(() => import("./pages/TestSocialLinks"));
const NorthernFjords = lazy(() => import("./components/portfolio/templates/Northern_Fjords"));
const RainforestCanopy = lazy(() => import("./components/portfolio/templates/Rainforest_Canopy/index.jsx"));
const DuotoneBold = lazy(() => import("./components/portfolio/templates/Duotone_Bold/index.jsx"));
const ChromaticGlitch = lazy(() => import("./components/portfolio/templates/Chromatic_Glitch/index.jsx"));
const SwissTypography = lazy(() => import("./components/portfolio/templates/Swiss_Typography/index.jsx"));
const DesertDunes = lazy(() => import("./components/portfolio/templates/Desert_Dunes/index.jsx"));
const PsychedelicSwirl = lazy(() => import("./components/portfolio/templates/Psychedelic_Swirl/index.jsx"));
const MemphisPop = lazy(() => import("./components/portfolio/templates/Memphis_Pop/index.jsx"));
const HiddenEasterEggScavengerHunt = lazy(() => import("./components/portfolio/templates/Hidden_Easter_Egg_Scavenger_Hunt/index.jsx"));
const CassetteMixtape = lazy(() => import("./components/portfolio/templates/Cassette_Mixtape/index.jsx"));
const MagneticDock = lazy(() => import("./components/portfolio/templates/Magnetic_Dock/index.jsx"));
const ColorBlock = lazy(() => import("./components/portfolio/templates/Color_Block/index.jsx"));
const OceanDepths = lazy(() => import("./components/portfolio/templates/Ocean_Depths/index.jsx"));
const NeonCityscape = lazy(() => import("./components/portfolio/templates/Neon_Cityscape/index.jsx"));
const PlanetaryOrbit = lazy(() => import("./components/portfolio/templates/Planetary_Orbit/index.jsx"));
const LowPolyTerrain = lazy(() => import("./components/portfolio/templates/Low_Poly_Terrain/index.jsx"));
const HighFashion = lazy(() => import("./components/portfolio/templates/High_Fashion/index.jsx"));
const TypographicWheatpastePosterWall = lazy(() => import("./components/portfolio/templates/Typographic_Wheatpaste_Poster_Wall/index.jsx"));
const DigitalManifestoScroll = lazy(() => import("./components/portfolio/templates/Digital_Manifesto_Scroll/index.jsx"));
const ZineCollage = lazy(() => import("./components/portfolio/templates/ZineCollage"));
const TransparentDesktopOverlayOS = lazy(() => import("./components/portfolio/templates/Transparent_Desktop_Overlay_OS/index.jsx"));
const CommercialPilotCockpit = lazy(() => import("./components/portfolio/templates/Commercial_Pilot_Cockpit/index.jsx"));
const BookPageFlip3DRender = lazy(() => import("./components/portfolio/templates/Book_Page_Flip_3D_Render/index.jsx"));
const IKEAAssemblyManual = lazy(() => import("./components/portfolio/templates/IKEA_Assembly_Manual/index.jsx"));
const MichelinStarChefPlating = lazy(() => import("./components/portfolio/templates/Michelin_Star_Chef_Plating/index.jsx"));
const SommelierWineCellarRacks = lazy(() => import("./components/portfolio/templates/Sommelier_Wine_Cellar_Racks/index.jsx"));
const MinimalDarkFluid = lazy(() => import("./components/portfolio/templates/Minimal_Dark_Fluid/index.jsx"));
const TerminalSkills = lazy(() => import("./components/portfolio/templates/Terminal_Skills/index.jsx"));
const ChiragChrgTheme = lazy(() => import("./components/portfolio/templates/ChiragChrg_Theme/index.jsx"));
const InspiredDevJadiya = lazy(() => import("./components/portfolio/templates/Inspired_Dev_Jadiya"));
const FilmDirectorClapperboard = lazy(() => import("./components/portfolio/templates/Film_Director_Clapperboard/index.jsx"));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));


const Community = lazy(() => import('./pages/Community'));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const OpenRouterCallback = lazy(() => import("./pages/OpenRouterCallback"));
const Upload = lazy(() => import("./pages/Upload"));
const Enhance = lazy(() => import("./pages/Enhance"));
const ResumeView = lazy(() => import("./pages/ResumeView"));
const ResumeTemplates = lazy(() => import("./pages/ResumeTemplates"));
const ResumeExamples = lazy(() => import("./pages/ResumeExamples"));
const JobAlerts = lazy(() => import("./pages/JobAlerts"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const InterviewReplay = lazy(() => import("./pages/InterviewReplay"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const LinkedInOptimizer = lazy(() => import("./pages/LinkedInOptimizer"));
const Settings = lazy(() => import("./pages/Settings"));
const ResumeRoast = lazy(() => import('./pages/ResumeRoast'));
const RoastHub = lazy(() => import('./pages/hubs/RoastHub'));
const PortfolioGithub = lazy(() => import('./pages/PortfolioGithub'));
const GithubPortfolioHub = lazy(() => import('./pages/hubs/GithubPortfolioHub'));
const GithubCallback = lazy(() => import('./pages/auth/GithubCallback'));
const SkillGap = lazy(() => import("./pages/SkillGap"));
const SalaryEstimate = lazy(() => import("./pages/SalaryEstimate"));
const EmailGenerator = lazy(() => import("./pages/EmailGenerator"));
const CareerPath = lazy(() => import("./pages/CareerPath"));
const Outreach = lazy(() => import("./pages/Outreach"));
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
const SharedResumeView = lazy(() => import("./pages/SharedResumeView"));
const AdminLogins = lazy(() => import("./pages/admin/views/AdminLogins"));
const AdminBugs = lazy(() => import("./pages/admin/views/AdminBugs"));

import { NotFound } from './pages';

const PrivacyPolicy = lazy(() => import('./pages/LegalPrivacy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/LegalCookies'));





// Hub Imports
const GitHubDashboard = lazy(() => import('./pages/GitHubDashboard'));
const LinkedInDashboard = lazy(() => import('./pages/LinkedInDashboard'));
const RepoAnalyzerLanding = lazy(() => import('./pages/RepoAnalyzer/Landing'));
const RepoAnalyzerDashboard = lazy(() => import('./pages/RepoAnalyzer/Dashboard'));
const RepoAnalyzerWorkspace = lazy(() => import('./pages/RepoAnalyzer/Workspace'));
const LegacyProjectVisualizerLanding = lazy(() => import('./pages/ProjectVisualizer/Landing'));
const ProjectVisualizerDashboard = lazy(() => import('./pages/ProjectVisualizer/Dashboard'));
const ProjectVisualizerWorkspace = lazy(() => import('./pages/ProjectVisualizer/Workspace'));

const ResumeBuilderLanding = lazy(() => import('./pages/features/ResumeBuilderLanding'));
const PortfolioBuilderLanding = lazy(() => import('./pages/features/PortfolioBuilderLanding'));
const ResumeRoastLanding = lazy(() => import('./pages/features/ResumeRoastLanding'));
const GithubPortfolioLanding = lazy(() => import('./pages/features/GithubPortfolioLanding'));
const ProjectVisualizerLanding = lazy(() => import('./pages/features/ProjectVisualizerLanding'));
const JobFinderLanding = lazy(() => import('./pages/features/JobFinderLanding'));
const MockInterviewLanding = lazy(() => import('./pages/features/MockInterviewLanding'));
const RecruitersLanding = lazy(() => import('./pages/features/RecruitersLanding'));
const GithubReadmeGeneratorLanding = lazy(() => import('./pages/features/GithubReadmeGeneratorLanding'));
const GithubReadmeGenerator = lazy(() => import('./pages/GithubReadmeGenerator'));

import ScrollToTop from "./components/ScrollToTop";

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
  const location = useLocation();

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
    // Remember where the user was headed so sign-in can return them there
    // instead of dumping them on the dashboard.
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
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
        <Route path="/login/*" element={<PublicRoute><Suspense fallback={<LoadingScreen label="Loading Login..." />}><Login /></Suspense></PublicRoute>} />
        <Route path="/register/*" element={<PublicRoute><Suspense fallback={<LoadingScreen label="Loading Registration..." />}><Register /></Suspense></PublicRoute>} />

        <Route path="/auth/openrouter/callback" element={<Suspense fallback={<LoadingScreen label="Loading callback..." />}><OpenRouterCallback /></Suspense>} />

        {/* Feature SaaS Landing Pages (Clean Slugs) */}
        <Route path="/resume-builder" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ResumeBuilderLanding /></Suspense>} />
        <Route path="/portfolio-builder" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><PortfolioBuilderLanding /></Suspense>} />
        <Route path="/resume-roast" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ResumeRoastLanding /></Suspense>} />
        <Route path="/github-portfolio" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><GithubPortfolioLanding /></Suspense>} />
        <Route path="/project-visualizer" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ProjectVisualizerLanding /></Suspense>} />
        <Route path="/job-finder" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><JobFinderLanding /></Suspense>} />
        <Route path="/mock-interview" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><MockInterviewLanding /></Suspense>} />
        <Route path="/recruiters" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><RecruitersLanding /></Suspense>} />
                <Route path="/readme-generator" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><GithubReadmeGeneratorLanding /></Suspense>} />
        <Route path="/readme-generator/generate" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading README Generator..." />}><GithubReadmeGenerator /></Suspense></ProtectedRoute>} />

        <Route path="/project-visualizer/analyze" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Project Visualizer..." />}><ProjectVisualizerWorkspace /></Suspense></ProtectedRoute>} />

        {/* Legacy Landing Redirects */}
        <Route path="/resume-builder-landing" element={<Navigate to="/resume-builder" replace />} />
        <Route path="/roast" element={<Navigate to="/resume-roast" replace />} />
        <Route path="/visualizer" element={<Navigate to="/project-visualizer" replace />} />
        <Route path="/ai-interview" element={<Navigate to="/mock-interview" replace />} />

        {/* Legal Pages (Public) */}
        <Route path="/privacy" element={<Suspense fallback={null}><PrivacyPolicy /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<LoadingScreen label="Loading About..." />}><Suspense fallback={<LoadingScreen label="Loading..." />}><About /></Suspense></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={null}><TermsOfService /></Suspense>} />
        <Route path="/cookies" element={<Suspense fallback={null}><CookiePolicy /></Suspense>} />

        {/* Template Gallery Route (Registered at /templates) */}
        <Route path="/templates" element={<Suspense fallback={<LoadingScreen label="Loading Templates..." />}><TemplateGallery /></Suspense>} />
        <Route path="/preview/:templateId" element={<Suspense fallback={<LoadingScreen label="Loading Preview..." />}><TemplatePreviewOnly /></Suspense>} />
        <Route path="/preview-inspired-dev-jadiya" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><InspiredDevJadiya /></Suspense>} />
        <Route path="/cover-letter" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><CoverLetter /></Suspense>} />


        {/* <Route path="/templates/day-night-cycle" element={<DayNightCycle />} /> */}

        <Route path="/templates/rainforest-canopy" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><RainforestCanopy /></Suspense>} />
        <Route path="/templates/northern-fjords" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><NorthernFjords /></Suspense>} />
        <Route path="/templates/duotone-bold" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><DuotoneBold /></Suspense>} />
        <Route path="/templates/chromatic-glitch" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ChromaticGlitch /></Suspense>} />
        <Route path="/templates/swiss-typography" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><SwissTypography /></Suspense>} />

        <Route path="/templates/desert-dunes" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><DesertDunes /></Suspense>} />
        <Route path="/templates/psychedelic-swirl" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><PsychedelicSwirl /></Suspense>} />
        <Route path="/templates/memphis-pop" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><MemphisPop /></Suspense>} />
        <Route path="/templates/cassette-mixtape" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><CassetteMixtape /></Suspense>} />
        <Route path="/templates/hidden-easter-egg-scavenger-hunt" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><HiddenEasterEggScavengerHunt /></Suspense>} />
        <Route path="/templates/magnetic-dock" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><MagneticDock /></Suspense>} />
        <Route path="/templates/ocean-depths" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><OceanDepths /></Suspense>} />
        <Route path="/templates/neon-cityscape" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><NeonCityscape /></Suspense>} />
        <Route path="/templates/planetary-orbit" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><PlanetaryOrbit /></Suspense>} />
        <Route path="/templates/low-poly-terrain" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><LowPolyTerrain /></Suspense>} />
        <Route path="/templates/high-fashion" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><HighFashion /></Suspense>} />
        <Route path="/templates/typographic-wheatpaste-poster-wall" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><TypographicWheatpastePosterWall /></Suspense>} />
        <Route path="/templates/digital-manifesto-scroll" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><DigitalManifestoScroll /></Suspense>} />

        <Route path="/templates/zine-collage" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ZineCollage /></Suspense>} />
        <Route path="/templates/chatbot" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ChatbotPortfolio /></Suspense>} />
        <Route path="/templates/glassmorphism" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><GlassmorphismTemplate /></Suspense>} />
        <Route path="/templates/transparent-desktop-overlay-os" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><TransparentDesktopOverlayOS /></Suspense>} />
        <Route path="/templates/commercial-pilot-cockpit" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><CommercialPilotCockpit /></Suspense>} />
        <Route path="/templates/book-page-flip-3d-render" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><BookPageFlip3DRender /></Suspense>} />
        <Route path="/templates/ikea-assembly-manual" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><IKEAAssemblyManual /></Suspense>} />
        <Route path="/templates/michelin-star-chef-plating" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><MichelinStarChefPlating /></Suspense>} />
        <Route path="/templates/sommelier-wine-cellar-racks" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><SommelierWineCellarRacks /></Suspense>} />
        <Route path="/templates/minimal-dark-fluid" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><MinimalDarkFluid /></Suspense>} />
        <Route path="/templates/terminal-skills" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><TerminalSkills /></Suspense>} />
        <Route path="/templates/chiragchrg-theme" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ChiragChrgTheme /></Suspense>} />
        <Route path="/templates/film-director-clapperboard" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><FilmDirectorClapperboard /></Suspense>} />
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
        <Route
          path="/roast/:shareToken"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen label="Loading shared roast..." />}>
                <ResumeRoast />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/resume-builder/build"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen label="Loading Resume Builder..." />}>
                <ResumeBuilder />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/text-to-resume" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Text to Resume..." />}><Suspense fallback={<LoadingScreen label="Loading..." />}><TextToResume /></Suspense></Suspense></ProtectedRoute>} />
        <Route path="/enhance/:resumeId" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Resume Enhancer..." />}><Enhance /></Suspense></ProtectedRoute>} />
        <Route path="/resume/:resumeId" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Resume..." />}><ResumeView /></Suspense></ProtectedRoute>} />
        <Route path="/resume-templates" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Templates..." />}><ResumeTemplates /></Suspense></ProtectedRoute>} />
        <Route path="/resume-examples" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Examples..." />}><ResumeExamples /></Suspense></ProtectedRoute>} />
        <Route
          path="/job-finder/search"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen label="Loading Jobs..." />}>
                <JobSearch />
              </Suspense>
            </ProtectedRoute>
          }
        />
        {/* Legacy redirect for jobs */}
        <Route path="/jobs" element={<Navigate to="/job-finder/search" replace />} />
        <Route path="/portfolio-builder/templates" element={<Navigate to="/templates" replace />} />
        <Route path="/job-alerts" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Job Alerts..." />}><JobAlerts /></Suspense></ProtectedRoute>} />
        <Route path="/job-tracker" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Job Tracker..." />}><Suspense fallback={<LoadingScreen label="Loading..." />}><JobTracker /></Suspense></Suspense></ProtectedRoute>} />
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
        <Route path="/mock-interview/practice" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Interview Prep..." />}><InterviewPrep /></Suspense></ProtectedRoute>} />
        {/* Legacy redirect for interview-prep */}
        <Route path="/interview-prep" element={<Navigate to="/mock-interview/practice" replace />} />
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
        <Route path="/linkedin-optimizer" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading LinkedIn Optimizer..." />}><LinkedInOptimizer /></Suspense></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Skill Gap Analyzer..." />}><SkillGap /></Suspense></ProtectedRoute>} />
        <Route path="/salary-estimate" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Salary Estimator..." />}><SalaryEstimate /></Suspense></ProtectedRoute>} />
        <Route path="/email-generator" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Email Generator..." />}><EmailGenerator /></Suspense></ProtectedRoute>} />
        <Route path="/career-path" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Career Trajectory..." />}><CareerPath /></Suspense></ProtectedRoute>} />
        <Route path="/outreach" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Cold Outreach..." />}><Outreach /></Suspense></ProtectedRoute>} />
        <Route path="/deployments" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Deployments..." />}><Suspense fallback={<LoadingScreen label="Loading..." />}><Deployments /></Suspense></Suspense></ProtectedRoute>} />
        <Route path="/resume-roast/analyze" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Resume Roast..." />}><ResumeRoast /></Suspense></ProtectedRoute>} />
        <Route path="/github-portfolio/build" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading GitHub Portfolio Builder..." />}><PortfolioGithub /></Suspense></ProtectedRoute>} />
        {/* Legacy redirects */}
        <Route path="/portfolio/github" element={<Navigate to="/github-portfolio/build" replace />} />
        <Route path="/auth/github/callback" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Completing GitHub connection..." />}><GithubCallback /></Suspense></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Settings..." />}><Settings /></Suspense></ProtectedRoute>} />


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
        <Route path="/hub/roast" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading Roast Hub..." />}><RoastHub /></Suspense></ProtectedRoute>} />
        <Route path="/hub/portfolio/github" element={<ProtectedRoute><Suspense fallback={<LoadingScreen label="Loading GitHub Portfolio Hub..." />}><GithubPortfolioHub /></Suspense></ProtectedRoute>} />
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
          path="/project-visualizer-legacy"
          element={
            <Navigate to="/project-visualizer" replace />
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


        <Route path="/test-social-links" element={<Suspense fallback={<LoadingScreen label="Loading Test Social Links..." />}><Suspense fallback={<LoadingScreen label="Loading..." />}><TestSocialLinks /></Suspense></Suspense>} />


        {/* Catch-All Route */}
        <Route path="/templates/color-block" element={<Suspense fallback={<LoadingScreen label="Loading..." />}><ColorBlock /></Suspense>} />
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
