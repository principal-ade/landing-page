"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { RevealedCell, BlockageWall, GameMode } from "./types";

interface MazeCanvasProps {
  // Dimensions
  baseWidth: number;
  baseHeight: number;

  // Maze configuration
  gridSize: number;
  cellSize: number;
  padding: number;
  mazeWidth: number;
  mazeHeight: number;
  mazeX: number;

  // Key positions
  startCol: number;
  startRow: number;
  destCol: number;
  destRow: number;

  // State
  mode: GameMode;
  revealedCells: RevealedCell[];
  deployed: boolean;
  started: boolean;
  blockageFound: boolean;
  testedLocally: boolean;
  testPath: RevealedCell[];
  revealedPathIndex: number;

  // Maze data
  horizontalWalls: number[][];
  verticalWalls: number[][];
  blockageWall: BlockageWall | null;
  actualBlockageCol: number;
  actualBlockageRow: number;
  blockageInjected: boolean;

  // Agent usage for opacity control
  agentUsage?: number;

  // Cover overlay control
  showCoverOverlay?: boolean;

  // Handlers
  onCellClick: (col: number, row: number) => void;
}

export const MazeCanvas: React.FC<MazeCanvasProps> = ({
  baseWidth,
  baseHeight,
  gridSize,
  cellSize,
  padding,
  mazeWidth,
  mazeHeight,
  mazeX,
  startCol,
  startRow,
  destCol,
  destRow,
  mode,
  revealedCells,
  deployed,
  started,
  blockageFound,
  testedLocally,
  testPath,
  revealedPathIndex,
  horizontalWalls,
  verticalWalls,
  blockageWall,
  actualBlockageCol,
  actualBlockageRow,
  blockageInjected,
  agentUsage = 50,
  showCoverOverlay,
  onCellClick,
}) => {
  const { theme } = useTheme();

  const getTitle = () => {
    return "With Principal AI";
  };

  // Use explicit showCoverOverlay prop if provided, otherwise auto-detect
  const showCover = showCoverOverlay !== undefined
    ? showCoverOverlay
    : (testedLocally && mode === 'conventional') || (deployed && mode !== 'start' && mode !== 'initial');

  // Calculate opacity based on agent usage during testing phase
  // High agent usage = high opacity (less visible)
  // Low agent usage = low opacity (more visible)
  const calculateCoverOpacity = () => {
    if (!deployed) {
      // Before deployment (intro and testing phases), map agent usage to opacity
      // 25 (a little) → 0.45, 50 (moderately) → 0.80, 75 (a lot) → 0.90
      if (agentUsage === 25) return 0.45;
      if (agentUsage === 50) return 0.80;
      if (agentUsage === 75) return 0.90;
      return agentUsage / 100; // Fallback
    }
    // After deployment, full opacity
    return 1;
  };

  const coverOpacity = calculateCoverOpacity();
  const mazeOpacity = 1;

  const renderMaze = (showBlockage: boolean, opacity: number = 1) => {
    const elements = [];

    elements.push(
      <rect
        key="background"
        x={mazeX}
        y={padding}
        width={mazeWidth}
        height={mazeHeight}
        fill="none"
        stroke={theme.colors.primary}
        strokeWidth="3"
        opacity={0.3 * opacity}
      />
    );

    const isBlockageWall = (type: 'horizontal' | 'vertical', wall: number[]) => {
      if (!showBlockage || !blockageWall) return false;

      if (type === 'vertical') {
        const [x, y1, , y2] = wall;
        return (
          blockageWall.type === 'vertical' &&
          x === blockageWall.col &&
          y1 === blockageWall.row1 &&
          y2 === blockageWall.row2
        );
      } else if (type === 'horizontal') {
        const [x1, y, x2] = wall;
        return (
          blockageWall.type === 'horizontal' &&
          y === blockageWall.row &&
          x1 === blockageWall.col1 &&
          x2 === blockageWall.col2
        );
      }
      return false;
    };

    horizontalWalls.forEach((wall, idx) => {
      const [x1, y, x2] = wall;
      const isBlockage = isBlockageWall('horizontal', wall);

      elements.push(
        <line
          key={`h-wall-${idx}`}
          x1={mazeX + x1 * cellSize}
          y1={padding + y * cellSize}
          x2={mazeX + x2 * cellSize}
          y2={padding + y * cellSize}
          stroke={isBlockage ? theme.colors.error : theme.colors.primary}
          strokeWidth={isBlockage ? 4 : 2.5}
          strokeLinecap="round"
          opacity={opacity}
        >
          {isBlockage && showBlockage && (
            <animate
              attributeName="stroke-width"
              values="4;6;4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </line>
      );
    });

    verticalWalls.forEach((wall, idx) => {
      const [x, y1, , y2] = wall;
      const isBlockage = isBlockageWall('vertical', wall);

      elements.push(
        <line
          key={`v-wall-${idx}`}
          x1={mazeX + x * cellSize}
          y1={padding + y1 * cellSize}
          x2={mazeX + x * cellSize}
          y2={padding + y2 * cellSize}
          stroke={isBlockage ? theme.colors.error : theme.colors.primary}
          strokeWidth={isBlockage ? 4 : 2.5}
          strokeLinecap="round"
          opacity={opacity}
        >
          {isBlockage && showBlockage && (
            <animate
              attributeName="stroke-width"
              values="4;6;4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </line>
      );
    });

    for (let row = 0; row <= gridSize; row++) {
      elements.push(
        <line
          key={`grid-h-${row}`}
          x1={mazeX}
          y1={padding + row * cellSize}
          x2={mazeX + mazeWidth}
          y2={padding + row * cellSize}
          stroke={theme.colors.primary}
          strokeWidth="0.5"
          opacity={0.15 * opacity}
        />
      );
    }
    for (let col = 0; col <= gridSize; col++) {
      elements.push(
        <line
          key={`grid-v-${col}`}
          x1={mazeX + col * cellSize}
          y1={padding}
          x2={mazeX + col * cellSize}
          y2={padding + mazeHeight}
          stroke={theme.colors.primary}
          strokeWidth="0.5"
          opacity={0.15 * opacity}
        />
      );
    }

    return elements;
  };

  return (
    <>
      {/* Background */}
      <rect x={0} y={0} width={baseWidth} height={baseHeight} fill={theme.colors.background} />

      {/* Title - only show for principal mode during testing/incident */}
      {mode === 'principal' && (
        <text x={baseWidth / 2} y={25} textAnchor="middle" fill={theme.colors.primary} fontSize={theme.fontSizes[2]} fontWeight={theme.fontWeights.bold} fontFamily={theme.fonts.body}>
          {getTitle()}
        </text>
      )}

      {/* Maze - only show after mode is selected */}
      {mode !== 'start' && mode !== 'initial' && (
        <>
          <g>{renderMaze(mode === 'principal' || blockageFound, mazeOpacity)}</g>

          {/* Test path - behind the cover, truncated at blockage if started */}
          {testedLocally && testPath.length > 0 && revealedPathIndex >= testPath.length && deployed && (() => {
            let pathToShow = testPath;

            // If incident has started, truncate path at blockage
            if (started && blockageInjected) {
              const blockageIndex = testPath.findIndex(
                cell => cell.col === actualBlockageCol && cell.row === actualBlockageRow
              );
              if (blockageIndex !== -1) {
                pathToShow = testPath.slice(0, blockageIndex + 1);
              }
            }

            return (
              <g>
                {/* Draw path as connected line */}
                <polyline
                  points={pathToShow
                    .map(cell => {
                      const x = mazeX + (cell.col + 0.5) * cellSize;
                      const y = padding + (cell.row + 0.5) * cellSize;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  stroke={theme.colors.success}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.7"
                />
                {/* Draw dots at each path cell */}
                {pathToShow.map((cell, idx) => (
                  <circle
                    key={`path-${idx}`}
                    cx={mazeX + (cell.col + 0.5) * cellSize}
                    cy={padding + (cell.row + 0.5) * cellSize}
                    r="4"
                    fill={theme.colors.success}
                    opacity="0.8"
                  />
                ))}
              </g>
            );
          })()}
        </>
      )}

      {/* Cover overlay */}
      {showCover && (
        <>
          <defs>
            <mask id="mazeCoverMask">
              <rect
                x={mazeX}
                y={padding}
                width={mazeWidth}
                height={mazeHeight}
                fill="white"
              />
              {revealedCells.map((cell, idx) => (
                <rect
                  key={idx}
                  x={mazeX + cell.col * cellSize}
                  y={padding + cell.row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="black"
                />
              ))}
            </mask>
          </defs>

          <g>
            <rect
              x={mazeX}
              y={padding}
              width={mazeWidth}
              height={mazeHeight}
              fill={theme.colors.background}
              opacity={coverOpacity}
              mask="url(#mazeCoverMask)"
            />
            <rect
              x={mazeX}
              y={padding}
              width={mazeWidth}
              height={mazeHeight}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="3"
              opacity="0.4"
            />

          </g>
        </>
      )}

      {/* Principal mode - story-based telemetry indicators */}
      {mode === 'principal' && deployed && testPath.length > 0 && (() => {
        // Get every 5th point in the path (including first and last)
        const telemetryPoints: RevealedCell[] = [];
        testPath.forEach((cell, idx) => {
          if (idx === 0 || idx === testPath.length - 1 || idx % 5 === 0) {
            telemetryPoints.push(cell);
          }
        });

        // If incident started and blockage exists, truncate at blockage
        let pointsToShow = telemetryPoints;
        if (blockageInjected) {
          const blockageIndex = telemetryPoints.findIndex(
            cell => {
              const pathIndex = testPath.findIndex(
                p => p.col === cell.col && p.row === cell.row
              );
              const blockagePathIndex = testPath.findIndex(
                p => p.col === actualBlockageCol && p.row === actualBlockageRow
              );
              return pathIndex > blockagePathIndex;
            }
          );
          if (blockageIndex !== -1) {
            pointsToShow = telemetryPoints.slice(0, blockageIndex);
          }
        }

        return (
          <g>
            {/* Connect telemetry points with lines */}
            <polyline
              points={pointsToShow
                .map(cell => {
                  const x = mazeX + (cell.col + 0.5) * cellSize;
                  const y = padding + (cell.row + 0.5) * cellSize;
                  return `${x},${y}`;
                })
                .join(' ')}
              stroke={theme.colors.primary}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
              strokeDasharray="5,5"
            />
            {/* Draw dots at telemetry points */}
            {pointsToShow.map((cell, idx) => (
              <circle
                key={`telemetry-${idx}`}
                cx={mazeX + (cell.col + 0.5) * cellSize}
                cy={padding + (cell.row + 0.5) * cellSize}
                r="7"
                fill={theme.colors.primary}
                stroke={theme.colors.background}
                strokeWidth="2"
                opacity="0.9"
              >
                <animate
                  attributeName="r"
                  values="7;9;7"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        );
      })()}

      {/* START and DEST markers - rendered after cover to stay visible */}
      {mode !== 'start' && mode !== 'initial' && (
        <>
          {/* START markers */}
          <circle
            cx={mazeX + (startCol + 0.5) * cellSize}
            cy={padding + (startRow + 0.5) * cellSize}
            r="5"
            fill={deployed ? theme.colors.success : theme.colors.secondary}
          />
          <text
            x={mazeX - 10}
            y={padding + (startRow + 0.5) * cellSize}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={theme.fontSizes[0]}
            fill={deployed ? theme.colors.success : theme.colors.secondary}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            START
          </text>

          {/* DEST markers */}
          <g>
            <circle
              cx={mazeX + (destCol + 0.5) * cellSize}
              cy={padding + (destRow + 0.5) * cellSize}
              r="8"
              fill="none"
              stroke={started ? theme.colors.error : (deployed ? theme.colors.success : theme.colors.primary)}
              strokeWidth="1.5"
              opacity="0.5"
            />
            <circle
              cx={mazeX + (destCol + 0.5) * cellSize}
              cy={padding + (destRow + 0.5) * cellSize}
              r="5"
              fill="none"
              stroke={started ? theme.colors.error : (deployed ? theme.colors.success : theme.colors.primary)}
              strokeWidth="1.5"
              opacity="0.6"
            />
            <circle
              cx={mazeX + (destCol + 0.5) * cellSize}
              cy={padding + (destRow + 0.5) * cellSize}
              r="2"
              fill={started ? theme.colors.error : (deployed ? theme.colors.success : theme.colors.primary)}
              opacity="0.7"
            />
          </g>
          <text
            x={mazeX + mazeWidth + 10}
            y={padding + (destRow + 0.5) * cellSize}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={theme.fontSizes[0]}
            fill={started ? theme.colors.error : (deployed ? theme.colors.success : theme.colors.primary)}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            DEST
          </text>

          {/* Test path - animating during testing */}
          {testedLocally && testPath.length > 0 && revealedPathIndex > 0 && !deployed && (
            <g>
              {/* Draw path as connected line */}
              <polyline
                points={testPath
                  .slice(0, revealedPathIndex)
                  .map(cell => {
                    const x = mazeX + (cell.col + 0.5) * cellSize;
                    const y = padding + (cell.row + 0.5) * cellSize;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                stroke={theme.colors.success}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
              {/* Draw dots at each path cell */}
              {testPath.slice(0, revealedPathIndex).map((cell, idx) => (
                <circle
                  key={`path-${idx}`}
                  cx={mazeX + (cell.col + 0.5) * cellSize}
                  cy={padding + (cell.row + 0.5) * cellSize}
                  r="4"
                  fill={theme.colors.success}
                  opacity="0.8"
                />
              ))}

              {/* Principal mode - show telemetry dots as path reaches them (no connections yet) */}
              {mode === 'principal' && (() => {
                const telemetryIndices: number[] = [];
                testPath.forEach((_, idx) => {
                  if (idx === 0 || idx === testPath.length - 1 || idx % 5 === 0) {
                    telemetryIndices.push(idx);
                  }
                });

                return telemetryIndices
                  .filter(idx => idx < revealedPathIndex)
                  .map(idx => {
                    const cell = testPath[idx];
                    return (
                      <circle
                        key={`telemetry-testing-${idx}`}
                        cx={mazeX + (cell.col + 0.5) * cellSize}
                        cy={padding + (cell.row + 0.5) * cellSize}
                        r="7"
                        fill={theme.colors.primary}
                        stroke={theme.colors.background}
                        strokeWidth="2"
                        opacity="0.9"
                      >
                        <animate
                          attributeName="r"
                          values="7;9;7"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    );
                  });
              })()}
            </g>
          )}
        </>
      )}

      {/* Interactive cells */}
      {started && (
        <g>
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => (
              <rect
                key={`cell-${row}-${col}`}
                x={mazeX + col * cellSize}
                y={padding + row * cellSize}
                width={cellSize}
                height={cellSize}
                fill="transparent"
                stroke="none"
                style={{ cursor: 'pointer' }}
                onClick={() => onCellClick(col, row)}
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute('fill', theme.colors.secondary);
                  e.currentTarget.setAttribute('opacity', '0.1');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute('fill', 'transparent');
                  e.currentTarget.setAttribute('opacity', '1');
                }}
              />
            ))
          )}
        </g>
      )}
    </>
  );
};
