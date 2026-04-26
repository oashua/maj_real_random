import PlayerHand from './PlayerHand';
import AiHand from './AiHand';
import DiscardPool from './DiscardPool';
import ScoreBoard from './ScoreBoard';
import ActionPanel from './ActionPanel';

export default function GameBoard({ gameState, onDiscard, onAction }) {
  if (!gameState || gameState.phase === 'start') return null;

  const { players, roundInfo, doraIndicators, wall, pendingActions } = gameState;

  return (
    <div className="game-board">
      <div className="game-center">
        <ScoreBoard roundInfo={roundInfo} doraIndicators={doraIndicators} wallRemaining={wall.length} riichiSticks={roundInfo.riichiSticks} />
      </div>

      <div className="player-area south">
        <div className="player-name">
          {players[0].name}
          {players[0].riichi && <span className="riichi-badge"> 立直</span>}
        </div>
        <div className="player-points">{players[0].points}点</div>
        <DiscardPool discards={players[0].discards} />
        <PlayerHand hand={players[0].hand} onDiscard={onDiscard} riichi={players[0].riichi} />
      </div>

      <div className="player-area east">
        <div className="player-name">
          {players[1].name}
          {players[1].riichi && <span className="riichi-badge"> 立直</span>}
        </div>
        <AiHand hand={players[1].hand} sideways />
        <DiscardPool discards={players[1].discards} sideways />
      </div>

      <div className="player-area north">
        <div className="player-name">
          {players[2].name}
          {players[2].riichi && <span className="riichi-badge"> 立直</span>}
        </div>
        <DiscardPool discards={players[2].discards} />
        <AiHand hand={players[2].hand} />
      </div>

      <div className="player-area west">
        <div className="player-name">
          {players[3].name}
          {players[3].riichi && <span className="riichi-badge"> 立直</span>}
        </div>
        <DiscardPool discards={players[3].discards} sideways />
        <AiHand hand={players[3].hand} sideways />
      </div>

      {pendingActions.length > 0 && <ActionPanel actions={pendingActions} onAction={onAction} />}
    </div>
  );
}