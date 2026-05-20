import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppLayout from "./components/AppLayout";
import PageTransition from "./components/ui/PageTransition"; // NEW: Import PageTransition
import { SkeletonPage } from "./components/ui/Skeleton";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Enhance from "./pages/Enhance";
import ResumeView from "./pages/ResumeView";
import JobSearch from "./pages/JobSearch";
import JobAlerts from "./pages/JobAlerts";
import JobTracker from "./pages/JobTracker";
import { Community, NotFound } from "./pages";
import InterviewPrep from "./pages/InterviewPrep";
import UserProfile from "./pages/UserProfile";
import EmailGenerator from "./pages/EmailGenerator";
import FellowshipLayout from "./pages/fellowship/FellowshipLayout";
import Onboarding from "./pages/fellowship/Onboarding";
import Challenges from "./pages/fellowship/Challenges";
import Settings from "./pages/Settings";
import ChallengeDetail from "./pages/fellowship/ChallengeDetail";
import CreateChallenge from "./pages/fellowship/CreateChallenge";
import MyProposals from "./pages/fellowship/MyProposals";
import MyChallenges from "./pages/fellowship/MyChallenges";
import ChallengeProposals from "./pages/fellowship/ChallengeProposals";
import Verify from "./pages/fellowship/Verify";
import FellowshipMessages from "./pages/fellowship/FellowshipMessages";
import FellowshipChat from "./pages/fellowship/FellowshipChat";
import SecuritySettings from "./pages/SecuritySettings";
import LinkedInCallback from "./pages/LinkedInCallback";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SkeletonPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SkeletonPage />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <div className="bg-mesh" />
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
            <PageTransition>
              {" "}
              {/* ← WRAP ROUTES HERE */}
              <Routes>
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <Home />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/auth/linkedin/callback"
                  element={
                    <PublicRoute>
                      <LinkedInCallback />
                    </PublicRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <PublicRoute>
                      <Dashboard />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <PublicRoute>
                      <Upload />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/enhance/:resumeId"
                  element={
                    <PublicRoute>
                      <Enhance />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/resume/:resumeId"
                  element={
                    <PublicRoute>
                      <ResumeView />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <PublicRoute>
                      <JobSearch />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/job-alerts"
                  element={
                    <PublicRoute>
                      <JobAlerts />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/job-tracker"
                  element={
                    <PublicRoute>
                      <JobTracker />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <PublicRoute>
                      <Community />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/interview-prep"
                  element={
                    <PublicRoute>
                      <InterviewPrep />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PublicRoute>
                      <UserProfile />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/profile/:uid"
                  element={
                    <PublicRoute>
                      <UserProfile />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/security"
                  element={
                    <PublicRoute>
                      <SecuritySettings />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/email-generator"
                  element={
                    <PublicRoute>
                      <EmailGenerator />
                     </PublicRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PublicRoute>
                      <Settings />
                     </PublicRoute>
                  }
                />

                <Route
                  path="/fellowship"
                  element={
                    <PublicRoute>
                      <FellowshipLayout />
                     </PublicRoute>
                  }
                >
                  <Route index element={<Challenges />} />
                  <Route path="onboarding" element={<Onboarding />} />
                  <Route path="challenges" element={<Challenges />} />
                  <Route path="challenges/:id" element={<ChallengeDetail />} />
                  <Route
                    path="challenges/:id/proposals"
                    element={<ChallengeProposals />}
                  />
                  <Route
                    path="create-challenge"
                    element={<CreateChallenge />}
                  />
                  <Route path="my-proposals" element={<MyProposals />} />
                  <Route path="my-challenges" element={<MyChallenges />} />
                  <Route path="verify" element={<Verify />} />
                  <Route path="messages" element={<FellowshipMessages />} />
                  <Route path="messages/:roomId" element={<FellowshipChat />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PageTransition>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
