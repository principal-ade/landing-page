"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../components/atoms/Button';
import { GameBodyText } from '../components/atoms/GameBodyText';
import { GAME_CONTENT } from '../config/gameContent';
import { GAME_CONFIG } from '../config/gameConfig';

interface DeployQuestionScreenProps {
  onBack: () => void;
  onDeploy: () => void;
}

/**
 * Deploy Question Screen - asks if ready to deploy
 * Shows question with typewriter effect
 */
export function DeployQuestionScreen({ onBack, onDeploy }: DeployQuestionScreenProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Typewriter effect for question
  useEffect(() => {
    const text = GAME_CONTENT.deployQuestion.question;
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
        <GameBodyText
          text={displayedText}
          showCursor={!isComplete && !!displayedText}
          opacity={0.9}
        />
      </div>

      {/* Action buttons */}
      {isComplete && (
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
  );
}
