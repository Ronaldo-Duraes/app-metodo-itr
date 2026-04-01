'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, fetchUserProfile, UserStats } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: UserStats | null;
  loading: boolean;
  isAluno: boolean;
  isAdmin: boolean;
  isVisitor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAluno: false,
  isAdmin: false,
  isVisitor: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      // Limpar subscription anterior do profile se existir
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        const { db } = require('@/lib/firebase'); // Import dinâmico ou garantir que db existe
        const { doc, onSnapshot } = require('firebase/firestore');
        
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          unsubscribeProfile = onSnapshot(userRef, (docSnap: any) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data());
            } else {
              setProfile(null);
            }
            setLoading(false);
          }, (error: any) => {
            console.error("Profile sync error:", error);
            setLoading(false);
          });
        } catch (error) {
          console.error("Auth context setup error:", error);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const isAluno = !!(profile?.role === 'aluno' || profile?.role === 'admin');
  const isAdmin = profile?.role === 'admin';
  const isVisitor = !user || profile?.role === 'lead';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAluno, isAdmin, isVisitor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
