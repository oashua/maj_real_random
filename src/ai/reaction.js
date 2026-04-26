// AI 吃碰杠/和牌的反应决策

import { calculateShanten } from './evaluator.js';
import { getAllHandTiles, canChi, canPon, canMinkan, canAnkan, canKakan } from '../core/hand.js';
import { isWinningHand } from '../core/validator.js';

export function aiDecideReaction(hand, discardedTile, playerId, gameState) {
  const allTiles = getAllHandTiles(hand);
  const shanten = calculateShanten(allTiles, hand.calls);

  const actions = [];

  // 1. Check if can win (highest priority)
  const testHand = [...allTiles, discardedTile];
  if (testHand.length === 14 && isWinningHand(testHand)) {
    actions.push({ type: 'ron', priority: 5 });
  }

  // 2. Check pon
  if (canPon(hand, discardedTile)) {
    if (shanten <= 2) {
      actions.push({ type: 'pon', priority: 3 });
    }
  }

  // 3. Check minkan
  if (canMinkan(hand, discardedTile)) {
    if (shanten <= 1) {
      actions.push({ type: 'minkan', priority: 4 });
    }
  }

  // 4. Check chi (only for next player)
  const nextPlayer = (gameState.currentTurn + 1) % 4;
  if (playerId === nextPlayer) {
    const chiOptions = canChi(hand, discardedTile);
    if (chiOptions.length > 0 && shanten <= 2) {
      actions.push({ type: 'chi', priority: 2, options: chiOptions });
    }
  }

  actions.sort((a, b) => b.priority - a.priority);
  return actions.length > 0 ? actions[0] : { type: 'skip', priority: 0 };
}

export function aiDecideTsumoAction(hand, gameState) {
  const allTiles = getAllHandTiles(hand);

  if (isWinningHand(allTiles) && hand.drawnTile) {
    return { type: 'tsumo' };
  }

  const ankans = canAnkan(hand);
  if (ankans.length > 0) {
    const shanten = calculateShanten(allTiles, hand.calls);
    if (shanten <= 0) {
      return { type: 'ankan', suit: ankans[0].suit, rank: ankans[0].rank };
    }
  }

  const kakans = canKakan(hand);
  if (kakans.length > 0) {
    return { type: 'kakan', call: kakans[0] };
  }

  return { type: 'discard' };
}