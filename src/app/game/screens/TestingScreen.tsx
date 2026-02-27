"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Button } from '../components/atoms/Button';
import { GameHeading } from '../components/atoms/GameHeading';
import { GameBodyText } from '../components/atoms/GameBodyText';
import { MazePanel } from '@/components/game/MazePanel';
import { useSequentialTypewriter } from '../hooks/useSequentialTypewriter';
import { GameMode } from '../types';
import { GAME_CONTENT } from '../config/gameContent';
import { GAME_CONFIG } from '../config/gameConfig';
import { UseMazeGameReturn } from '@/hooks/useMazeGame';

interface TestingScreenProps {
  mode: GameMode;
  phase: 'testing' | 'testing-running' | 'test-complete' | 'deploy-question';
  onBack: () => void;
  onTestLocally: () => void;
  onDeploy: () => void;
  gameState: UseMazeGameReturn;
  agentUsage: number;
}

/**
 * Testing Screen - shows testing intro and maze
 * Different content for conventional vs principal mode
 */
export function TestingScreen({ mode, phase, onBack, onTestLocally, onDeploy, gameState, agentUsage }: TestingScreenProps) {
  const { theme } = useTheme();
  const [showButtons, setShowButtons] = useState(false);
  const [showMaze, setShowMaze] = useState(false);
  const [deployQuestionText, setDeployQuestionText] = useState('');
  const [deployQuestionComplete, setDeployQuestionComplete] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Track window width for responsive layout
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Get lines based on mode
  const lineConfigs = useMemo(() => {
    const lines = mode === 'principal'
      ? GAME_CONTENT.testing.lines.principal
      : GAME_CONTENT.testing.lines.conventional;

    return lines.map((line) => ({
      text: line.text,
      speed: GAME_CONFIG.timings.typewriterSpeed.body,
    }));
  }, [mode]);

  const { lines, allComplete, currentLineIndex } = useSequentialTypewriter(
    phase === 'testing',
    lineConfigs,
    GAME_CONFIG.timings.lineDelays.line2
  );

  // Extract for dependency array
  const secondLineComplete = lines[1]?.isComplete;

  // Show maze after line 1 completes OR if we're in running/complete/deploy phases
  useEffect(() => {
    if (phase === 'testing-running' || phase === 'test-complete' || phase === 'deploy-question') {
      // Always show maze in these phases
      setShowMaze(true);
    } else if (phase === 'testing') {
      // In testing phase, show after line 1 completes
      if (secondLineComplete && !showMaze) {
        const timer = setTimeout(() => setShowMaze(true), 500);
        return () => clearTimeout(timer);
      } else if (!secondLineComplete) {
        setShowMaze(false);
      }
    }
  }, [phase, secondLineComplete, showMaze]);

  // Typewriter effect for deploy question
  useEffect(() => {
    if (phase === 'deploy-question') {
      const text = GAME_CONTENT.deployQuestion.question;
      const speed = GAME_CONFIG.timings.typewriterSpeed.question;

      setDeployQuestionText('');
      setDeployQuestionComplete(false);

      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDeployQuestionText(text.substring(0, index + 1));
          index++;
        } else {
          setDeployQuestionComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Show buttons after all lines complete (only in testing phase)
  useEffect(() => {
    if (phase === 'testing' && allComplete && !showButtons) {
      const timer = setTimeout(() => setShowButtons(true), 200);
      return () => clearTimeout(timer);
    } else if (phase !== 'testing' || !allComplete) {
      setShowButtons(false);
    }
  }, [phase, allComplete, showButtons]);

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
          gap: isMobile || isTablet ? '16px' : '32px',
          flex: isMobile || isTablet ? '0 0 50%' : '0 0 650px',
          maxWidth: '650px',
          width: '100%',
          height: isMobile || isTablet ? '50%' : 'auto',
        }}
      >
      <div>
        {/* Testing intro phase */}
        {phase === 'testing' && (
          <>
            {/* Heading - Line 0 */}
            <GameHeading
              text={lines[0]?.displayedText || ''}
              showCursor={!!(lines[0]?.displayedText && !lines[0]?.isComplete && currentLineIndex === 0)}
            />

            {/* Description - Line 1 */}
            <GameBodyText
              text={lines[1]?.displayedText || ''}
              showCursor={!!(lines[1]?.displayedText && !lines[1]?.isComplete && currentLineIndex === 1)}
              opacity={0.9}
              marginBottom="16px"
              minHeight={isMobile || isTablet ? "3.2em" : "1.6em"}
            />

            {/* Additional info - Line 2 */}
            <GameBodyText
              text={lines[2]?.displayedText || ''}
              showCursor={!!(lines[2]?.displayedText && !lines[2]?.isComplete && currentLineIndex === 2)}
              opacity={0.7}
              marginBottom="0"
              minHeight={isMobile || isTablet ? "4.8em" : "1.6em"}
            />
          </>
        )}

        {/* Testing running phase */}
        {phase === 'testing-running' && (
          <>
            <GameHeading text="Testing Visualization" />
            <div style={{
              background: theme.colors.primary,
              padding: '16px 24px',
              borderRadius: '8px',
              opacity: 0.9,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}>
                Testing...
              </div>
            </div>
          </>
        )}

        {/* Test complete phase */}
        {phase === 'test-complete' && (
          <>
            <GameHeading text="Testing Visualization" />
            <GameBodyText
              text="Test Complete: Your code is working locally"
              opacity={0.9}
              marginBottom="16px"
            />
          </>
        )}

        {/* Deploy question phase */}
        {phase === 'deploy-question' && (
          <>
            <GameHeading text="Production Deployment" />
            <GameBodyText
              text={deployQuestionText}
              showCursor={!deployQuestionComplete && !!deployQuestionText}
              opacity={0.9}
              marginBottom="16px"
            />
          </>
        )}
      </div>

        {/* Action buttons - reserve space */}
        <div
          style={{
            minHeight: '56px', // Reserve space for buttons
          }}
        >
          {/* Testing phase buttons */}
          {phase === 'testing' && showButtons && (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              <Button onClick={onBack} variant="ghost">
                {GAME_CONTENT.testing.buttons.back}
              </Button>
              <Button onClick={onTestLocally}>
                {GAME_CONTENT.testing.buttons.testLocally}
              </Button>
            </div>
          )}

          {/* Deploy question buttons */}
          {phase === 'deploy-question' && deployQuestionComplete && (
            <div
              style={{
                display: 'flex',
                gap: '16px',
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              <Button onClick={onBack} variant="ghost">
                {GAME_CONTENT.deployQuestion.buttons.back}
              </Button>
              <Button onClick={onDeploy}>
                {GAME_CONTENT.deployQuestion.buttons.deploy}
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
          opacity: showMaze ? 1 : 0,
          visibility: showMaze ? 'visible' : 'hidden',
          transition: 'opacity 0.5s ease',
        }}
      >
        {showMaze && (
          <MazePanel
            gameState={gameState}
            handleCellClick={gameState.handleCellClick}
            agentUsage={agentUsage}
            isMobile={isMobile}
            showMaze={showMaze}
            showCoverOverlay={(phase === 'testing' || phase === 'testing-running') && mode === 'conventional'}
          />
        )}
      </div>
    </div>
  );
}
