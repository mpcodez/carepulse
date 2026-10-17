import {
  signInAnonymously,
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Initialize authentication.
 * Uses a custom token when available (e.g. Canvas environment),
 * otherwise falls back to anonymous auth.
 */
export async function initAuth() {
  try {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }
  } catch (err) {
    console.error('Auth initialization error:', err);
  }
}

/**
 * Sign the current user out.
 */
export function logOut() {
  return firebaseSignOut(auth);
}
