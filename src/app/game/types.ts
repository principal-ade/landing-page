/**
 * Domain types for Game v2
 * Using tagged unions to prevent impossible states
 */

// Value Objects
export type AgentUsageLevel = 25 | 50 | 75;
export type GameMode = 'conventional' | 'principal';

// Game State - Tagged Union Pattern
export type GameState =
  | { phase: 'start' }
  | { phase: 'agentQuestion'; selection: AgentUsageLevel | null }
  | { phase: 'testing'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'testing-running'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'test-complete'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'deploy-question'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'cost-info'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'deployed-running'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'incident-active'; mode: GameMode; agentUsage: AgentUsageLevel }
  | { phase: 'incident-resolved'; mode: GameMode; agentUsage: AgentUsageLevel };

// Events that can transition between states
export type GameEvent =
  | { type: 'CONTINUE' }
  | { type: 'SELECT_USAGE'; value: AgentUsageLevel }
  | { type: 'START_TEST' }
  | { type: 'TEST_COMPLETE' }
  | { type: 'DEPLOY' }
  | { type: 'GO_BACK' }
  | { type: 'TRY_PRINCIPAL'; agentUsage: AgentUsageLevel }
  | { type: 'JUMP_TO_STATE'; state: GameState };

// Typewriter result
export interface TypewriterResult {
  displayedText: string;
  isComplete: boolean;
}

export interface SequentialTypewriterResult {
  lines: TypewriterResult[];
  allComplete: boolean;
  currentLineIndex: number;
}

// Configuration types
export interface GameConfig {
  timings: {
    typewriterSpeed: {
      heading: number;
      body: number;
      question: number;
    };
    lineDelays: {
      line2: number;
      line3: number;
    };
  };
}

export interface ContentLine {
  text: string;
  speed: number;
}
