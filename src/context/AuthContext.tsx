'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, fetchUserProfile, UserStats } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: UserStats | null;
  loading: boolean;
  isAluno: boolean;
  isVisitor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAluno: false,
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userProfile = await fetchUserProfile(firebaseUser.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAluno = !!(profile?.role === 'aluno' || profile?.role === 'admin');
  const isVisitor = !user || profile?.role === 'lead';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAluno, isVisitor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
