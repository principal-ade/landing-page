"use client";

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  as?: 'h1' | 'h2' | 'p' | 'span';
  style?: React.CSSProperties;
  showCursor?: boolean;
}

/**
 * Typewriter effect component
 * Animates text character by character
 */
export function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  onComplete,
  as: Component = 'p',
  style = {},
  showCursor = true,
}: TypewriterTextProps) {
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
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return (
    <Component style={style}>
      {displayedText}
      {showCursor && displayedText && !isComplete && (
        <span
          style={{
            animation: 'blink 1s infinite',
            marginLeft: '2px',
          }}
        >
          |
        </span>
      )}
    </Component>
  );
}
