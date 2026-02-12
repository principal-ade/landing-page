"use client";

import React, { useEffect } from 'react';
import ClientThemeProvider from '@/components/providers/ClientThemeProvider';
import { useTheme } from '@principal-ade/industry-theme';
import { useGameEngine } from './hooks/useGameEngine';
import { useMazeGame } from '@/hooks/useMazeGame';
import { StartScreen } from './screens/StartScreen';
import { AgentQuestionScreen } from './screens/AgentQuestionScreen';
import { TestingScreen } from './screens/TestingScreen';
import { PrincipalTestingScreen } from './screens/PrincipalTestingScreen';
import { ProductionScreen } from './screens/ProductionScreen';

/**
 * Game v2 - Clean Architecture Implementation
 * Demonstrates separation of concerns and state machine pattern
 */
function GameContent() {
  const { theme } = useTheme();
  const { state, handlers } = useGameEngine();

  // Initialize maze game state
  const gameState = useMazeGame({
    incidentCostPerSecond: 220,
    startRevenue: true,
  });

  // Track window width for responsive padding
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Set maze mode when entering testing phase
  useEffect(() => {
    if (state.phase === 'testing' || state.phase === 'testing-running' || state.phase === 'test-complete' || state.phase === 'cost-info' || state.phase === 'deployed-running' || state.phase === 'incident-active' || state.phase === 'incident-resolved') {
      gameState.setMode(state.mode);
    }
  }, [state.phase, state, gameState]);

  // Transition from testing-running to test-complete when test finishes
  useEffect(() => {
    if (state.phase === 'testing-running' &&
        gameState.testedLocally &&
        gameState.revealedPathIndex >= gameState.testPath.length) {
      // Test animation complete, transition to test-complete
      handlers.testComplete();
    }
  }, [state.phase, gameState.testedLocally, gameState.revealedPathIndex, gameState.testPath.length, handlers]);

  // Transition from test-complete to deploy-question after pause
  useEffect(() => {
    if (state.phase === 'test-complete') {
      const timer = setTimeout(() => handlers.continue(), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.phase, handlers]);

  // Start incident when entering incident-active phase
  useEffect(() => {
    if (state.phase === 'incident-active' && !gameState.started) {
      gameState.startIncident();
    }
  }, [state.phase, gameState]);

  // Auto-transition to incident-resolved when blockage is found
  useEffect(() => {
    if (state.phase === 'incident-active' && gameState.blockageFound) {
      const timer = setTimeout(() => handlers.continue(), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, gameState.blockageFound, handlers]);

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
      case 'testing-running':
      case 'test-complete':
      case 'deploy-question':
        // Use PrincipalTestingScreen for principal mode, TestingScreen for conventional
        if (state.mode === 'principal') {
          return (
            <PrincipalTestingScreen
              phase={state.phase}
              onBack={handlers.goBack}
              onTestLocally={() => {
                gameState.handleTestLocally();
                handlers.startTest();
              }}
              onDeploy={() => {
                gameState.handleDeploy();
                handlers.deploy();
              }}
              gameState={gameState}
              agentUsage={state.agentUsage}
            />
          );
        } else {
          return (
            <TestingScreen
              mode={state.mode}
              phase={state.phase}
              onBack={handlers.goBack}
              onTestLocally={() => {
                gameState.handleTestLocally();
                handlers.startTest();
              }}
              onDeploy={() => {
                gameState.handleDeploy();
                handlers.deploy();
              }}
              gameState={gameState}
              agentUsage={state.agentUsage}
            />
          );
        }

      case 'cost-info':
      case 'deployed-running':
      case 'incident-active':
      case 'incident-resolved':
        return (
          <ProductionScreen
            mode={state.mode}
            phase={state.phase}
            onBack={handlers.goBack}
            onContinue={handlers.continue}
            onTryPrincipal={() => {
              gameState.handleTryPrincipal();
              handlers.tryPrincipal(state.agentUsage);
            }}
            onPlayAgain={() => {
              // TODO: Implement play again flow
            }}
            gameState={gameState}
            agentUsage={state.agentUsage}
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
          height: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
          paddingTop: isMobile || isTablet ? '0' : '80px',
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
            height: '100%',
            alignItems: 'center',
            padding: isMobile || isTablet ? '20px 40px' : '60px 40px',
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
