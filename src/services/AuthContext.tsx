import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { storage } from './storage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout: if onAuthStateChanged doesn't fire within 1.5 seconds,
    // stop loading and show whatever state we have.
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth initialization timed out, forcing loading to false.');
        setLoading(false);
      }
    }, 1500);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(timeoutId);
      
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Set basic user info immediately to unblock the UI
      const basicUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      };
      setUser(basicUser);
      setLoading(false);

      // Fetch full profile in the background
      try {
        const profile = await storage.getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          // If profile doesn't exist, save the basic one
          await storage.saveUserProfile(basicUser);
        }
      } catch (firestoreError) {
        console.error('Background Firestore profile fetch failed:', firestoreError);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
