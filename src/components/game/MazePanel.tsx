"use client";

import React from "react";
import { MazeCanvas } from "@/components/maze/MazeCanvas";

interface MazePanelProps {
  gameState: any; // All the game state from useMazeGame
  handleCellClick: (row: number, col: number) => void;
  agentUsage: number;
  isMobile: boolean;
  showMaze: boolean;
}

export function MazePanel({
  gameState,
  handleCellClick,
  agentUsage,
  isMobile,
  showMaze,
}: MazePanelProps) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        alignSelf: "center", // Center the maze vertically
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        padding: isMobile ? '20px 16px' : '40px 20px',
        width: '100%',
        animation: showMaze ? 'fadeIn 0.5s ease-in' : 'none',
      }}>
        <svg
          width={gameState.baseWidth}
          height={gameState.baseHeight}
          viewBox={`0 0 ${gameState.baseWidth} ${gameState.baseHeight}`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <MazeCanvas
            {...gameState}
            onCellClick={handleCellClick}
            agentUsage={agentUsage}
          />
        </svg>
      </div>
    </div>
  );
}
