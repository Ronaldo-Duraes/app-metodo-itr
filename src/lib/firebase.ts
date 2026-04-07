import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs,
  addDoc, 
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
  sendPasswordResetEmail,
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
    // 🛡️ TRAVA DE SEGURANÇA: Nunca sobrescrever role existente!
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Verifica se o doc já existe (race condition / re-signup)
      let existingDoc;
      try {
        existingDoc = await Promise.race([
          getDoc(userRef),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_CHECK')), 3000))
        ]);
      } catch {
        existingDoc = null; // Se timeout, trata como novo
      }

      if (existingDoc && existingDoc.exists() && existingDoc.data()?.role) {
        // 🛡️ Doc já existe com role definida pelo Admin — NÃO sobrescrever!
        console.log('🛡️ Role existente preservada:', existingDoc.data()?.role);
        await Promise.race([
          setDoc(userRef, {
            displayName: name,
            name: name,
            email: user.email,
            uid: user.uid,
            // role OMITIDO PROPOSITALMENTE — preserva o que o Admin definiu
          }, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_BANCO')), 5000))
        ]);
      } else {
        // Doc novo — pode definir role inicial
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
        await Promise.race([
          setDoc(userRef, payload, { merge: true }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_BANCO')), 5000))
        ]);
      }
      console.log('PASSO 2: FIRESTORE DOC OK');

      // PASSO 2.5: Disparo de e-mail de boas-vindas via coleção 'mail' (Trigger Email Extension)
      try {
        await addDoc(collection(db, 'mail'), {
          to: [user.email],
          message: {
            subject: '🏆 Bem-vindo ao Método ITR — Seu acesso foi ativado!',
            html: `
              <div style="background-color:#0a0a0a;padding:40px 20px;font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;">
                <div style="border:1px solid #d4af37;padding:40px;text-align:center;">
                  <div style="border-bottom:2px solid #d4af37;padding-bottom:24px;margin-bottom:24px;">
                    <h1 style="color:#d4af37;font-size:28px;font-weight:900;letter-spacing:2px;margin:0;text-transform:uppercase;">Método ITR</h1>
                    <p style="color:#888;font-size:10px;letter-spacing:4px;text-transform:uppercase;margin-top:8px;">Protocolo de Elite Ativado</p>
                  </div>
                  <h2 style="color:#ffffff;font-size:22px;font-weight:800;margin-bottom:16px;">Bem-vindo(a), ${name}!</h2>
                  <p style="color:#aaa;font-size:14px;line-height:1.8;margin-bottom:24px;">
                    Sua conta foi criada com sucesso. Agora você tem acesso ao sistema de fluência mais avançado do Brasil.
                  </p>
                  <div style="background:#111;border:1px solid #222;padding:20px;margin-bottom:24px;">
                    <p style="color:#d4af37;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px 0;font-weight:700;">Seus dados de acesso</p>
                    <p style="color:#fff;font-size:14px;margin:0;">📧 ${user.email}</p>
                  </div>
                  <a href="https://app-metodo-itr.vercel.app/login" style="display:inline-block;background:#d4af37;color:#0a0a0a;padding:14px 40px;font-size:12px;font-weight:900;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">
                    Acessar o Portal
                  </a>
                  <div style="border-top:1px solid #222;margin-top:32px;padding-top:16px;">
                    <p style="color:#444;font-size:10px;letter-spacing:2px;text-transform:uppercase;">© Método ITR — Todos os direitos reservados</p>
                  </div>
                </div>
              </div>
            `
          }
        });
        console.log('PASSO 2.5: EMAIL DE BOAS-VINDAS ENFILEIRADO');
      } catch (mailError: any) {
        console.warn('⚠️ Falha ao enfileirar e-mail de boas-vindas:', mailError.message);
      }
    } catch (fsError: any) {
      // Log, mas NÃO impede o fluxo — o AuthContext vai auto-criar se necessário
      console.warn("⚠️ Firestore setDoc no SignUp falhou:", fsError.message);
    }

    // PASSO 3: Retorna o usuário — o redirect é feito pelo chamador (login/page.tsx)
    return user;
  } catch (error: any) {
    console.error("Erro ao registrar:", error);
    // Sem window.alert — o caller (login/page.tsx) trata via setError UI
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

/**
 * Envia e-mail de recuperação de senha (Firebase Auth)
 * Seta idioma para PT antes de enviar para que a página de reset seja em português.
 */
export async function resetPassword(email: string): Promise<boolean> {
  if (!isFirebaseReady || !auth) return false;
  try {
    auth.languageCode = 'pt';
    await sendPasswordResetEmail(auth, email);
    console.log('✅ E-mail de recuperação enviado para:', email);
    return true;
  } catch (error: any) {
    console.error('❌ Erro ao enviar e-mail de recuperação:', error);
    throw error;
  }
}

export async function signInWithGoogle() {
  if (!isFirebaseReady || !auth || !googleProvider) return null;
  try {
    // 🛡️ Limpa qualquer sessão anterior para evitar "TARGET_ID_ALREADY_EXISTS"
    await auth.signOut().catch(() => {});
    
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
  // 🛡️ Limpa dados locais para evitar "sujeira" entre contas
  if (typeof window !== 'undefined') {
    const keysToRemove = [
      'itr_app_data',
      'itr_mirror_triggers',
      'itr_grammar_checklist',
      'itr-tour-completed',
      'welcomeShown'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    sessionStorage.removeItem('welcomeShown');
  }
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
 * ADMIN: Exclui o documento do usuário do Firestore.
 * Nota: Não remove do Firebase Auth (requer Admin SDK no servidor).
 * O usuário será re-criado no Firestore se tentar logar novamente.
 */
export async function deleteUserDoc(uid: string): Promise<boolean> {
  if (!isFirebaseReady || !db || !uid) return false;
  try {
    const { deleteDoc: deleteDocument } = await import('firebase/firestore');
    const userRef = doc(db, 'users', uid);
    await deleteDocument(userRef);
    console.log('🗑️ Documento do usuário removido:', uid);
    return true;
  } catch (error) {
    console.error("Erro ao deletar documento:", error);
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

// ===================================================================
// SINCRONIZAÇÃO TOTAL — AppData (Vocabulário, SRS, Decks) na Nuvem
// ===================================================================

/**
 * Salva TODO o AppData (dicionário, decks, profile local, sprints) no Firestore.
 * Armazenado em: users/{uid}/appData/main
 * Usa merge para não sobrescrever campos que possam existir.
 */
export async function saveAppDataToCloud(uid: string, data: any): Promise<boolean> {
  if (!isFirebaseReady || !db || !uid) return false;
  try {
    const docRef = doc(db, 'users', uid, 'appData', 'main');
    // Remove campos undefined/function que o Firestore não aceita
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, { 
      ...cleanData, 
      _lastSyncedAt: serverTimestamp() 
    });
    console.log('☁️ AppData sincronizado com a nuvem');
    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar AppData na nuvem:", error);
    return false;
  }
}

/**
 * Carrega o AppData completo do Firestore para restaurar no localStorage.
 * Retorna null se não houver dados na nuvem (primeiro acesso).
 */
export async function loadAppDataFromCloud(uid: string): Promise<any | null> {
  if (!isFirebaseReady || !db || !uid) return null;
  try {
    await enableNetwork(db).catch(() => {});
    const docRef = doc(db, 'users', uid, 'appData', 'main');
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('TIMEOUT_CLOUD_LOAD')), 8000))
    ]);
    if (snap.exists()) {
      const data = snap.data();
      // Remove metadados do Firestore antes de retornar
      delete data._lastSyncedAt;
      console.log('☁️ AppData restaurado da nuvem:', {
        dictionary: data.dictionary?.length || 0,
        decks: data.decks?.length || 0,
        totalWords: data.profile?.totalWordsAdded || 0
      });
      return data;
    }
    console.log('☁️ Nenhum AppData encontrado na nuvem (primeiro acesso)');
    return null;
  } catch (error: any) {
    console.warn("⚠️ Falha ao carregar AppData da nuvem:", error.message);
    return null;
  }
}
