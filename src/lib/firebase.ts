import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Verifica se as chaves existem para evitar erros de inicialização se o .env estiver vazio
export const isFirebaseReady = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

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

export { db, auth, googleProvider };

// --- Lógica de Autenticação & Firestore ---

export async function signUpWithEmail(email: string, pass: string, name: string) {
  if (!isFirebaseReady || !auth || !db) return null;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    
    // Criar perfil no Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: null,
      role: 'lead',
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
      // Criar novo usuário com role 'lead' (visitante que criou conta)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: 'lead',
        createdAt: new Date().toISOString(),
        totalWordsAdded: 0,
        masteredCount: 0,
        unlockedRewards: []
      });
    }
    
    return user;
  } catch (error) {
    console.error("Erro ao autenticar com Google:", error);
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
  role: 'lead' | 'aluno' | 'admin';
  masteredCount: number;
  totalWordsAdded: number;
  unlockedRewards: string[]; 
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
