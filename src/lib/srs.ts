import { Flashcard, ReviewInterval, UserProfile, AppData, Deck, DictionaryEntry } from './types';

const STORAGE_KEY = 'itr_app_data';

// ===================================================================
// CLOUD SYNC BRIDGE — Conecta localStorage ao Firestore
// ===================================================================
let _cloudSyncCallback: ((data: AppData) => void) | null = null;
let _cloudSyncTimeout: ReturnType<typeof setTimeout> | null = null;
const CLOUD_SYNC_DEBOUNCE_MS = 2000; // Debounce de 2s para não spammar o Firestore

/**
 * Registra o callback que será chamado (com debounce) sempre que o AppData mudar.
 * Chamado pelo AppWrapper com a função que salva no Firestore.
 */
export const setCloudSyncCallback = (cb: ((data: AppData) => void) | null) => {
  _cloudSyncCallback = cb;
  if (!cb && _cloudSyncTimeout) {
    clearTimeout(_cloudSyncTimeout);
    _cloudSyncTimeout = null;
  }
};

export const getAppData = (): AppData => {
  const defaultData: AppData = { 
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

  if (typeof window === 'undefined') return defaultData;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveAppData(defaultData);
      return defaultData;
    }
    const data = JSON.parse(stored);
    
    // Safety checks for missing fields
    if (!data.decks) data.decks = [];
    if (!data.dictionary) data.dictionary = [];
    if (!data.profile) data.profile = defaultData.profile;
    if (!data.vocabularyProgress) data.vocabularyProgress = [];

    // --- MIGRATION: cards -> dictionary (Legacy Cleanup) ---
    if (data.cards && data.cards.length > 0) {
      data.cards.forEach((card: Flashcard) => {
        const existingIndex = data.dictionary.findIndex((e: DictionaryEntry) => 
          e.word.toLowerCase().trim() === card.front.toLowerCase().trim()
        );
        
        if (existingIndex >= 0) {
          const entry = data.dictionary[existingIndex];
          // Merge SRS data if the legacy card has more progress
          if (!entry.nextReview || (card.lastReviewed && (!entry.lastReviewed || new Date(card.lastReviewed) > new Date(entry.lastReviewed)))) {
            data.dictionary[existingIndex] = {
              ...entry,
              nextReview: card.nextReview,
              lastReviewed: card.lastReviewed,
              interval: card.interval,
              reviewedCount: card.reviewedCount,
              deck: card.deck,
              association: card.association || entry.association
            };
          }
        } else {
          data.dictionary.push({
            id: card.dictionaryId || `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            word: card.front,
            translation: card.back,
            dateAdded: new Date().toISOString(),
            isMemorized: card.isMemorized || false,
            usageFrequency: 1,
            nextReview: card.nextReview,
            lastReviewed: card.lastReviewed,
            interval: card.interval,
            reviewedCount: card.reviewedCount,
            deck: card.deck,
            association: card.association
          });
        }
      });
      data.cards = []; // Clear migrated data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return data;
  } catch (e) {
    console.error("Failed to parse AppData from localStorage", e);
    return defaultData;
  }
};

export const saveAppData = (data: AppData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // ☁️ CLOUD SYNC: Dispara sync debounced com Firestore
    if (_cloudSyncCallback) {
      if (_cloudSyncTimeout) clearTimeout(_cloudSyncTimeout);
      _cloudSyncTimeout = setTimeout(() => {
        _cloudSyncCallback?.(data);
      }, CLOUD_SYNC_DEBOUNCE_MS);
    }
  } catch (e) {
    console.error("Failed to save AppData to localStorage", e);
  }
};

// --- CORE SRS SELECTORS (DICTIONARY-BASED) ---

export const getCards = (): Flashcard[] => {
  const dictionary = getDictionary();
  return dictionary.map(e => ({
    id: e.id,
    front: e.word,
    back: e.translation,
    association: e.association,
    nextReview: e.nextReview || new Date().toISOString(),
    lastReviewed: e.lastReviewed || null,
    interval: e.interval || 0,
    reviewedCount: e.reviewedCount || 0,
    isLearned: e.isMemorized || (e.reviewedCount || 0) > 5,
    isMemorized: e.isMemorized,
    deck: e.deck,
    dictionaryId: e.id,
    pronunciation: e.pronunciation || '',
    inDictionary: e.inDictionary ?? true
  }));
};

export const saveCards = (cards: Flashcard[]) => {
  console.warn("saveCards is deprecated. Use updateCard or dictionary functions directly.");
};

export const getPriorityCards = (cards: Flashcard[], deckID?: string) => {
  const now = new Date();
  const dictionary = getDictionary();
  let filtered = dictionary.filter(e => !e.isMemorized);

  if (deckID) {
    const decks = getDecks();
    const targetDeck = decks.find(d => d.id === deckID || d.name === deckID);
    if (targetDeck) {
      filtered = filtered.filter(e => e.deck === targetDeck.name || e.deck === targetDeck.id);
    } else {
      filtered = filtered.filter(e => e.deck === deckID);
    }
  }

  return filtered
    .filter(e => {
      const isNew = !e.lastReviewed || !e.reviewedCount;
      const isOverdue = e.nextReview ? new Date(e.nextReview) <= now : true;
      return isNew || isOverdue;
    })
    .sort((a, b) => {
      const isANew = !a.lastReviewed;
      const isBNew = !b.lastReviewed;
      if (!isANew && !isBNew) return new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime();
      if (isANew && isBNew) return a.id.localeCompare(b.id);
      return isANew ? 1 : -1;
    })
    .map(e => ({
      id: e.id,
      front: e.word,
      back: e.translation,
      association: e.association,
      nextReview: e.nextReview || now.toISOString(),
      lastReviewed: e.lastReviewed || null,
      interval: e.interval || 0,
      reviewedCount: e.reviewedCount || 0,
      isLearned: e.isMemorized || (e.reviewedCount || 0) > 5,
      isMemorized: e.isMemorized,
      deck: e.deck,
      dictionaryId: e.id,
      pronunciation: e.pronunciation || '',
      inDictionary: e.inDictionary ?? true
    }));
};

export const getTodayPendingCards = (cards: Flashcard[]) => getPriorityCards(cards);

// --- UPDATERS ---

export const updateCard = (cardId: string, updates: Partial<Flashcard>) => {
  const dictionary = getDictionary();
  const updated = dictionary.map(e => {
    if (e.id === cardId) {
      return {
        ...e,
        word: updates.front || e.word,
        translation: updates.back || e.translation,
        deck: updates.deck || e.deck,
        association: updates.association || e.association,
        isMemorized: updates.isMemorized !== undefined ? updates.isMemorized : e.isMemorized,
        nextReview: updates.nextReview || e.nextReview,
        lastReviewed: updates.lastReviewed || e.lastReviewed,
        interval: updates.interval || e.interval,
        reviewedCount: updates.reviewedCount || e.reviewedCount,
        pronunciation: updates.pronunciation !== undefined ? updates.pronunciation : e.pronunciation,
        inDictionary: updates.inDictionary !== undefined ? updates.inDictionary : e.inDictionary
      };
    }
    return e;
  });
  saveDictionary(updated);
};

export const updateCardReview = (cardId: string, intervalType: ReviewInterval) => {
  const dictionary = getDictionary();
  const now = new Date();
  
  let mins = 0;
  let isMemorized = false;
  switch (intervalType) {
    case '10m': mins = 10; break;
    case '1h': mins = 60; break;
    case '1d': mins = 1440; break;
    case '4d': mins = 5760; break;
    case '7d': mins = 10080; break;
    case '30d': mins = 43200; break;
    case 'memorized': isMemorized = true; break;
  }

  const nextDate = isMemorized 
    ? new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000) 
    : new Date(now.getTime() + mins * 60 * 1000);

  const updated = dictionary.map(e => {
    if (e.id === cardId) {
      return {
        ...e,
        isMemorized: isMemorized || e.isMemorized,
        nextReview: nextDate.toISOString(),
        lastReviewed: now.toISOString(),
        interval: mins,
        reviewedCount: (e.reviewedCount || 0) + 1,
        inDictionary: true
      };
    }
    return e;
  });
  saveDictionary(updated);
};

export const updateCardAssociation = (cardId: string, association: string) => {
  updateCard(cardId, { association } as any);
};

export const addFullCard = (front: string, back: string, association: string, deckName: string, pronunciation: string = '') => {
  const dictionary = getDictionary();
  const existingIndex = dictionary.findIndex(e => e.word.toLowerCase().trim() === front.toLowerCase().trim());
  if (existingIndex >= 0) {
    const entry = dictionary[existingIndex];
    dictionary[existingIndex] = { ...entry, translation: back, deck: deckName, association, pronunciation, isMemorized: false, inDictionary: true };
    saveDictionary(dictionary);
    return entry;
  } else {
    const newEntry: DictionaryEntry = {
      id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      word: front,
      translation: back,
      dateAdded: new Date().toISOString(),
      isMemorized: false,
      usageFrequency: 1,
      nextReview: new Date().toISOString(),
      lastReviewed: null,
      interval: 0,
      reviewedCount: 0,
      deck: deckName,
      association: association,
      pronunciation: pronunciation,
      inDictionary: true
    };
    saveDictionary([...dictionary, newEntry]);
    
    const profile = getUserProfile();
    saveUserProfile({ ...profile, totalWordsAdded: (profile.totalWordsAdded || 0) + 1 });
    return newEntry;
  }
};

export const addCustomCard = (front: string, back: string, association: string, deck: string = 'Personalizado', pronunciation: string = '') => {
  return addFullCard(front, back, association, deck, pronunciation);
};

export const deleteCard = (cardId: string) => deleteDictionaryEntry(cardId);

// --- DICTIONARY & PROGRESS ---

export const getDictionary = (): DictionaryEntry[] => getAppData().dictionary || [];

export const getDictionaryCount = (): number => getDictionary().filter(e => e.inDictionary !== false).length;

export const saveDictionary = (dictionary: DictionaryEntry[]) => {
  const data = getAppData();
  saveAppData({ ...data, dictionary });
};

export const updateDictionaryEntry = (id: string, word: string, translation: string) => {
  const dictionary = getDictionary();
  const updated = dictionary.map(e => (e.id === id ? { ...e, word, translation } : e));
  saveDictionary(updated);
};

export const deleteDictionaryEntry = (id: string) => {
  const dictionary = getDictionary();
  saveDictionary(dictionary.filter(e => e.id !== id));
};

export const getVocabularyProgress = (): string[] => {
  return getDictionary().filter(e => e.isMemorized).map(e => e.id);
};

export const toggleVocabularyMemorized = (word: { id: string, en: string, pt: string }) => {
  const dictionary = getDictionary();
  const existing = dictionary.find(e => e.word.toLowerCase().trim() === word.en.toLowerCase().trim());
  
  if (existing) {
    if (existing.isMemorized) {
      updateCard(existing.id, { isMemorized: false } as any);
      return false;
    } else {
      updateCard(existing.id, { isMemorized: true } as any);
      return true;
    }
  } else {
    addFullCard(word.en, word.pt, '', 'Vocabulário Essencial');
    const newlyAdded = getDictionary().find(e => e.word.toLowerCase().trim() === word.en.toLowerCase().trim());
    if (newlyAdded) updateCard(newlyAdded.id, { isMemorized: true } as any);
    return true;
  }
};

export const getCurrentSprint = (): number => getAppData().currentSprint || 1;

export const setVocabularySprint = (sprint: number) => {
  const data = getAppData();
  saveAppData({ ...data, currentSprint: sprint });
};

export const generateSprintCards = (words: { en: string, pt: string, category: string, phonetic?: string }[], sprintIndex: number) => {
  const decks = getDecks();
  const baseName = `Vocabulário ITR - Sprint ${sprintIndex}`;
  let deckName = baseName;
  let counter = 2;
  while (decks.some(d => d.name === deckName)) {
    deckName = `${baseName} - ${counter}`;
    counter++;
  }
  addDeck(deckName);
  words.forEach(word => addFullCard(word.en, word.pt, `Vocabulário Essencial - ${word.category}`, deckName, word.phonetic || ''));
  return deckName; 
};

export const resetSprintProgress = (wordIds: string[], words: { en: string, pt: string }[]) => {
  const dictionary = getDictionary();
  const filtered = dictionary.filter(e => {
    return !words.some(w => e.word.toLowerCase().trim() === w.en.toLowerCase().trim());
  });
  saveDictionary(filtered);
};

// --- PROFILE & PATENTES ---

export const getUserProfile = (): UserProfile => {
  const profile = getAppData().profile;
  return { ...profile, soundEnabled: profile.soundEnabled ?? true };
};

export const saveUserProfile = (profile: UserProfile) => {
  const data = getAppData();
  saveAppData({ ...data, profile });
};

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

// --- DECKS ---

export const getDecks = (): Deck[] => getAppData().decks;

export const saveDecks = (decks: Deck[]) => {
  const data = getAppData();
  saveAppData({ ...data, decks });
};

export const addDeck = (name: string) => {
  const decks = getDecks();
  const newDeck: Deck = { id: `deck-${Date.now()}`, name };
  saveDecks([...decks, newDeck]);
  return newDeck;
};

export const deleteDeck = (deckId: string) => {
  const decks = getDecks();
  const deckToDelete = decks.find(d => d.id === deckId);
  if (!deckToDelete) return;
  saveDecks(decks.filter(d => d.id !== deckId));
  const dictionary = getDictionary();
  saveDictionary(dictionary.filter(e => e.deck !== deckToDelete.name && e.deck !== deckToDelete.id));
};

export const renameDeck = (deckId: string, newName: string) => {
  const decks = getDecks();
  const oldDeck = decks.find(d => d.id === deckId);
  if (!oldDeck) return;
  saveDecks(decks.map(d => d.id === deckId ? { ...d, name: newName } : d));
  const dictionary = getDictionary();
  saveDictionary(dictionary.map(e => e.deck === oldDeck.name ? { ...e, deck: newName } : e));
};

// --- AUDIO & UTILITIES ---

export const playMasterySound = () => {
  if (typeof window === 'undefined' || !getUserProfile().soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playLush = (freq: number, start: number, dur: number, vol = 0.08) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start); osc.stop(ctx.currentTime + start + dur);
    };
    playLush(329.63, 0, 0.9); playLush(493.88, 0.15, 0.8); playLush(659.25, 0.3, 0.7);
  } catch (e) {}
};

export const MILESTONES_COMMON = [10, 20, 30, 40, 50, 60, 70, 80, 90, 150, 200, 250, 400, 500, 600, 1100];
export const MILESTONES_MASTERY = [100, 300, 700, 1500];

export const checkMasteryMilestone = (count: number): { value: number, isMastery: boolean } | null => {
  const profile = getUserProfile();
  const unlocked = profile.unlockedMilestones || [];
  const isMastery = MILESTONES_MASTERY.includes(count);
  const isCommon = MILESTONES_COMMON.includes(count);

  if ((isMastery || isCommon) && !unlocked.includes(count)) {
    saveUserProfile({ ...profile, unlockedMilestones: [...unlocked, count] });
    return { value: count, isMastery };
  }
  return null;
};

export const playBlipSound = () => {
  if (typeof window === 'undefined' || !getUserProfile().soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
};

export const playVictoryPremiumSound = () => {
  if (typeof window === 'undefined' || !getUserProfile().soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playShimmer = (freq: number, start: number, dur: number, vol = 0.05) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, ctx.currentTime + start + dur);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start); osc.stop(ctx.currentTime + start + dur);
    };
    // Acorde Maj7 Arpeggiated (C Maj7: C4, E4, G4, B4)
    const base = 261.63; // C4
    playShimmer(base, 0, 1.2, 0.06); 
    playShimmer(base * 1.25, 0.05, 1.1, 0.05); 
    playShimmer(base * 1.5, 0.1, 1.0, 0.05); 
    playShimmer(base * 1.875, 0.15, 0.9, 0.04);
    playShimmer(base * 2, 0.2, 0.8, 0.03); // C5 octave
  } catch (e) {}
};

export const playVictorySound = () => {
  if (typeof window === 'undefined' || !getUserProfile().soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playNote = (freq: number, start: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol * 0.5, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.4);
      osc.start(ctx.currentTime + start); osc.stop(ctx.currentTime + start + 0.4);
    };
    playNote(523.25, 0, 0.08); playNote(783.99, 0.05, 0.06); playNote(1046.50, 0.1, 0.05);
  } catch (e) {}
};

export const resetDictionarySRS = () => {
  const dictionary = getDictionary();
  const now = new Date().toISOString();
  const reset = dictionary.map(e => ({
    ...e,
    inDictionary: false,
    isMemorized: false,
    nextReview: now,
    lastReviewed: null,
    interval: 0,
    reviewedCount: 0
  }));
  saveDictionary(reset);
};

export const clearAllData = () => {
  if (typeof window === 'undefined') return;
  const profile = getUserProfile();
  localStorage.clear();
  const newData: AppData = {
    cards: [],
    profile: { ...profile, totalWordsAdded: profile.totalWordsAdded, unlockedMilestones: profile.unlockedMilestones },
    decks: [],
    dictionary: [],
    vocabularyProgress: [],
    currentSprint: 1
  };
  saveAppData(newData);
  window.location.reload();
};

export const ensureCardInDictionary = (cardId: string) => {
  const dictionary = getDictionary();
  const index = dictionary.findIndex(e => e.id === cardId);
  if (index >= 0 && !dictionary[index].inDictionary) {
    dictionary[index].inDictionary = true;
    saveDictionary(dictionary);
  }
};
