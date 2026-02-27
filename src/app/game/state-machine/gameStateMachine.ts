import { GameState, GameEvent, GameMode, AgentUsageLevel } from '../types';

/**
 * State machine for game flow
 * Uses reducer pattern for predictable state transitions
 */

// Helper to determine mode from agent usage
function determineMode(_agentUsage: AgentUsageLevel): GameMode {
  // All non-Principal usage is conventional
  return 'conventional';
}

// Initial state
export const initialGameState: GameState = {
  phase: 'start',
};

// State transition reducer
export function gameStateReducer(state: GameState, event: GameEvent): GameState {
  // Handle JUMP_TO_STATE event (for development only)
  if (event.type === 'JUMP_TO_STATE') {
    return event.state;
  }

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
          agentUsage: state.selection,
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
      if (event.type === 'START_TEST') {
        return { phase: 'testing-running', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'testing-running':
      if (event.type === 'TEST_COMPLETE') {
        return { phase: 'test-complete', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'test-complete':
      if (event.type === 'CONTINUE') {
        return { phase: 'deploy-question', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'deploy-question':
      if (event.type === 'DEPLOY') {
        return { phase: 'cost-info', mode: state.mode, agentUsage: state.agentUsage };
      }
      if (event.type === 'GO_BACK') {
        return { phase: 'test-complete', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'cost-info':
      if (event.type === 'CONTINUE') {
        return { phase: 'deployed-running', mode: state.mode, agentUsage: state.agentUsage };
      }
      if (event.type === 'GO_BACK') {
        return { phase: 'deploy-question', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'deployed-running':
      if (event.type === 'CONTINUE') {
        return { phase: 'incident-active', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'incident-active':
      if (event.type === 'CONTINUE') {
        return { phase: 'incident-resolved', mode: state.mode, agentUsage: state.agentUsage };
      }
      break;

    case 'incident-resolved':
      if (event.type === 'TRY_PRINCIPAL') {
        return { phase: 'testing', mode: 'principal', agentUsage: event.agentUsage };
      }
      // End of game flow for now
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
): state is { phase: 'testing'; mode: GameMode; agentUsage: AgentUsageLevel } {
  return state.phase === 'testing';
}
