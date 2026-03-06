'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  reload,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; email: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: () => Promise<{ success: boolean; error?: string }>;
  checkEmailVerified: () => Promise<{ verified: boolean }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ALLOWED_DOMAINS = ['gmail.com', 'outlook.com', 'icloud.com'];

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email address.';
  const domain = email.split('@')[1]?.toLowerCase();
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return 'Only @gmail.com, @outlook.com, and @icloud.com are accepted.';
  }
  return null;
}

async function getUsername(uid: string): Promise<string> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data().username as string) : '';
  } catch {
    return '';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.emailVerified) {
        const username = await getUsername(fbUser.uid);
        setFirebaseUser(fbUser);
        setUser({ username, email: fbUser.email! });
        setIsAuthenticated(true);
      } else {
        setFirebaseUser(fbUser);
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        await signOut(auth);
        return { success: false, error: 'Please verify your email before logging in. Check your inbox for the verification link.' };
      }
      const username = await getUsername(cred.user.uid);
      setFirebaseUser(cred.user);
      setUser({ username, email: cred.user.email! });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password.' };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setFirebaseUser(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const emailError = validateEmail(email);
    if (emailError) return { success: false, error: emailError };

    // Step 1: Create auth account
    let cred;
    try {
    cred = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
    console.error("Firebase register error:", err);

    const code = (err as { code?: string }).code;
    const message = (err as { message?: string }).message;

    if (code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists.' };
    }

    if (code === 'auth/weak-password') {
        return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (code === 'auth/operation-not-allowed') {
        return { success: false, error: 'Email/Password sign-in is not enabled.' };
    }

    return { success: false, error: code ?? message ?? 'Unknown error' };
    }

    // Step 2: Save username to Firestore (non-blocking — won't prevent registration)
    try {
      await setDoc(doc(db, 'users', cred.user.uid), { username, email });
    } catch (err: unknown) {
      console.warn('Firestore write failed (username not saved):', (err as { message?: string }).message);
    }

    // Step 3: Send verification email
    try {
      await sendEmailVerification(cred.user);
    } catch (err: unknown) {
      console.warn('Verification email failed:', (err as { message?: string }).message);
    }

    setFirebaseUser(cred.user);
    await signOut(auth);
    return { success: true };
  };

  const resendVerification = async (): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseUser) return { success: false, error: 'No pending registration found.' };
    try {
      await sendEmailVerification(firebaseUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Could not resend verification email.' };
    }
  };

  const checkEmailVerified = async (): Promise<{ verified: boolean }> => {
    if (!firebaseUser) return { verified: false };
    await reload(firebaseUser);
    return { verified: firebaseUser.emailVerified };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, register, resendVerification, checkEmailVerified }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
