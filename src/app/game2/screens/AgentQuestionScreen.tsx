"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Button } from '../components/atoms/Button';
import { GameHeading } from '../components/atoms/GameHeading';
import { AgentUsageLevel } from '../types';
import { GAME_CONTENT } from '../config/gameContent';
import { GAME_CONFIG } from '../config/gameConfig';

interface AgentQuestionScreenProps {
  selectedUsage: AgentUsageLevel | null;
  onSelectUsage: (value: AgentUsageLevel) => void;
  onContinue: () => void;
}

/**
 * Agent Question Screen - asks user about their agent usage
 * Shows question with typewriter effect, then three option buttons
 */
export function AgentQuestionScreen({
  selectedUsage,
  onSelectUsage,
  onContinue,
}: AgentQuestionScreenProps) {
  const { theme } = useTheme();
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Typewriter effect for question
  useEffect(() => {
    const text = GAME_CONTENT.agentQuestion.question;
    const speed = GAME_CONFIG.timings.typewriterSpeed.question;

    setDisplayedText('');
    setIsComplete(false);

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
  }, []);

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
      {/* Question */}
      <div>
        <GameHeading
          text={displayedText}
          showCursor={!isComplete && !!displayedText}
        />
      </div>

      {/* Option buttons - staggered fade-in */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {GAME_CONTENT.agentQuestion.options.map((option, index) => {
          const isSelected = selectedUsage === option.value;
          const delay = index * 1000; // 0s, 1s, 2s

          return (
            <button
              key={option.value}
              onClick={() => onSelectUsage(option.value)}
              disabled={!isComplete || !displayedText}
              style={{
                padding: '18px 32px',
                background: isSelected ? theme.colors.primary : 'transparent',
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: '8px',
                fontSize: theme.fontSizes[3],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                cursor: isComplete && displayedText ? 'pointer' : 'default',
                fontFamily: theme.fonts.body,
                opacity: isComplete && displayedText ? (isSelected ? 1 : 0.7) : 0,
                pointerEvents: isComplete && displayedText ? 'auto' : 'none',
                transition: `opacity 0.3s ease ${delay}ms, background 0.2s ease`,
              }}
              onMouseEnter={(e) => {
                if (isComplete && displayedText) {
                  e.currentTarget.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                if (isComplete && displayedText) {
                  e.currentTarget.style.opacity = isSelected ? '1' : '0.7';
                }
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Continue button - shows when selection is made */}
      <Button onClick={onContinue} disabled={selectedUsage === null}>
        {GAME_CONTENT.agentQuestion.button}
      </Button>
    </div>
  );
}
