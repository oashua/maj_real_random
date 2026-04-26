import { describe, it, expect } from 'vitest';
import { xorshiftShuffle, createRng } from '../shuffle.js';

describe('shuffle', () => {
  it('should shuffle 136 tiles with given seed', () => {
    const tiles = Array.from({ length: 136 }, (_, i) => i);
    const result = xorshiftShuffle(tiles, 12345);
    expect(result.length).toBe(136);
    expect(result).not.toEqual(tiles);
    const result2 = xorshiftShuffle(Array.from({ length: 136 }, (_, i) => i), 12345);
    expect(result).toEqual(result2);
  });

  it('different seeds should produce different shuffles', () => {
    const tiles = Array.from({ length: 136 }, (_, i) => i);
    const r1 = xorshiftShuffle(tiles, 1);
    const r2 = xorshiftShuffle(tiles, 2);
    expect(r1).not.toEqual(r2);
  });

  it('should preserve all elements after shuffle', () => {
    const tiles = Array.from({ length: 136 }, (_, i) => i);
    const result = xorshiftShuffle(tiles, 999);
    expect(result.sort((a, b) => a - b)).toEqual(tiles);
  });

  it('rng should produce deterministic sequence', () => {
    const rng = createRng(42);
    const v1 = rng();
    const v2 = rng();
    expect(typeof v1).toBe('number');
    expect(v1).not.toBe(v2);
    const rng2 = createRng(42);
    expect(rng2()).toBe(v1);
    expect(rng2()).toBe(v2);
  });
});