import './styles/game.css';
import './styles/tiles.css';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';
import { useGame } from './hooks/useGame';

export default function App() {
  const { gameState, result, startGame, playerDiscard, playerAction, continueGame } = useGame();

  if (!gameState || gameState.phase === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div className="app">
      <GameBoard gameState={gameState} onDiscard={playerDiscard} onAction={playerAction} />
      {result && <ResultScreen result={result} onContinue={continueGame} />}
    </div>
  );
}