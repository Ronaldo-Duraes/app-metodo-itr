'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp, enableNetwork } from 'firebase/firestore';
import { auth, db, UserStats, ADMIN_EMAIL } from '@/lib/firebase';

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
  const autoCreateAttempted = useRef(false);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      // Libera a interface instantaneamente enquanto busca o Firestore
      setLoading(false);
      autoCreateAttempted.current = false;
      
      // Limpar subscription anterior do profile
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        // Força enableNetwork antes de tentar ouvir
        enableNetwork(db).catch(() => {});
        
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          
          unsubscribeProfile = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserStats);
            } else {
              // GUARDIÃO: Documento não existe no Firestore, mas user está autenticado
              // Auto-criar com role 'usuario' para NUNCA tratá-lo como visitante
              if (!autoCreateAttempted.current) {
                autoCreateAttempted.current = true;
                console.log('🛡️ AuthContext: Auto-criando documento para UID:', firebaseUser.uid);
                
                try {
                  // 🛡️ TRAVA DUPLA: Verificar novamente com getDoc antes de escrever
                  // (protege contra race conditions onde o doc foi criado entre o onSnapshot e agora)
                  const { getDoc: getDocCheck } = await import('firebase/firestore');
                  const freshSnap = await getDocCheck(userRef);
                  
                  if (freshSnap.exists() && freshSnap.data()?.role) {
                    // Doc foi criado por outro fluxo — usar os dados existentes
                    console.log('🛡️ AuthContext: Doc já existe com role', freshSnap.data()?.role, '— preservando');
                    setProfile(freshSnap.data() as UserStats);
                  } else {
                    // Doc genuinamente novo — pode criar com role padrão
                    const initialRole = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'usuario';
                    const newProfile: UserStats = {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email || '',
                      displayName: firebaseUser.displayName || 'Usuário',
                      name: firebaseUser.displayName || 'Usuário',
                      role: initialRole,
                      createdAt: serverTimestamp() as any,
                      totalWordsAdded: 0,
                      masteredCount: 0,
                      unlockedRewards: []
                    };
                    await setDoc(userRef, newProfile, { merge: true });
                    // O onSnapshot vai atualizar o profile automaticamente quando o doc for criado
                  }
                } catch (e) {
                  console.error("Erro ao auto-criar documento:", e);
                  // Fallback: setar profile local mesmo sem Firestore para evitar "visitante"
                  setProfile({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || 'Usuário',
                    name: firebaseUser.displayName || 'Usuário',
                    role: 'usuario',
                    totalWordsAdded: 0,
                    masteredCount: 0,
                    unlockedRewards: []
                  });
                }
              }
            }
          }, (error) => {
            console.error("Profile sync error:", error);
            // Fallback: se onSnapshot falhar, setar profile local
            if (firebaseUser) {
              setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'Usuário',
                name: firebaseUser.displayName || 'Usuário',
                role: 'usuario',
                totalWordsAdded: 0,
                masteredCount: 0,
                unlockedRewards: []
              });
            }
          });
        } catch (error) {
          console.error("Auth context setup error:", error);
          setLoading(false);
        }
      } else {
        setProfile(null);
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
