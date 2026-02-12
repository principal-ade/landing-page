"use client";

import React from "react";
import { GameFlowState } from "@/app/game/types";
import { TIMINGS } from "@/app/game/constants";
import { GameMode } from "@/components/maze/types";

interface TypewriterResult {
  displayedText: string;
  isComplete: boolean;
}

interface SequentialTypewriterResult {
  lines: TypewriterResult[];
  allComplete: boolean;
  currentLineIndex: number;
}

interface TextPanelProps {
  flowState: GameFlowState;
  setFlowState: (state: GameFlowState) => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  isMobile: boolean;
  theme: any;

  // Game state
  testedLocally: boolean;
  deployed: boolean;
  started: boolean;
  blockageFound: boolean;
  incidentCost: number;
  incidentDurationSeconds: number;
  previousIncidentCost: number;
  previousIncidentDuration: number;
  continueClicked: boolean;

  // Typewriter results
  startLines: SequentialTypewriterResult;
  agentQuestion: TypewriterResult;
  testingLines: SequentialTypewriterResult;
  deployQuestion: TypewriterResult;
  costInfoLines: SequentialTypewriterResult;
  deployedLines: SequentialTypewriterResult;
  incidentLines: SequentialTypewriterResult;

  // Slider state
  agentUsage: number;
  setAgentUsage: (value: number) => void;

  // Handlers
  handleTestLocally: () => void;
  handleDeploy: () => void;
  handleTryAgain: () => void;
  handleTryPrincipal: () => void;

  // Show flags
  showSlider: boolean;
  showContinueButton: boolean;
  showTestComplete: boolean;
  showDeployQuestion: boolean;
  showDeployButtons: boolean;
  showCostInfo: boolean;
  showTestingText: boolean;
  showTestingButtons: boolean;
  showIncidentCostBox: boolean;
}

export function TextPanel({
  flowState,
  setFlowState,
  mode,
  setMode,
  isMobile,
  theme,
  testedLocally,
  deployed,
  started,
  blockageFound,
  incidentCost,
  incidentDurationSeconds,
  previousIncidentCost,
  previousIncidentDuration,
  continueClicked,
  startLines,
  agentQuestion,
  testingLines,
  deployQuestion,
  costInfoLines,
  deployedLines,
  incidentLines,
  agentUsage,
  setAgentUsage,
  handleTestLocally,
  handleDeploy,
  handleTryAgain,
  handleTryPrincipal,
  showSlider,
  showContinueButton,
  showTestComplete,
  showDeployQuestion,
  showDeployButtons,
  showCostInfo,
  showTestingText,
  showTestingButtons,
  showIncidentCostBox,
}: TextPanelProps) {
  // Handle slider interaction
  const handleSliderChange = (value: number) => {
    setAgentUsage(value);
  };

  // 1. Initial screen - just intro
  if (flowState === 'start') {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          flex: isMobile ? "0 0 auto" : "1",
          maxWidth: isMobile ? "500px" : "650px",
          minWidth: isMobile ? "auto" : "400px",
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
              minHeight: '4.8em',
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

        <button
          onClick={() => setFlowState('agent-question')}
          disabled={!startLines.allComplete}
          style={{
            padding: isMobile ? '12px 24px' : '16px 40px',
            background: theme.colors.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            cursor: startLines.allComplete ? 'pointer' : 'default',
            fontFamily: theme.fonts.body,
            transition: 'all 0.2s ease',
            opacity: startLines.allComplete ? 1 : 0,
            pointerEvents: startLines.allComplete ? 'auto' : 'none',
          }}
          onMouseEnter={(e) => {
            if (startLines.allComplete) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Continue
        </button>
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
          flex: isMobile ? "0 0 auto" : "1",
          maxWidth: isMobile ? "500px" : "650px",
          minWidth: isMobile ? "auto" : "400px",
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

        {/* Three option buttons - always rendered to prevent layout shift */}
        {showSlider && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <button
              onClick={() => handleSliderChange(25)}
              disabled={!agentQuestion.isComplete || !agentQuestion.displayedText}
              style={{
                padding: isMobile ? '16px 24px' : '18px 32px',
                background: agentUsage === 25 ? theme.colors.primary : 'transparent',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                cursor: (agentQuestion.isComplete && agentQuestion.displayedText) ? 'pointer' : 'default',
                fontFamily: theme.fonts.body,
                opacity: (agentQuestion.isComplete && agentQuestion.displayedText) ? (agentUsage === 25 ? 1 : 0.7) : 0,
                pointerEvents: (agentQuestion.isComplete && agentQuestion.displayedText) ? 'auto' : 'none',
                transition: 'opacity 0.3s ease 0s, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (agentQuestion.isComplete && agentQuestion.displayedText) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (agentQuestion.isComplete && agentQuestion.displayedText) {
                  e.currentTarget.style.opacity = agentUsage === 25 ? '1' : '0.7';
                }
              }}
            >
              A little
            </button>

            <button
              onClick={() => handleSliderChange(50)}
              disabled={!agentQuestion.isComplete || !agentQuestion.displayedText}
              style={{
                padding: isMobile ? '16px 24px' : '18px 32px',
                background: agentUsage === 50 ? theme.colors.primary : 'transparent',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                cursor: (agentQuestion.isComplete && agentQuestion.displayedText) ? 'pointer' : 'default',
                fontFamily: theme.fonts.body,
                opacity: (agentQuestion.isComplete && agentQuestion.displayedText) ? (agentUsage === 50 ? 1 : 0.7) : 0,
                pointerEvents: (agentQuestion.isComplete && agentQuestion.displayedText) ? 'auto' : 'none',
                transition: 'opacity 0.3s ease 1s, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (agentQuestion.isComplete && agentQuestion.displayedText) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (agentQuestion.isComplete && agentQuestion.displayedText) {
                  e.currentTarget.style.opacity = agentUsage === 50 ? '1' : '0.7';
                }
              }}
            >
              Moderately
            </button>

            <button
              onClick={() => handleSliderChange(75)}
              disabled={!agentQuestion.isComplete || !agentQuestion.displayedText}
              style={{
                padding: isMobile ? '16px 24px' : '18px 32px',
                background: agentUsage === 75 ? theme.colors.primary : 'transparent',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                cursor: (agentQuestion.isComplete && agentQuestion.displayedText) ? 'pointer' : 'default',
                fontFamily: theme.fonts.body,
                opacity: (agentQuestion.isComplete && agentQuestion.displayedText) ? (agentUsage === 75 ? 1 : 0.7) : 0,
                pointerEvents: (agentQuestion.isComplete && agentQuestion.displayedText) ? 'auto' : 'none',
                transition: 'opacity 0.3s ease 2s, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (agentQuestion.isComplete && agentQuestion.displayedText) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (agentQuestion.isComplete && agentQuestion.displayedText) {
                  e.currentTarget.style.opacity = agentUsage === 75 ? '1' : '0.7';
                }
              }}
            >
              A lot
            </button>
          </div>
        )}

        {/* Continue button - always rendered to prevent layout shift */}
        <button
          onClick={() => {
            setMode('agentic');
            setFlowState('testing-intro');
          }}
          disabled={!showContinueButton}
          style={{
            padding: isMobile ? '12px 24px' : '16px 40px',
            background: theme.colors.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            cursor: showContinueButton ? 'pointer' : 'default',
            fontFamily: theme.fonts.body,
            transition: 'opacity 0.3s ease',
            opacity: showContinueButton ? 1 : 0,
            pointerEvents: showContinueButton ? 'auto' : 'none',
          }}
          onMouseEnter={(e) => {
            if (showContinueButton) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // 3. During testing/deployment/incident - GAME PHASE (Steps 3-7)
  if (mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          flex: isMobile ? "0 0 auto" : "1", // Split width proportionally with MazePanel
          maxWidth: isMobile ? "500px" : "650px", // Cap maximum width
          minWidth: isMobile ? "auto" : "400px", // Ensure minimum readable width
          padding: isMobile ? "0" : "20px 0",
          minHeight: isMobile ? "400px" : "500px", // Fixed height to prevent jumping
          justifyContent: "flex-start", // Top-align content
        }}
      >
        {/* Testing phase */}
        {!testedLocally && !deployed && (
          <div>
            {/* Testing intro text with typewriter */}
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
              )}
            </h2>
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
              )}
            </p>
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
              )}
            </p>
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
                  <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
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
        {testedLocally && !deployed && !showTestComplete && !showDeployQuestion && (
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
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
                  <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
                )}
              </p>
            ))}

            {/* Continue button */}
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

        {/* Deployed, running fine */}
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
              )}
            </p>
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
              )}
            </p>
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
                <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>|</span>
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

        {/* Blockage found - non-principal */}
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
}
