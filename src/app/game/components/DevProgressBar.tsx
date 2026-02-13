"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { GameState, AgentUsageLevel } from '../types';

interface DevProgressBarProps {
  currentState: GameState;
  onJumpToPhase: (phase: GameState['phase'], mode?: 'conventional' | 'principal', agentUsage?: AgentUsageLevel) => void;
}

/**
 * Development-only progress bar for jumping between game phases
 */
export function DevProgressBar({ currentState, onJumpToPhase }: DevProgressBarProps) {
  const { theme } = useTheme();

  const phases: Array<{
    label: string;
    phase: GameState['phase'];
    requiresMode?: boolean;
  }> = [
    { label: 'Start', phase: 'start' },
    { label: 'Agent Q', phase: 'agentQuestion' },
    { label: 'Testing', phase: 'testing', requiresMode: true },
    { label: 'Test Run', phase: 'testing-running', requiresMode: true },
    { label: 'Test Done', phase: 'test-complete', requiresMode: true },
    { label: 'Deploy Q', phase: 'deploy-question', requiresMode: true },
    { label: 'Cost Info', phase: 'cost-info', requiresMode: true },
    { label: 'Running', phase: 'deployed-running', requiresMode: true },
    { label: 'Incident', phase: 'incident-active', requiresMode: true },
    { label: 'Resolved', phase: 'incident-resolved', requiresMode: true },
  ];

  const handleClick = (phase: GameState['phase'], requiresMode?: boolean) => {
    if (requiresMode) {
      // Use current mode if available, otherwise default to conventional with 50% agent usage
      const mode = currentState.phase !== 'start' && currentState.phase !== 'agentQuestion'
        ? (currentState as any).mode
        : 'conventional';
      const agentUsage: AgentUsageLevel = currentState.phase !== 'start' && currentState.phase !== 'agentQuestion'
        ? (currentState as any).agentUsage
        : 50;
      onJumpToPhase(phase, mode, agentUsage);
    } else {
      onJumpToPhase(phase);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        borderTop: `2px solid ${theme.colors.primary}`,
        padding: '8px 12px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        zIndex: 9999,
        fontSize: '11px',
        fontFamily: theme.fonts.monospace || 'monospace',
      }}
    >
      <div
        style={{
          color: theme.colors.text,
          opacity: 0.5,
          marginRight: '8px',
          alignSelf: 'center',
          fontWeight: theme.fontWeights.bold,
        }}
      >
        DEV:
      </div>
      {phases.map(({ label, phase, requiresMode }) => {
        const isActive = currentState.phase === phase;
        return (
          <button
            key={phase}
            onClick={() => handleClick(phase, requiresMode)}
            style={{
              padding: '4px 12px',
              backgroundColor: isActive ? theme.colors.primary : `${theme.colors.primary}20`,
              color: theme.colors.text,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: isActive ? theme.fontWeights.bold : theme.fontWeights.body,
              opacity: isActive ? 1 : 0.6,
              whiteSpace: 'nowrap',
              fontFamily: theme.fonts.monospace || 'monospace',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = isActive ? '1' : '0.6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {label}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <button
        onClick={() => handleClick('testing', true)}
        style={{
          padding: '4px 12px',
          backgroundColor: `${theme.colors.secondary}40`,
          color: theme.colors.text,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: theme.fontWeights.body,
          opacity: 0.6,
          whiteSpace: 'nowrap',
          fontFamily: theme.fonts.monospace || 'monospace',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.6';
        }}
      >
        Conv
      </button>
      <button
        onClick={() => onJumpToPhase('testing', 'principal', 50 as AgentUsageLevel)}
        style={{
          padding: '4px 12px',
          backgroundColor: `${theme.colors.primary}40`,
          color: theme.colors.text,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: theme.fontWeights.body,
          opacity: 0.6,
          whiteSpace: 'nowrap',
          fontFamily: theme.fonts.monospace || 'monospace',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.6';
        }}
      >
        Princ
      </button>
    </div>
  );
}
