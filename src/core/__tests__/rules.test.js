import { describe, it, expect } from 'vitest';
import { WINDS, INITIAL_POINTS, GAME_LENGTH, RIICHI_COST, isMenzenchin, canRiichi } from '../rules.js';

describe('rules constants', () => {
  it('should define 4 winds', () => {
    expect(WINDS.length).toBe(4);
  });

  it('should have initial points of 25000', () => {
    expect(INITIAL_POINTS).toBe(25000);
  });

  it('should define game length as tonpuu+nansha', () => {
    expect(GAME_LENGTH).toEqual([
      { wind: '東', number: 1 }, { wind: '東', number: 2 },
      { wind: '東', number: 3 }, { wind: '東', number: 4 },
      { wind: '南', number: 1 }, { wind: '南', number: 2 },
      { wind: '南', number: 3 }, { wind: '南', number: 4 },
    ]);
  });

  it('riichi cost should be 1000', () => {
    expect(RIICHI_COST).toBe(1000);
  });
});

describe('isMenzenchin', () => {
  it('should return true when no calls', () => {
    expect(isMenzenchin([])).toBe(true);
  });

  it('should return true when only ankou calls', () => {
    expect(isMenzenchin([{ type: 'ankou' }])).toBe(true);
  });

  it('should return false when has minchi call', () => {
    expect(isMenzenchin([{ type: 'minchi' }])).toBe(false);
  });

  it('should return false when has minpon call', () => {
    expect(isMenzenchin([{ type: 'minpon' }])).toBe(false);
  });

  it('should return false when has minkan call', () => {
    expect(isMenzenchin([{ type: 'minkan' }])).toBe(false);
  });
});

describe('canRiichi', () => {
  it('should return true when menzenchin, tenpai, and enough points', () => {
    expect(canRiichi([], true, 25000)).toBe(true);
  });

  it('should return false when not menzenchin', () => {
    expect(canRiichi([{ type: 'minchi' }], true, 25000)).toBe(false);
  });

  it('should return false when not tenpai', () => {
    expect(canRiichi([], false, 25000)).toBe(false);
  });

  it('should return false when points < 1000', () => {
    expect(canRiichi([], true, 500)).toBe(false);
  });
});