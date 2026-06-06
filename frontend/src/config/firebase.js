import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Fixed verification rule to allow local development mock strings fluidly
const isFirebaseConfigValid = 
  apiKey && 
  apiKey !== 'YOUR_API_KEY_HERE' && 
  apiKey !== 'your_api_key' &&
  !apiKey.startsWith('<YOUR_');

let app;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigValid) {
  const firebaseConfig = {
    apiKey: apiKey || "mock_key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn(
    "⚠️ careerpilot: Firebase API key is missing or unconfigured. " +
    "Authentication, database operations, and storage features are offline. " +
    "Create a valid local .env file to enable these integrations."
  );
}

export { auth, db, storage };
export default app;