// 游戏规则常量与判断函数

export const WINDS = ['東', '南', '西', '北'];

export const INITIAL_POINTS = 25000;

export const RIICHI_COST = 1000;

export const GAME_LENGTH = [
  { wind: '東', number: 1 }, { wind: '東', number: 2 },
  { wind: '東', number: 3 }, { wind: '東', number: 4 },
  { wind: '南', number: 1 }, { wind: '南', number: 2 },
  { wind: '南', number: 3 }, { wind: '南', number: 4 },
];

export function isMenzenchin(calls) {
  return calls.every(c => c.type === 'ankou' || c.type === 'kakan');
}

export function canRiichi(calls, isTenpai, points) {
  return isMenzenchin(calls) && isTenpai && points >= RIICHI_COST;
}

export function doraFromIndicator(indicator) {
  if (indicator.suit === 'z') {
    if (indicator.rank <= 4) return { suit: 'z', rank: indicator.rank % 4 + 1 };
    const next = indicator.rank % 7 + 5;
    return { suit: 'z', rank: next > 7 ? 5 : next };
  }
  return { suit: indicator.suit, rank: indicator.rank % 9 + 1 };
}

export const ACTION_PRIORITY = {
  'tsumo': 5,
  'ron': 5,
  'kan': 4,
  'pon': 3,
  'chi': 2,
};