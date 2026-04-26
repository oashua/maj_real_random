import { describe, it, expect } from 'vitest';
import { TILE_TYPES, createTileSet, isAkahai } from '../tiles.js';

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

  it('should have unique IDs for each tile', () => {
    const tiles = createTileSet();
    const ids = tiles.map(t => t.id);
    expect(new Set(ids).size).toBe(136);
  });
});