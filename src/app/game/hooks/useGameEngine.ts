"use client";

import { useReducer, useCallback } from 'react';
import { GameState, AgentUsageLevel } from '../types';
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

  // Handler: Test complete
  const handleTestComplete = useCallback(() => {
    dispatch({ type: 'TEST_COMPLETE' });
  }, []);

  // Handler: Deploy
  const handleDeploy = useCallback(() => {
    dispatch({ type: 'DEPLOY' });
  }, []);

  // Handler: Go back to previous screen
  const handleGoBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  // Handler: Try with Principal AI
  const handleTryPrincipal = useCallback((agentUsage: AgentUsageLevel) => {
    dispatch({ type: 'TRY_PRINCIPAL', agentUsage });
  }, []);

  // Handler: Jump to specific state (development only)
  const handleJumpToState = useCallback((state: GameState) => {
    dispatch({ type: 'JUMP_TO_STATE', state });
  }, []);

  // Return state and handlers
  return {
    state,
    handlers: {
      continue: handleContinue,
      selectUsage: handleSelectUsage,
      startTest: handleStartTest,
      testComplete: handleTestComplete,
      deploy: handleDeploy,
      goBack: handleGoBack,
      tryPrincipal: handleTryPrincipal,
      jumpToState: handleJumpToState,
    },
  };
}
