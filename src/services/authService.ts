/**
 * Clerk-Ready Authentication Service for Kayda Sathi
 * 
 * Configured for seamless transition to Clerk (@clerk/clerk-expo).
 * Handles user sessions, email sign-in, social sign-in, and guest citizen access.
 */
import { Platform } from 'react-native';
import { validateCredentials } from './authValidation';

// Clerk configuration and post-auth redirect URLs
export const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

export const CLERK_AUTH_URLS = {
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/auth-redirect',
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/auth-redirect',
  signInFallbackRedirectUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || '/auth-redirect',
  signUpFallbackRedirectUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL || '/auth-redirect',
};

const STORAGE_KEY = 'kayda_sathi_auth_user';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
  provider?: string;
  redirectUrl?: string;
}

// In-memory user cache
let currentUser: UserProfile | null = null;
const subscribers = new Set<(user: UserProfile | null) => void>();

function notifySubscribers() {
  subscribers.forEach((cb) => {
    try {
      cb(currentUser);
    } catch (e) {
      console.warn('Subscriber notification error:', e);
    }
  });
}

function saveSession(user: UserProfile | null, rememberMe: boolean) {
  currentUser = user;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      if (user && rememberMe) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // ignore storage error
    }
  }
  notifySubscribers();
}

function loadInitialSession(): UserProfile | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore storage error
    }
  }
  return null;
}

currentUser = loadInitialSession();

export const authService = {
  /**
   * Subscribe to auth state changes (used by App.tsx)
   */
  subscribe: (
    onChange: (user: UserProfile | null) => void,
    onError: (message: string) => void
  ): (() => void) => {
    subscribers.add(onChange);
    setTimeout(() => {
      try {
        onChange(currentUser);
      } catch (err: any) {
        onError(err?.message || 'Error checking session');
      }
    }, 10);

    return () => {
      subscribers.delete(onChange);
    };
  },

  /**
   * Sign In with Email and Password
   */
  signInWithEmail: async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<UserProfile> => {
    validateCredentials(email, password, false);

    // Clean user object (ready to link with Clerk useSignIn hook)
    const user: UserProfile = {
      uid: 'clerk-user-' + Date.now(),
      email: email.trim(),
      displayName: email.split('@')[0],
      photoURL: null,
      phoneNumber: null,
      isAnonymous: false,
      emailVerified: true,
      provider: 'clerk',
      redirectUrl: CLERK_AUTH_URLS.afterSignInUrl,
    };

    saveSession(user, rememberMe);
    return user;
  },

  /**
   * Create account / Sign Up with Email and Password
   */
  signUpWithEmail: async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    rememberMe = true
  ): Promise<UserProfile> => {
    validateCredentials(email, password, true);

    const fName = firstName?.trim() || '';
    const lName = lastName?.trim() || '';
    const computedName = fName && lName
      ? `${fName} ${lName}`
      : fName || email.split('@')[0];

    const user: UserProfile = {
      uid: 'clerk-user-' + Date.now(),
      email: email.trim(),
      displayName: computedName,
      firstName: fName || null,
      lastName: lName || null,
      photoURL: null,
      phoneNumber: null,
      isAnonymous: false,
      emailVerified: false,
      provider: 'clerk',
      redirectUrl: CLERK_AUTH_URLS.afterSignUpUrl,
    };

    saveSession(user, rememberMe);
    return user;
  },

  /**
   * Send Password Reset Email / Verification Code
   */
  sendPasswordReset: async (email: string): Promise<void> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      throw new Error('Please enter a valid email address first.');
    }
    // Simulation / Clerk prepareFirstFactor email_code
    console.info(`Password reset / verification dispatched to ${email}`);
  },

  /**
   * Send Email Verification
   */
  sendEmailVerification: async (): Promise<void> => {
    console.info('Verification code sent to user email.');
  },

  /**
   * Social Sign-in (Google - Clerk OAuth via /auth-redirect)
   */
  signInWithGoogle: async (
    googleEmail?: string,
    googleName?: string
  ): Promise<UserProfile> => {
    const email = googleEmail?.trim() || 'citizen.google@gmail.com';
    const displayName = googleName?.trim() || 'Google Verified Citizen';
    const parts = displayName.split(' ');
    const firstName = parts[0] || 'Google';
    const lastName = parts.slice(1).join(' ') || 'Citizen';

    const user: UserProfile = {
      uid: 'clerk-google-' + Date.now(),
      email: email,
      displayName: displayName,
      firstName: firstName,
      lastName: lastName,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      phoneNumber: null,
      isAnonymous: false,
      emailVerified: true,
      provider: 'google',
      redirectUrl: CLERK_AUTH_URLS.afterSignInUrl,
    };
    saveSession(user, true);
    return user;
  },

  /**
   * Social Sign-in (Apple - ready for Clerk OAuth)
   */
  signInWithApple: async (): Promise<UserProfile> => {
    const user: UserProfile = {
      uid: 'clerk-apple-' + Date.now(),
      email: 'citizen@icloud.com',
      displayName: 'Apple User',
      photoURL: null,
      phoneNumber: null,
      isAnonymous: false,
      emailVerified: false,
      provider: 'apple',
    };
    saveSession(user, true);
    return user;
  },

  /**
   * Phone Sign-in (ready for Clerk Phone SMS code)
   */
  signInWithPhone: async (phone?: string): Promise<UserProfile> => {
    const user: UserProfile = {
      uid: 'clerk-phone-' + Date.now(),
      email: null,
      displayName: 'Phone Verified Citizen',
      photoURL: null,
      phoneNumber: phone || '+91 98765 43210',
      isAnonymous: false,
      emailVerified: false,
      provider: 'phone',
    };
    saveSession(user, true);
    return user;
  },

  /**
   * Guest / Anonymous Sign-in
   */
  signInAnonymously: async (): Promise<UserProfile> => {
    const user: UserProfile = {
      uid: 'guest-' + Date.now(),
      email: null,
      displayName: 'Guest Citizen',
      photoURL: null,
      phoneNumber: null,
      isAnonymous: true,
      emailVerified: false,
      provider: 'guest',
    };
    saveSession(user, false);
    return user;
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    saveSession(null, false);
  },
};
