/**
 * Calculates a deterministic love score (0-100) based on two names.
 * The order of names does not matter.
 */
export const calculateLoveScore = (name1: string, name2: string): number => {
  // Normalize: Lowercase, remove whitespace
  const n1 = name1.toLowerCase().trim().replace(/\s/g, '');
  const n2 = name2.toLowerCase().trim().replace(/\s/g, '');

  // Sort to ensure "John + Jane" is the same as "Jane + John"
  const names = [n1, n2].sort();
  
  // Special Developer Override / Easter Egg
  if (names.includes('gaurav') && names.includes('radhika')) {
    return 96;
  }

  const combined = names.join('❤️');

  if (!combined) return 0;

  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  // Ensure positive number and map to 0-100
  // We use a specific modulo logic to distribute scores nicely
  const absHash = Math.abs(hash);
  const score = (absHash % 101); 

  return score;
};

export const getLoveMessage = (score: number): string => {
  if (score >= 90) return "Soulmates! ❤️";
  if (score >= 80) return "A Perfect Match! 🌹";
  if (score >= 60) return "Strong Chemistry! ✨";
  if (score >= 40) return "Potential Lovers... 🤔";
  if (score >= 20) return "Just Friends 🤷";
  return "Run Away! 🏃💨";
};