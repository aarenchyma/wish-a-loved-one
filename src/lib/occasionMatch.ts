// src/lib/occasionMatch.ts
const OCCASION_KEYWORDS: Record<string, string[]> = {
  birthday: ['birthday', 'bday', 'born day', 'turning', 'happy birthday'],
  valentine: ['valentine', 'love', 'romantic', 'crush', 'heartfelt', 'i love you'],
  anniversary: ['anniversary', 'years together', 'wedding anniversary'],
  graduation: ['graduation', 'graduating', 'convocation', 'degree', 'grad'],
  wedding: ['wedding', 'marriage', 'getting married', 'bride', 'groom'],
  newyear: ['new year', 'happy new year', 'nye', 'resolution'],
};

export function matchOccasion(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  if (!normalized) return null;

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [templateId, keywords] of Object.entries(OCCASION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        // longer keyword match = more confident match
        if (keyword.length > bestScore) {
          bestScore = keyword.length;
          bestMatch = templateId;
        }
      }
    }
  }

  return bestMatch;
}