import { describe, it, expect } from 'vitest';
import { createHand, sortHand, removeTileFromHand, addTileToHand } from '../hand.js';
import { createTileSet } from '../tiles.js';

describe('hand management', () => {
  it('should create a hand from tiles', () => {
    const allTiles = createTileSet();
    const tiles = allTiles.slice(0, 13);
    const hand = createHand(tiles);
    expect(hand.tiles.length).toBe(13);
    expect(hand.drawnTile).toBeNull();
  });

  it('should sort hand by suit and rank', () => {
    const allTiles = createTileSet();
    const tiles = [allTiles[10], allTiles[0], allTiles[5], allTiles[2]];
    const sorted = sortHand(tiles);
    expect(sorted[0].rank).toBeLessThanOrEqual(sorted[1].rank);
  });

  it('should remove tile from hand', () => {
    const allTiles = createTileSet();
    const tiles = allTiles.slice(0, 13);
    const hand = createHand(tiles);
    const removed = removeTileFromHand(hand, hand.tiles[0].id);
    expect(removed.tiles.length).toBe(12);
    expect(removed.tiles.find(t => t.id === hand.tiles[0].id)).toBeUndefined();
  });

  it('should add drawn tile to hand', () => {
    const allTiles = createTileSet();
    const tiles = allTiles.slice(0, 13);
    const drawn = allTiles[13];
    const hand = createHand(tiles);
    const newHand = addTileToHand(hand, drawn);
    expect(newHand.drawnTile).toEqual(drawn);
    expect(newHand.tiles.length).toBe(13);
  });
});