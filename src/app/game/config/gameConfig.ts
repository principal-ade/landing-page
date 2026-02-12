import { GameConfig } from '../types';

/**
 * Game configuration - centralized constants
 */
export const GAME_CONFIG: GameConfig = {
  timings: {
    typewriterSpeed: {
      heading: 50,
      body: 30,
      question: 40,
    },
    lineDelays: {
      line2: 200,
      line3: 100,
    },
  },
} as const;
