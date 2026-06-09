import { useState, useEffect } from 'react';
import Deployments from './pages/Deployments';
import TemplateGallery from "./pages/TemplateGallery";
import ToastManager from "./components/ToastManager";
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
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Enhance from './pages/Enhance';
import ResumeView from './pages/ResumeView';
import JobSearch from './pages/JobSearch';
import JobAlerts from './pages/JobAlerts';
import JobTracker from './pages/JobTracker';
import { Community, NotFound } from './pages';
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const isAuthenticated = localStorage.getItem('firebase:authUser') !== null;

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          {/* ToastManager wraps everything so any child can call useToast() */}
          <ToastManager position="top-right">
            <BrowserRouter>
              <div className="bg-mesh" />
              {isAuthenticated && (
                <CommandPalette
                  isOpen={isCommandPaletteOpen}
                  setIsOpen={setIsCommandPaletteOpen}
                />
              )}
              {/* react-hot-toast kept for existing toast.success/error calls elsewhere */}
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
                <Route path="/auth/linkedin/callback" element={<PublicRoute><LinkedInCallback /></PublicRoute>} />

                {/* Legal Pages (Public) */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />

                {/* Template Gallery */}
                <Route path="/templates" element={<TemplateGallery />} />

                {/* Core Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                <Route path="/enhance/:resumeId" element={<ProtectedRoute><Enhance /></ProtectedRoute>} />
                <Route path="/resume/:resumeId" element={<ProtectedRoute><ResumeView /></ProtectedRoute>} />
                <Route path="/jobs" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
                <Route path="/job-alerts" element={<ProtectedRoute><JobAlerts /></ProtectedRoute>} />
                <Route path="/job-tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/interview-prep" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/profile/:uid" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
                <Route path="/email-generator" element={<ProtectedRoute><EmailGenerator /></ProtectedRoute>} />
                <Route path="/linkedin-optimizer" element={<ProtectedRoute><LinkedInOptimizer /></ProtectedRoute>} />
                <Route path="/deployments" element={<ProtectedRoute><Deployments /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

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

                {/* Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ToastManager>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;