"use client";

import { useReducer, useCallback } from 'react';
import { GameState, GameEvent, AgentUsageLevel } from '../types';
import { gameStateReducer, initialGameState } from '../state-machine/gameStateMachine';

/**
 * Game Engine Hook
 * Central orchestrator for game state and business logic
 */
export function useGameEngine() {
  const [state, dispatch] = useReducer(gameStateReducer, initialGameState);

  // Handler: Continue from start screen
  const handleContinue = useCallback(() => {
    dispatch({ type: 'CONTINUE' });
  }, []);

  // Handler: Select agent usage level
  const handleSelectUsage = useCallback((value: AgentUsageLevel) => {
    dispatch({ type: 'SELECT_USAGE', value });
  }, []);

  // Handler: Start test
  const handleStartTest = useCallback(() => {
    dispatch({ type: 'START_TEST' });
  }, []);

  // Handler: Go back to previous screen
  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  // Return state and handlers
  return {
    state,
    handlers: {
      continue: handleContinue,
      selectUsage: handleSelectUsage,
      startTest: handleStartTest,
      goBack: handleGoBack,
    },
  };
}
