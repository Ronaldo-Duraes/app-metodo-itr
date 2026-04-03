import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  enableNetwork,
  Unsubscribe
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAKmN9LVOZaeO_kbnUibhgUAuc77c_Og5s",
  authDomain: "app-metodo-itr-c9e06.firebaseapp.com",
  projectId: "app-metodo-itr-c9e06",
  storageBucket: "app-metodo-itr-c9e06.firebasestorage.app",
  messagingSenderId: "837243870219",
  appId: "1:837243870219:web:de5ad9e76cf2229db7fb0e",
  measurementId: "G-K6720D3CL1"
};

// Configuração Real Conectada
export const isFirebaseReady = true;

let app: any;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isFirebaseReady) {
  app = initializeApp(firebaseConfig);
  
  // INICIALIZAÇÃO LIMPA — sem terminate(), sem clearIndexedDbPersistence()
  // Essas chamadas DESTRUÍAM a conexão e causavam "client is offline"
  db = getFirestore(app);
  
  // Força modo online proativo — se o SDK estiver offline por cache corrompido, isso força a reconexão
  if (typeof window !== 'undefined') {
    enableNetwork(db).catch((e) => console.warn('enableNetwork initial:', e));
  }
  
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const ADMIN_EMAIL = 'ronaldo.duraes@gmail.com';

export { db, auth, googleProvider };

/**
 * Força o Firestore para modo online — útil como botão de emergência
 */
export async function forceFirestoreOnline(): Promise<boolean> {
  if (!db) return false;
  try {
    await enableNetwork(db);
    console.log('✅ Firestore forçado para modo Online');
    return true;
  } catch (e) {
    console.error('❌ Falha ao forçar enableNetwork:', e);
    return false;
  }
}

// --- Lógica de Autenticação & Firestore ---

export async function signUpWithEmail(email: string, pass: string, name: string) {
  if (!isFirebaseReady || !auth || !db) return null;
  try {
    // Garante rede ativa antes de qualquer operação
    await enableNetwork(db).catch(() => {});
    
    console.log('Iniciando Auth...');
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    console.log('PASSO 1: AUTH OK — UID:', result.user.uid);
    const user = result.user;

    await updateProfile(user, { displayName: name });
    const initialRole = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'usuario';

    // PASSO 2: Criar documento no Firestore IMEDIATAMENTE
    try {
      const userRef = doc(db, 'users', user.uid);
      const payload = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        name: name,
        photoURL: null,
        role: initialRole,
        createdAt: serverTimestamp(),
        totalWordsAdded: 0,
        masteredCount: 0,
        unlockedRewards: []
      };

      // Timeout blindado de 5s
      await Promise.race([
        setDoc(userRef, payload, { merge: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT_BANCO")), 5000))
      ]);
      console.log('PASSO 2: FIRESTORE DOC OK');
    } catch (fsError: any) {
      // Log, mas NÃO impede o fluxo — o AuthContext vai auto-criar se necessário
      console.warn("⚠️ Firestore setDoc no SignUp falhou:", fsError.message);
    }

    // PASSO 3: Retorna o usuário — o redirect é feito pelo chamador (login/page.tsx)
    return user;
  } catch (error: any) {
    console.error("Erro ao registrar:", error);
    // Alert específico para email duplicado
    if (error.code === 'auth/email-already-in-use') {
      if (typeof window !== 'undefined') {
        window.alert('Este e-mail já está cadastrado! Tente fazer login.');
      }
    }
    throw error;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  if (!isFirebaseReady || !auth) return null;
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Erro ao entrar com e-mail:", error);
    throw error;
  }
}

export async function signInWithGoogle() {
  if (!isFirebaseReady || !auth || !googleProvider) return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Força rede ativa
    await enableNetwork(db).catch(() => {});
    
    const userRef = doc(db, 'users', user.uid);
    
    let userSnap;
    try {
      userSnap = await getDoc(userRef);
    } catch (docError: any) {
      // Fallback: se offline, redireciona mesmo assim — AuthContext cria o doc
      if (docError.message?.toLowerCase().includes('offline')) {
        console.warn('Firestore offline no Google Auth — redirecionando...');
        if (typeof window !== 'undefined') {
          window.location.href = '/app';
        }
        return user;
      }
      throw docError;
    }
    
    if (!userSnap.exists()) {
      const initialRole = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'usuario';

      try {
        const payload = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          name: user.displayName,
          photoURL: user.photoURL,
          role: initialRole,
          createdAt: serverTimestamp(),
          totalWordsAdded: 0,
          masteredCount: 0,
          unlockedRewards: []
        };
        
        await Promise.race([
          setDoc(userRef, payload, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT_BANCO")), 5000))
        ]);
        console.log('✅ Doc criado (Google Auth):', user.uid);
      } catch (fsError: any) {
        console.warn("⚠️ Firestore block no Google Auth:", fsError.message);
        // Não bloqueia — AuthContext cria o doc
      }
    } else {
      // Atualiza dados do Google
      await updateDoc(userRef, {
        displayName: user.displayName || userSnap.data()?.displayName,
        photoURL: user.photoURL || userSnap.data()?.photoURL
      }).catch(() => {});
    }
    
    return user;
  } catch (error: any) {
    console.error("❌ Erro Crítico Google Auth:", {
      code: error.code,
      message: error.message,
      domain: typeof window !== 'undefined' ? window.location.hostname : 'SSR'
    });
    throw error;
  }
}

export async function logout() {
  if (!auth) return;
  await signOut(auth);
}

export interface UserStats {
  uid?: string;
  email?: string;
  displayName?: string;
  name?: string;
  photoURL?: string;
  role: 'usuario' | 'aluno' | 'admin';
  masteredCount: number;
  totalWordsAdded: number;
  unlockedRewards: string[]; 
  createdAt?: any;
}

/**
 * Busca o perfil completo do usuário no Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserStats | null> {
  if (!isFirebaseReady || !db) return null;
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserStats;
  }
  return null;
}

/**
 * Atualiza o status de resgate de recompensa
 */
export async function redeemReward(uid: string, rewardKey: string) {
  if (!isFirebaseReady || !db) return false;
  const docRef = doc(db, 'users', uid);
  const stats = await fetchUserProfile(uid);
  
  if (stats) {
    const updatedRewards = [...(stats.unlockedRewards || [])];
    if (!updatedRewards.includes(rewardKey)) {
      updatedRewards.push(rewardKey);
      await updateDoc(docRef, { unlockedRewards: updatedRewards });
      return true;
    }
  }
  return false;
}

/**
 * ADMIN: Busca todos os usuários (one-shot) com força online
 */
export async function getAllUsers(): Promise<UserStats[]> {
  if (!isFirebaseReady || !db) return [];
  try {
    // Força rede ativa antes de buscar
    await enableNetwork(db).catch(() => {});
    
    const usersRef = collection(db, 'users');
    
    const querySnapshot = await Promise.race([
      getDocs(query(usersRef)),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("TIMEOUT_BANCO")), 8000))
    ]);
    
    // @ts-ignore
    const users = querySnapshot.docs.map((d: any) => d.data() as UserStats);
    return users.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } catch (error: any) {
    if (error.message === 'TIMEOUT_BANCO') {
       throw error; 
    }
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

/**
 * ADMIN: Inscreve listener real-time na coleção users (onSnapshot)
 */
export function subscribeToUsers(callback: (users: UserStats[]) => void): Unsubscribe | null {
  if (!isFirebaseReady || !db) return null;
  
  const usersRef = collection(db, 'users');
  
  return onSnapshot(usersRef, (snapshot) => {
    const users = snapshot.docs.map(d => d.data() as UserStats);
    const sorted = users.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    callback(sorted);
  }, (error) => {
    console.error("onSnapshot users error:", error);
  });
}

/**
 * ADMIN: Atualiza o role de um usuário
 */
export async function updateUserRole(uid: string, newRole: UserStats['role']) {
  if (!isFirebaseReady || !db) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role: newRole });
    return true;
  } catch (error) {
    console.error("Erro ao atualizar role:", error);
    return false;
  }
}

/**
 * Atualiza o perfil do usuário no Firestore e no Firebase Auth
 */
export async function updateUserProfile(uid: string, data: Partial<UserStats>) {
  if (!isFirebaseReady || !db) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    
    if (auth.currentUser && auth.currentUser.uid === uid) {
      if (data.displayName || data.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName || auth.currentUser.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return false;
  }
}

// ===================================================================
// PERSISTÊNCIA DE PROGRESSO — Salva/carrega checklists no Firestore
// ===================================================================

export interface UserProgress {
  grammarChecklist?: Record<string, boolean>;
  mirrorTriggers?: Record<string, boolean>;
  lastSyncedAt?: any;
}

/**
 * Salva progresso do usuário no Firestore (merge para não sobrescrever outros campos)
 */
export async function saveUserProgress(uid: string, progressKey: keyof UserProgress, data: any): Promise<boolean> {
  if (!isFirebaseReady || !db || !uid) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      [`progress.${progressKey}`]: data,
      [`progress.lastSyncedAt`]: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Erro ao salvar progresso (${progressKey}):`, error);
    // Fallback: tenta setDoc com merge se o doc não existir
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        progress: {
          [progressKey]: data,
          lastSyncedAt: serverTimestamp()
        }
      }, { merge: true });
      return true;
    } catch (e2) {
      console.error("Fallback setDoc também falhou:", e2);
      return false;
    }
  }
}

/**
 * Carrega progresso do usuário do Firestore
 */
export async function loadUserProgress(uid: string): Promise<UserProgress | null> {
  if (!isFirebaseReady || !db || !uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data.progress as UserProgress) || null;
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar progresso:", error);
    return null;
  }
}
