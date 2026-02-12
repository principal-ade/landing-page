"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable button component with consistent styling
 */
export function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  children,
  className = '',
}: ButtonProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'secondary') return theme.colors.secondary;
    return 'transparent';
  };

  const getBorder = () => {
    if (variant === 'ghost') return `2px solid ${theme.colors.primary}`;
    return 'none';
  };

  const getOpacity = () => {
    if (disabled) return 0;
    if (variant === 'ghost') return 0.7;
    return 1;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        padding: '16px 40px',
        background: getBackgroundColor(),
        border: getBorder(),
        borderRadius: '8px',
        fontSize: theme.fontSizes[3],
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: theme.fonts.body,
        transition: 'all 0.2s ease',
        opacity: getOpacity(),
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
          if (variant === 'ghost') {
            e.currentTarget.style.opacity = '1';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        if (variant === 'ghost') {
          e.currentTarget.style.opacity = '0.7';
        }
      }}
    >
      {children}
    </button>
  );
}
