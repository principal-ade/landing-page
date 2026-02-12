"use client";

import React, { useState, useEffect, useMemo } from "react";
import ClientThemeProvider from "@/components/providers/ClientThemeProvider";
import { useTheme } from "@principal-ade/industry-theme";
import { useMazeGame } from "@/hooks/useMazeGame";
import { TIMINGS } from "./constants";
import { GameFlowState } from "./types";
import { useSequentialTypewriter } from "@/hooks/useSequentialTypewriter";
import { ProgressTracker } from "@/components/game/ProgressTracker";
import { TextPanel } from "@/components/game/TextPanel";
import { MazePanel } from "@/components/game/MazePanel";

// Typewriter effect hook
function useTypewriter(text: string, speed: number = 50, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayedText, isComplete };
}

function GameContent() {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Fixed incident cost per second (average of range)
  const incidentCostPerSecond = 225;

  // Revenue control state (needs to be declared before useMazeGame)
  const [startRevenue, setStartRevenue] = useState(false);

  const gameState = useMazeGame({
    incidentCostPerSecond: incidentCostPerSecond,
    startRevenue: startRevenue
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const {
    mode,
    handleTestLocally,
    handleDeploy,
    startIncident,
    handleTryPrincipal,
    handleTryAgain,
    handleCellClick,
    setMode,
    deployed,
    started,
    testedLocally,
    testPath,
    revealedPathIndex,
    blockageFound,
    incidentCost,
    incidentDurationSeconds,
    previousIncidentCost,
    previousIncidentDuration,
  } = gameState;

  // Game flow state machine
  const [flowState, setFlowState] = useState<GameFlowState>('start');

  // Agent usage state (0 = unselected, 25 = a little, 50 = moderately, 75 = a lot)
  const [agentUsage, setAgentUsage] = useState(0);

  // Derived UI states from flowState
  const showSlider = flowState === 'agent-question';
  const showContinueButton = flowState === 'agent-question' && (agentUsage === 25 || agentUsage === 50 || agentUsage === 75);
  const showTestComplete = flowState === 'test-complete';
  const showDeployQuestion = flowState === 'deploy-question';
  const showDeployButtons = flowState === 'deploy-question';
  const showCostInfo = flowState === 'cost-info';
  const continueClicked = flowState === 'deployed-running' || flowState === 'incident-active' || flowState === 'incident-resolved';

  // Typewriter text for start screen - using sequential typewriter
  const startLineConfigs = useMemo(() => [
    { text: "You are a software developer in 2026", speed: TIMINGS.TYPEWRITER.HEADING },
    { text: "Your code works locally and you are ready to deploy to production.", speed: TIMINGS.TYPEWRITER.PARAGRAPH },
  ], []);

  const startLines = useSequentialTypewriter(
    flowState === 'start',
    startLineConfigs,
    200
  );

  // Typewriter text for agent question screen
  const agentQuestionText = "How much do you use agents to develop your software?";
  const agentQuestion = useTypewriter(flowState === 'agent-question' ? agentQuestionText : '', TIMINGS.TYPEWRITER.HEADING, 0);

  // Typewriter text for deploy question
  const deployQuestionText = "Everything looks good. Ready to deploy to production?";
  const deployQuestion = useTypewriter(flowState === 'deploy-question' ? deployQuestionText : '', TIMINGS.TYPEWRITER.QUESTION, 0);

  // Typewriter text for cost info (after deployment) - using sequential typewriter
  const costInfoLineConfigs = useMemo(() => [
    { text: "Once you deploy to production it can be hard to remember what your code looks like or see into its execution.", speed: TIMINGS.TYPEWRITER.BODY_TEXT },
    {
      text: mode === 'principal'
        ? "With story based telemetry, we ensure your codebase has the telemetry necessary to understand what is supposed to happen."
        : "Using conventional telemetry can often not be as useful in practice as it is in theory.",
      speed: TIMINGS.TYPEWRITER.BODY_TEXT
    },
    { text: "On average, production incidents cost companies $225 per second in lost revenue and engineering time.", speed: TIMINGS.TYPEWRITER.BODY_TEXT },
  ], [mode]);

  const costInfoLines = useSequentialTypewriter(
    flowState === 'cost-info',
    costInfoLineConfigs,
    TIMINGS.TESTING_LINE_DELAYS.LINE_2
  );

  // Typewriter text for deployed running phase - using sequential typewriter
  const deployedLineConfigs = useMemo(() => [
    { text: "✓ Deployed successfully", speed: TIMINGS.TYPEWRITER.BODY_TEXT },
    { text: "Users are flowing through. Revenue is coming in. Everything is working perfectly...", speed: TIMINGS.TYPEWRITER.BODY_TEXT },
  ], []);

  const deployedLines = useSequentialTypewriter(
    flowState === 'deployed-running',
    deployedLineConfigs,
    TIMINGS.TESTING_LINE_DELAYS.LINE_2
  );

  // Typewriter text for incident phase - using sequential typewriter
  const [showIncidentCostBox, setShowIncidentCostBox] = useState(false);

  const incidentLine2Regular = "Find the blockage in production. Click cells to inspect the system.";
  const incidentLine2Principal = "With story based telemetry, we ensure your codebase has the telemetry necessary to understand what is supposed to happen.";

  const incidentLineConfigs = useMemo(() => [
    { text: "🚨 INCIDENT: Users can't complete checkout", speed: TIMINGS.TYPEWRITER.BODY_TEXT },
    { text: mode === 'principal' ? incidentLine2Principal : incidentLine2Regular, speed: TIMINGS.TYPEWRITER.BODY_TEXT },
  ], [mode]);

  const incidentLines = useSequentialTypewriter(
    flowState === 'incident-active',
    incidentLineConfigs,
    TIMINGS.TESTING_LINE_DELAYS.LINE_2
  );

  // Show cost box after all incident lines complete
  useEffect(() => {
    if (flowState === 'incident-active' && incidentLines.allComplete && !showIncidentCostBox) {
      const timer = setTimeout(() => setShowIncidentCostBox(true), 300);
      return () => clearTimeout(timer);
    } else if (flowState !== 'incident-active') {
      setShowIncidentCostBox(false);
    }
  }, [flowState, incidentLines.allComplete, showIncidentCostBox]);

  // Typewriter text for testing phase - using sequential typewriter
  const showTestingText = flowState === 'testing-intro';
  const [showTestingButtons, setShowTestingButtons] = useState(false);
  const [showMaze, setShowMaze] = useState(false);

  const testingLine2Regular = "Your visibility into the code during testing depends on how much you used agents during development.";
  const testingLine3Regular = "Higher agent usage generally translates to less insight into the details of the execution path.";
  const testingLinePrincipal = "Watch how Principal AI instruments your code with telemetry to understand the complete execution path.";

  const testingLineConfigs = useMemo(() => {
    const lines = [
      { text: "Testing Visualization", speed: TIMINGS.TYPEWRITER.HEADING },
      { text: "The maze represents an execution path in your codebase.", speed: TIMINGS.TYPEWRITER.QUESTION },
      { text: mode === 'principal' ? testingLinePrincipal : testingLine2Regular, speed: TIMINGS.TYPEWRITER.BODY_TEXT },
    ];

    // Add third line only for non-principal mode
    if (mode !== 'principal') {
      lines.push({ text: testingLine3Regular, speed: TIMINGS.TYPEWRITER.BODY_TEXT });
    }

    return lines;
  }, [mode]);

  const testingLines = useSequentialTypewriter(
    showTestingText,
    testingLineConfigs,
    TIMINGS.TESTING_LINE_DELAYS.LINE_2
  );

  // Show maze after second line (index 1) completes
  useEffect(() => {
    if (showTestingText && testingLines.lines[1]?.isComplete && !showMaze) {
      const timer = setTimeout(() => setShowMaze(true), TIMINGS.MAZE_FADE_IN_DELAY);
      return () => clearTimeout(timer);
    } else if (!showTestingText) {
      setShowMaze(false);
    }
  }, [showTestingText, testingLines.lines, showMaze]);

  // Show buttons after all lines complete
  useEffect(() => {
    if (showTestingText && testingLines.allComplete && !showTestingButtons) {
      const timer = setTimeout(() => setShowTestingButtons(true), TIMINGS.TESTING_BUTTONS_DELAY);
      return () => clearTimeout(timer);
    } else if (!showTestingText) {
      setShowTestingButtons(false);
    }
  }, [showTestingText, testingLines.allComplete, showTestingButtons]);

  // Transition from testing-running to test-complete when test finishes
  useEffect(() => {
    if (flowState === 'testing-running' && testedLocally && revealedPathIndex >= testPath.length) {
      setFlowState('test-complete');
    }
  }, [flowState, testedLocally, revealedPathIndex, testPath.length]);

  // Transition from test-complete to deploy-question after pause
  useEffect(() => {
    if (flowState === 'test-complete') {
      const timer = setTimeout(() => setFlowState('deploy-question'), TIMINGS.TEST_COMPLETE_PAUSE);
      return () => clearTimeout(timer);
    }
  }, [flowState]);

  // Transition from deploy-question to cost-info after deployment
  useEffect(() => {
    if (flowState === 'deploy-question' && deployed) {
      const timer = setTimeout(() => setFlowState('cost-info'), TIMINGS.COST_INFO_DELAY);
      return () => clearTimeout(timer);
    }
  }, [flowState, deployed]);

  // Transition from cost-info to deployed-running when Continue is clicked
  useEffect(() => {
    if (flowState === 'deployed-running' && !startRevenue) {
      const timer = setTimeout(() => setStartRevenue(true), TIMINGS.REVENUE_MESSAGE_PAUSE);
      return () => clearTimeout(timer);
    } else if (flowState !== 'deployed-running' && flowState !== 'incident-active' && flowState !== 'incident-resolved') {
      setStartRevenue(false);
    }
  }, [flowState, startRevenue]);

  // Transition from deployed-running to incident-active after revenue accumulates
  useEffect(() => {
    if (flowState === 'deployed-running' && startRevenue) {
      const timer = setTimeout(() => {
        startIncident();
        setFlowState('incident-active');
      }, TIMINGS.REVENUE_TO_INCIDENT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [flowState, startRevenue, startIncident]);

  // Transition from incident-active to incident-resolved when blockage found
  useEffect(() => {
    if (flowState === 'incident-active' && blockageFound) {
      setFlowState('incident-resolved');
    }
  }, [flowState, blockageFound]);

  // Reset agent usage selection when entering agent-question step
  useEffect(() => {
    if (flowState === 'agent-question') {
      setAgentUsage(0);
    }
  }, [flowState]);

  // Handle slider interaction
  const handleSliderChange = (value: number) => {
    setAgentUsage(value);
  };

  // Handle navigation from progress tracker
  const handleNavigate = (targetState: GameFlowState) => {
    // Jumping to start - reset everything
    if (targetState === 'start') {
      handleTryAgain();
      setFlowState('start');
      return;
    }

    // Jumping to agent question - reset mode so maze disappears
    if (targetState === 'agent-question') {
      setMode('initial');
      setFlowState('agent-question');
      return;
    }

    // Jumping to testing - need to have mode set
    if (targetState === 'testing-intro') {
      if (mode === 'initial' || mode === 'start') {
        setMode('agentic'); // Default to agentic mode if not set
      }
      setFlowState('testing-intro');
      return;
    }

    // Jumping to deploy - need to have completed test
    if (targetState === 'deploy-question') {
      if (!testedLocally) {
        // Fast-forward through testing
        handleTestLocally();
        setTimeout(() => {
          setFlowState('deploy-question');
        }, 100);
      } else {
        setFlowState('deploy-question');
      }
      return;
    }

    // Jumping to production - need to have deployed
    if (targetState === 'deployed-running') {
      if (!deployed) {
        handleDeploy();
        setTimeout(() => {
          setFlowState('deployed-running');
        }, 100);
      } else {
        setFlowState('deployed-running');
      }
      return;
    }

    // Jumping to incident - need to be deployed
    if (targetState === 'incident-active') {
      if (!started) {
        startIncident();
      }
      setFlowState('incident-active');
      return;
    }

    // Jumping to resolved - only if incident was started
    if (targetState === 'incident-resolved' && started) {
      setFlowState('incident-resolved');
      return;
    }

    // Default: just set the flow state
    setFlowState(targetState);
  };

  // Removed renderTextPanel function - now using TextPanel component
  // See TextPanel.tsx for the text rendering logic
  const _renderTextPanel_removed = () => {
    // 1. Initial screen - just intro
    if (flowState === 'start') {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            maxWidth: isMobile ? "500px" : "600px",
            padding: isMobile ? "0" : "20px 0",
          }}
        >
          <div>
            {/* Line 0: Heading */}
            <h1
              style={{
                fontSize: isMobile ? theme.fontSizes[6] : theme.fontSizes[7],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.primary,
                marginBottom: "24px",
                fontFamily: theme.fonts.heading,
                lineHeight: 1.2,
              }}
            >
              {startLines.lines[0]?.displayedText}
              {startLines.lines[0]?.displayedText && !startLines.lines[0]?.isComplete && (
                <span
                  style={{
                    animation: 'blink 1s infinite',
                    marginLeft: '2px',
                  }}
                >
                  |
                </span>
              )}
            </h1>
            {/* Line 1: Paragraph */}
            <p
              style={{
                fontSize: isMobile ? theme.fontSizes[3] : theme.fontSizes[4],
                color: theme.colors.text,
                lineHeight: 1.6,
                fontFamily: theme.fonts.body,
                opacity: 0.9,
                minHeight: '4.8em', // Prevent layout shift
              }}
            >
              {startLines.lines[1]?.displayedText}
              {startLines.lines[1]?.displayedText && !startLines.lines[1]?.isComplete && (
                <span
                  style={{
                    animation: 'blink 1s infinite',
                    marginLeft: '2px',
                  }}
                >
                  |
                </span>
              )}
            </p>
          </div>

          {startLines.allComplete && (
            <button
              onClick={() => setFlowState('agent-question')}
              style={{
                padding: isMobile ? '12px 24px' : '16px 40px',
                background: theme.colors.primary,
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                transition: 'all 0.2s ease',
                animation: 'fadeIn 0.5s ease-in',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Continue
            </button>
          )}
        </div>
      );
    }

    // 2. Slider question screen
    if (flowState === 'agent-question') {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            maxWidth: isMobile ? "500px" : "600px",
            padding: isMobile ? "0" : "20px 0",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.primary,
                marginBottom: "32px",
                fontFamily: theme.fonts.heading,
                lineHeight: 1.2,
                minHeight: '1.5em',
              }}
            >
              {agentQuestion.displayedText}
              {!agentQuestion.isComplete && (
                <span
                  style={{
                    animation: 'blink 1s infinite',
                    marginLeft: '2px',
                  }}
                >
                  |
                </span>
              )}
            </h2>
          </div>

          {/* Slider */}
          {showSlider && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'fadeIn 0.5s ease-in',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                }}>
                  A little
                </span>
                <span style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                }}>
                  A lot
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={agentUsage}
                onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: `linear-gradient(to right, ${theme.colors.secondary} 0%, ${theme.colors.primary} ${agentUsage}%, ${theme.colors.primary}40 ${agentUsage}%, ${theme.colors.primary}40 100%)`,
                  outline: 'none',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer',
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  appearance: none;
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${theme.colors.primary};
                  cursor: pointer;
                  box-shadow: 0 2px 8px ${theme.colors.primary}60;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background: ${theme.colors.primary};
                  cursor: pointer;
                  border: none;
                  box-shadow: 0 2px 8px ${theme.colors.primary}60;
                }
              `}</style>
            </div>
          )}

          {/* Continue button */}
          {showContinueButton && (
            <button
              onClick={() => {
                // Set mode based on slider value
                // For now, use 'agentic' as the mode - we'll adjust the opacity based on agentUsage
                setMode('agentic');
                setFlowState('testing-intro');
              }}
              style={{
                padding: isMobile ? '12px 24px' : '16px 40px',
                background: theme.colors.primary,
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                cursor: 'pointer',
                fontFamily: theme.fonts.body,
                transition: 'all 0.2s ease',
                animation: 'fadeIn 0.5s ease-in',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Continue
            </button>
          )}
        </div>
      );
    }

    // 3. During testing/deployment/incident
    if (mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') {
      return (
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            maxWidth: isMobile ? "500px" : "480px",
            padding: isMobile ? "0" : "20px 0",
          }}
        >
          {/* Testing phase */}
          {!testedLocally && !deployed && (
            <div>
              {/* Line 0: Heading */}
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                {testingLines.lines[0]?.displayedText}
                {testingLines.lines[0]?.displayedText && !testingLines.lines[0]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </h2>
              {/* Line 1: Maze description */}
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.text,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  minHeight: '1.6em',
                }}
              >
                {testingLines.lines[1]?.displayedText}
                {testingLines.lines[1]?.displayedText && !testingLines.lines[1]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>
              {/* Line 2: Mode-specific explanation */}
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                  marginBottom: mode === 'principal' ? "24px" : "8px",
                  minHeight: '1.5em',
                }}
              >
                {testingLines.lines[2]?.displayedText}
                {testingLines.lines[2]?.displayedText && !testingLines.lines[2]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>
              {/* Line 3: Additional info (non-principal only) */}
              {mode !== 'principal' && testingLines.lines[3] && (
                <p
                  style={{
                    fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                    color: theme.colors.text,
                    lineHeight: 1.5,
                    fontFamily: theme.fonts.body,
                    opacity: 0.7,
                    marginBottom: "24px",
                    minHeight: '1.5em',
                  }}
                >
                  {testingLines.lines[3]?.displayedText}
                  {testingLines.lines[3]?.displayedText && !testingLines.lines[3]?.isComplete && (
                    <span
                      style={{
                        animation: 'blink 1s infinite',
                        marginLeft: '2px',
                      }}
                    >
                      |
                    </span>
                  )}
                </p>
              )}
              {showTestingButtons && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexDirection: isMobile ? 'column' : 'row',
                  animation: 'fadeIn 0.5s ease-in',
                }}>
                  <button
                    onClick={() => setFlowState('agent-question')}
                    style={{
                      padding: isMobile ? '14px 28px' : '16px 40px',
                      background: theme.colors.primary,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.text,
                      cursor: 'pointer',
                      fontFamily: theme.fonts.body,
                      transition: 'all 0.2s ease',
                      opacity: 0.3,
                      minWidth: isMobile ? '200px' : '140px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.3';
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      handleTestLocally();
                      setFlowState('testing-running');
                    }}
                    style={{
                      padding: isMobile ? '14px 28px' : '16px 40px',
                      background: theme.colors.primary,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.text,
                      cursor: 'pointer',
                      fontFamily: theme.fonts.body,
                      transition: 'all 0.2s ease',
                      minWidth: isMobile ? '200px' : '140px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Test Locally
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Testing in progress */}
          {testedLocally && revealedPathIndex < testPath.length && !deployed && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Testing Visualization
              </h2>
              <div style={{
                background: theme.colors.primary,
                padding: '16px 24px',
                borderRadius: '8px',
                opacity: 0.9,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.body,
                }}>
                  Testing...
                </div>
              </div>
            </div>
          )}

          {/* Test complete message */}
          {showTestComplete && !showDeployQuestion && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Testing Visualization
              </h2>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.success,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  fontWeight: theme.fontWeights.bold,
                }}
              >
                Test Complete: Your code is working locally
              </p>
            </div>
          )}

          {/* Deploy question */}
          {showDeployQuestion && !deployed && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Testing Visualization
              </h2>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.text,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "24px",
                  minHeight: '1.6em',
                }}
              >
                {deployQuestion.displayedText}
                {deployQuestion.displayedText && !deployQuestion.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>

              {/* Deploy buttons */}
              {showDeployButtons && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  flexDirection: isMobile ? 'column' : 'row',
                  animation: 'fadeIn 0.5s ease-in',
                }}>
                  <button
                    onClick={() => setFlowState('agent-question')}
                    style={{
                      padding: isMobile ? '14px 28px' : '16px 40px',
                      background: theme.colors.primary,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.text,
                      cursor: 'pointer',
                      fontFamily: theme.fonts.body,
                      transition: 'all 0.2s ease',
                      opacity: 0.3,
                      minWidth: isMobile ? '200px' : '140px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.3';
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDeploy}
                    style={{
                      padding: isMobile ? '14px 28px' : '16px 40px',
                      background: theme.colors.secondary,
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.text,
                      cursor: 'pointer',
                      fontFamily: theme.fonts.body,
                      transition: 'all 0.2s ease',
                      minWidth: isMobile ? '200px' : '140px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.secondary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    DEPLOY
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cost info step (after deployment) */}
          {deployed && showCostInfo && !continueClicked && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Production
              </h2>
              {costInfoLines.lines.map((line, index) => (
                <p
                  key={index}
                  style={{
                    fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                    color: theme.colors.text,
                    lineHeight: 1.6,
                    fontFamily: theme.fonts.body,
                    opacity: 0.9,
                    marginBottom: index === costInfoLines.lines.length - 1 ? "24px" : "16px",
                    minHeight: '1.6em',
                  }}
                >
                  {line.displayedText}
                  {line.displayedText && !line.isComplete && (
                    <span
                      style={{
                        animation: 'blink 1s infinite',
                        marginLeft: '2px',
                      }}
                    >
                      |
                    </span>
                  )}
                </p>
              ))}

              {/* Continue button - show after all lines complete */}
              {costInfoLines.allComplete && (
                <button
                  onClick={() => setFlowState('deployed-running')}
                  style={{
                    padding: isMobile ? '14px 28px' : '16px 40px',
                    background: theme.colors.primary,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                    fontWeight: theme.fontWeights.bold,
                    color: theme.colors.text,
                    cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                    transition: 'all 0.2s ease',
                    animation: 'fadeIn 0.5s ease-in',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Deployed, running fine (after Continue is clicked but before incident starts) */}
          {deployed && continueClicked && !started && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Production
              </h2>
              {/* Line 1: Deployed successfully */}
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.success,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  fontWeight: theme.fontWeights.bold,
                  minHeight: '1.6em',
                }}
              >
                {deployedLines.lines[0]?.displayedText}
                {deployedLines.lines[0]?.displayedText && !deployedLines.lines[0]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>
              {/* Line 2: Users flowing through */}
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                  minHeight: '1.5em',
                }}
              >
                {deployedLines.lines[1]?.displayedText}
                {deployedLines.lines[1]?.displayedText && !deployedLines.lines[1]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Incident! */}
          {started && !blockageFound && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Production Incident
              </h2>
              {/* Line 1: Incident alert */}
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.error,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  fontWeight: theme.fontWeights.bold,
                  minHeight: '1.6em',
                }}
              >
                {incidentLines.lines[0]?.displayedText}
                {incidentLines.lines[0]?.displayedText && !incidentLines.lines[0]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>
              {/* Line 2: Instructions */}
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  minHeight: '1.5em',
                }}
              >
                {incidentLines.lines[1]?.displayedText}
                {incidentLines.lines[1]?.displayedText && !incidentLines.lines[1]?.isComplete && (
                  <span
                    style={{
                      animation: 'blink 1s infinite',
                      marginLeft: '2px',
                    }}
                  >
                    |
                  </span>
                )}
              </p>
              {showIncidentCostBox && (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: `${theme.colors.error}15`,
                    borderRadius: "8px",
                    border: `1px solid ${theme.colors.error}30`,
                    animation: 'fadeIn 0.5s ease-in',
                  }}
                >
                <p
                  style={{
                    fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                    color: theme.colors.text,
                    lineHeight: 1.5,
                    fontFamily: theme.fonts.body,
                    opacity: 0.9,
                    margin: 0,
                  }}
                >
                  <strong>Incident Cost: ${incidentCost.toLocaleString()}</strong>
                  <br />
                  <strong>Duration: {incidentDurationSeconds.toFixed(1)}s</strong>
                  <br />
                  <span style={{ opacity: 0.7 }}>Each inspection: $500</span>
                </p>
                </div>
              )}
            </div>
          )}

          {/* Blockage found */}
          {blockageFound && mode !== 'principal' && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Incident Resolved
              </h2>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.success,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  fontWeight: theme.fontWeights.bold,
                }}
              >
                ✓ Blockage Found!
              </p>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "8px",
                }}
              >
                Time to resolution: <strong>{incidentDurationSeconds.toFixed(1)} seconds</strong>
              </p>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                }}
              >
                Total incident cost: <strong>${incidentCost.toLocaleString()}</strong>
              </p>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                  marginBottom: "24px",
                }}
              >
                Want to see how Principal AI handles it faster with story based telemetry?
              </p>
              <div style={{
                display: 'flex',
                gap: '16px',
                flexDirection: isMobile ? 'column' : 'row',
              }}>
                <button
                  onClick={() => {
                    handleTryAgain();
                    setFlowState('start');
                  }}
                  style={{
                    padding: isMobile ? '10px 24px' : '12px 32px',
                    background: theme.colors.primary,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: theme.fontSizes[0],
                    fontWeight: theme.fontWeights.bold,
                    color: theme.colors.text,
                    cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                    transition: 'all 0.2s ease',
                    opacity: 0.2,
                    minWidth: isMobile ? '200px' : '140px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.2';
                  }}
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    handleTryPrincipal();
                    setFlowState('testing-intro');
                  }}
                  style={{
                    padding: isMobile ? '10px 24px' : '12px 32px',
                    background: theme.colors.primary,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: theme.fontSizes[0],
                    fontWeight: theme.fontWeights.bold,
                    color: theme.colors.text,
                    cursor: 'pointer',
                    fontFamily: theme.fonts.body,
                    transition: 'all 0.2s ease',
                    opacity: 0.8,
                    minWidth: isMobile ? '200px' : '180px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Try with Principal AI
                </button>
              </div>
            </div>
          )}

          {/* Principal AI resolved */}
          {blockageFound && mode === 'principal' && previousIncidentCost > 0 && (
            <div>
              <h2
                style={{
                  fontSize: isMobile ? theme.fontSizes[4] : theme.fontSizes[5],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Incident Resolved
              </h2>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.success,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "16px",
                  fontWeight: theme.fontWeights.bold,
                }}
              >
                ✓ Issue Resolved
              </p>
              <div
                style={{
                  padding: "20px",
                  backgroundColor: `${theme.colors.success}15`,
                  borderRadius: "8px",
                  border: `1px solid ${theme.colors.success}30`,
                  marginBottom: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                    color: theme.colors.text,
                    lineHeight: 1.5,
                    fontFamily: theme.fonts.body,
                    opacity: 0.9,
                    margin: 0,
                  }}
                >
                  <strong style={{ color: theme.colors.success }}>
                    You saved ${(previousIncidentCost - incidentCost).toLocaleString()} and {(previousIncidentDuration - incidentDurationSeconds).toFixed(1)}s
                  </strong>
                  <br />
                  <span style={{ opacity: 0.7 }}>
                    Resolution time: {incidentDurationSeconds.toFixed(1)}s vs {previousIncidentDuration.toFixed(1)}s
                  </span>
                  <br />
                  <span style={{ opacity: 0.7 }}>
                    Cost: ${incidentCost.toLocaleString()} vs ${previousIncidentCost.toLocaleString()}
                  </span>
                </p>
              </div>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                  marginBottom: "24px",
                }}
              >
                Telemetry pinpointed the exact location of the issue, dramatically reducing MTTR and cost.
              </p>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/demo';
                  }
                }}
                style={{
                  padding: isMobile ? '10px 24px' : '12px 32px',
                  background: theme.colors.primary,
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: theme.fontSizes[0],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.text,
                  cursor: 'pointer',
                  fontFamily: theme.fonts.body,
                  transition: 'all 0.2s ease',
                  opacity: 0.9,
                  minWidth: isMobile ? '200px' : '220px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Schedule A Call Today
              </button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Two-phase layout:
          Phase 1 (start, agent-question): Vertically centered, flexible
          Phase 2 (testing onwards): Top-aligned, fixed height for stability */}
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: flowState === 'start' || flowState === 'agent-question' ? "center" : "flex-start",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
          paddingTop: flowState === 'start' || flowState === 'agent-question'
            ? "0" // Centered by alignItems
            : isMobile ? "60px" : "80px", // Fixed padding for game phase
          paddingBottom: isMobile ? "80px" : "120px", // Space for progress tracker
        }}
      >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile || isTablet ? "column" : "row",
          gap: isMobile ? "40px" : "60px",
          maxWidth: "1400px",
          width: "100%",
          alignItems: isMobile || isTablet ? "center" : "flex-start",
          padding: isMobile ? "40px 20px" : "60px 40px",
        }}
      >
        {/* Dynamic Text Panel - now on the left */}
        <TextPanel
          flowState={flowState}
          setFlowState={setFlowState}
          mode={mode}
          setMode={setMode}
          isMobile={isMobile}
          theme={theme}
          testedLocally={testedLocally}
          deployed={deployed}
          started={started}
          blockageFound={blockageFound}
          incidentCost={incidentCost}
          incidentDurationSeconds={incidentDurationSeconds}
          previousIncidentCost={previousIncidentCost}
          previousIncidentDuration={previousIncidentDuration}
          continueClicked={continueClicked}
          startLines={startLines}
          agentQuestion={agentQuestion}
          testingLines={testingLines}
          deployQuestion={deployQuestion}
          costInfoLines={costInfoLines}
          deployedLines={deployedLines}
          incidentLines={incidentLines}
          agentUsage={agentUsage}
          setAgentUsage={setAgentUsage}
          handleTestLocally={handleTestLocally}
          handleDeploy={handleDeploy}
          handleTryAgain={handleTryAgain}
          handleTryPrincipal={handleTryPrincipal}
          showSlider={showSlider}
          showContinueButton={showContinueButton}
          showTestComplete={showTestComplete}
          showDeployQuestion={showDeployQuestion}
          showDeployButtons={showDeployButtons}
          showCostInfo={showCostInfo}
          showTestingText={showTestingText}
          showTestingButtons={showTestingButtons}
          showIncidentCostBox={showIncidentCostBox}
        />

        {/* Maze Panel - space reserved once testing starts, appears after "maze represents..." line completes */}
        {(mode === 'agentic' || mode === 'no-agentic' || mode === 'principal') && (
          <div style={{
            flex: isMobile || isTablet ? "0 0 auto" : "1",
            minWidth: isMobile || isTablet ? "auto" : "400px",
            maxWidth: isMobile || isTablet ? "100%" : "550px",
            opacity: (showMaze || testedLocally || deployed) ? 1 : 0,
            visibility: (showMaze || testedLocally || deployed) ? 'visible' : 'hidden',
            pointerEvents: (showMaze || testedLocally || deployed) ? 'auto' : 'none',
            transition: 'opacity 0.5s ease',
          }}>
            <MazePanel
              gameState={gameState}
              handleCellClick={handleCellClick}
              agentUsage={agentUsage}
              isMobile={isMobile}
              showMaze={showMaze && !testedLocally && !deployed}
            />
          </div>
        )}
      </div>
    </div>

    {/* Progress Tracker */}
    <ProgressTracker
      currentState={flowState}
      onNavigate={handleNavigate}
      isMobile={isMobile}
    />
    </>
  );
}

export default function GamePage() {
  return (
    <ClientThemeProvider>
      <GameContent />
    </ClientThemeProvider>
  );
}
