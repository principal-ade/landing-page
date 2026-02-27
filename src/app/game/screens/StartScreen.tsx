"use client";

import React, { useMemo } from 'react';
import { Button } from '../components/atoms/Button';
import { GameHeading } from '../components/atoms/GameHeading';
import { GameBodyText } from '../components/atoms/GameBodyText';
import { useSequentialTypewriter } from '../hooks/useSequentialTypewriter';
import { GAME_CONTENT } from '../config/gameContent';
import { GAME_CONFIG } from '../config/gameConfig';

interface StartScreenProps {
  onContinue: () => void;
}

/**
 * Start screen - first impression of the game
 * Shows intro text with typewriter effect
 */
export function StartScreen({ onContinue }: StartScreenProps) {
  // Configure lines with typewriter speeds
  const lineConfigs = useMemo(
    () => [
      {
        text: GAME_CONTENT.start.lines[0].text,
        speed: GAME_CONFIG.timings.typewriterSpeed.heading,
      },
      {
        text: GAME_CONTENT.start.lines[1].text,
        speed: GAME_CONFIG.timings.typewriterSpeed.body,
      },
    ],
    []
  );

  const { lines, allComplete, currentLineIndex } = useSequentialTypewriter(
    true,
    lineConfigs,
    GAME_CONFIG.timings.lineDelays.line2
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        maxWidth: '650px',
        padding: '20px 0',
      }}
    >
      <div>
        {/* Heading */}
        <GameHeading
          text={lines[0]?.displayedText || ''}
          showCursor={!!(lines[0]?.displayedText && !lines[0]?.isComplete && currentLineIndex === 0)}
        />

        {/* Body text - always render to reserve space, but only show text when available */}
        <GameBodyText
          text={lines[1]?.displayedText || ''}
          showCursor={!!(lines[1]?.displayedText && !lines[1].isComplete && currentLineIndex === 1)}
          opacity={0.9}
          minHeight="4.8em"
        />
      </div>

      {/* Continue button - fades in when text is complete */}
      <Button onClick={onContinue} disabled={!allComplete}>
        {GAME_CONTENT.start.button}
      </Button>
    </div>
  );
}
