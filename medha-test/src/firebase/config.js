import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// In production, use environment variables (import.meta.env.VITE_FIREBASE_*)
const firebaseConfig = typeof __firebase_config !== 'undefined'
  ? JSON.parse(__firebase_config)
  : {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-app.firebaseapp.com',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-app',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-app.appspot.com',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo',
    };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId =
  typeof __app_id !== 'undefined' ? __app_id : 'carepulse-health-tracker';

export default app;
