'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signOut as firebaseSignOut } from './auth';
import { getUserProfile, UserProfile } from './firestore';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
    }
  };

  useEffect(() => {
    // Safety net: if Firebase Auth hangs (e.g. IndexedDB blocked by browser extension),
    // unblock after 4 seconds rather than spinning forever.
    const timeout = setTimeout(() => setLoading(false), 4000);

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      clearTimeout(timeout);
      setUser(firebaseUser);
      setLoading(false); // unblock consumers immediately — profile loads in background

      if (firebaseUser) {
        getUserProfile(firebaseUser.uid).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut: handleSignOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
