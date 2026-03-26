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
  const newCard: Flashcard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    front,
    back,
    association,
    lastReviewed: null,
    interval: 0,
    nextReview: new Date().toISOString(),
    reviewedCount: 0,
    isLearned: false, // Novos cards começam como não aprendidos
    deck: deckName,
  };
  saveCards([...cards, newCard]);
  if (!skipDictionary) {
    addOrUpdateDictionaryEntry(newCard); // Alimenta o dicionário ao criar
  }
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

  // Se foi memorizado, atualiza no dicionário
  if (isMemorized) {
    const card = updatedCards.find(c => c.id === cardId);
    if (card) addOrUpdateDictionaryEntry(card);
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
  const existingIndex = dictionary.findIndex(e => e.word.toLowerCase() === card.front.toLowerCase());

  if (existingIndex >= 0) {
    const updatedEntry = {
      ...dictionary[existingIndex],
      isMemorized: card.isMemorized || dictionary[existingIndex].isMemorized,
      usageFrequency: dictionary[existingIndex].usageFrequency + 1,
      translation: card.back // Atualiza tradução se mudou
    };
    dictionary[existingIndex] = updatedEntry;
  } else {
    dictionary.push({
      id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      word: card.front,
      translation: card.back,
      dateAdded: new Date().toISOString(),
      isMemorized: card.isMemorized || false,
      usageFrequency: 1
    });
  }
  saveDictionary(dictionary);
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
      if (!skipDictionary) {
        addOrUpdateDictionaryEntry(updated);
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
    
    const playFreq = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // Arpejo de vitória (Acorde Maior) - Toca um som de conquista 'Ta-ta-da-daaa'
    playFreq(440.00, 0, 0.15); // A4
    playFreq(554.37, 0.15, 0.15); // C#5
    playFreq(659.25, 0.30, 0.15); // E5
    playFreq(880.00, 0.45, 0.4); // A5
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
    
    // Som curto 
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
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
