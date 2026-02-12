"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';

interface GameHeadingProps {
  text: string;
  showCursor?: boolean;
}

/**
 * Consistent heading component for all game screens
 * Ensures first lines are always aligned across different steps
 */
export function GameHeading({ text, showCursor = false }: GameHeadingProps) {
  const { theme } = useTheme();

  return (
    <h1
      style={{
        fontSize: theme.fontSizes[7],
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.primary,
        marginBottom: '24px',
        fontFamily: theme.fonts.heading,
        lineHeight: 1.2,
        minHeight: '1.2em',
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
    </h1>
  );
}
