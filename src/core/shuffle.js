// Seeded PRNG using mulberry32 — simple, fast, well-distributed
// Used for reproducible Fisher-Yates shuffle

export function createRng(seed) {
  let state = seed | 0;

  return function next() {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0);
  };
}

export function xorshiftShuffle(array, seed) {
  const rng = createRng(seed);
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rng() % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}