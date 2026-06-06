import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

/**
 * FIXED LOCAL DEV PROVIDER: Bypasses Firebase validation entirely
 * and simulates an active offline developer workspace profile.
 */
export function AuthProvider({ children }) {
  // Inject a mock user profile by default so you never hit a "Sign In" gate
  const [user, setUser] = useState({
    uid: "mock-developer-id-12345",
    email: "soumya.dev@example.com",
    displayName: "Soumya Jain",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    getIdToken: async () => "mock-jwt-token-string"
  })
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Unblock the application render cycle immediately
    setLoading(false)
  }, [])

  // Safely intercept potential network requests with quick dummy logs
  const signup = async (email, password, displayName) => {
    console.log("Mock Signup Intercepted:", { email, displayName });
    const mockUser = { ...user, email, displayName: displayName || "Developer" };
    setUser(mockUser);
    return mockUser;
  }

  const login = async (email, password) => {
    console.log("Mock Login Intercepted:", email);
    return user;
  }

  const loginWithGoogle = async () => {
    console.log("Mock Google Sign-In Intercepted");
    return user;
  }

  const loginWithLinkedIn = () => {
    console.log("Mock LinkedIn Sign-In Intercepted");
    alert("Bypassed: LinkedIn OAuth code redirected locally.");
  }

  const logout = async () => {
    console.log("Mock Logout Triggered: Retaining session structure for interface view.");
    // Keep user state populated locally so your panels don't unexpectedly turn blank
  }

  const getToken = async () => {
    return "mock-jwt-token-string"
  }

  const value = {
    user,
    loading: false,
    signup,
    login,
    loginWithGoogle,
    loginWithLinkedIn,
    logout,
    getToken,
    isMockAuth: true 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}