import { useState, useCallback, useRef } from 'react';
import { createGame, dealTiles, discardTile, nextTurn, advanceRound } from '../core/game';
import { calculateShanten, isWinningHand, checkYaku, countHan, countFu, calculatePoints, findMentsuDecompositions } from '../core/validator';
import { aiDecideDiscard, aiDecideRiichi } from '../ai/strategy';
import { aiDecideReaction, aiDecideTsumoAction } from '../ai/reaction';
import { getAllHandTiles } from '../core/hand';
import { doraFromIndicator, isMenzenchin } from '../core/rules';

export function useGame() {
  const [gameState, setGameState] = useState(null);
  const [result, setResult] = useState(null);
  const aiTimeoutRef = useRef(null);

  const startGame = useCallback((seed) => {
    const game = createGame(seed);
    const dealt = dealTiles(game);
    setGameState(dealt);
    setResult(null);

    if (dealt.players[dealt.currentTurn].id !== 0) {
      scheduleAiAction(dealt);
    }
  }, []);

  const scheduleAiAction = useCallback((game) => {
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    const delay = 300 + Math.random() * 500;
    aiTimeoutRef.current = setTimeout(() => processAiTurn(game), delay);
  }, []);

  const processAiTurn = useCallback((game) => {
    const currentPlayer = game.players[game.currentTurn];
    if (currentPlayer.id === 0) return;

    if (currentPlayer.hand.drawnTile) {
      const allTiles = getAllHandTiles(currentPlayer.hand);
      if (isWinningHand(allTiles)) {
        handleWin(game, game.currentTurn, true);
        return;
      }
    }

    const allTiles = getAllHandTiles(currentPlayer.hand);
    const allKnown = game.players.flatMap(p => p.discards);
    const discard = aiDecideDiscard(currentPlayer.hand, [...allTiles, ...allKnown], game);

    if (!discard) return;

    const shanten = calculateShanten(allTiles, currentPlayer.hand.calls);
    const shouldRiichi = !currentPlayer.riichi && shanten <= 0 && isMenzenchin(currentPlayer.hand.calls);

    let newGame = discardTile(game, game.currentTurn, discard.id);

    if (shouldRiichi) {
      newGame.players[game.currentTurn] = {
        ...newGame.players[game.currentTurn],
        riichi: true,
        points: newGame.players[game.currentTurn].points - 1000,
      };
      newGame.roundInfo = { ...newGame.roundInfo, riichiSticks: newGame.roundInfo.riichiSticks + 1 };
    }

    checkReactions(newGame);
  }, []);

  const checkReactions = useCallback((game) => {
    const discarded = game.lastDiscard;
    if (!discarded) {
      const next = nextTurn(game);
      setGameState(next);
      if (next.players[next.currentTurn].id !== 0) scheduleAiAction(next);
      return;
    }

    for (let i = 0; i < 4; i++) {
      if (i === game.currentTurn) continue;
      if (i === 0) continue; // Skip player reaction for now (simplified)

      const player = game.players[i];
      const reaction = aiDecideReaction(player.hand, discarded, i, game);

      if (reaction.type === 'ron') {
        handleWin(game, i, false);
        return;
      }
    }

    const next = nextTurn(game);
    setGameState(next);
    if (next.players[next.currentTurn].id !== 0) scheduleAiAction(next);
  }, []);

  const playerDiscard = useCallback((tile) => {
    if (!gameState || gameState.currentTurn !== 0) return;

    const newGame = discardTile(gameState, 0, tile.id);
    setGameState(newGame);
    checkReactions(newGame);
  }, [gameState]);

  const playerAction = useCallback((action) => {
    if (action.type === 'skip') {
      const next = nextTurn(gameState);
      setGameState(next);
      if (next.players[next.currentTurn].id !== 0) scheduleAiAction(next);
      return;
    }
    if (action.type === 'tsumo') {
      handleWin(gameState, 0, true);
      return;
    }
    if (action.type === 'ron') {
      handleWin(gameState, 0, false);
      return;
    }
    const next = nextTurn(gameState);
    setGameState(next);
  }, [gameState]);

  const handleWin = useCallback((game, winnerId, isTsumo) => {
    const winner = game.players[winnerId];
    const allTiles = getAllHandTiles(winner.hand);
    const doraTiles = game.doraIndicators ? game.doraIndicators.map(ind => doraFromIndicator(ind)) : [];

    const yaku = checkYaku(allTiles, winner.hand.calls, game.roundInfo, doraTiles);
    const totalHan = countHan(yaku);

    let fu = 30;
    if (totalHan <= 4) {
      const decompositions = findMentsuDecompositions(allTiles);
      if (decompositions.length > 0) {
        fu = countFu(decompositions[0], isTsumo, winner.hand.calls);
      }
    }

    const points = calculatePoints(totalHan, fu, winner.isDealer);
    const pointsChange = {};
    game.players.forEach(p => {
      pointsChange[p.name] = p.id === winnerId ? 8000 : -2000;
    });

    setResult({
      type: isTsumo ? 'tsumo' : 'ron',
      winner: winner.name,
      loser: isTsumo ? null : game.players[game.currentTurn]?.name,
      yaku, totalHan, fu, pointsChange,
    });
  }, []);

  const continueGame = useCallback(() => {
    setResult(null);
    const newSeed = gameState.seed + 1;
    const newGame = createGame(newSeed);
    const dealt = dealTiles(newGame);
    setGameState(dealt);
    if (dealt.players[dealt.currentTurn].id !== 0) scheduleAiAction(dealt);
  }, [gameState]);

  return { gameState, result, startGame, playerDiscard, playerAction, continueGame };
}