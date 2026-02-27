"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Button } from '../components/atoms/Button';
import { GameHeading } from '../components/atoms/GameHeading';
import { GameBodyText } from '../components/atoms/GameBodyText';
import { MazePanel } from '@/components/game/MazePanel';
import { useSequentialTypewriter } from '../hooks/useSequentialTypewriter';
import { GAME_CONTENT } from '../config/gameContent';
import { GAME_CONFIG } from '../config/gameConfig';
import { UseMazeGameReturn } from '@/hooks/useMazeGame';

interface PrincipalProductionScreenProps {
  phase: 'cost-info' | 'deployed-running' | 'incident-active' | 'incident-resolved';
  onBack: () => void;
  onContinue: () => void;
  gameState: UseMazeGameReturn;
  agentUsage: number;
}

/**
 * Principal Production Screen - shows production with Principal AI telemetry
 * Emphasizes story-based telemetry and automated incident resolution
 */
export function PrincipalProductionScreen({ phase, onBack, onContinue, gameState, agentUsage }: PrincipalProductionScreenProps) {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const [showRemainingLines, setShowRemainingLines] = useState(false);

  // Track window width for responsive layout
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Configure lines for cost-info phase
  const lineConfigs = useMemo(() => {
    const lines = [
      {
        text: GAME_CONTENT.costInfo.lines.common[0].text,
        speed: GAME_CONFIG.timings.typewriterSpeed.body,
      },
      {
        text: GAME_CONTENT.costInfo.lines.principal.text,
        speed: GAME_CONFIG.timings.typewriterSpeed.body,
      },
      {
        text: GAME_CONTENT.costInfo.lines.final.text,
        speed: GAME_CONFIG.timings.typewriterSpeed.body,
      },
    ];
    return lines;
  }, []);

  const { lines, allComplete, currentLineIndex } = useSequentialTypewriter(
    phase === 'cost-info',
    lineConfigs,
    GAME_CONFIG.timings.lineDelays.line2
  );

  // Extract for dependency array
  const firstLineComplete = lines[0]?.isComplete;

  // Reset states when phase changes
  useEffect(() => {
    if (phase !== 'cost-info') {
      setShowOverlay(false);
      setShowRemainingLines(false);
    }
  }, [phase]);

  // Turn on overlay after first line completes
  useEffect(() => {
    if (phase === 'cost-info' && firstLineComplete && !showOverlay) {
      const timer = setTimeout(() => setShowOverlay(true), 500);
      return () => clearTimeout(timer);
    }
  }, [phase, firstLineComplete, showOverlay]);

  // Show remaining lines after overlay is on
  useEffect(() => {
    if (phase === 'cost-info' && showOverlay && !showRemainingLines) {
      const timer = setTimeout(() => setShowRemainingLines(true), 800);
      return () => clearTimeout(timer);
    }
  }, [phase, showOverlay, showRemainingLines]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile || isTablet ? 'column' : 'row',
        gap: isMobile ? '40px' : '60px',
        width: '100%',
        maxWidth: '1400px',
        padding: '20px 0',
        alignItems: isMobile || isTablet ? 'center' : 'flex-start',
        height: isMobile || isTablet ? '100%' : 'auto',
      }}
    >
      {/* Text content - left side */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile || isTablet ? '12px' : '20px',
          flex: isMobile || isTablet ? '0 0 50%' : '0 0 650px',
          maxWidth: '650px',
          width: '100%',
          height: isMobile || isTablet ? '50%' : 'auto',
        }}
      >
        <div>
          {/* Cost info phase */}
          {phase === 'cost-info' && (
            <>
              <GameHeading text="Production" />

              {!showRemainingLines ? (
                <>
                  {/* Line 0 - first line only */}
                  <GameBodyText
                    text={lines[0]?.displayedText || ''}
                    showCursor={!!(lines[0]?.displayedText && !lines[0]?.isComplete && currentLineIndex === 0)}
                    opacity={0.9}
                    marginBottom="0"
                    minHeight={isMobile || isTablet ? "3.2em" : "1.6em"}
                  />
                </>
              ) : (
                <>
                  {/* Line 1 */}
                  <GameBodyText
                    text={lines[1]?.displayedText || ''}
                    showCursor={!!(lines[1]?.displayedText && !lines[1]?.isComplete && currentLineIndex === 1)}
                    opacity={0.9}
                    marginBottom="16px"
                    minHeight={isMobile || isTablet ? "3.2em" : "1.6em"}
                  />

                  {/* Line 2 */}
                  <GameBodyText
                    text={lines[2]?.displayedText || ''}
                    showCursor={!!(lines[2]?.displayedText && !lines[2]?.isComplete && currentLineIndex === 2)}
                    opacity={0.9}
                    marginBottom="0"
                    minHeight={isMobile || isTablet ? "3.2em" : "1.6em"}
                  />
                </>
              )}
            </>
          )}

          {/* Deployed running phase */}
          {phase === 'deployed-running' && (
            <>
              <GameHeading text={GAME_CONTENT.deployedRunning.heading} />
              <GameBodyText
                text={GAME_CONTENT.deployedRunning.text}
                opacity={0.9}
                marginBottom="0"
              />
            </>
          )}

          {/* Incident active phase */}
          {phase === 'incident-active' && (
            <>
              <GameHeading text={GAME_CONTENT.incidentActive.heading} />
              <GameBodyText
                text={gameState.blockageFound
                  ? GAME_CONTENT.incidentActive.principal.foundText
                  : GAME_CONTENT.incidentActive.principal.text}
                opacity={0.9}
                marginBottom="0"
              />
            </>
          )}

          {/* Incident resolved phase */}
          {phase === 'incident-resolved' && (
            <>
              <GameHeading text={GAME_CONTENT.incidentResolved.heading} />
              <GameBodyText
                text={GAME_CONTENT.incidentResolved.principal.text}
                opacity={0.9}
                marginBottom="0"
              />
            </>
          )}
        </div>

        {/* Counters */}
        <div style={{ minHeight: '48px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Revenue counter - shown during deployed-running */}
          {phase === 'deployed-running' && (
            <div
              style={{
                padding: '12px 16px',
                background: `${theme.colors.success}20`,
                borderRadius: '8px',
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              <div
                style={{
                  fontSize: theme.fontSizes[4],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.success,
                  fontFamily: theme.fonts.body,
                }}
              >
                Revenue: ${gameState.revenue.toLocaleString()}
              </div>
            </div>
          )}

          {/* Incident cost counter - shown during incident-active */}
          {phase === 'incident-active' && (
            <>
              <div
                style={{
                  padding: '12px 16px',
                  background: `${theme.colors.error}20`,
                  borderRadius: '8px',
                  animation: 'fadeIn 0.5s ease-in',
                }}
              >
                <div
                  style={{
                    fontSize: theme.fontSizes[4],
                    fontWeight: theme.fontWeights.bold,
                    color: theme.colors.error,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  Incident Cost: ${Math.round(gameState.incidentCost).toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.text,
                    opacity: 0.7,
                    fontFamily: theme.fonts.body,
                    marginTop: '4px',
                  }}
                >
                  Duration: {gameState.incidentDurationSeconds.toFixed(1)}s
                </div>
              </div>
            </>
          )}

          {/* Final incident cost - shown during incident-resolved */}
          {phase === 'incident-resolved' && (
            <>
              {gameState.previousMode === 'conventional' && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: `${theme.colors.error}20`,
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: theme.fontSizes[1],
                      color: theme.colors.text,
                      opacity: 0.7,
                      fontFamily: theme.fonts.body,
                      marginBottom: '8px',
                    }}
                  >
                    Your previous attempt (Conventional):
                  </div>
                  <div
                    style={{
                      fontSize: theme.fontSizes[3],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.error,
                      fontFamily: theme.fonts.body,
                    }}
                  >
                    ${Math.round(gameState.previousIncidentCost).toLocaleString()} | {gameState.previousIncidentDuration.toFixed(1)}s
                  </div>
                </div>
              )}
              <div
                style={{
                  padding: '12px 16px',
                  background: `${theme.colors.success}20`,
                  borderRadius: '8px',
                }}
              >
                {gameState.previousMode === 'conventional' && (
                  <div
                    style={{
                      fontSize: theme.fontSizes[1],
                      color: theme.colors.text,
                      opacity: 0.7,
                      fontFamily: theme.fonts.body,
                      marginBottom: '8px',
                    }}
                  >
                    With Principal AI:
                  </div>
                )}
                <div
                  style={{
                    fontSize: theme.fontSizes[4],
                    fontWeight: theme.fontWeights.bold,
                    color: gameState.previousMode === 'conventional' ? theme.colors.success : theme.colors.error,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {gameState.previousMode === 'conventional' ? '' : 'Total Incident Cost: '}${Math.round(gameState.incidentCost).toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.text,
                    opacity: 0.7,
                    fontFamily: theme.fonts.body,
                    marginTop: '4px',
                  }}
                >
                  Duration: {gameState.incidentDurationSeconds.toFixed(1)}s
                </div>
                {gameState.previousMode === 'conventional' && gameState.previousIncidentCost > 0 && (
                  <div
                    style={{
                      fontSize: theme.fontSizes[2],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.success,
                      fontFamily: theme.fonts.body,
                      marginTop: '8px',
                    }}
                  >
                    {Math.round(((gameState.previousIncidentCost - gameState.incidentCost) / gameState.previousIncidentCost) * 100)}% cost reduction
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ minHeight: '56px' }}>
          {phase === 'cost-info' && showRemainingLines && allComplete && (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              <Button onClick={onBack} variant="ghost">
                Back
              </Button>
              <Button onClick={onContinue}>
                {GAME_CONTENT.costInfo.button}
              </Button>
            </div>
          )}

          {phase === 'deployed-running' && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <Button onClick={onContinue}>
                {GAME_CONTENT.deployedRunning.button}
              </Button>
            </div>
          )}

          {phase === 'incident-active' && gameState.blockageFound && !gameState.bugFixed && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <Button onClick={gameState.handleFixBug}>
                {GAME_CONTENT.incidentActive.buttons.approveFix}
              </Button>
            </div>
          )}

          {phase === 'incident-resolved' && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <Button
                onClick={() => window.open('https://cal.com/principlemd/intro', '_blank')}
              >
                {GAME_CONTENT.incidentResolved.buttons.scheduleCall}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Maze - right side */}
      <div
        style={{
          flex: isMobile || isTablet ? '1' : '1',
          minWidth: isMobile || isTablet ? 'auto' : '400px',
          maxWidth: isMobile || isTablet ? '100%' : '550px',
          width: '100%',
        }}
      >
        <MazePanel
          gameState={gameState}
          handleCellClick={gameState.handleCellClick}
          agentUsage={agentUsage}
          isMobile={isMobile}
          showMaze={true}
          showCoverOverlay={(phase === 'cost-info' && showOverlay) || phase === 'deployed-running' || phase === 'incident-active' || phase === 'incident-resolved'}
        />
      </div>
    </div>
  );
}
