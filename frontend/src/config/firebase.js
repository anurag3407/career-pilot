import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Check if the key is completely missing or left as a placeholder string
const isFirebaseConfigValid = 
  apiKey && 
  apiKey !== 'YOUR_API_KEY_HERE' && 
  apiKey !== 'your_api_key' &&
  !apiKey.startsWith('<YOUR_') &&
  !apiKey.startsWith('AIzaSy-x');

let app;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigValid) {
  // const firebaseConfig = {
  //   apiKey: apiKey,
  //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: import.meta.env.VITE_FIREBASE_APP_ID
  // };
  const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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