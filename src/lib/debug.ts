'use client';

import { getAppData, saveAppData, getUserProfile, saveUserProfile, addFullCard, getDecks, clearAllData } from './srs';
import { AppData, Flashcard } from './types';

/**
 * SCRIP DE DEBUG CENTRALIZADO (MÉTODO ITR)
 * Acesse via console: window.debug.help()
 */

/**
 * SUITE DE DEBUG ITR (MÉTODO ITR)
 * Acesse via console: window.itr.help()
 */

export const initDebugMode = () => {
  if (typeof window === 'undefined') return;

  (window as any).itr = {
    help: () => {
      console.log(`
%c --- SUITE DE DEBUG ITR --- %c
Comandos disponíveis:
1. %citr.test(valor)%c   -> Define o total de palavras e dispara o modal (ex: 100, 300, 700, 1500)
2. %citr.reset()%c       -> Limpa todas as conquistas e reseta o contador vitalício
3. %citr.stats()%c       -> Mostra o resumo de palavras adicionadas na história
4. %citr.seed(qty)%c     -> Gera cards aleatórios para teste
5. %citr.toggleSound(bool)%c -> Ativa/Desativa efeitos sonoros
      `, 
      'background: #fbbf24; color: black; font-weight: bold; padding: 4px;', '',
      'color: #fbbf24; font-weight: bold;', '',
      'color: #fbbf24; font-weight: bold;', '',
      'color: #fbbf24; font-weight: bold;', '',
      'color: #fbbf24; font-weight: bold;', '',
      'color: #fbbf24; font-weight: bold;', ''
      );
    },

    test: (valor: number) => {
      console.log(`%c[ITR]%c Forçando marco de maestria: ${valor}...`, 'color: #fbbf24; font-weight: bold;', '');
      const profile = getUserProfile();
      
      // Remove do array de desbloqueados para permitir o disparo novamente se já existia
      const unlocked = profile.unlockedMilestones || [];
      const newUnlocked = unlocked.filter(m => m !== valor);
      
      saveUserProfile({
        ...profile,
        totalWordsAdded: valor,
        unlockedMilestones: newUnlocked
      });
      console.log(`%c[ITR]%c Contador vitalício setado para ${valor}. Recarregando...`, 'color: #fbbf24; font-weight: bold;', '');
      window.location.reload();
    },

    reset: () => {
      console.log(`%c[ITR]%c Resetando TUDO (incluindo marcos vitalícios)...`, 'color: #ef4444; font-weight: bold;', '');
      const initialData: AppData = {
        cards: [],
        profile: { 
          name: 'Estudante ITR',
          totalWordsAdded: 0,
          unlockedMilestones: [],
          soundEnabled: true
        },
        decks: [],
        dictionary: [],
        vocabularyProgress: [],
        currentSprint: 1
      };
      saveAppData(initialData);
      window.location.reload();
    },

    stats: () => {
      const profile = getUserProfile();
      console.log(`%c --- ESTATÍSTICAS VITAIS ITR --- %c`, 'background: #fbbf24; color: black; font-weight: bold;', '');
      console.log(`Total de Palavras na História: %c${profile.totalWordsAdded || 0}`, 'color: #fbbf24; font-weight: bold;');
      console.log(`Marcos Alcançados: %c${(profile.unlockedMilestones || []).join(', ') || 'Nenhum'}`, 'color: #fbbf24; font-weight: bold;');
    },

    seed: (qty: number) => {
      const decks = getDecks();
      if (decks.length === 0) return console.error('Crie um deck primeiro.');
      for (let i = 0; i < qty; i++) {
        addFullCard(`Test ${i}`, `Teste ${i}`, `Mne ${i}`, decks[0].name);
      }
      window.location.reload();
    },

    toggleSound: (enabled: boolean) => {
      const profile = getUserProfile();
      saveUserProfile({ ...profile, soundEnabled: enabled });
      console.log(`%c[ITR]%c Efeitos sonoros ${enabled ? 'ATIVADOS' : 'DESATIVADOS'}.`, 'color: #fbbf24; font-weight: bold;', '');
    }
  };

  (window as any).itr.help();
};
