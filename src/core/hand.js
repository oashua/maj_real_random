// 手牌管理模块

const SUIT_ORDER = { 'm': 0, 'p': 1, 's': 2, 'z': 3 };

export function createHand(tiles) {
  return {
    tiles: sortHand(tiles),
    drawnTile: null,
    calls: [],
    riichi: false,
    riichiTurn: null,
  };
}

export function sortHand(tiles) {
  return [...tiles].sort((a, b) => {
    const suitDiff = SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit];
    if (suitDiff !== 0) return suitDiff;
    return a.rank - b.rank;
  });
}

export function removeTileFromHand(hand, tileId) {
  if (hand.drawnTile && hand.drawnTile.id === tileId) {
    return { ...hand, drawnTile: null };
  }
  return {
    ...hand,
    tiles: hand.tiles.filter(t => t.id !== tileId),
  };
}

export function addTileToHand(hand, tile) {
  return { ...hand, drawnTile: tile };
}

export function getAllHandTiles(hand) {
  const all = hand.drawnTile ? [...hand.tiles, hand.drawnTile] : [...hand.tiles];
  return sortHand(all);
}

export function canChi(hand, discardedTile) {
  if (discardedTile.suit === 'z') return [];
  const combos = [];
  const sameSuit = hand.tiles.filter(t => t.suit === discardedTile.suit);
  const ranks = sameSuit.map(t => t.rank);

  if (ranks.includes(discardedTile.rank + 1) && ranks.includes(discardedTile.rank + 2)) {
    combos.push({ type: 'chi_left', tiles: [discardedTile.rank, discardedTile.rank + 1, discardedTile.rank + 2] });
  }
  if (ranks.includes(discardedTile.rank - 1) && ranks.includes(discardedTile.rank + 1)) {
    combos.push({ type: 'chi_mid', tiles: [discardedTile.rank - 1, discardedTile.rank, discardedTile.rank + 1] });
  }
  if (ranks.includes(discardedTile.rank - 2) && ranks.includes(discardedTile.rank - 1)) {
    combos.push({ type: 'chi_right', tiles: [discardedTile.rank - 2, discardedTile.rank - 1, discardedTile.rank] });
  }

  return combos;
}

export function canPon(hand, discardedTile) {
  const count = hand.tiles.filter(t => t.suit === discardedTile.suit && t.rank === discardedTile.rank).length;
  return count >= 2;
}

export function canMinkan(hand, discardedTile) {
  const count = hand.tiles.filter(t => t.suit === discardedTile.suit && t.rank === discardedTile.rank).length;
  return count >= 3;
}

export function canKakan(hand) {
  return hand.calls.filter(c => c.type === 'minpon' && hand.drawnTile &&
    hand.drawnTile.suit === c.tiles[0].suit && hand.drawnTile.rank === c.tiles[0].rank);
}

export function canAnkan(hand) {
  const allTiles = getAllHandTiles(hand);
  const counts = {};
  allTiles.forEach(t => {
    const key = `${t.suit}${t.rank}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const ankans = [];
  for (const [key, count] of Object.entries(counts)) {
    if (count === 4) {
      ankans.push({ suit: key[0], rank: parseInt(key.slice(1)) });
    }
  }
  return ankans;
}