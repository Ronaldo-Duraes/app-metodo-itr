'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import SidebarES from "@/components/sidebar/SidebarES";
import HeaderES from "@/components/layout/HeaderES";
import { motion, AnimatePresence } from 'framer-motion';
import { getUserProfile, checkMasteryMilestone, playMasterySound, playBlipSound, getDictionaryCount, setCloudSyncCallback, saveAppData, getAppData } from '@/lib/srs';
import MasteryModal from './MasteryModal';
import { initDebugMode } from '@/lib/debug';
import { startTour } from '@/lib/tour';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile, saveAppDataToCloud, loadAppDataFromCloud } from '@/lib/firebase';
import { arrayUnion } from 'firebase/firestore';
import WelcomeTour from '@/components/WelcomeTour';

const WelcomeScreen = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000] font-outfit overflow-hidden">
    <motion.div 
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }} 
      className="text-center"
    >
      <span className="text-[10px] font-black text-orange-500 tracking-[0.6em] uppercase mb-4 block animate-pulse text-center w-full">Ambiente de Elite</span>
      <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-orange-500 tracking-[-0.05em] uppercase drop-shadow-[0_0_50px_rgba(16,185,129,0.4)] leading-none px-4 text-center">
        Boas-vindas
      </h1>
    </motion.div>
  </div>
);

export default function AppWrapperES({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarESOpen, setIsSidebarESOpen] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    // Sincronizar estado com o sessionStorage IMEDIATAMENTE antes da pintura
    const welcomeShown = sessionStorage.getItem('welcomeShown');
    
    if (welcomeShown) {
      setShowSplash(false);
    }
    
    setIsInitialized(true);
    initDebugMode();
  }, []);

  useEffect(() => {
    // Fechar a splash após o tempo cinematográfico rigoroso
    if (showSplash && isInitialized) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('welcomeShown', 'true');
        }
      }, 1500); 
      return () => clearTimeout(timer);
    }
    
    // Iniciar tour se necessário após a splash
    if (!showSplash && isInitialized) {
      // Auto-tour desativado: Controle agora é manual via ícones (?) no HeaderES/SidebarES
    }
  }, [showSplash, isInitialized]);

  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const { user, profile: authProfile } = useAuth();
  const cloudSyncInitialized = useRef(false);

  // ===================================================================
  // ☁️ CLOUD SYNC ENGINE — Sincronização Total com Firestore
  // ===================================================================
  useEffect(() => {
    if (!user?.uid || !isInitialized) return;
    
    // Evita re-inicialização dupla
    if (cloudSyncInitialized.current) return;
    cloudSyncInitialized.current = true;
    
    const initCloudSync = async () => {
      try {
        // PASSO 1: Carregar AppData da nuvem
        const cloudData = await loadAppDataFromCloud(user.uid);
        
        if (cloudData) {
          const localData = getAppData();
          const localHasData = (localData.dictionary?.length || 0) > 0;
          const cloudHasData = (cloudData.dictionary?.length || 0) > 0;
          
          if (cloudHasData && !localHasData) {
            // Nuvem tem dados, local está vazio → RESTAURAR da nuvem
            console.log('☁️ Restaurando dados da nuvem para localStorage');
            saveAppData(cloudData);
          } else if (cloudHasData && localHasData) {
            // Ambos têm dados → Usar o que tem MAIS conteúdo (merge inteligente)
            const cloudDictLen = cloudData.dictionary?.length || 0;
            const localDictLen = localData.dictionary?.length || 0;
            
            if (cloudDictLen > localDictLen) {
              console.log(`☁️ Nuvem tem mais dados (${cloudDictLen} vs ${localDictLen}) → Usando nuvem`);
              saveAppData(cloudData);
            } else {
              console.log(`☁️ Local tem mais dados (${localDictLen} vs ${cloudDictLen}) → Sincronizando para nuvem`);
              saveAppDataToCloud(user.uid, localData);
            }
          } else if (!cloudHasData && localHasData) {
            // Local tem dados, nuvem não → Upload inicial
            console.log('☁️ Upload inicial dos dados locais para a nuvem');
            saveAppDataToCloud(user.uid, localData);
          }
        } else {
          // Primeiro acesso na nuvem → Upload do que tiver localmente
          const localData = getAppData();
          if ((localData.dictionary?.length || 0) > 0) {
            console.log('☁️ Primeiro upload para a nuvem');
            saveAppDataToCloud(user.uid, localData);
          }
        }
      } catch (err) {
        console.warn('⚠️ Falha ao inicializar cloud sync:', err);
      }
      
      // PASSO 2: Registrar callback de sync contínuo (debounced)
      setCloudSyncCallback((data) => {
        if (user?.uid) {
          saveAppDataToCloud(user.uid, data).catch(() => {});
        }
      });
    };
    
    initCloudSync();
    
    return () => {
      setCloudSyncCallback(null);
      cloudSyncInitialized.current = false;
    };
  }, [user?.uid, isInitialized]);

  // --- MONITORAMENTO DE MAESTRIA (EPIC) ---
  useEffect(() => {
    if (showSplash || !isInitialized) return;
    
    const checkMastery = () => {
      const profile = getUserProfile();
      const count = profile.totalWordsAdded || 0;
      const reached = checkMasteryMilestone(count);
      
      if (reached) {
        setActiveMilestone(reached.value);
        if (reached.isMastery) {
          playMasterySound();
        } else {
          playBlipSound();
        }

        // 🛡️ PERSISTÊNCIA: Sincronizar masteredCount + milestone no Firestore
        if (user?.uid) {
          const dictCount = getDictionaryCount();
          updateUserProfile(user.uid, {
            masteredCount: dictCount,
            totalWordsAdded: count,
            unlockedRewards: arrayUnion(`milestone_${reached.value}`) as any,
          } as any).catch(err => console.warn('⚠️ Falha ao persistir milestone:', err));
        }
      }
    };

    // Verifica inicialmente e depois a cada 2 seg
    checkMastery();
    const interval = setInterval(checkMastery, 2000);
    return () => clearInterval(interval);
  }, [showSplash, isInitialized, user?.uid]);

  // Callback when user claims the mastery modal
  const handleClaimMastery = () => {
    const claimedValue = activeMilestone;
    setActiveMilestone(null);
    
    // Sincronização final no Firestore ao reivindicar
    if (user?.uid && claimedValue) {
      const dictCount = getDictionaryCount();
      updateUserProfile(user.uid, {
        masteredCount: dictCount,
        totalWordsAdded: getUserProfile().totalWordsAdded || 0,
      } as any).catch(() => {});
    }
  };

  // --- LÓGICA ANTI-FLASH: RETORNO ABSOLUTO ---
  // Se a splash deve aparecer, NÃO RENDERIZA NADA (SidebarES, Main, Conteúdo) além dela.
  if (showSplash && isInitialized) {
    return <WelcomeScreen />;
  }

  // Prevenção de flash durante inicialização do sessionStorage
  if (!isInitialized) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      <SidebarES isOpen={isSidebarESOpen} onClose={() => setIsSidebarESOpen(false)} />
      <div className="flex-1 ml-0 md:ml-64 relative min-h-screen">
        <HeaderES onMenuToggle={() => setIsSidebarESOpen(prev => !prev)} />
        <main className="p-3 md:p-8 pt-[72px] md:pt-28 pb-6 md:pb-8 h-screen overflow-y-auto scroll-smooth transition-all duration-300 safe-bottom">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {activeMilestone && (
          <MasteryModal 
            milestone={activeMilestone} 
            onClose={handleClaimMastery} 
          />
        )}
      </AnimatePresence>

      <WelcomeTour isSidebarOpen={isSidebarESOpen} setIsSidebarOpen={setIsSidebarESOpen} />
    </>
  );
}
