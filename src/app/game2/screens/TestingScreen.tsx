"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Button } from '../components/atoms/Button';
import { GameHeading } from '../components/atoms/GameHeading';
import { GameBodyText } from '../components/atoms/GameBodyText';
import { useSequentialTypewriter } from '../hooks/useSequentialTypewriter';
import { GameMode } from '../types';
import { GAME_CONTENT } from '../config/gameContent';
import { GAME_CONFIG } from '../config/gameConfig';

interface TestingScreenProps {
  mode: GameMode;
  onBack: () => void;
  onTestLocally: () => void;
}

/**
 * Testing Screen - shows testing intro and maze
 * Different content for agentic vs principal mode
 */
export function TestingScreen({ mode, onBack, onTestLocally }: TestingScreenProps) {
  const { theme } = useTheme();
  const [showButtons, setShowButtons] = useState(false);

  // Get lines based on mode
  const lineConfigs = useMemo(() => {
    const lines = mode === 'principal'
      ? GAME_CONTENT.testing.lines.principal
      : GAME_CONTENT.testing.lines.agentic;

    return lines.map((line) => ({
      text: line.text,
      speed: GAME_CONFIG.timings.typewriterSpeed.body,
    }));
  }, [mode]);

  const { lines, allComplete, currentLineIndex } = useSequentialTypewriter(
    true,
    lineConfigs,
    GAME_CONFIG.timings.lineDelays.line2
  );

  // Show buttons after all lines complete
  useEffect(() => {
    if (allComplete && !showButtons) {
      const timer = setTimeout(() => setShowButtons(true), 200);
      return () => clearTimeout(timer);
    } else if (!allComplete) {
      setShowButtons(false);
    }
  }, [allComplete, showButtons]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        maxWidth: '650px',
        padding: '20px 0',
        minHeight: '500px',
      }}
    >
      <div>
        {/* Heading - Line 0 */}
        <GameHeading
          text={lines[0]?.displayedText || ''}
          showCursor={lines[0]?.displayedText && !lines[0]?.isComplete && currentLineIndex === 0}
        />

        {/* Description - Line 1 */}
        <GameBodyText
          text={lines[1]?.displayedText || ''}
          showCursor={lines[1]?.displayedText && !lines[1]?.isComplete && currentLineIndex === 1}
          opacity={0.9}
          marginBottom="16px"
          minHeight="1.6em"
        />

        {/* Additional info - Line 2 */}
        <GameBodyText
          text={lines[2]?.displayedText || ''}
          showCursor={lines[2]?.displayedText && !lines[2]?.isComplete && currentLineIndex === 2}
          opacity={0.7}
          marginBottom={mode === 'principal' ? '24px' : '8px'}
          minHeight="1.6em"
        />

        {/* Line 3 (only for non-principal) */}
        {mode !== 'principal' && lines[3] && (
          <GameBodyText
            text={lines[3]?.displayedText || ''}
            showCursor={lines[3]?.displayedText && !lines[3]?.isComplete && currentLineIndex === 3}
            opacity={0.7}
            marginBottom="24px"
            minHeight="1.6em"
          />
        )}
      </div>

      {/* Action buttons */}
      {showButtons && (
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
    </div>
  );
}
