export interface EssentialWordES {
  id: string;
  es: string;
  pt: string;
  category: string;
  phonetic?: string;
  sprint: number;
}

export const VOCABULARY_SPRINTS_ES: EssentialWordES[] = [];

const words: Partial<EssentialWordES>[] = [
  { es: 'ser', pt: 'ser' },
  { es: 'estar', pt: 'estar' },
  { es: 'tener', pt: 'ter' },
  { es: 'hacer', pt: 'fazer' },
  { es: 'poder', pt: 'poder' },
  { es: 'decir', pt: 'dizer' },
  { es: 'ir', pt: 'ir' },
  { es: 'ver', pt: 'ver' },
  { es: 'dar', pt: 'dar' },
  { es: 'saber', pt: 'saber' },
  { es: 'querer', pt: 'querer' },
  { es: 'llegar', pt: 'chegar' },
  { es: 'pasar', pt: 'passar' },
  { es: 'deber', pt: 'dever' },
  { es: 'poner', pt: 'pôr' },
  { es: 'parecer', pt: 'parecer' },
  { es: 'quedar', pt: 'ficar' },
  { es: 'creer', pt: 'acreditar' },
  { es: 'hablar', pt: 'falar' },
  { es: 'llevar', pt: 'levar' }
];

for(let sprint = 1; sprint <= 12; sprint++) {
  for(let i = 1; i <= 50; i++) {
    const num = ((sprint-1)*50) + i;
    const wordRef = words[i % words.length];
    VOCABULARY_SPRINTS_ES.push({
      id: \es_word_\\,
      es: \\ \\,
      pt: \\ \\,
      category: sprint === 1 ? 'Verbos Básicos' : sprint === 2 ? 'Substantivos' : 'Expansão',
      phonetic: '...',
      sprint: sprint
    });
  }
}
