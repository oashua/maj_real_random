// 手牌评估器 - 向听数计算与打牌评分

import { calculateShanten as coreShanten } from '../core/validator.js';

export function calculateShanten(tiles, calls) {
  return coreShanten(tiles, calls);
}

export function findEffectiveTiles(tiles, calls, allKnownTiles) {
  const currentShanten = calculateShanten(tiles, calls);
  const effective = [];

  const allTypes = ['m','p','s'].flatMap(s =>
    [1,2,3,4,5,6,7,8,9].map(r => `${s}${r}`)
  ).concat(['z1','z2','z3','z4','z5','z6','z7']);

  for (const typeKey of allTypes) {
    const usedCount = allKnownTiles.filter(t =>
      `${t.suit}${t.rank}` === typeKey
    ).length;
    const maxCount = 4;
    if (usedCount >= maxCount) continue;

    const suit = typeKey[0];
    const rank = parseInt(typeKey.slice(1));
    const testTile = { suit, rank, aka: false, id: -1 };
    const testHand = [...tiles, testTile];
    const newShanten = calculateShanten(testHand, calls);

    if (newShanten < currentShanten) {
      const remaining = maxCount - usedCount;
      effective.push({ suit, rank, remaining, shantenReduction: currentShanten - newShanten });
    }
  }

  return effective;
}

export function scoreDiscard(handTiles, calls, allKnownTiles) {
  const scores = [];

  for (let i = 0; i < handTiles.length; i++) {
    const tile = handTiles[i];
    const remaining = [...handTiles];
    remaining.splice(i, 1);

    const shanten = calculateShanten(remaining, calls);
    const effectiveTiles = findEffectiveTiles(remaining, calls, allKnownTiles);

    const effectiveCount = effectiveTiles.reduce((sum, e) => sum + e.remaining, 0);
    const score = -shanten * 100 + effectiveCount * 10;

    scores.push({ tile, score, shanten, effectiveCount });
  }

  scores.sort((a, b) => b.score - a.score);
  return scores;
}

export function chooseBestDiscard(handTiles, calls, allKnownTiles) {
  const scores = scoreDiscard(handTiles, calls, allKnownTiles);
  return scores[scores.length - 1].tile;
}