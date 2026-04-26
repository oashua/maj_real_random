// 困难AI核心策略

import { calculateShanten, chooseBestDiscard, findEffectiveTiles } from './evaluator.js';
import { isMenzenchin } from '../core/rules.js';
import { getAllHandTiles } from '../core/hand.js';

export function aiDecideDiscard(hand, allKnownTiles, gameState) {
  const allTiles = getAllHandTiles(hand);
  const shanten = calculateShanten(allTiles, hand.calls);

  const opponentRiichi = gameState.players && gameState.players.some(
    p => p.id !== 0 && p.riichi
  );

  if (opponentRiichi) {
    return defensiveDiscard(hand, allKnownTiles, gameState);
  }

  return chooseBestDiscard(allTiles, hand.calls, allKnownTiles);
}

export function aiDecideRiichi(hand, playerInfo) {
  const allTiles = getAllHandTiles(hand);
  const shanten = calculateShanten(allTiles, hand.calls);

  if (!isMenzenchin(hand.calls)) return false;
  if (shanten > 0) return false;
  if (playerInfo.points < 1000) return false;

  return true;
}

function defensiveDiscard(hand, allKnownTiles, gameState) {
  const allTiles = getAllHandTiles(hand);

  const riichiPlayer = gameState.players ? gameState.players.find(p => p.id !== 0 && p.riichi) : null;
  if (!riichiPlayer) return chooseBestDiscard(allTiles, hand.calls, allKnownTiles);

  const safeKeys = new Set(riichiPlayer.discards.map(t => `${t.suit}${t.rank}`));
  const safeTiles = allTiles.filter(t => safeKeys.has(`${t.suit}${t.rank}`));

  if (safeTiles.length > 0) {
    return chooseBestDiscard(safeTiles, hand.calls, allKnownTiles);
  }

  const sujiTiles = findSujiTiles(allTiles, riichiPlayer.discards);
  if (sujiTiles.length > 0) {
    return chooseBestDiscard(sujiTiles, hand.calls, allKnownTiles);
  }

  return chooseBestDiscard(allTiles, hand.calls, allKnownTiles);
}

function findSujiTiles(handTiles, discards) {
  const sujiKeys = new Set();
  for (const d of discards) {
    if (d.suit === 'z') continue;
    sujiKeys.add(`${d.suit}${d.rank - 3}`);
    sujiKeys.add(`${d.suit}${d.rank + 3}`);
  }
  return handTiles.filter(t => sujiKeys.has(`${t.suit}${t.rank}`));
}