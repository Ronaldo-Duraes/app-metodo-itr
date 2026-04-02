'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, fetchUserProfile, UserStats } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: UserStats | null;
  loading: boolean;
  isAluno: boolean;
  isUsuario: boolean;
  isAdmin: boolean;
  isVisitor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAluno: false,
  isUsuario: false,
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
      // Libera a interface instantaneamente enquanto busca o Firestore
      setLoading(false);
      
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
          unsubscribeProfile = onSnapshot(userRef, async (docSnap: any) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data());
              setLoading(false);
            } else {
              const { setDoc } = require('firebase/firestore');
              try {
                const newProfile: UserStats = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  displayName: firebaseUser.displayName || 'Usuário',
                  name: firebaseUser.displayName || 'Usuário',
                  role: 'usuario',
                  createdAt: new Date(),
                  totalWordsAdded: 0,
                  masteredCount: 0,
                  unlockedRewards: []
                };
                await setDoc(userRef, newProfile);
                setProfile(newProfile);
                setLoading(false);
              } catch (e) {
                console.error("Erro ao auto-criar documento:", e);
                setProfile(null);
                setLoading(false);
              }
            }
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

  const isAluno = profile?.role === 'aluno' || profile?.role === 'admin';
  const isUsuario = profile?.role === 'usuario';
  const isAdmin = profile?.role === 'admin';
  const isVisitor = !user;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAluno, isUsuario, isAdmin, isVisitor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
