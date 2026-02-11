"use client";

import React, { useState, useEffect } from "react";
import ClientThemeProvider from "@/components/providers/ClientThemeProvider";
import { useTheme } from "@principal-ade/industry-theme";
import { useMazeGame } from "@/hooks/useMazeGame";
import { MazeCanvas } from "@/components/maze/MazeCanvas";

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

  // Slider state (0 to 100, where 0 = "a little", 100 = "a lot")
  const [agentUsage, setAgentUsage] = useState(50);
  const [showSlider, setShowSlider] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  // Test complete and deploy UI state
  const [showTestComplete, setShowTestComplete] = useState(false);
  const [showDeployQuestion, setShowDeployQuestion] = useState(false);
  const [showDeployButtons, setShowDeployButtons] = useState(false);

  // Cost info UI state (after deployment)
  const [showCostInfo, setShowCostInfo] = useState(false);
  const [showCostContinueButton, setShowCostContinueButton] = useState(false);
  const [continueClicked, setContinueClicked] = useState(false);

  // Typewriter text for start screen
  const startHeadingText = "You are a software developer in 2026";
  const startParagraphText = "Your code works locally and you are ready to deploy to production.";

  const startHeading = useTypewriter(startHeadingText, 50, 0);
  const startParagraph = useTypewriter(startParagraphText, 30, startHeadingText.length * 50 + 200);

  // Typewriter text for slider question screen
  const sliderQuestionText = "How much do you use agents to develop your software?";
  const sliderQuestion = useTypewriter(mode === 'initial' ? sliderQuestionText : '', 50, 0);

  // Typewriter text for deploy question
  const deployQuestionText = "Everything looks good. Ready to deploy to production?";
  const deployQuestion = useTypewriter(showDeployQuestion ? deployQuestionText : '', 40, 0);

  // Typewriter text for cost info (after deployment)
  const costInfoText = "On average, production incidents cost companies $225 per second in lost revenue and engineering time.";
  const costInfo = useTypewriter(showCostInfo ? costInfoText : '', 40, 0);

  // Typewriter text for testing phase
  const showTestingText = (mode === 'agentic' || mode === 'no-agentic' || mode === 'principal') && !testedLocally && !deployed;
  const [testingLine1Ready, setTestingLine1Ready] = useState(false);
  const [testingLine2Ready, setTestingLine2Ready] = useState(false);
  const [testingLine3Ready, setTestingLine3Ready] = useState(false);
  const [showTestingButtons, setShowTestingButtons] = useState(false);
  const [showMaze, setShowMaze] = useState(false);

  const testingHeading = "Testing Visualization";
  const testingLine1Text = "The maze represents an execution path in your codebase.";
  const testingLine2Regular = "Your visibility into the code during testing depends on how much you used agents during development.";
  const testingLine3Regular = "Higher agent usage generally translates to less insight into the details of the execution path.";
  const testingLinePrincipal = "Watch how Principal AI instruments your code with telemetry to understand the complete execution path.";

  const testingHeadingTyped = useTypewriter(showTestingText ? testingHeading : '', 50, 0);
  const testingLine1Typed = useTypewriter(testingLine1Ready ? testingLine1Text : '', 40, 0);
  const testingLine2Typed = useTypewriter(
    testingLine2Ready ? (mode === 'principal' ? testingLinePrincipal : testingLine2Regular) : '',
    35,
    0
  );
  const testingLine3Typed = useTypewriter(testingLine3Ready ? testingLine3Regular : '', 35, 0);

  // Chain the typewriter effects
  useEffect(() => {
    if (showTestingText && testingHeadingTyped.isComplete && !testingLine1Ready) {
      const timer = setTimeout(() => setTestingLine1Ready(true), 100);
      return () => clearTimeout(timer);
    } else if (!showTestingText) {
      setTestingLine1Ready(false);
    }
  }, [showTestingText, testingHeadingTyped.isComplete, testingLine1Ready]);

  useEffect(() => {
    if (testingLine1Typed.isComplete && testingLine1Ready && !testingLine2Ready) {
      const timer = setTimeout(() => setTestingLine2Ready(true), 100);
      return () => clearTimeout(timer);
    } else if (!showTestingText) {
      setTestingLine2Ready(false);
    }
  }, [testingLine1Typed.isComplete, testingLine1Ready, testingLine2Ready, showTestingText]);

  useEffect(() => {
    if (testingLine2Typed.isComplete && testingLine2Ready && !testingLine3Ready && mode !== 'principal') {
      const timer = setTimeout(() => setTestingLine3Ready(true), 100);
      return () => clearTimeout(timer);
    } else if (!showTestingText || mode === 'principal') {
      setTestingLine3Ready(false);
    }
  }, [testingLine2Typed.isComplete, testingLine2Ready, testingLine3Ready, showTestingText, mode]);

  // Show maze after first line completes
  useEffect(() => {
    if (testingLine1Ready && testingLine1Typed.isComplete && !showMaze && showTestingText) {
      const timer = setTimeout(() => setShowMaze(true), 200);
      return () => clearTimeout(timer);
    } else if (!showTestingText) {
      setShowMaze(false);
    }
  }, [testingLine1Ready, testingLine1Typed.isComplete, showMaze, showTestingText]);

  // Show buttons only after all text is complete
  useEffect(() => {
    if (mode === 'principal' && testingLine2Ready && testingLine2Typed.isComplete && !showTestingButtons) {
      const timer = setTimeout(() => setShowTestingButtons(true), 200);
      return () => clearTimeout(timer);
    } else if (mode !== 'principal' && testingLine3Ready && testingLine3Typed.isComplete && !showTestingButtons) {
      const timer = setTimeout(() => setShowTestingButtons(true), 200);
      return () => clearTimeout(timer);
    } else if (!showTestingText) {
      setShowTestingButtons(false);
    }
  }, [mode, testingLine2Ready, testingLine2Typed.isComplete, testingLine3Ready, testingLine3Typed.isComplete, showTestingButtons, showTestingText]);

  useEffect(() => {
    if (mode === 'initial' && sliderQuestion.isComplete) {
      const timer1 = setTimeout(() => setShowSlider(true), 300);
      return () => clearTimeout(timer1);
    } else if (mode !== 'initial') {
      setShowSlider(false);
      setShowContinueButton(false);
    }
  }, [mode, sliderQuestion.isComplete]);

  // Show "Test complete" immediately when testing finishes
  useEffect(() => {
    if (testedLocally && !deployed && revealedPathIndex >= testPath.length && (mode === 'agentic' || mode === 'no-agentic' || mode === 'principal')) {
      setShowTestComplete(true);
    } else {
      setShowTestComplete(false);
      setShowDeployQuestion(false);
      setShowDeployButtons(false);
    }
  }, [testedLocally, deployed, revealedPathIndex, testPath.length, mode]);

  // Show deploy question after a 2 second pause
  useEffect(() => {
    if (showTestComplete && !showDeployQuestion && !deployed) {
      const timer = setTimeout(() => setShowDeployQuestion(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [showTestComplete, showDeployQuestion, deployed]);

  // Show deploy buttons after deploy question is typed
  useEffect(() => {
    if (showDeployQuestion && deployQuestion.isComplete && !showDeployButtons) {
      const timer = setTimeout(() => setShowDeployButtons(true), 300);
      return () => clearTimeout(timer);
    }
  }, [showDeployQuestion, deployQuestion.isComplete, showDeployButtons]);

  // Show cost info immediately after deployment
  useEffect(() => {
    if (deployed && !started && !showCostInfo) {
      const timer = setTimeout(() => setShowCostInfo(true), 1000); // 1 second pause after deploy
      return () => clearTimeout(timer);
    } else if (!deployed) {
      setShowCostInfo(false);
      setShowCostContinueButton(false);
      setContinueClicked(false);
    }
  }, [deployed, started, showCostInfo]);

  // Show Continue button after cost info is typed
  useEffect(() => {
    if (showCostInfo && costInfo.isComplete) {
      const timer = setTimeout(() => setShowCostContinueButton(true), 300);
      return () => clearTimeout(timer);
    }
  }, [showCostInfo, costInfo.isComplete]);

  // Start revenue after "Users are flowing through..." message is readable
  useEffect(() => {
    if (continueClicked && !startRevenue) {
      const timer = setTimeout(() => setStartRevenue(true), 2500); // 2.5 second delay to read the message
      return () => clearTimeout(timer);
    } else if (!continueClicked) {
      setStartRevenue(false);
    }
  }, [continueClicked, startRevenue]);

  // Start incident after revenue has been accumulating
  useEffect(() => {
    if (startRevenue && deployed && !started) {
      const timer = setTimeout(() => startIncident(), 3000); // 3 second delay to see revenue
      return () => clearTimeout(timer);
    }
  }, [startRevenue, deployed, started, startIncident]);

  // Show continue button after user interacts with slider
  const handleSliderChange = (value: number) => {
    setAgentUsage(value);
    setShowContinueButton(true);
  };

  // Render different text panels based on game state
  const renderTextPanel = () => {
    // 1. Initial screen - just intro
    if (mode === 'start') {
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
              {startHeading.displayedText}
              {!startHeading.isComplete && (
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
              {startParagraph.displayedText}
              {startParagraph.displayedText && !startParagraph.isComplete && (
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

          {startParagraph.isComplete && (
            <button
              onClick={() => setMode('initial')}
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
    if (mode === 'initial') {
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
              {sliderQuestion.displayedText}
              {!sliderQuestion.isComplete && (
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
                {testingHeadingTyped.displayedText}
                {!testingHeadingTyped.isComplete && (
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
                {testingLine1Typed.displayedText}
                {testingLine1Typed.displayedText && !testingLine1Typed.isComplete && (
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
                {testingLine2Typed.displayedText}
                {testingLine2Typed.displayedText && !testingLine2Typed.isComplete && (
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
              {mode !== 'principal' && (
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
                  {testingLine3Typed.displayedText}
                  {testingLine3Typed.displayedText && !testingLine3Typed.isComplete && (
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
                    onClick={() => setMode('initial')}
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
                    onClick={handleTestLocally}
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
                    onClick={() => setMode('initial')}
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
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  color: theme.colors.text,
                  lineHeight: 1.6,
                  fontFamily: theme.fonts.body,
                  opacity: 0.9,
                  marginBottom: "24px",
                  minHeight: '3em',
                }}
              >
                {costInfo.displayedText}
                {costInfo.displayedText && !costInfo.isComplete && (
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

              {/* Continue button */}
              {showCostContinueButton && (
                <button
                  onClick={() => setContinueClicked(true)}
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
                ✓ Deployed successfully
              </p>
              <p
                style={{
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  color: theme.colors.text,
                  lineHeight: 1.5,
                  fontFamily: theme.fonts.body,
                  opacity: 0.7,
                }}
              >
                Users are flowing through. Revenue is coming in. Everything is working perfectly...
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
                }}
              >
                🚨 INCIDENT: Users can't complete checkout
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
                {mode === 'principal'
                  ? 'Principal AI is analyzing telemetry data to locate the blockage...'
                  : 'Find the blockage in production. Click cells to inspect the system.'}
              </p>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: `${theme.colors.error}15`,
                  borderRadius: "8px",
                  border: `1px solid ${theme.colors.error}30`,
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
                  onClick={handleTryAgain}
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
                  onClick={handleTryPrincipal}
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
      <div
        style={{
          width: "100%",
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
          paddingTop: mode === 'start' ? "15vh" : mode === 'initial' ? "8vh" : "0",
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
        {renderTextPanel()}

        {/* Game Section - show after first line of text completes or after testing starts */}
        {((mode === 'agentic' || mode === 'no-agentic' || mode === 'principal') && (showMaze || testedLocally || deployed)) && (
          <div style={{ flex: "0 0 auto" }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              padding: isMobile ? '20px 16px' : '40px 20px',
              width: '100%',
              animation: showMaze && !testedLocally && !deployed ? 'fadeIn 0.5s ease-in' : 'none',
            }}>
              <svg
                width={gameState.baseWidth}
                height={gameState.baseHeight}
                viewBox={`0 0 ${gameState.baseWidth} ${gameState.baseHeight}`}
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                style={{ maxWidth: '100%', height: 'auto' }}
              >
                <MazeCanvas
                  {...gameState}
                  onCellClick={handleCellClick}
                  agentUsage={agentUsage}
                />
              </svg>
          </div>
        </div>
        )}
      </div>
    </div>
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
