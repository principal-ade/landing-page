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
import { PrincipalProductionScreen } from './screens/PrincipalProductionScreen';
// DevProgressBar import removed - commented out in production
// GameState, GameMode, AgentUsageLevel imports removed - only used by commented-out dev code

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

  // Development only: handler for jumping to specific phases (commented out for production)
  // const handleJumpToPhase = (phase: GameState['phase'], mode?: GameMode, agentUsage?: AgentUsageLevel) => {
  //   let newState: GameState;
  //
  //   if (phase === 'start') {
  //     newState = { phase: 'start' };
  //   } else if (phase === 'agentQuestion') {
  //     newState = { phase: 'agentQuestion', selection: null };
  //   } else {
  //     // All other phases require mode and agentUsage
  //     const finalMode = mode || 'conventional';
  //     const finalAgentUsage: AgentUsageLevel = agentUsage || 50;
  //     newState = { phase, mode: finalMode, agentUsage: finalAgentUsage } as GameState;
  //   }
  //
  //   handlers.jumpToState(newState);
  // };

  // Sync maze state when jumping to phases (for dev progress bar)
  useEffect(() => {
    if (state.phase === 'testing' || state.phase === 'testing-running' || state.phase === 'test-complete' || state.phase === 'deploy-question' || state.phase === 'cost-info' || state.phase === 'deployed-running' || state.phase === 'incident-active' || state.phase === 'incident-resolved') {
      // Set mode
      gameState.setMode(state.mode);

      // If we're at test-complete or beyond, ensure test has been run
      if ((state.phase === 'test-complete' || state.phase === 'deploy-question' || state.phase === 'cost-info' || state.phase === 'deployed-running' || state.phase === 'incident-active' || state.phase === 'incident-resolved') && !gameState.testedLocally) {
        gameState.handleTestLocally();
      }

      // If we're at deployed phases, ensure deploy has been called
      if ((state.phase === 'deployed-running' || state.phase === 'incident-active' || state.phase === 'incident-resolved') && !gameState.deployed) {
        gameState.handleDeploy();
      }

      // If we're at incident phases, ensure incident has started
      if ((state.phase === 'incident-active' || state.phase === 'incident-resolved') && !gameState.started) {
        gameState.startIncident();
      }
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

  // Auto-transition to incident-resolved when bug is fixed
  useEffect(() => {
    if (state.phase === 'incident-active' && gameState.bugFixed) {
      const timer = setTimeout(() => handlers.continue(), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.phase, gameState.bugFixed, handlers]);

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
        // Use PrincipalProductionScreen for principal mode, ProductionScreen for conventional
        if (state.mode === 'principal') {
          return (
            <PrincipalProductionScreen
              phase={state.phase}
              onBack={handlers.goBack}
              onContinue={handlers.continue}
              gameState={gameState}
              agentUsage={state.agentUsage}
            />
          );
        } else {
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
              gameState={gameState}
              agentUsage={state.agentUsage}
            />
          );
        }

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
          from { opacity: 0; }
          to { opacity: 1; }
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

          {/* Debug info - commented out for production */}
          {/* <div
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
          </div> */}
        </div>
      </div>

      {/* Development progress bar - commented out for production */}
      {/* <DevProgressBar currentState={state} onJumpToPhase={handleJumpToPhase} /> */}
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
