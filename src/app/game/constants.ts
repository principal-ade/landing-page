/**
 * Game flow timing constants
 * All values in milliseconds
 */
export const TIMINGS = {
  // Test phase
  TEST_COMPLETE_PAUSE: 2000,
  MAZE_FADE_IN_DELAY: 200,
  TESTING_BUTTONS_DELAY: 200,
  PATH_REVEAL_PER_CELL: 50,

  // Deploy phase
  DEPLOY_QUESTION_DELAY: 2000, // After test complete
  DEPLOY_BUTTONS_DELAY: 300,

  // Cost info phase
  COST_INFO_DELAY: 1000, // After deployment
  COST_CONTINUE_BUTTON_DELAY: 300,

  // Revenue and incident phase
  REVENUE_MESSAGE_PAUSE: 2500, // Time to read "Users are flowing through..."
  REVENUE_TO_INCIDENT_DELAY: 3000, // Time to see revenue accumulating

  // Typewriter speeds (ms per character)
  TYPEWRITER: {
    HEADING: 50,
    PARAGRAPH: 30,
    QUESTION: 40,
    BODY_TEXT: 35,
  },

  // Testing phase typewriter delays
  TESTING_LINE_DELAYS: {
    LINE_1: 100,
    LINE_2: 100,
    LINE_3: 100,
  },

  // Slider interaction
  SLIDER_CONTINUE_DELAY: 300,

  // Principal AI automation
  PRINCIPAL_CLICK_INTERVAL: 300,
} as const;

/**
 * Game cost constants
 * All values in dollars
 */
export const COSTS = {
  INCIDENT_PER_SECOND: 225, // Average of $150-$300 range
  MANUAL_INSPECTION: 500, // Cost per cell click
} as const;

/**
 * Maze configuration constants
 */
export const MAZE_CONFIG = {
  GRID_SIZE: 10,
  CELL_SIZE: 30,
  PADDING: 50,
  BASE_WIDTH: 450,
  BASE_HEIGHT: 620,

  // Start and destination positions
  START_COL: 0,
  START_ROW: 0,
  DEST_COL: 9,
  DEST_ROW: 9,

  // Hint frequency
  HINT_EVERY_N_CLICKS: 5,

  // Blockage reveal radius
  BLOCKAGE_REVEAL_RADIUS: 3,
} as const;
