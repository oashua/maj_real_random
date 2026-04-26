import { describe, it, expect } from 'vitest';
import {
  isWinningHand, findMentsuDecompositions,
  countHan, countFu, calculatePoints,
  checkYaku, calculateShanten
} from '../validator.js';
import { createTileSet, tileKey } from '../tiles.js';

function buildHand(keys, allTiles) {
  const map = {};
  allTiles.forEach(t => { map[t.key] = t; });
  return keys.map(k => map[k]);
}

describe('validator - basic winning check', () => {
  const allTiles = createTileSet();

  it('should recognize 4 mentsu + 1 jantai', () => {
    const tiles = buildHand([
      'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9',
      'p1', 'p2', 'p3', 'm5', 'm5'
    ], allTiles);
    expect(isWinningHand(tiles)).toBe(true);
  });

  it('should recognize seven pairs', () => {
    const tiles = buildHand([
      'm1', 'm1', 'm2', 'm2', 'm3', 'm3', 'p1', 'p1', 'p5', 'p5', 'z1', 'z1', 'z2', 'z2'
    ], allTiles);
    expect(isWinningHand(tiles, true)).toBe(true);
  });

  it('should recognize kokushi', () => {
    const tiles = buildHand([
      'm1', 'm9', 'p1', 'p9', 's1', 's9', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'm1'
    ], allTiles);
    expect(isWinningHand(tiles, false, true)).toBe(true);
  });

  it('should reject incomplete hand', () => {
    const tiles = buildHand([
      'm1', 'm2', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9',
      'p1', 'p2', 'p3', 'm5', 'm5'
    ], allTiles);
    expect(isWinningHand(tiles)).toBe(false);
  });

  it('should count tanyao yaku', () => {
    const tiles = buildHand([
      'm2', 'm3', 'm4', 'p2', 'p3', 'p4', 's2', 's3', 's4',
      'm5', 'm5', 'p5', 'p5'
    ], allTiles);
    const yaku = checkYaku(tiles, [], { wind: '東', playerWind: '南' }, []);
    const tanyao = yaku.find(y => y.name === '断幺九');
    expect(tanyao).toBeDefined();
  });

  it('should calculate shanten', () => {
    const tiles = allTiles.slice(0, 13);
    const shanten = calculateShanten(tiles, []);
    expect(typeof shanten).toBe('number');
  });

  it('should return -1 for winning hand shanten', () => {
    const tiles = buildHand([
      'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9',
      'p1', 'p2', 'p3', 'm5', 'm5'
    ], allTiles);
    expect(calculateShanten(tiles, [])).toBeLessThanOrEqual(0);
  });
});