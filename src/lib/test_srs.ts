import { Flashcard, ReviewInterval } from './types';

// Mock getCards function
const mockCards: Flashcard[] = [
  {
    id: 'new-1',
    front: 'New 1',
    back: 'Novo 1',
    nextReview: new Date().toISOString(),
    lastReviewed: null,
    interval: 0,
    reviewedCount: 0,
    isLearned: false,
    isMemorized: false,
  },
  {
    id: 'due-1',
    front: 'Due 1',
    back: 'Vencido 1',
    nextReview: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    lastReviewed: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    interval: 60,
    reviewedCount: 1,
    isLearned: false,
    isMemorized: false,
  },
  {
    id: 'due-2',
    front: 'Due 2',
    back: 'Vencido 2',
    nextReview: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    lastReviewed: new Date(Date.now() - 1000 * 60 * 120 * 24).toISOString(),
    interval: 1440,
    reviewedCount: 2,
    isLearned: false,
    isMemorized: false,
  },
  {
    id: 'future-1',
    front: 'Future 1',
    back: 'Futuro 1',
    nextReview: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour from now
    lastReviewed: new Date().toISOString(),
    interval: 60,
    reviewedCount: 1,
    isLearned: false,
    isMemorized: false,
  },
  {
    id: 'memorized-1',
    front: 'Memorized 1',
    back: 'Memorizado 1',
    nextReview: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
    interval: 0,
    reviewedCount: 5,
    isLearned: true,
    isMemorized: true,
  }
];

// Paste the logic from srs.ts here to test it
const getPriorityCards = (cards: Flashcard[]) => {
  const now = new Date();
  return cards
    .filter(card => !card.isMemorized)
    .filter(card => {
      const isNew = card.reviewedCount === 0;
      const isOverdue = new Date(card.nextReview) <= now;
      return isNew || isOverdue;
    })
    .sort((a, b) => {
      const isANew = a.reviewedCount === 0;
      const isBNew = b.reviewedCount === 0;

      if (!isANew && !isBNew) {
        return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
      }
      if (isANew && isBNew) {
        return a.id.localeCompare(b.id);
      }
      return isANew ? 1 : -1;
    });
};

const result = getPriorityCards(mockCards);

console.log('--- PRIORITY CARDS ---');
result.forEach(c => console.log(`${c.id}: ${c.front} (Review: ${c.nextReview}, Count: ${c.reviewedCount})`));

const expectedOrder = ['due-2', 'due-1', 'new-1'];
const actualOrder = result.map(c => c.id);

if (JSON.stringify(actualOrder) === JSON.stringify(expectedOrder)) {
  console.log('✅ PASS: Sorting and Filtering is correct.');
} else {
  console.log('❌ FAIL: Expected', expectedOrder, 'but got', actualOrder);
  process.exit(1);
}
