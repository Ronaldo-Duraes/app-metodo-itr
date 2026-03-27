import { Flashcard, ReviewInterval, UserProfile, AppData, Deck, DictionaryEntry } from './types';

const STORAGE_KEY = 'itr_app_data';

const getAppData = (): AppData => {
  if (typeof window === 'undefined') return { cards: [], profile: { name: 'Estudante ITR' }, decks: [] };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialData: AppData = { 
      cards: [], 
      profile: { name: 'Estudante ITR' },
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

const saveAppData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getCards = (): Flashcard[] => getAppData().cards;

export const saveCards = (cards: Flashcard[]) => {
  const data = getAppData();
  saveAppData({ ...data, cards });
};

export const getUserProfile = (): UserProfile => getAppData().profile;

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
  localStorage.clear();
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
  
  saveDictionary(dictionary);
  return newId;
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
    .filter(card => !card.isMemorized) // Exclui cards memorizados
    .filter(card => {
      // Se nunca foi revisado, está pendente se o nextReview já passou
      return new Date(card.nextReview) <= now;
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
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const playTechNode = (freq: number, type: OscillatorType, startTime: number, duration: number, volume = 0.2) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + startTime + duration);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Industrial Tech Chime - Seco, metálico e futurista
    playTechNode(880, 'square', 0, 0.1, 0.1);    // A5
    playTechNode(1318.51, 'sine', 0.05, 0.2, 0.15); // E6
    playTechNode(1760, 'triangle', 0.1, 0.4, 0.1);  // A6
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};

export const playBlipSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // "Metallic Click" - Curto e seco
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
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
