import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration - replace with your config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const isValidConfig = firebaseConfig.apiKey && 
                     firebaseConfig.apiKey !== 'your_api_key' && 
                     !firebaseConfig.apiKey.startsWith('your_');

let app;
let auth;
let db;
let storage;

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error)
  }
}

if (!auth) {
  console.warn('⚠️ Firebase initialized in mock/fallback mode because API key is missing or placeholder.')
  app = {}
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Simulate unauthenticated user
      callback(null)
      return () => {}
    },
    signOut: async () => {},
    signInWithEmailAndPassword: async () => { throw new Error('Firebase Auth is not configured (mock mode)') },
    createUserWithEmailAndPassword: async () => { throw new Error('Firebase Auth is not configured (mock mode)') }
  }
  db = {}
  storage = {}
}

export { auth, db, storage }
export default app

