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
  onSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
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

// Inicializa Firebase apenas se as chaves existirem
let app: any;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isFirebaseReady) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  // Configuração adicional para evitar erros de pop-up no localhost
  googleProvider.setCustomParameters({ prompt: 'select_account' });
}

export const ADMIN_EMAIL = 'ronaldo.duraes@gmail.com';

export { db, auth, googleProvider };

// --- Lógica de Autenticação & Firestore ---

export async function signUpWithEmail(email: string, pass: string, name: string) {
  if (!isFirebaseReady || !auth || !db) return null;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    
    // Criar perfil no Firestore
    const userRef = doc(db, 'users', user.uid);
    
    // Determinar role inicial (Auto-Admin se o e-mail for o do ronaldo)
    const initialRole = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'lead';

    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: null,
      role: initialRole,
      createdAt: new Date().toISOString(),
      totalWordsAdded: 0,
      masteredCount: 0,
      unlockedRewards: []
    });
    
    return user;
  } catch (error) {
    console.error("Erro ao registrar com e-mail:", error);
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
    
    // Verificar se usuário existe no Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Determinar role inicial (Auto-Admin)
      const initialRole = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'lead';

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: initialRole,
        createdAt: new Date().toISOString(),
        totalWordsAdded: 0,
        masteredCount: 0,
        unlockedRewards: []
      });
    }
    
    return user;
  } catch (error: any) {
    console.error("❌ Erro Crítico Google Auth:", {
      code: error.code,
      message: error.message,
      domain: window.location.hostname
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
  photoURL?: string;
  role: 'lead' | 'aluno' | 'admin';
  masteredCount: number;
  totalWordsAdded: number;
  unlockedRewards: string[]; 
  createdAt?: string;
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
 * ADMIN: Busca todos os usuários ordenados por data de criação
 */
export async function getAllUsers(): Promise<UserStats[]> {
  if (!isFirebaseReady || !db) return [];
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserStats);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
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
