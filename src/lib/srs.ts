import { Flashcard, ReviewInterval, UserProfile, AppData, Deck } from './types';

const STORAGE_KEY = 'itr_app_data';

const getAppData = (): AppData => {
  if (typeof window === 'undefined') return { cards: [], profile: { name: 'Estudante ITR' }, decks: [] };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Tenta migrar da chave antiga se existir
    const oldCards = localStorage.getItem('itr_flashcards_v1');
    const initialData: AppData = { 
      cards: oldCards ? JSON.parse(oldCards) : [], 
      profile: { name: 'Estudante ITR' },
      decks: [
        { id: 'deck-1', name: 'Essenciais ITR' },
        { id: 'deck-2', name: 'Verbos Comuns' }
      ]
    };
    saveAppData(initialData);
    return initialData;
  }
  const data = JSON.parse(stored);
  if (!data.decks) data.decks = [];
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

export const addFullCard = (front: string, back: string, association: string, deckName: string) => {
  const cards = getCards();
  const newCard: Flashcard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    front,
    back,
    association,
    nextReview: new Date().toISOString(),
    reviewedCount: 0,
    isLearned: false, // Novos cards começam como não aprendidos
    deck: deckName,
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
    reviewedCount: 0,
    isLearned: true, // Já conta como masterizada para evolução da patente
    deck,
  };
  saveCards([...cards, newCard]);
};

export const calculateNextReview = (interval: ReviewInterval): Date => {
  const now = new Date();
  switch (interval) {
    case '1h': return new Date(now.getTime() + 60 * 60 * 1000);
    case '24h': return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case '1s': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case '1m': return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default: return now;
  }
};

export const updateCardReview = (cardId: string, interval: ReviewInterval) => {
  const cards = getCards();
  const nextReview = calculateNextReview(interval).toISOString();
  const isLearned = interval === '1s' || interval === '1m';
  
  const updatedCards = cards.map(c => 
    c.id === cardId 
      ? { ...c, nextReview, lastInterval: interval, reviewedCount: c.reviewedCount + 1, isLearned: isLearned || c.isLearned } 
      : c
  );
  
  saveCards(updatedCards);
};

export const updateCardAssociation = (cardId: string, association: string) => {
  const cards = getCards();
  const updatedCards = cards.map(c => 
    c.id === cardId ? { ...c, association } : c
  );
  saveCards(updatedCards);
};

export const getTodayPendingCards = (cards: Flashcard[]) => {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // Final do dia de hoje
  return cards.filter(card => new Date(card.nextReview) <= now);
};

export const ESSENTIAL_VOCABULARY = [
  // Pronouns
  { front: 'I', back: 'Eu' }, { front: 'You', back: 'Você' }, { front: 'He', back: 'Ele' }, 
  { front: 'She', back: 'Ela' }, { front: 'It', back: 'Isto/Ele/Ela (coisas)' }, { front: 'We', back: 'Nós' }, { front: 'They', back: 'Eles/Elas' },
  // Verb to be
  { front: 'I am', back: 'Eu sou/estou' }, { front: 'You are', back: 'Você é/está' }, { front: 'He is', back: 'Ele é/está' },
  { front: 'She is', back: 'Ela é/está' }, { front: 'It is', back: 'Isto é/está' }, { front: 'We are', back: 'Nós somos/estamos' }, { front: 'They are', back: 'Eles são/estão' },
  // Essential Verbs
  { front: 'To go', back: 'Ir' }, { front: 'To have', back: 'Ter' }, { front: 'To do', back: 'Fazer' }, { front: 'To say', back: 'Dizer' },
  { front: 'To get', back: 'Pegar/Conseguir' }, { front: 'To make', back: 'Fazer/Criar' }, { front: 'To know', back: 'Saber' },
  { front: 'To think', back: 'Pensar' }, { front: 'To take', back: 'Pegar/Levar' }, { front: 'To see', back: 'Ver' },
  { front: 'To come', back: 'Vir' }, { front: 'To want', back: 'Querer' }, { front: 'To use', back: 'Usar' }, { front: 'To find', back: 'Encontrar' },
  { front: 'To give', back: 'Dar' }, { front: 'To tell', back: 'Contar/Falar' }, { front: 'To work', back: 'Trabalhar' },
  { front: 'To call', back: 'Chamar/Ligar' }, { front: 'To try', back: 'Tentar' }, { front: 'To ask', back: 'Perguntar' },
  { front: 'To need', back: 'Precisar' }, { front: 'To feel', back: 'Sentir' }, { front: 'To become', back: 'Tornar-se' },
  { front: 'To leave', back: 'Sair/Deixar' }, { front: 'To put', back: 'Colocar' }, { front: 'To mean', back: 'Significar' },
  { front: 'To keep', back: 'Manter' }, { front: 'To let', back: 'Deixar' }, { front: 'To begin', back: 'Começar' },
  { front: 'To seem', back: 'Parecer' }, { front: 'To help', back: 'Ajudar' }, { front: 'To talk', back: 'Conversar' },
  { front: 'To turn', back: 'Virar' }, { front: 'To start', back: 'Começar' }, { front: 'To show', back: 'Mostrar' },
  { front: 'To hear', back: 'Ouvir' }, { front: 'To play', back: 'Jogar/Tocar' }, { front: 'To run', back: 'Correr' },
];

export const importEssentialVocabulary = () => {
  const currentCards = getCards();
  const newCards: Flashcard[] = ESSENTIAL_VOCABULARY.map((v, index) => ({
    id: `essential-${index}-${Date.now()}`,
    front: v.front,
    back: v.back,
    nextReview: new Date().toISOString(),
    reviewedCount: 0,
    isLearned: false,
    deck: 'Essencial',
  })).filter(nv => !currentCards.some(cc => cc.front === nv.front));
  
  saveCards([...currentCards, ...newCards]);
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
