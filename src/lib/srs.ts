import { Flashcard, ReviewInterval, UserProfile, AppData, Deck, DictionaryEntry } from './types';

const STORAGE_KEY = 'itr_app_data';

export const getAppData = (): AppData => {
  if (typeof window === 'undefined') return { cards: [], profile: { name: 'Estudante ITR' }, decks: [] };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialData: AppData = { 
      cards: [], 
      profile: { 
        name: 'Estudante ITR',
        totalWordsAdded: 0,
        unlockedMilestones: [],
        soundEnabled: true
      },
      decks: [] 
    };
    saveAppData(initialData);
    return initialData;
  }
  const data = JSON.parse(stored);
  if (!data.decks) data.decks = [];
  if (!data.dictionary) data.dictionary = [];
  return data;
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getCards = (): Flashcard[] => getAppData().cards;

export const saveCards = (cards: Flashcard[]) => {
  const data = getAppData();
  saveAppData({ ...data, cards });
};

export const getUserProfile = (): UserProfile => {
  const profile = getAppData().profile;
  if (profile.soundEnabled === undefined) {
    return { ...profile, soundEnabled: true };
  }
  return profile;
};

export const saveUserProfile = (profile: UserProfile) => {
  const data = getAppData();
  saveAppData({ ...data, profile });
};

export const getDecks = (): Deck[] => getAppData().decks;

export const saveDecks = (decks: Deck[]) => {
  const data = getAppData();
  saveAppData({ ...data, decks });
};

export const addDeck = (name: string) => {
  const decks = getDecks();
  const newDeck: Deck = {
    id: `deck-${Date.now()}`,
    name
  };
  saveDecks([...decks, newDeck]);
  return newDeck;
};

export const renameDeck = (deckId: string, newName: string) => {
  const decks = getDecks();
  const updatedDecks = decks.map(d => d.id === deckId ? { ...d, name: newName } : d);
  saveDecks(updatedDecks);

  // Opcional: Atualizar o nome do deck nos cards se estiver usando o nome como referência?
  // Atualmente o filtro no UI usa 'deck.name || deck.id'. 
  // É melhor manter a consistência.
  const cards = getCards();
  const updatedCards = cards.map(c => {
    const deck = decks.find(d => d.id === deckId);
    if (c.deck === deck?.name) return { ...c, deck: newName };
    return c;
  });
  saveCards(updatedCards);
};

export const deleteDeck = (deckId: string) => {
  const decks = getDecks();
  const deckToDelete = decks.find(d => d.id === deckId);
  if (!deckToDelete) return;

  const updatedDecks = decks.filter(d => d.id !== deckId);
  saveDecks(updatedDecks);

  // IMPORTANTE: Remover todos os cards deste deck
  const cards = getCards();
  const updatedCards = cards.filter(c => c.deck !== deckToDelete.name && c.deck !== deckToDelete.id);
  saveCards(updatedCards);
};

export const addFullCard = (front: string, back: string, association: string, deckName: string, skipDictionary: boolean = false) => {
  const cards = getCards();
  let dictionaryId: string | undefined = undefined;
  
  if (!skipDictionary) {
    const dictionary = getDictionary();
    const existingEntry = dictionary.find(e => 
      e.word.toLowerCase().trim() === front.toLowerCase().trim() && 
      e.translation.toLowerCase().trim() === back.toLowerCase().trim()
    );

    if (existingEntry) {
      dictionaryId = existingEntry.id;
    } else {
      dictionaryId = addOrUpdateDictionaryEntry({ front, back, isMemorized: false } as Flashcard);
    }
  }

  const newCard: Flashcard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    front,
    back,
    association,
    lastReviewed: null,
    interval: 0,
    nextReview: new Date().toISOString(),
    reviewedCount: 0,
    isLearned: false,
    deck: deckName,
    dictionaryId
  };
  
  saveCards([...cards, newCard]);
  return newCard;
};

export const addCustomCard = (front: string, back: string, association: string, deck: string = 'Personalizado') => {
  const cards = getCards();
  const newCard: Flashcard = {
    id: Math.random().toString(36).substr(2, 9),
    front,
    back,
    association,
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    interval: 0,
    reviewedCount: 0,
    isLearned: true, // Já conta como masterizada para evolução da patente
    deck,
  };
  saveCards([...cards, newCard]);
};

export const calculateNextReview = (interval: ReviewInterval): Date => {
  const now = new Date();
  switch (interval) {
    case '10m': return new Date(now.getTime() + 10 * 60 * 1000);
    case '1d': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '4d': return new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    case '7d': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    case 'memorized': return new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 anos no futuro
    default: return now;
  }
};

export const updateCardReview = (cardId: string, intervalType: ReviewInterval) => {
  const cards = getCards();
  const now = new Date();
  
  let intervalMinutes = 0;
  let isMemorized = false;
  switch (intervalType) {
    case '10m': intervalMinutes = 10; break;
    case '1d': intervalMinutes = 1440; break;
    case '4d': intervalMinutes = 5760; break;
    case '7d': intervalMinutes = 10080; break;
    case '30d': intervalMinutes = 43200; break;
    case 'memorized': isMemorized = true; break;
  }

  const nextReview = new Date(now.getTime() + intervalMinutes * 60 * 1000).toISOString();
  
  const updatedCards = cards.map(c => 
    c.id === cardId 
      ? { 
          ...c, 
          nextReview: isMemorized ? new Date(Date.now() + 100*365*24*60*60*1000).toISOString() : nextReview, 
          lastReviewed: now.toISOString(),
          interval: intervalMinutes,
          reviewedCount: c.reviewedCount + 1, 
          isLearned: isMemorized || intervalType === '7d' || intervalType === '30d' || c.isLearned,
          isMemorized: isMemorized || c.isMemorized
        } 
      : c
  );
  
  saveCards(updatedCards);

  // Se foi memorizado, atualiza no dicionário de forma sincronizada
  if (isMemorized) {
    const card = updatedCards.find(c => c.id === cardId);
    if (card) {
      if (card.dictionaryId) {
        const dictionary = getDictionary();
        const index = dictionary.findIndex(e => e.id === card.dictionaryId);
        if (index >= 0) {
          dictionary[index].isMemorized = true;
          saveDictionary(dictionary);
        }
      } else {
        const dId = addOrUpdateDictionaryEntry(card);
        const finalCards = updatedCards.map(c => c.id === cardId ? { ...c, dictionaryId: dId } : c);
        saveCards(finalCards);
      }
    }
  }
};

// Função de limpeza total (Remover se quiser desabilitar o nuclear reset)
export const clearAllData = () => {
  if (typeof window === 'undefined') return;
  
  const profile = getUserProfile();
  const masteryData = {
    totalWordsAdded: profile.totalWordsAdded,
    unlockedMilestones: profile.unlockedMilestones
  };
  
  localStorage.clear();
  
  // Restaura o progresso de maestria após o clear
  const newData: AppData = {
    cards: [],
    profile: { 
      name: profile.name || 'Estudante ITR',
      ...masteryData
    },
    decks: []
  };
  saveAppData(newData);
  
  window.location.reload();
};

export const updateCardAssociation = (cardId: string, association: string) => {
  const cards = getCards();
  const updatedCards = cards.map(c => 
    c.id === cardId ? { ...c, association } : c
  );
  saveCards(updatedCards);
};

export const getDictionary = (): DictionaryEntry[] => {
  return getAppData().dictionary || [];
};

export const saveDictionary = (dictionary: DictionaryEntry[]) => {
  const data = getAppData();
  data.dictionary = dictionary;
  saveAppData(data);
};

export const addOrUpdateDictionaryEntry = (card: Flashcard) => {
  const dictionary = getDictionary();
  const newId = `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  dictionary.push({
    id: newId,
    word: card.front,
    translation: card.back,
    dateAdded: new Date().toISOString(),
    isMemorized: card.isMemorized || false,
    usageFrequency: 1
  });
  
  const data = getAppData();
  const profile = data.profile;
  const currentTotal = (profile.totalWordsAdded || 0) + 1;
  
  // Atualiza o perfil com o novo total
  saveUserProfile({
    ...profile,
    totalWordsAdded: currentTotal
  });

  saveDictionary(dictionary);
  return newId;
};

export const MILESTONES_COMMON = [10, 20, 30, 40, 50, 60, 70, 80, 90, 150, 200, 250, 400, 500, 600, 1100];
export const MILESTONES_MASTERY = [100, 300, 700, 1500];

export const checkMasteryMilestone = (count: number): { value: number, isMastery: boolean } | null => {
  const profile = getUserProfile();
  const unlocked = profile.unlockedMilestones || [];
  
  const isMastery = MILESTONES_MASTERY.includes(count);
  const isCommon = MILESTONES_COMMON.includes(count);

  if ((isMastery || isCommon) && !unlocked.includes(count)) {
    // Registra como desbloqueado
    saveUserProfile({
      ...profile,
      unlockedMilestones: [...unlocked, count]
    });
    return { value: count, isMastery };
  }
  return null;
};

export const playMasterySound = () => {
  if (typeof window === 'undefined') return;
  const profile = getUserProfile();
  if (profile.soundEnabled === false) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playLushNote = (freq: number, startTime: number, duration: number, volume = 0.15) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, ctx.currentTime + startTime + duration);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);

      // Eco sutil para corpo
      const delay = ctx.createDelay();
      const feedback = ctx.createGain();
      delay.delayTime.value = 0.15;
      feedback.gain.value = 0.2;
      
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(ctx.destination);
    };

    // Maestria Encorpada (Max 1s) - Timbre abafado tipo Piano Elétrico
    playLushNote(329.63, 0, 0.9, 0.08);  // E4
    playLushNote(493.88, 0.15, 0.8, 0.06); // B4
    playLushNote(659.25, 0.3, 0.7, 0.04); // E5
  } catch (e) {
    console.error('Audio mastery playback failed', e);
  }
};

export const updateDictionaryEntry = (id: string, word: string, translation: string) => {
  const dictionary = getDictionary();
  const index = dictionary.findIndex(e => e.id === id);
  if (index >= 0) {
    dictionary[index] = { ...dictionary[index], word, translation };
    saveDictionary(dictionary);
    return true;
  }
  return false;
};

export const deleteDictionaryEntry = (id: string) => {
  const dictionary = getDictionary();
  const updatedDictionary = dictionary.filter(e => e.id !== id);
  saveDictionary(updatedDictionary);
};

export const getDictionaryCount = (): number => {
  return getDictionary().length;
};

export const deleteCard = (cardId: string) => {
  const cards = getCards();
  const updatedCards = cards.filter(c => c.id !== cardId);
  saveCards(updatedCards);
};

export const updateCard = (cardId: string, updates: Partial<Flashcard>, skipDictionary: boolean = false) => {
  const cards = getCards();
  const updatedCards = cards.map(c => {
    if (c.id === cardId) {
      const updated = { ...c, ...updates };
      
      // Sincronização com o Dicionário (Estrito via ID)
      if (!skipDictionary && updated.dictionaryId) {
        updateDictionaryEntry(updated.dictionaryId, updated.front, updated.back);
      }
      
      return updated;
    }
    return c;
  });
  saveCards(updatedCards);
};

export const getPriorityCards = (cards: Flashcard[], deckID?: string) => {
  const now = new Date();
  let filtered = cards;
  if (deckID) {
    // Busca o nome do deck para garantir filtro por texto ou ID
    const decks = getDecks();
    const targetDeck = decks.find(d => d.id === deckID || d.name === deckID);
    if (targetDeck) {
      filtered = cards.filter(c => c.deck === targetDeck.name || c.deck === targetDeck.id);
    } else {
      // Fallback: tenta filtrar direto pelo deckID se o objeto deck não for encontrado
      filtered = cards.filter(c => c.deck === deckID);
    }
  }
  return filtered
    .filter(card => !card.isMemorized) // NUNCA exibe memorizados
    .filter(card => {
      // Critério: STATUS NOVO (reviewedCount === 0) OU TEMPO VENCIDO (nextReview <= agora)
      const isNew = card.reviewedCount === 0;
      const isOverdue = new Date(card.nextReview) <= now;
      return isNew || isOverdue;
    })
    .sort((a, b) => {
      // ORDENAÇÃO: VENCIDOS primeiro (mais atrasados), depois NOVOS
      const isANew = a.reviewedCount === 0;
      const isBNew = b.reviewedCount === 0;

      if (!isANew && !isBNew) {
        // Ambos vencidos: o mais atrasado primeiro
        return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
      }
      if (isANew && isBNew) {
        // Ambos novos: manter ordem (ou por id/data de criação se houvesse)
        return a.id.localeCompare(b.id);
      }
      // Vencidos antes de Novos
      return isANew ? 1 : -1;
    });
};

export const getTodayPendingCards = (cards: Flashcard[]) => {
  return getPriorityCards(cards);
};

// Final do arquivo srs.ts

export interface Patente {
  level: number;
  name: string;
  minWords: number;
  maxWords: number | null;
  iconName: string;
}

export const PATENTES: Patente[] = [
  { level: 1, name: 'Semente ITR', minWords: 0, maxWords: 99, iconName: 'Sprout' },
  { level: 2, name: 'Broto de Fluência', minWords: 100, maxWords: 299, iconName: 'Leaf' },
  { level: 3, name: 'Raiz Forte', minWords: 300, maxWords: 699, iconName: 'Activity' },
  { level: 4, name: 'Arbusto de Diálogo', minWords: 700, maxWords: 1499, iconName: 'Shrub' },
  { level: 5, name: 'Árvore da Fluência', minWords: 1500, maxWords: null, iconName: 'Trees' },
];

export const getUserPatente = (masteredCount: number) => {
  const current = PATENTES.find(p => masteredCount >= p.minWords && (p.maxWords === null || masteredCount <= p.maxWords)) || PATENTES[0];
  const nextIndex = PATENTES.findIndex(p => p.level === current.level) + 1;
  const next = nextIndex < PATENTES.length ? PATENTES[nextIndex] : null;
  const wordsToNext = next ? next.minWords - masteredCount : 0;
  
  return { current, next, wordsToNext };
};

export const playVictorySound = () => {
  if (typeof window === 'undefined') return;
  const profile = getUserProfile();
  if (profile.soundEnabled === false) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Sucesso Sutil - Inspirado em notificação moderna (Slack-like)
    // Dois tons harmônicos curtos e suaves
    const playNote = (freq: number, startTime: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine'; // Suave
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.5, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + 0.4);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + 0.4);
    };

    // Acorde Sutil - Harmonia tipo Slack / Apple
    playNote(523.25, 0, 0.08); // C5
    playNote(783.99, 0.05, 0.06); // G5 
    playNote(1046.50, 0.1, 0.05); // C6
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

export const playBlipSound = () => {
  if (typeof window === 'undefined') return;
  const profile = getUserProfile();
  if (profile.soundEnabled === false) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // "Pop" Elegante e Curto
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    console.error('Blip sound failed', e);
  }
};

export const getSortedDeckCards = (cards: Flashcard[], deckID?: string) => {
  let filtered = cards;
  if (deckID) {
    const decks = getDecks();
    const targetDeck = decks.find(d => d.id === deckID || d.name === deckID);
    if (targetDeck) {
      filtered = cards.filter(c => c.deck === targetDeck.name || c.deck === targetDeck.id);
    } else {
      filtered = cards.filter(c => c.deck === deckID);
    }
  }

  // Sort: Overdue cards first, then by earliest nextReview
  return [...filtered].sort((a, b) => {
    return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
  });
};
