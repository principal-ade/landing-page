/**
 * Game flow state machine
 * Represents the current phase of the user journey through the game
 */
export type GameFlowState =
  | 'start' // Initial intro screen
  | 'agent-question' // Asking about agent usage
  | 'testing-intro' // Showing testing visualization intro text
  | 'testing-running' // Test path animation in progress
  | 'test-complete' // Test complete message
  | 'deploy-question' // Asking if ready to deploy
  | 'cost-info' // Showing incident cost information
  | 'deployed-running' // Deployed, revenue accumulating
  | 'incident-active' // Incident happening, user searching
  | 'incident-resolved' // Blockage found, showing results
  | 'principal-comparison'; // Showing Principal AI comparison

/**
 * Flow state transitions
 * Maps current state to possible next states
 */
export const FLOW_TRANSITIONS: Record<GameFlowState, GameFlowState[]> = {
  'start': ['agent-question'],
  'agent-question': ['testing-intro'],
  'testing-intro': ['testing-running'],
  'testing-running': ['test-complete'],
  'test-complete': ['deploy-question'],
  'deploy-question': ['cost-info'],
  'cost-info': ['deployed-running'],
  'deployed-running': ['incident-active'],
  'incident-active': ['incident-resolved'],
  'incident-resolved': ['principal-comparison', 'start', 'testing-intro'], // Can go to comparison, try again, or principal mode
  'principal-comparison': ['start'], // Can only restart from here
};

/**
 * Helper to check if a state transition is valid
 */
export function isValidTransition(from: GameFlowState, to: GameFlowState): boolean {
  return FLOW_TRANSITIONS[from].includes(to);
}
