// 游戏流程控制器

import { createTileSet } from './tiles.js';
import { xorshiftShuffle } from './shuffle.js';
import { createHand, sortHand } from './hand.js';
import { INITIAL_POINTS, GAME_LENGTH, WINDS } from './rules.js';

export function createGame(seed) {
  return {
    seed,
    phase: 'start',
    roundInfo: {
      wind: '東',
      number: 1,
      honba: 0,
      riichiSticks: 0,
    },
    players: [
      { id: 0, name: '玩家', points: INITIAL_POINTS, hand: null, discards: [], riichi: false, isDealer: true, calls: [], wind: WINDS[0] },
      { id: 1, name: '电脑1', points: INITIAL_POINTS, hand: null, discards: [], riichi: false, isDealer: false, calls: [], wind: WINDS[1] },
      { id: 2, name: '电脑2', points: INITIAL_POINTS, hand: null, discards: [], riichi: false, isDealer: false, calls: [], wind: WINDS[2] },
      { id: 3, name: '电脑3', points: INITIAL_POINTS, hand: null, discards: [], riichi: false, isDealer: false, calls: [], wind: WINDS[3] },
    ],
    wall: [],
    dora: [],
    doraIndicators: [],
    currentTurn: 0,
    lastDiscard: null,
    pendingActions: [],
    turnCount: 0,
  };
}

export function dealTiles(game) {
  const allTiles = createTileSet();
  const shuffled = xorshiftShuffle(allTiles, game.seed);

  const newGame = { ...game, phase: 'playing', wall: [] };

  const hands = [[], [], [], []];
  let wallIndex = 0;

  for (let round = 0; round < 3; round++) {
    for (let player = 0; player < 4; player++) {
      for (let i = 0; i < 4; i++) {
        hands[player].push(shuffled[wallIndex++]);
      }
    }
  }
  for (let player = 0; player < 4; player++) {
    hands[player].push(shuffled[wallIndex++]);
  }

  newGame.players = game.players.map((p, i) => ({
    ...p,
    hand: createHand(sortHand(hands[i])),
    discards: [],
    riichi: false,
    calls: [],
  }));

  const doraIndicator = shuffled[wallIndex];
  newGame.doraIndicators = [doraIndicator];
  wallIndex++;

  newGame.wall = shuffled.slice(wallIndex);

  const dealerDraw = newGame.wall.shift();
  newGame.players[0].hand = { ...newGame.players[0].hand, drawnTile: dealerDraw };
  newGame.currentTurn = 0;
  newGame.turnCount = 0;

  return newGame;
}

export function nextTurn(game) {
  const nextPlayer = (game.currentTurn + 1) % 4;
  const drawTile = game.wall.shift();

  if (!drawTile) {
    return { ...game, phase: 'result', resultType: 'ryuukyoku' };
  }

  const newPlayers = [...game.players];
  newPlayers[nextPlayer] = {
    ...newPlayers[nextPlayer],
    hand: { ...newPlayers[nextPlayer].hand, drawnTile: drawTile },
  };

  return {
    ...game,
    players: newPlayers,
    currentTurn: nextPlayer,
    turnCount: game.turnCount + 1,
    lastDiscard: null,
    pendingActions: [],
  };
}

export function discardTile(game, playerId, tileId) {
  const player = game.players[playerId];
  const hand = player.hand;

  let discardedTile;
  let newHand;

  if (hand.drawnTile && hand.drawnTile.id === tileId) {
    discardedTile = hand.drawnTile;
    newHand = { ...hand, drawnTile: null };
  } else {
    discardedTile = hand.tiles.find(t => t.id === tileId);
    newHand = {
      ...hand,
      tiles: hand.tiles.filter(t => t.id !== tileId),
      drawnTile: hand.drawnTile,
    };
  }

  const newDiscards = [...player.discards, discardedTile];
  const newPlayers = [...game.players];
  newPlayers[playerId] = {
    ...player,
    hand: newHand,
    discards: newDiscards,
  };

  return {
    ...game,
    players: newPlayers,
    lastDiscard: discardedTile,
    pendingActions: [],
  };
}

export function advanceRound(game, dealerWon) {
  const ri = game.roundInfo;

  if (dealerWon) {
    return {
      ...game,
      roundInfo: {
        ...ri,
        honba: ri.honba + 1,
        riichiSticks: 0,
      },
    };
  }

  const nextNumber = ri.number + 1;
  let nextWind = ri.wind;

  let finalNumber = nextNumber;
  let finalWind = nextWind;

  if (nextNumber > 4) {
    if (ri.wind === '東') {
      finalWind = '南';
      finalNumber = 1;
    } else {
      return { ...game, phase: 'end' };
    }
  }

  return {
    ...game,
    roundInfo: {
      wind: finalWind,
      number: finalNumber,
      honba: 0,
      riichiSticks: 0,
    },
  };
}