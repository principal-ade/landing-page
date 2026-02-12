import { GameState, GameEvent, GameMode, AgentUsageLevel } from '../types';

/**
 * State machine for game flow
 * Uses reducer pattern for predictable state transitions
 */

// Helper to determine mode from agent usage
function determineMode(agentUsage: AgentUsageLevel): GameMode {
  // For now, map all non-zero usage to 'agentic'
  // Later we can make this more sophisticated
  return 'agentic';
}

// Initial state
export const initialGameState: GameState = {
  phase: 'start',
};

// State transition reducer
export function gameStateReducer(state: GameState, event: GameEvent): GameState {
  switch (state.phase) {
    case 'start':
      if (event.type === 'CONTINUE') {
        return { phase: 'agentQuestion', selection: null };
      }
      break;

    case 'agentQuestion':
      if (event.type === 'SELECT_USAGE') {
        return {
          phase: 'agentQuestion',
          selection: event.value,
        };
      }
      if (event.type === 'CONTINUE' && state.selection !== null) {
        return {
          phase: 'testing',
          mode: determineMode(state.selection),
        };
      }
      if (event.type === 'GO_BACK') {
        return { phase: 'start' };
      }
      break;

    case 'testing':
      if (event.type === 'GO_BACK') {
        return { phase: 'agentQuestion', selection: null };
      }
      // Will add START_TEST handler later for phase 2
      break;
  }

  // No valid transition - return current state
  return state;
}

// Helper to check if a transition is valid
export function canTransition(state: GameState, event: GameEvent): boolean {
  const nextState = gameStateReducer(state, event);
  return nextState !== state;
}

// Type guard helpers
export function isStartPhase(state: GameState): state is { phase: 'start' } {
  return state.phase === 'start';
}

export function isAgentQuestionPhase(
  state: GameState
): state is { phase: 'agentQuestion'; selection: AgentUsageLevel | null } {
  return state.phase === 'agentQuestion';
}

export function isTestingPhase(
  state: GameState
): state is { phase: 'testing'; mode: GameMode } {
  return state.phase === 'testing';
}
