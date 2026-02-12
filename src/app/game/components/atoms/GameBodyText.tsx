"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';

interface GameBodyTextProps {
  text: string;
  showCursor?: boolean;
  opacity?: number;
  marginBottom?: string;
  minHeight?: string;
}

/**
 * Consistent body text component for all game screens
 * Uses same font size as headers but with body font and normal weight
 */
export function GameBodyText({
  text,
  showCursor = false,
  opacity = 0.9,
  marginBottom = '0',
  minHeight,
}: GameBodyTextProps) {
  const { theme } = useTheme();

  return (
    <p
      style={{
        fontSize: theme.fontSizes[7],
        color: theme.colors.text,
        lineHeight: 1.6,
        fontFamily: theme.fonts.body,
        opacity,
        marginBottom,
        minHeight,
      }}
    >
      {text}
      {text && showCursor && (
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
  );
}
