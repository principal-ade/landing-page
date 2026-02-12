"use client";

import React from 'react';
import ClientThemeProvider from '@/components/providers/ClientThemeProvider';
import { useTheme } from '@principal-ade/industry-theme';
import { useGameEngine } from './hooks/useGameEngine';
import { StartScreen } from './screens/StartScreen';
import { AgentQuestionScreen } from './screens/AgentQuestionScreen';
import { TestingScreen } from './screens/TestingScreen';

/**
 * Game v2 - Clean Architecture Implementation
 * Demonstrates separation of concerns and state machine pattern
 */
function GameContent() {
  const { theme } = useTheme();
  const { state, handlers } = useGameEngine();

  // Render appropriate screen based on state
  const renderScreen = () => {
    switch (state.phase) {
      case 'start':
        return <StartScreen onContinue={handlers.continue} />;

      case 'agentQuestion':
        return (
          <AgentQuestionScreen
            selectedUsage={state.selection}
            onSelectUsage={handlers.selectUsage}
            onContinue={handlers.continue}
          />
        );

      case 'testing':
        return (
          <TestingScreen
            mode={state.mode}
            onBack={handlers.goBack}
            onTestLocally={handlers.startTest}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Main container */}
      <div
        style={{
          width: '100%',
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '60px',
            maxWidth: '1400px',
            width: '100%',
            alignItems: 'center',
            padding: '60px 40px',
          }}
        >
          {/* Render current screen */}
          {renderScreen()}

          {/* Debug info - remove in production */}
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '12px',
              background: theme.colors.primary + '20',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: theme.colors.text,
              opacity: 0.5,
            }}
          >
            Phase: {state.phase}
            {state.phase === 'agentQuestion' && ` | Selection: ${state.selection ?? 'none'}`}
            {state.phase === 'testing' && ` | Mode: ${state.mode}`}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Game2Page() {
  return (
    <ClientThemeProvider>
      <GameContent />
    </ClientThemeProvider>
  );
}
