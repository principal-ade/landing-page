"use client";

import React from "react";
import { MazeCanvas } from "@/components/maze/MazeCanvas";

interface MazePanelProps {
  gameState: any; // All the game state from useMazeGame
  handleCellClick: (row: number, col: number) => void;
  agentUsage: number;
  isMobile: boolean;
  showMaze: boolean;
  showCoverOverlay?: boolean; // Explicit control over cover visibility
  animate?: boolean; // Control fade-in animation (default: false)
}

export function MazePanel({
  gameState,
  handleCellClick,
  agentUsage,
  isMobile,
  showMaze,
  showCoverOverlay,
  animate = false,
}: MazePanelProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: isMobile ? '20px 16px' : '40px 20px',
        animation: (showMaze && animate) ? 'fadeIn 0.5s ease-in' : 'none',
        maxWidth: '100%',
        maxHeight: '100%',
      }}>
        <svg
          width={gameState.baseWidth}
          height={gameState.baseHeight}
          viewBox={`0 0 ${gameState.baseWidth} ${gameState.baseHeight}`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        >
          <MazeCanvas
            {...gameState}
            onCellClick={handleCellClick}
            agentUsage={agentUsage}
            showCoverOverlay={showCoverOverlay}
          />
        </svg>
      </div>
    </div>
  );
}
