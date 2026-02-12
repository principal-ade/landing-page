"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { useMazeGame } from "@/hooks/useMazeGame";
import { MazeCanvas } from "./maze/MazeCanvas";

interface MazeDemoProps {
  width?: number;
  height?: number;
  mazeSeed?: number;
}

export const MazeDemo: React.FC<MazeDemoProps> = ({
  width,
  height,
  mazeSeed,
}) => {
  const { theme } = useTheme();
  const gameState = useMazeGame({ mazeSeed });

  // Responsive window width tracking
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const {
    mode,
    revealedCells,
    directionHint,
    incidentCost,
    blockageFound,
    started,
    deployed,
    testedLocally,
    testPath,
    revealedPathIndex,
    previousIncidentCost,
    previousMode,
    baseWidth,
    baseHeight,
    handleModeSelect,
    handleTestLocally,
    handleDeploy,
    handleTryPrincipal,
    handleTryAgain,
    handleCellClick,
    setMode,
  } = gameState;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      padding: isMobile ? '20px 16px' : '40px 20px',
      width: '100%',
    }}>
      {/* Maze SVG - now independent */}
      <svg
        width={width || baseWidth}
        height={height || baseHeight}
        viewBox={`0 0 ${baseWidth} ${baseHeight}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <MazeCanvas {...gameState} onCellClick={handleCellClick} />
      </svg>

      {/* Start button */}
      {mode === 'start' && (
        <button
          onClick={() => setMode('initial')}
          style={{
            padding: isMobile ? '16px 32px' : '20px 60px',
            background: theme.colors.primary,
            border: 'none',
            borderRadius: '12px',
            fontSize: isMobile ? '18px' : '24px',
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Start Software Development
        </button>
      )}

      {/* Mode selection buttons */}
      {mode === 'initial' && (
        <div style={{
          display: 'flex',
          gap: '16px',
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <button
            onClick={() => handleModeSelect('conventional')}
            style={{
              padding: isMobile ? '14px 28px' : '16px 40px',
              background: theme.colors.secondary,
              border: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s ease',
              minWidth: isMobile ? '200px' : '140px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.secondary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Artisanal
          </button>
          <button
            onClick={() => handleModeSelect('principal')}
            style={{
              padding: isMobile ? '14px 28px' : '16px 40px',
              background: theme.colors.primary,
              border: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s ease',
              minWidth: isMobile ? '200px' : '140px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Agentic
          </button>
        </div>
      )}

      {/* Test Locally button */}
      {(mode === 'conventional' || mode === 'principal') && !testedLocally && !deployed && (
        <button
          onClick={handleTestLocally}
          style={{
            padding: isMobile ? '14px 28px' : '16px 40px',
            background: theme.colors.primary,
            border: 'none',
            borderRadius: '8px',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Test Locally
        </button>
      )}

      {/* Testing status */}
      {(mode === 'conventional' || mode === 'principal') && testedLocally && revealedPathIndex < testPath.length && !deployed && (
        <div style={{
          background: theme.colors.primary,
          padding: '16px 24px',
          borderRadius: '8px',
          opacity: 0.9,
          minWidth: isMobile ? '250px' : '300px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}>
            Testing...
          </div>
        </div>
      )}

      {/* Test Successful status */}
      {(mode === 'conventional' || mode === 'principal') && testedLocally && revealedPathIndex >= testPath.length && testPath.length > 0 && !deployed && (
        <div style={{
          background: theme.colors.success,
          padding: '16px 24px',
          borderRadius: '8px',
          opacity: 0.9,
          minWidth: isMobile ? '250px' : '300px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}>
            Test Successful
          </div>
        </div>
      )}

      {/* Deploy and Back buttons */}
      {(mode === 'conventional' || mode === 'principal') && testedLocally && revealedPathIndex >= testPath.length && testPath.length > 0 && !deployed && (
        <div style={{
          display: 'flex',
          gap: '16px',
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <button
            onClick={() => setMode('initial')}
            style={{
              padding: isMobile ? '14px 28px' : '16px 40px',
              background: theme.colors.primary,
              border: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s ease',
              opacity: 0.3,
              minWidth: isMobile ? '200px' : '140px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.3';
            }}
          >
            Back
          </button>
          <button
            onClick={handleDeploy}
            style={{
              padding: isMobile ? '14px 28px' : '16px 40px',
              background: theme.colors.secondary,
              border: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s ease',
              minWidth: isMobile ? '200px' : '140px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.secondary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            DEPLOY
          </button>
        </div>
      )}

      {/* Running fine message */}
      {deployed && !started && (
        <div style={{
          background: theme.colors.success,
          padding: '16px 24px',
          borderRadius: '8px',
          opacity: 0.9,
          minWidth: isMobile ? '250px' : '300px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.body,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
            marginBottom: '8px',
          }}>
            Deployment Successful
          </div>
          <div style={{
            fontSize: theme.fontSizes[1],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}>
            All systems operational
          </div>
        </div>
      )}

      {/* Incident cost */}
      {started && (
        <div style={{
          background: incidentCost < 1000 ? theme.colors.warning : theme.colors.error,
          padding: '16px 24px',
          borderRadius: '8px',
          opacity: 0.9,
          minWidth: isMobile ? '250px' : '300px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.body,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
            marginBottom: '8px',
          }}>
            Incident Cost
          </div>
          <div style={{
            fontSize: theme.fontSizes[3],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}>
            ${incidentCost.toLocaleString()}
          </div>
        </div>
      )}

      {/* Cost savings after Principal mode resolves */}
      {mode === 'principal' && blockageFound && previousIncidentCost > 0 && (
        <div style={{
          background: theme.colors.success,
          padding: '12px 20px',
          borderRadius: '8px',
          opacity: 0.9,
          minWidth: isMobile ? '250px' : '300px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.body,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
          }}>
            You saved ${(previousIncidentCost - incidentCost).toLocaleString()} vs {previousMode === 'conventional' ? 'Artisanal' : 'Principal'}
          </div>
        </div>
      )}

      {/* Hints below incident cost */}
      {started && revealedCells.length === 0 && !blockageFound && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: theme.fontSizes[1],
            fontWeight: theme.fontWeights.body,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
            marginBottom: '8px',
          }}>
            It&apos;s 3:00 AM - Find the blockage!
          </div>
          <div style={{
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.body,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
            opacity: 0.7,
          }}>
            Click to inspect the deployment
          </div>
        </div>
      )}

      {started && revealedCells.length > 0 && directionHint && !blockageFound && (revealedCells.length % 5 === 0) && (
        <div style={{
          fontSize: theme.fontSizes[1],
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
          textAlign: 'center',
        }}>
          {directionHint}
        </div>
      )}

      {/* Try Again / Try with Principal buttons */}
      {started && blockageFound && mode !== 'principal' && (
        <div style={{
          display: 'flex',
          gap: '16px',
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <button
            onClick={handleTryAgain}
            style={{
              padding: isMobile ? '10px 24px' : '12px 32px',
              background: theme.colors.primary,
              border: 'none',
              borderRadius: '6px',
              fontSize: theme.fontSizes[0],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.primary,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s ease',
              opacity: 0.2,
              minWidth: isMobile ? '200px' : '140px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.2';
            }}
          >
            Try Again
          </button>
          <button
            onClick={handleTryPrincipal}
            style={{
              padding: isMobile ? '10px 24px' : '12px 32px',
              background: theme.colors.primary,
              border: 'none',
              borderRadius: '6px',
              fontSize: theme.fontSizes[0],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              cursor: 'pointer',
              fontFamily: theme.fonts.body,
              transition: 'all 0.2s ease',
              opacity: 0.8,
              minWidth: isMobile ? '200px' : '180px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Try with Principal AI
          </button>
        </div>
      )}

      {/* Principal mode - Schedule A Call button */}
      {mode === 'principal' && blockageFound && previousIncidentCost > 0 && (
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/demo';
            }
          }}
          style={{
            padding: isMobile ? '10px 24px' : '12px 32px',
            background: theme.colors.primary,
            border: 'none',
            borderRadius: '6px',
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            cursor: 'pointer',
            fontFamily: theme.fonts.body,
            transition: 'all 0.2s ease',
            opacity: 0.9,
            minWidth: isMobile ? '200px' : '220px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Schedule A Call Today
        </button>
      )}
    </div>
  );
};
