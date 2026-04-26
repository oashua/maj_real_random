import { describe, it, expect } from 'vitest';
import { createGame, dealTiles, nextTurn, advanceRound } from '../game.js';
import { INITIAL_POINTS } from '../rules.js';

describe('game controller', () => {
  it('should create a game with seed', () => {
    const game = createGame(1234567890);
    expect(game.seed).toBe(1234567890);
    expect(game.phase).toBe('start');
    expect(game.players.length).toBe(4);
    expect(game.players[0].name).toBe('玩家');
    expect(game.players[1].name).toBe('电脑1');
  });

  it('should initialize all players with 25000 points', () => {
    const game = createGame(12345);
    game.players.forEach(p => expect(p.points).toBe(INITIAL_POINTS));
  });

  it('should deal 13 tiles to each player + 14 to dealer', () => {
    const game = createGame(12345);
    const dealt = dealTiles(game);
    expect(dealt.players[0].hand.tiles.length + (dealt.players[0].hand.drawnTile ? 1 : 0)).toBe(14);
    expect(dealt.players[1].hand.tiles.length).toBe(13);
    expect(dealt.players[2].hand.tiles.length).toBe(13);
    expect(dealt.players[3].hand.tiles.length).toBe(13);
    expect(dealt.wall.length).toBeGreaterThan(0);
  });

  it('should advance round correctly', () => {
    const game = createGame(12345);
    game.roundInfo = { wind: '東', number: 1, honba: 0, riichiSticks: 0 };
    const next = advanceRound(game, false);
    expect(next.roundInfo.wind).toBe('東');
    expect(next.roundInfo.number).toBe(2);
  });

  it('should keep dealer when dealer wins', () => {
    const game = createGame(12345);
    game.roundInfo = { wind: '東', number: 1, honba: 0, riichiSticks: 0 };
    const next = advanceRound(game, true);
    expect(next.roundInfo.wind).toBe('東');
    expect(next.roundInfo.number).toBe(1);
    expect(next.roundInfo.honba).toBe(1);
  });
});