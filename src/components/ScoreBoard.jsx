import Tile from './Tile';
import { doraFromIndicator } from '../core/rules';

export default function ScoreBoard({ roundInfo, doraIndicators, wallRemaining, riichiSticks }) {
  const doraTiles = doraIndicators ? doraIndicators.map(ind => doraFromIndicator(ind)) : [];

  return (
    <div className="scoreboard">
      <div className="round-info">
        {roundInfo.wind}{roundInfo.number}局 | {roundInfo.honba}本场
        {riichiSticks > 0 && ` | ${riichiSticks}立直棒`}
      </div>
      <div className="wall-count">残{wallRemaining}枚</div>
      <div className="dora-area">
        <span style={{ fontSize: '12px' }}>宝:</span>
        {doraTiles.map((d, i) => <Tile key={i} tile={d} small />)}
      </div>
    </div>
  );
}