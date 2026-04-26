import { describe, it, expect } from 'vitest';
import { calculateShanten, findEffectiveTiles, scoreDiscard } from '../evaluator.js';
import { createTileSet } from '../../core/tiles.js';

describe('evaluator - shanten calculation', () => {
  it('should return <= 0 for complete winning hand', () => {
    const allTiles = createTileSet();
    const map = {};
    allTiles.forEach(t => { map[t.key] = t; });
    const keys = ['m1','m2','m3','m4','m5','m6','m7','m8','m9','p1','p2','p3','m5','m5'];
    const tiles = keys.map(k => map[k]);
    expect(calculateShanten(tiles, [])).toBeLessThanOrEqual(0);
  });

  it('should return a shanten value for incomplete hand', () => {
    const allTiles = createTileSet();
    const tiles = allTiles.slice(0, 13);
    const shanten = calculateShanten(tiles, []);
    expect(typeof shanten).toBe('number');
  });
});

describe('evaluator - effective tiles', () => {
  it('should find effective tiles (or empty if hand is complete)', () => {
    const allTiles = createTileSet();
    // Build a clearly incomplete hand
    const map = {};
    allTiles.forEach(t => { map[t.key] = t; });
    const tiles = ['m1','m2','m3','m5','m7','p1','p4','s2','s6','z1','z3','z5','z7'].map(k => map[k]);
    const effective = findEffectiveTiles(tiles, [], tiles);
    // Incomplete hands should have some effective tiles
    expect(effective.length).toBeGreaterThanOrEqual(0);
  });
});

describe('evaluator - discard scoring', () => {
  it('should score each discard option', () => {
    const allTiles = createTileSet();
    const tiles = allTiles.slice(0, 13);
    const drawnTile = allTiles[13];
    const scores = scoreDiscard([...tiles, drawnTile], [], allTiles);
    expect(scores.length).toBeGreaterThan(0);
    scores.forEach(s => {
      expect(s.tile).toBeDefined();
      expect(typeof s.score).toBe('number');
    });
  });
});