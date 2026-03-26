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
  deck?: string; // Baralho para agrupamento
}

export interface UserProfile {
  name: string;
  avatar?: string;
}

export interface Deck {
  id: string;
  name: string;
}

export interface AppData {
  cards: Flashcard[];
  profile: UserProfile;
  decks: Deck[];
}

export type ReviewInterval = '1h' | '24h' | '1s' | '1m';
