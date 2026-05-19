import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './components/AppLayout'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Enhance from './pages/Enhance'
import ResumeView from './pages/ResumeView'
import JobSearch from './pages/JobSearch'
import JobAlerts from './pages/JobAlerts'
import JobTracker from './pages/JobTracker'
import { Community, NotFound } from './pages'
import InterviewPrep from './pages/InterviewPrep'
import UserProfile from './pages/UserProfile'
import EmailGenerator from './pages/EmailGenerator'
import LinkedInOptimizer from './pages/LinkedInOptimizer'
import FellowshipLayout from './pages/fellowship/FellowshipLayout'
import Onboarding from './pages/fellowship/Onboarding'
import Challenges from './pages/fellowship/Challenges'
import Settings from './pages/Settings'
import ChallengeDetail from './pages/fellowship/ChallengeDetail'
import CreateChallenge from './pages/fellowship/CreateChallenge'
import MyProposals from './pages/fellowship/MyProposals'
import MyChallenges from './pages/fellowship/MyChallenges'
import ChallengeProposals from './pages/fellowship/ChallengeProposals'
import Verify from './pages/fellowship/Verify'
import FellowshipMessages from './pages/fellowship/FellowshipMessages'
import FellowshipChat from './pages/fellowship/FellowshipChat'
import SecuritySettings from './pages/SecuritySettings'
import LinkedInCallback from './pages/LinkedInCallback'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading CareerPilot...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading CareerPilot...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
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
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(8px)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/auth/linkedin/callback" element={<PublicRoute><LinkedInCallback /></PublicRoute>} />

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
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

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

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App