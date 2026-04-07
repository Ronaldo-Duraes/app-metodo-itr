'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc, updateDoc, serverTimestamp, enableNetwork } from 'firebase/firestore';
import { auth, db, UserStats, ADMIN_EMAIL } from '@/lib/firebase';

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 🧹 LIMPEZA DE CACHE — Executada em erros críticos de auth
// ─────────────────────────────────────────────────────────────
function clearAuthCache() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.clear();
    const keysToRemove = [
      'itr_app_data',
      'itr_mirror_triggers',
      'itr_grammar_checklist',
      'itr-tour-completed',
      'welcomeShown',
      'admin_authenticated'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('🧹 Cache de autenticação limpo');
  } catch (e) {
    console.warn('Falha ao limpar cache:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 🛡️ PROVEDOR DE AUTENTICAÇÃO — FONTE ÚNICA DE VERDADE
//
// REGRA DE OURO: `loading` SÓ vira `false` DEPOIS que o
// Firestore confirma o perfil do usuário. Isso ELIMINA o
// bug de "visitante por atraso de leitura".
// ─────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const profileUnsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // ── SEMPRE limpar listener anterior do profile ──
      if (profileUnsubRef.current) {
        profileUnsubRef.current();
        profileUnsubRef.current = null;
      }

      // ════════════════════════════════════════════════
      // CASO 1: USUÁRIO DESLOGADO
      // ════════════════════════════════════════════════
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // ════════════════════════════════════════════════
      // CASO 2: USUÁRIO AUTENTICADO
      // NÃO liberamos loading até ter o perfil Firestore
      // ════════════════════════════════════════════════
      setUser(firebaseUser);

      try {
        // Força rede ativa antes de qualquer leitura


        const userRef = doc(db, 'users', firebaseUser.uid);

        // ── PASSO 1: getDoc one-shot para perfil IMEDIATO ──
        let initialProfile: UserStats | null = null;

        try {
          const docSnap = await Promise.race([
            getDoc(userRef),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('TIMEOUT_PROFILE_5S')), 5000)
            )
          ]);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserStats;

            // 🛡️ UID CONSISTENCY CHECK
            if (data.uid && data.uid !== firebaseUser.uid) {
              console.error('🚨 UID mismatch! Doc:', data.uid, '≠ Auth:', firebaseUser.uid);
              clearAuthCache();
              await firebaseSignOut(auth);
              setUser(null);
              setProfile(null);
              setLoading(false);
              return;
            }

            initialProfile = data;
            setProfile(data);

            // Atualiza lastAccessAt sem bloquear
            updateDoc(userRef, { lastAccessAt: serverTimestamp() }).catch(() => {});
          } else {
            // ── Doc NÃO existe → criar como 'visitante' ──
            const initialRole = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
              ? 'admin'
              : 'aluno';

            const newProfile: UserStats = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Visitante ITR',
              name: firebaseUser.displayName || 'Visitante ITR',
              photoURL: firebaseUser.photoURL || null,
              role: initialRole,
              createdAt: serverTimestamp() as any,
              totalWordsAdded: 0,
              masteredCount: 0,
              unlockedRewards: [],
              firstLogin: true
            };

            await setDoc(userRef, newProfile, { merge: true });
            initialProfile = { ...newProfile, createdAt: new Date() };
            setProfile(initialProfile);
            console.log('✅ AuthContext: Doc criado com role:', initialRole);
          }
        } catch (fetchError: any) {
          console.error('❌ Erro ao buscar perfil Firestore:', fetchError.message);

          // 🧹 Se for erro de sessão corrompida, limpa tudo
          const msg = fetchError.message?.toLowerCase() || '';
          if (msg.includes('target') || msg.includes('already exists') || msg.includes('internal')) {
            console.warn('🚨 Possível TARGET_ID — limpando cache e forçando logout');
            clearAuthCache();
            await firebaseSignOut(auth).catch(() => {});
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          // Fallback: profile local mínimo para não travar UI
          initialProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Usuário',
            name: firebaseUser.displayName || 'Usuário',
            role: 'visitante',
            totalWordsAdded: 0,
            masteredCount: 0,
            unlockedRewards: [],
            firstLogin: true
          };
          setProfile(initialProfile);
        }

        // ═══════════════════════════════════════════
        // 🔓 AGORA sim: loading = false
        // O perfil Firestore FOI lido/criado.
        // ═══════════════════════════════════════════
        setLoading(false);

        // ── PASSO 2: onSnapshot para atualizações em tempo real ──
        try {
          profileUnsubRef.current = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserStats;

              // UID check em tempo real
              if (data.uid && data.uid !== firebaseUser.uid) {
                console.error('🚨 UID mismatch via onSnapshot — logout');
                clearAuthCache();
                firebaseSignOut(auth).catch(() => {});
                return;
              }

              setProfile(data);
            }
          }, (error) => {
            console.error('Profile onSnapshot error:', error);

            // 🛡️ TARGET_ID recovery
            const errorMsg = error.message?.toLowerCase() || '';
            if (errorMsg.includes('target') || errorMsg.includes('already exists') || errorMsg.includes('internal')) {
              console.warn('🚨 TARGET_ID via onSnapshot — limpando cache e logout');
              clearAuthCache();
              firebaseSignOut(auth).catch(() => {});
            }
          });
        } catch (snapError) {
          console.warn('⚠️ onSnapshot subscribe falhou (não-crítico):', snapError);
        }

      } catch (error: any) {
        console.error('❌ AuthContext setup error:', error);
        clearAuthCache();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (profileUnsubRef.current) profileUnsubRef.current();
    };
  }, []);

  // ── Derivações de role ──
  const isAluno = profile?.role === 'aluno' || profile?.role === 'admin';
  const isUsuario = profile?.role === 'usuario';
  const isAdmin = profile?.role === 'admin';
  // isVisitor: NÃO logado OU logado com role 'visitante' no Firestore
  const isVisitor = !user || profile?.role === 'visitante';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAluno, isUsuario, isAdmin, isVisitor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
