import { AgentUsageLevel } from '../types';

/**
 * Game content - all text in one place for easy editing and i18n
 */
export const GAME_CONTENT = {
  start: {
    lines: [
      { text: "You are a software developer in 2026" },
      { text: "Your code works locally and you are ready to deploy to production." },
    ],
    button: "Continue",
  },

  agentQuestion: {
    question: "How much do you use agents to develop your software?",
    options: [
      { label: "A little", value: 25 as AgentUsageLevel },
      { label: "Moderately", value: 50 as AgentUsageLevel },
      { label: "A lot", value: 75 as AgentUsageLevel },
    ],
    button: "Continue",
  },

  testing: {
    lines: {
      agentic: [
        { text: "Testing Visualization" },
        { text: "The maze represents an execution path in your codebase." },
        { text: "Your visibility into the code during testing depends on how much you used agents during development." },
        { text: "Higher agent usage generally translates to less insight into the details of the execution path." },
      ],
      principal: [
        { text: "Testing Visualization" },
        { text: "The maze represents an execution path in your codebase." },
        { text: "Watch how Principal AI instruments your code with telemetry to understand the complete execution path." },
      ],
    },
    buttons: {
      back: "Back",
      testLocally: "Test Locally",
    },
  },
} as const;
