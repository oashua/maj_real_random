// 和牌判定与役识别模块

export function isWinningHand(tiles, checkChitoi = true, checkKokushi = true) {
  if (tiles.length !== 14) return false;

  if (checkKokushi && isKokushi(tiles)) return true;
  if (checkChitoi && isChitoi(tiles)) return true;
  return findMentsuDecompositions(tiles).length > 0;
}

function isChitoi(tiles) {
  const counts = {};
  tiles.forEach(t => {
    const key = `${t.suit}${t.rank}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  const pairs = Object.entries(counts).filter(([k, v]) => v === 2);
  return pairs.length === 7;
}

function isKokushi(tiles) {
  const yaochuuKeys = [
    'm1', 'm9', 'p1', 'p9', 's1', 's9',
    'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7'
  ];
  const counts = {};
  tiles.forEach(t => {
    const key = `${t.suit}${t.rank}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  let doubleCount = 0;
  for (const key of yaochuuKeys) {
    if (!counts[key]) return false;
    if (counts[key] === 2) doubleCount++;
    if (counts[key] > 2) return false;
  }
  for (const key of Object.keys(counts)) {
    if (!yaochuuKeys.includes(key)) return false;
  }
  return doubleCount === 1;
}

export function findMentsuDecompositions(tiles) {
  const counts = {};
  tiles.forEach(t => {
    const key = `${t.suit}${t.rank}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const results = [];

  for (const [jantaiKey, jantaiCount] of Object.entries(counts)) {
    if (jantaiCount < 2) continue;

    const remaining = { ...counts };
    remaining[jantaiKey] -= 2;
    if (remaining[jantaiKey] === 0) delete remaining[jantaiKey];

    const mentsus = extractMentsus(remaining);
    if (mentsus) {
      results.push({
        jantai: { suit: jantaiKey[0], rank: parseInt(jantaiKey.slice(1)) },
        mentsus,
      });
    }
  }

  return results;
}

function extractMentsus(counts) {
  const mentsus = [];
  const keys = Object.keys(counts).sort();

  // z tiles: only koutsu possible
  const zKeys = keys.filter(k => k[0] === 'z');
  for (const key of zKeys) {
    const count = counts[key];
    if (count === 3) {
      mentsus.push({ type: 'koutsu', suit: 'z', rank: parseInt(key.slice(1)) });
      delete counts[key];
    } else if (count > 0) {
      return null;
    }
  }

  for (const suit of ['m', 'p', 's']) {
    const result = decomposeSuit({ ...counts }, suit);
    if (result === null) return null;
    mentsus.push(...result);
    // Update counts to reflect consumed tiles
    result.forEach(m => {
      if (m.type === 'koutsu') {
        const key = `${suit}${m.rank}`;
        counts[key] -= 3;
        if (counts[key] <= 0) delete counts[key];
      } else {
        for (const r of m.ranks) {
          const key = `${suit}${r}`;
          counts[key] -= 1;
          if (counts[key] <= 0) delete counts[key];
        }
      }
    });
  }

  if (Object.keys(counts).some(k => counts[k] > 0)) return null;
  return mentsus.length === 4 ? mentsus : null;
}

function decomposeSuit(counts, suit) {
  // Try koutsu-first approach
  const r1 = tryDecompose(counts, suit, false);
  if (r1 !== null) return r1;
  // Try shuntsu-first approach
  return tryDecompose(counts, suit, true);
}

function tryDecompose(counts, suit, shuntsuFirst) {
  const mentsus = [];
  const temp = { ...counts };

  if (shuntsuFirst) {
    for (let r = 1; r <= 7; r++) {
      const k1 = `${suit}${r}`, k2 = `${suit}${r+1}`, k3 = `${suit}${r+2}`;
      while (temp[k1] > 0 && temp[k2] > 0 && temp[k3] > 0) {
        mentsus.push({ type: 'shuntsu', suit, ranks: [r, r+1, r+2] });
        temp[k1]--; temp[k2]--; temp[k3]--;
      }
    }
    for (let r = 1; r <= 9; r++) {
      const key = `${suit}${r}`;
      while (temp[key] >= 3) {
        mentsus.push({ type: 'koutsu', suit, rank: r });
        temp[key] -= 3;
      }
    }
  } else {
    for (let r = 1; r <= 9; r++) {
      const key = `${suit}${r}`;
      while (temp[key] >= 3) {
        mentsus.push({ type: 'koutsu', suit, rank: r });
        temp[key] -= 3;
      }
    }
    for (let r = 1; r <= 7; r++) {
      const k1 = `${suit}${r}`, k2 = `${suit}${r+1}`, k3 = `${suit}${r+2}`;
      while (temp[k1] > 0 && temp[k2] > 0 && temp[k3] > 0) {
        mentsus.push({ type: 'shuntsu', suit, ranks: [r, r+1, r+2] });
        temp[k1]--; temp[k2]--; temp[k3]--;
      }
    }
  }

  const remaining = Object.entries(temp).filter(([k, v]) => k[0] === suit && v > 0);
  if (remaining.length > 0) return null;
  return mentsus;
}

export function checkYaku(handTiles, calls, roundInfo, doraTiles) {
  const yakuList = [];
  const allTiles = [...handTiles, ...calls.flatMap(c => c.tiles || [])];
  const isMenzenchin = calls.every(c => c.type === 'ankou' || c.type === 'kakan');

  // 断幺九
  if (!allTiles.some(t => isYaochuuTile(t))) {
    yakuList.push({ name: '断幺九', han: 1 });
  }

  // 七对子
  if (isChitoi(handTiles) && isMenzenchin) {
    yakuList.push({ name: '七对子', han: 2 });
  }

  // 混一色
  const suits = new Set(allTiles.filter(t => t.suit !== 'z').map(t => t.suit));
  if (suits.size === 1 && allTiles.some(t => t.suit === 'z')) {
    yakuList.push({ name: '混一色', han: isMenzenchin ? 3 : 2 });
  }

  // 清一色
  if (suits.size === 1 && !allTiles.some(t => t.suit === 'z')) {
    yakuList.push({ name: '清一色', han: isMenzenchin ? 6 : 5 });
  }

  // 对对和
  const decompositions = findMentsuDecompositions(handTiles);
  if (decompositions.length > 0) {
    for (const decomp of decompositions) {
      if (decomp.mentsus.every(m => m.type === 'koutsu')) {
        if (!yakuList.find(y => y.name === '对对和')) {
          yakuList.push({ name: '对对和', han: 2 });
        }
      }
    }
  }

  // 三暗刻
  const ankous = calls.filter(c => c.type === 'ankou');
  if (decompositions.length > 0) {
    for (const decomp of decompositions) {
      const handKoutsu = decomp.mentsus.filter(m => m.type === 'koutsu');
      const totalAnkou = ankous.length + handKoutsu.length;
      if (totalAnkou >= 3 && !yakuList.find(y => y.name === '三暗刻')) {
        yakuList.push({ name: '三暗刻', han: 2 });
      }
    }
  }

  // 宝牌
  let doraHan = 0;
  for (const tile of allTiles) {
    for (const dora of doraTiles) {
      if (tile.suit === dora.suit && tile.rank === dora.rank) doraHan++;
    }
    if (tile.aka) doraHan++;
  }
  if (doraHan > 0) {
    yakuList.push({ name: '宝牌', han: doraHan });
  }

  return yakuList;
}

function isYaochuuTile(tile) {
  if (tile.suit === 'z') return true;
  return tile.rank === 1 || tile.rank === 9;
}

export function countHan(yakuList) {
  return yakuList.reduce((sum, y) => sum + y.han, 0);
}

export function countFu(decomposition, isTsumo, calls) {
  let fu = 20;

  const jantai = decomposition.jantai;
  if (jantai.suit === 'z' || jantai.rank === 1 || jantai.rank === 9) fu += 2;

  for (const mentsu of decomposition.mentsus) {
    if (mentsu.type === 'koutsu') {
      const isYaochuu = mentsu.suit === 'z' || mentsu.rank === 1 || mentsu.rank === 9;
      fu += isYaochuu ? 8 : 4;
    }
  }

  for (const call of calls) {
    if (call.type === 'minpon') {
      const isYaochuu = call.tiles[0].suit === 'z' || call.tiles[0].rank === 1 || call.tiles[0].rank === 9;
      fu += isYaochuu ? 4 : 2;
    } else if (call.type === 'ankou') {
      const isYaochuu = call.tiles[0].suit === 'z' || call.tiles[0].rank === 1 || call.tiles[0].rank === 9;
      fu += isYaochuu ? 16 : 8;
    } else if (call.type === 'minchi') {
      fu += 2;
    } else if (call.type === 'minkan') {
      fu += call.tiles[0].suit === 'z' || [1, 9].includes(call.tiles[0].rank) ? 8 : 4;
    }
  }

  if (isTsumo) fu += 2;

  return Math.ceil(fu / 10) * 10;
}

export function calculatePoints(han, fu, isDealer) {
  const basicPoints = fu * Math.pow(2, han + 2);

  if (han === 1 && fu < 30) return { basic: 1000, dealer: 1500, child: 500 };
  if (han === 2 && fu < 20) return { basic: 1500, dealer: 2300, child: 700 };

  if (han >= 5 || (han === 4 && fu >= 40) || (han === 3 && fu >= 70)) {
    if (isDealer) return { basic: 12000, dealer: 4000, child: 4000 };
    return { basic: 8000, dealer: 8000, child: 2000 };
  }

  if (isDealer) {
    const each = Math.ceil(basicPoints * 6 / 100) * 100;
    return { basic: basicPoints, dealer: each, child: each };
  } else {
    const dealerPay = Math.ceil(basicPoints * 6 / 100) * 100;
    const eachPay = Math.ceil(basicPoints * 2 / 100) * 100;
    return { basic: basicPoints, dealer: dealerPay, child: eachPay };
  }
}

export function calculateShanten(tiles, calls) {
  const counts = {};
  tiles.forEach(t => {
    const key = `${t.suit}${t.rank}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  let mentsuCount = 0;
  let partialCount = 0;
  let jantaiCount = 0;

  for (const [key, count] of Object.entries(counts)) {
    if (count >= 2) jantaiCount++;
  }

  for (const [key, count] of Object.entries(counts)) {
    if (count >= 3) mentsuCount++;
  }

  const tempCounts = { ...counts };
  for (const suit of ['m', 'p', 's']) {
    for (let r = 1; r <= 7; r++) {
      const k1 = `${suit}${r}`, k2 = `${suit}${r+1}`, k3 = `${suit}${r+2}`;
      if (tempCounts[k1] && tempCounts[k2] && tempCounts[k3]) {
        mentsuCount++;
        tempCounts[k1]--; tempCounts[k2]--; tempCounts[k3]--;
      }
    }
  }

  for (const suit of ['m', 'p', 's']) {
    for (let r = 1; r <= 8; r++) {
      const k1 = `${suit}${r}`, k2 = `${suit}${r+1}`;
      if (tempCounts[k1] && tempCounts[k2]) {
        partialCount++;
        tempCounts[k1]--; tempCounts[k2]--;
      }
    }
  }

  const totalMentsu = mentsuCount + calls.length;
  const hasJantai = jantaiCount > 0;

  let shanten = 8 - 2 * totalMentsu - partialCount - (hasJantai ? 1 : 0);

  const pairs = Object.values(tempCounts).filter(v => v >= 2).length + jantaiCount;
  const chitoiShanten = 6 - pairs;

  const yaochuuKeys = ['m1','m9','p1','p9','s1','s9','z1','z2','z3','z4','z5','z6','z7'];
  const yaochuuCount = yaochuuKeys.filter(k => counts[k]).length;
  const kokushiShanten = 13 - yaochuuCount - (yaochuuCount >= 1 ? 1 : 0);

  return Math.min(shanten, chitoiShanten, kokushiShanten);
}