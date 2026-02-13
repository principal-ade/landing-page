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
      conventional: [
        { text: "Testing Visualization" },
        { text: "The maze represents an execution path in your codebase." },
        { text: "Your visibility into the code during testing depends on how much you used agents during development." },
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

  deployQuestion: {
    question: "Everything looks good. Ready to deploy to production?",
    buttons: {
      back: "Back",
      deploy: "DEPLOY",
    },
  },

  costInfo: {
    lines: {
      common: [
        { text: "Once you deploy to production it can be hard to remember what your code looks like or see into its execution." },
      ],
      conventional: { text: "Using conventional telemetry can often not be as useful in practice as it is in theory." },
      principal: { text: "With story based telemetry, we ensure your codebase has the telemetry necessary to understand what is supposed to happen." },
      final: { text: "On average, production incidents cost companies $220 per second in lost revenue and engineering time." },
    },
    button: "Continue",
  },

  deployedRunning: {
    heading: "Production",
    text: "Your app is running smoothly in production. Revenue is accumulating...",
    button: "Continue",
  },

  incidentActive: {
    heading: "Production Incident",
    conventional: {
      text: "An error is blocking your users! Click cells to search for the bug.",
      foundText: "You found the bug! Click to fix the issue.",
    },
    principal: {
      text: "An error is blocking your users! Principal AI's story-based telemetry automatically identifies the issue.",
      foundText: "Principal AI found the bug! Click to approve the fix.",
    },
    hint: "Direction hint will appear every 5 clicks",
    buttons: {
      fix: "Fix",
      approveFix: "Approve Fix",
    },
  },

  incidentResolved: {
    heading: "Incident Resolved",
    conventional: {
      text: "You found the bug and fixed the issue!",
    },
    principal: {
      text: "Principal AI identified and helped resolve the issue in seconds!",
    },
    buttons: {
      scheduleCall: "Schedule a call",
      tryPrincipal: "Try with Principal AI",
      playAgain: "Play Again",
    },
  },
} as const;
