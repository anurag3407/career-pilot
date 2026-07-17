import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

let currentFilename = '';
let currentDirname = '';
try {
  currentFilename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
  currentDirname = typeof __dirname !== 'undefined' ? __dirname : dirname(currentFilename);
} catch (e) {
  currentFilename = process.cwd() + '/mock.js';
  currentDirname = process.cwd();
}
const _filename = currentFilename;
const _dirname = currentDirname;

// Initialize Firebase Admin SDK
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

let initialized = false;
let serviceAccount = null;

// Try to load service account from file path first (FIREBASE_SERVICE_ACCOUNT_PATH)
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    const serviceAccountPath = join(_dirname, '../../', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    if (existsSync(serviceAccountPath)) {
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      console.log('✅ Loaded service account from file path');
    } else {
      // Try as absolute path or relative to backend folder
      const altPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      if (existsSync(altPath)) {
        serviceAccount = JSON.parse(readFileSync(altPath, 'utf8'));
        console.log('✅ Loaded service account from absolute path');
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to load from FIREBASE_SERVICE_ACCOUNT_PATH:', error.message);
  }
}

// Fallback to JSON string in FIREBASE_SERVICE_ACCOUNT env variable
if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('✅ Loaded service account from JSON env variable');
  } catch (error) {
    console.warn('⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', error.message);
  }
}

if (serviceAccount) {
  try {
    if (typeof serviceAccount.private_key !== 'string' || serviceAccount.private_key.trim() === '') {
      console.error('❌ Firebase service account private_key is missing or invalid. Skipping credential initialization.');
    } else {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      initialized = true;
      console.log('✅ Firebase Admin SDK initialized with service account');
    }
  } catch (error) {
    console.error('❌ Failed to initialize with service account:', error.message);
  }
}


if (!initialized) {
  // Check for GOOGLE_APPLICATION_CREDENTIALS environment variable
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: firebaseConfig.storageBucket
      });
      initialized = true;
      console.log('✅ Firebase Admin SDK initialized with application default credentials');
    } catch (error) {
      console.warn('Failed to use application default credentials:', error.message);
    }
  }
}

if (!initialized) {
  try {
    console.warn('⚠️ Firebase initialized without credentials — running in limited/unauthenticated mode');
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket
    });
  } catch (error) {
    console.error('❌ Failed to initialize Firebase without credentials:', error.message);
  }
}

// Export Firestore and Storage instances
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

export default admin;
