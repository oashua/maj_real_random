// 牌的类型定义
// suit: 'm'(万), 'p'(筒), 's'(索), 'z'(字)
// rank: 1-9 for number suits, 1-7 for z (東南西北白發中)
// aka: true for 赤牌

export const TILE_TYPES = [];

for (let r = 1; r <= 9; r++) {
  TILE_TYPES.push({ suit: 'm', rank: r });
}
for (let r = 1; r <= 9; r++) {
  TILE_TYPES.push({ suit: 'p', rank: r });
}
for (let r = 1; r <= 9; r++) {
  TILE_TYPES.push({ suit: 's', rank: r });
}
for (let r = 1; r <= 7; r++) {
  TILE_TYPES.push({ suit: 'z', rank: r });
}

export function tileKey(suit, rank, aka = false) {
  return `${suit}${rank}${aka ? 'a' : ''}`;
}

export function isAkahai(tile) {
  return tile.aka === true;
}

export function isYaochuu(tile) {
  if (tile.suit === 'z') return true;
  return tile.rank === 1 || tile.rank === 9;
}

export function createTileSet() {
  const tiles = [];
  let id = 0;

  for (const type of TILE_TYPES) {
    if (type.suit === 'm' && type.rank === 5) {
      for (let i = 0; i < 3; i++) {
        tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: false, key: tileKey(type.suit, type.rank, false) });
      }
      tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: true, key: tileKey(type.suit, type.rank, true) });
    } else if (type.suit === 'p' && type.rank === 5) {
      for (let i = 0; i < 3; i++) {
        tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: false, key: tileKey(type.suit, type.rank, false) });
      }
      tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: true, key: tileKey(type.suit, type.rank, true) });
    } else if (type.suit === 's' && type.rank === 5) {
      for (let i = 0; i < 3; i++) {
        tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: false, key: tileKey(type.suit, type.rank, false) });
      }
      tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: true, key: tileKey(type.suit, type.rank, true) });
    } else {
      for (let i = 0; i < 4; i++) {
        tiles.push({ id: id++, suit: type.suit, rank: type.rank, aka: false, key: tileKey(type.suit, type.rank, false) });
      }
    }
  }

  return tiles;
}

export const Z_TILE_NAMES = {
  1: '東', 2: '南', 3: '西', 4: '北',
  5: '白', 6: '發', 7: '中',
};

export const M_RANK_NAMES = { 1:'一', 2:'二', 3:'三', 4:'四', 5:'五', 6:'六', 7:'七', 8:'八', 9:'九' };

export function tileDisplayName(tile) {
  if (tile.suit === 'z') return Z_TILE_NAMES[tile.rank];
  if (tile.suit === 'm') return `${M_RANK_NAMES[tile.rank]}萬`;
  if (tile.suit === 'p') return `${tile.rank}筒`;
  if (tile.suit === 's') return `${tile.rank}索`;
  return '?';
}