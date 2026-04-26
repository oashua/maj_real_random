import { describe, it, expect } from 'vitest';
import { ALL_TILES, TILE_TYPES, createTileSet, isAkahai } from '../tiles.js';

describe('tiles', () => {
  it('should define all tile types', () => {
    expect(TILE_TYPES.length).toBeGreaterThan(0);
  });

  it('should create a full set of 136 tiles', () => {
    const tiles = createTileSet();
    expect(tiles.length).toBe(136);
  });

  it('should contain exactly 3 akahai', () => {
    const tiles = createTileSet();
    const akahai = tiles.filter(t => isAkahai(t));
    expect(akahai.length).toBe(3);
  });

  it('each non-aka tile type should have 4 copies', () => {
    const tiles = createTileSet();
    const normalTiles = tiles.filter(t => !isAkahai(t));
    const counts = {};
    normalTiles.forEach(t => {
      counts[t.type] = (counts[t.key] || 0) + 1;
      counts[t.key] = (counts[t.key] || 0) + 1;
    });
    // Check that each non-aka key has exactly 3 copies (since 1 of 4 is replaced by aka)
    const fiveKeys = ['m5', 'p5', 's5'];
    for (const [key, count] of Object.entries(counts)) {
      if (fiveKeys.includes(key)) {
        expect(count).toBe(3);
      } else {
        expect(count).toBe(4);
      }
    }
  });

  it('should have unique IDs for each tile', () => {
    const tiles = createTileSet();
    const ids = tiles.map(t => t.id);
    expect(new Set(ids).size).toBe(136);
  });
});