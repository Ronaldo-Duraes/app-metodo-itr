import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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
let app;
let db: any = null;
let auth: any = null;

if (isFirebaseReady) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { db, auth };

// --- Lógica de Sincronização de Progresso ---

export interface UserStats {
  masteredCount: number;
  unlockedRewards: string[]; // ['ruby_500', 'gold_1500']
}

/**
 * Busca o progresso real do usuário no Firestore
 */
export async function fetchUserStats(uid: string): Promise<UserStats | null> {
  if (!isFirebaseReady) return null;
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
  if (!isFirebaseReady) return false;
  const docRef = doc(db, 'users', uid);
  const stats = await fetchUserStats(uid);
  
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
