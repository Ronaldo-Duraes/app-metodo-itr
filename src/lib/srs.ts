import { Flashcard, ReviewInterval, UserProfile, AppData } from './types';

const STORAGE_KEY = 'itr_app_data';

const getAppData = (): AppData => {
  if (typeof window === 'undefined') return { cards: [], profile: { name: 'Estudante ITR' } };
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Tenta migrar da chave antiga se existir
    const oldCards = localStorage.getItem('itr_flashcards_v1');
    const initialData: AppData = { 
      cards: oldCards ? JSON.parse(oldCards) : [], 
      profile: { name: 'Estudante ITR' } 
    };
    saveAppData(initialData);
    return initialData;
  }
  return JSON.parse(stored);
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

export const addCustomCard = (front: string, back: string, association: string) => {
  const cards = getCards();
  const newCard: Flashcard = {
    id: Math.random().toString(36).substr(2, 9),
    front,
    back,
    association,
    nextReview: new Date().toISOString(),
    reviewedCount: 0,
    isLearned: false,
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
  })).filter(nv => !currentCards.some(cc => cc.front === nv.front));
  
  saveCards([...currentCards, ...newCards]);
};
