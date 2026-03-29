export interface Flashcard {
  id: string;
  front: string; // Inglês
  back: string;  // Português
  association?: string; // Técnica de memorização
  nextReview: string; // ISO Date (Calculado)
  lastReviewed: string | null; // ISO Date da última revisão
  interval: number; // Intervalo em minutos
  reviewedCount: number;
  isLearned: boolean; // Aprendido no longo prazo
  isMemorized?: boolean; // Pessoal: Parar de revisar totalmente
  deck?: string; // Baralho para agrupamento
  dictionaryId?: string; // Referência para a linha no dicionário
}

export interface UserProfile {
  name: string;
  avatar?: string;
  totalWordsAdded?: number; // Contador vitalício (não reseta ao limpar dicionário)
  unlockedMilestones?: number[]; // [100, 300, 700, 1500]
  soundEnabled?: boolean; // Toggle de efeitos sonoros
}

export interface Deck {
  id: string;
  name: string;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  translation: string;
  dateAdded: string;
  isMemorized: boolean;
  usageFrequency: number;
}

export interface AppData {
  cards: Flashcard[];
  profile: UserProfile;
  decks: Deck[];
  dictionary?: DictionaryEntry[];
  vocabularyProgress?: string[]; // IDs das palavras memorizadas
  currentSprint?: number; // Sprint atual selecionado
}

export type ReviewInterval = '10m' | '1h' | '1d' | '4d' | '7d' | '30d' | 'memorized';
