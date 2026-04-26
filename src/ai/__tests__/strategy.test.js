import { describe, it, expect } from 'vitest';
import { aiDecideDiscard, aiDecideRiichi } from '../strategy.js';
import { createTileSet } from '../../core/tiles.js';
import { createHand } from '../../core/hand.js';

describe('strategy - discard decision', () => {
  it('should choose a tile to discard', () => {
    const allTiles = createTileSet();
    const hand = createHand(allTiles.slice(0, 13));
    hand.drawnTile = allTiles[13];
    const allKnown = allTiles.slice(0, 14);
    const decision = aiDecideDiscard(hand, allKnown, {});
    expect(decision).toBeDefined();
    expect(decision.id).toBeDefined();
  });

  it('should discard a tile from a hand with isolated tiles', () => {
    const allTiles = createTileSet();
    const map = {};
    allTiles.forEach(t => { map[t.key] = t; });
    const tiles = ['m1','m2','m3','m4','m5','m6','m7','m8','p2','p3','p4','m5','z7'].map(k => map[k]);
    const hand = createHand(tiles);
    const decision = aiDecideDiscard(hand, tiles, {});
    expect(decision).toBeDefined();
    expect(decision.id).toBeDefined();
  });
});

describe('strategy - riichi decision', () => {
  it('should decide riichi when tenpai and menzenchin', () => {
    const allTiles = createTileSet();
    const map = {};
    allTiles.forEach(t => { map[t.key] = t; });
    const tiles = ['m1','m2','m3','m4','m5','m6','m7','m8','p1','p2','p3','m5','m5'].map(k => map[k]);
    const hand = createHand(tiles.slice(0, 13));
    hand.drawnTile = tiles[13];
    const decision = aiDecideRiichi(hand, { points: 25000 });
    expect(decision).toBe(true);
  });
});