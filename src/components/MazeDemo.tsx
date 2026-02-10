"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { MazeGenerator } from "@/lib/mazeGenerator";

interface MazeDemoProps {
  width?: number;
  height?: number;
  mazeSeed?: number;
}

interface RevealedCell {
  col: number;
  row: number;
}

export const MazeDemo: React.FC<MazeDemoProps> = ({
  width,
  height,
  mazeSeed,
}) => {
  const { theme } = useTheme();

  // Use fixed dimensions for calculations but allow SVG to be responsive
  const baseWidth = 450;
  const baseHeight = 620;

  // Maze configuration
  const gridSize = 10;
  const cellSize = 30;
  const padding = 50;
  const mazeWidth = gridSize * cellSize;
  const mazeHeight = gridSize * cellSize;
  const mazeX = (baseWidth - mazeWidth) / 2;

  // Key positions
  const startCol = 0;
  const startRow = 0;
  const destCol = 9;
  const destRow = 9;

  // State
  const [revealedCells, setRevealedCells] = useState<RevealedCell[]>([]);
  const [directionHint, setDirectionHint] = useState<string>("");
  const [timeCost, setTimeCost] = useState<number>(0);
  const [clickCost, setClickCost] = useState<number>(0);
  const [blockageFound, setBlockageFound] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [currentSeed, setCurrentSeed] = useState<number>(() => Math.floor(Math.random() * 10000));
  const [blockageInjected, setBlockageInjected] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [testedLocally, setTestedLocally] = useState<boolean>(false);
  const [testPath, setTestPath] = useState<RevealedCell[]>([]);
  const [revealedPathIndex, setRevealedPathIndex] = useState<number>(0);
  const [mode, setMode] = useState<'start' | 'initial' | 'no-agentic' | 'agentic' | 'principal'>('start');
  const [revenue, setRevenue] = useState<number>(0);
  const [previousIncidentCost, setPreviousIncidentCost] = useState<number>(0);
  const [previousMode, setPreviousMode] = useState<'no-agentic' | 'agentic' | null>(null);

  // Total incident cost
  const incidentCost = timeCost + clickCost;

  // Update currentSeed when mazeSeed prop changes (only if provided)
  useEffect(() => {
    if (mazeSeed !== undefined) {
      setCurrentSeed(mazeSeed);
    }
  }, [mazeSeed]);

  // Increment time cost
  useEffect(() => {
    if (blockageFound || !startTime || !started) return;

    const interval = setInterval(() => {
      setTimeCost(prev => prev + 1);
    }, 10);

    return () => clearInterval(interval);
  }, [blockageFound, startTime, started]);

  // Progressive path reveal animation
  useEffect(() => {
    if (!testedLocally || testPath.length === 0) {
      setRevealedPathIndex(0);
      return;
    }

    if (revealedPathIndex >= testPath.length) return;

    const timer = setTimeout(() => {
      setRevealedPathIndex(prev => prev + 1);
    }, 50); // Reveal one cell every 50ms

    return () => clearTimeout(timer);
  }, [testedLocally, testPath.length, revealedPathIndex]);

  // Increment revenue while deployed but before incident starts
  useEffect(() => {
    if (!deployed || started) return;

    const interval = setInterval(() => {
      setRevenue(prev => prev + 10);
    }, 100); // Increment revenue by $10 every 100ms

    return () => clearInterval(interval);
  }, [deployed, started]);

  // Generate maze
  const { horizontalWalls, verticalWalls, blockageWall, actualBlockageCol, actualBlockageRow } = useMemo(() => {
    let seed = currentSeed;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const originalRandom = Math.random;
    Math.random = seededRandom;

    const generator = new MazeGenerator(gridSize, gridSize);
    generator.generate(startRow, startCol);

    let blockCell = { row: 5, col: 5 } as any;
    let direction: 'north' | 'south' | 'east' | 'west' = 'east';
    let blockageWall: any = null;

    if (blockageInjected) {
      const path = generator.findPath(startRow, startCol, destRow, destCol);

      if (path.length > 2) {
        const middleStart = Math.floor(path.length * 0.3);
        const middleEnd = Math.floor(path.length * 0.7);
        const blockIndex = Math.floor(seededRandom() * (middleEnd - middleStart)) + middleStart;
        blockCell = path[blockIndex];

        if (blockIndex < path.length - 1) {
          const nextCell = path[blockIndex + 1];
          const rowDiff = nextCell.row - blockCell.row;
          const colDiff = nextCell.col - blockCell.col;

          if (rowDiff === 1) direction = 'south';
          else if (rowDiff === -1) direction = 'north';
          else if (colDiff === 1) direction = 'east';
          else if (colDiff === -1) direction = 'west';
        }
      }

      generator.addBlockage(blockCell.row, blockCell.col, direction);
    }

    const walls = generator.getWalls();

    if (blockageInjected) {
      if (direction === 'east' || direction === 'west') {
        const targetCol = direction === 'east' ? blockCell.col + 1 : blockCell.col;
        const targetRow = blockCell.row;

        const wallSegment = walls.vertical.find(wall => {
          const [col, row1, , row2] = wall;
          return col === targetCol && row1 <= targetRow && row2 > targetRow;
        });

        if (wallSegment) {
          const [col, row1, , row2] = wallSegment;
          blockageWall = { type: 'vertical' as const, col, row1, row2 };
        }
      } else {
        const targetRow = direction === 'south' ? blockCell.row + 1 : blockCell.row;
        const targetCol = blockCell.col;

        const wallSegment = walls.horizontal.find(wall => {
          const [col1, row, col2] = wall;
          return row === targetRow && col1 <= targetCol && col2 > targetCol;
        });

        if (wallSegment) {
          const [col1, row, col2] = wallSegment;
          blockageWall = { type: 'horizontal' as const, row, col1, col2 };
        }
      }
    }

    Math.random = originalRandom;

    return {
      horizontalWalls: walls.horizontal,
      verticalWalls: walls.vertical,
      blockageWall,
      actualBlockageCol: blockCell.col,
      actualBlockageRow: blockCell.row,
    };
  }, [currentSeed, blockageInjected]);

  // Handlers
  const handleModeSelect = (selectedMode: 'no-agentic' | 'agentic') => {
    setMode(selectedMode);
    setTestedLocally(false);
    setTestPath([]);
    setRevenue(0);
  };

  const handleTestLocally = () => {
    // Generate the path from start to destination
    let seed = currentSeed;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const originalRandom = Math.random;
    Math.random = seededRandom;

    const generator = new MazeGenerator(gridSize, gridSize);
    generator.generate(startRow, startCol);
    const path = generator.findPath(startRow, startCol, destRow, destCol);

    Math.random = originalRandom;

    // Convert path to RevealedCell format
    const pathCells = path.map(cell => ({ col: cell.col, row: cell.row }));
    setTestPath(pathCells);
    setTestedLocally(true);
  };

  const handleDeploy = () => {
    setDeployed(true);
    setTimeout(() => {
      setBlockageInjected(true);
      setStarted(true);
      setStartTime(Date.now());
    }, 3000);
  };

  const handleTryPrincipal = () => {
    // Store the current incident cost and mode for comparison
    setPreviousIncidentCost(incidentCost);
    setPreviousMode(mode as 'no-agentic' | 'agentic');
    setMode('principal');
    setRevealedCells([]);
    setDirectionHint("");
    setBlockageFound(false);
    setTimeCost(0);
    setClickCost(0);
    setStartTime(null);
    setStarted(false);
    setDeployed(false);
    setBlockageInjected(false);
    setTestedLocally(false);
    setTestPath([]);
    setRevenue(0);
  };

  const handleTryAgain = () => {
    setRevealedCells([]);
    setDirectionHint("");
    setBlockageFound(false);
    setTimeCost(0);
    setClickCost(0);
    setStartTime(null);
    setStarted(false);
    setBlockageInjected(false);
    setDeployed(false);
    setTestedLocally(false);
    setTestPath([]);
    setMode('start');
    setCurrentSeed(Math.floor(Math.random() * 10000));
    setRevenue(0);
    setPreviousIncidentCost(0);
    setPreviousMode(null);
  };

  const handleCellClick = useCallback((col: number, row: number) => {
    if (blockageFound || !started) return;

    const alreadyRevealed = revealedCells.some(
      cell => cell.col === col && cell.row === row
    );

    if (alreadyRevealed) return;

    setClickCost(prev => prev + 500);
    setRevealedCells([...revealedCells, { col, row }]);

    const isBlockageCell = col === actualBlockageCol && row === actualBlockageRow;

    if (isBlockageCell) {
      setDirectionHint("Blockage Found!");
      setBlockageFound(true);

      // Reveal surrounding cells within 3 block radius
      const cellsToReveal: RevealedCell[] = [...revealedCells];
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const distance = Math.abs(actualBlockageCol - c) + Math.abs(actualBlockageRow - r);
          if (distance <= 3) {
            const alreadyInList = cellsToReveal.some(
              cell => cell.col === c && cell.row === r
            );
            if (!alreadyInList) {
              cellsToReveal.push({ col: c, row: r });
            }
          }
        }
      }
      setRevealedCells(cellsToReveal);
    } else if (mode !== 'principal') {
      // Only show hint every 5 clicks in non-principal modes
      if (revealedCells.length > 0 && (revealedCells.length + 1) % 5 === 0) {
        const colDiff = actualBlockageCol - col;
        const rowDiff = actualBlockageRow - row;

        // Show only one direction - prioritize the larger distance
        let direction = "";
        if (Math.abs(rowDiff) > Math.abs(colDiff)) {
          direction = rowDiff > 0 ? "South" : "North";
        } else if (Math.abs(colDiff) > Math.abs(rowDiff)) {
          direction = colDiff > 0 ? "East" : "West";
        } else {
          // If equal, pick row direction
          direction = rowDiff > 0 ? "South" : "North";
        }

        setDirectionHint(direction);
      } else {
        setDirectionHint("");
      }
    }
  }, [blockageFound, started, revealedCells, actualBlockageCol, actualBlockageRow, gridSize, mode]);

  // Principal AI - Automated search when incident starts
  useEffect(() => {
    if (mode !== 'principal' || !started || blockageFound || testPath.length === 0) return;

    // Find telemetry points
    const telemetryIndices: number[] = [];
    testPath.forEach((_, idx) => {
      if (idx === 0 || idx === testPath.length - 1 || idx % 5 === 0) {
        telemetryIndices.push(idx);
      }
    });

    // Find the blockage index in the path
    const blockagePathIndex = testPath.findIndex(
      cell => cell.col === actualBlockageCol && cell.row === actualBlockageRow
    );

    if (blockagePathIndex === -1) return;

    // Find the last telemetry point before the blockage
    let lastTelemetryBeforeBlockage = -1;
    for (let i = telemetryIndices.length - 1; i >= 0; i--) {
      if (telemetryIndices[i] < blockagePathIndex) {
        lastTelemetryBeforeBlockage = telemetryIndices[i];
        break;
      }
    }

    if (lastTelemetryBeforeBlockage === -1) return;

    // Start automated clicking from the last telemetry point toward the blockage
    let currentIndex = lastTelemetryBeforeBlockage;

    const interval = setInterval(() => {
      if (currentIndex >= blockagePathIndex) {
        clearInterval(interval);
        return;
      }

      currentIndex++;
      const cell = testPath[currentIndex];
      handleCellClick(cell.col, cell.row);

      if (currentIndex >= blockagePathIndex) {
        clearInterval(interval);
      }
    }, 300); // Click every 300ms

    return () => clearInterval(interval);
  }, [mode, started, blockageFound, testPath, actualBlockageCol, actualBlockageRow, handleCellClick]);

  // Render maze
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

  const getTitle = () => {
    if (mode === 'start') return "Software Development Lifecycle";
    if (mode === 'principal') return "With Principal AI";
    if (mode === 'agentic') return "Agentic";
    if (mode === 'no-agentic') return "Artisanal";
    return "Choose Your Approach";
  };

  const showCover = mode === 'agentic' || (deployed && mode === 'no-agentic') || (deployed && mode === 'principal');
  const coverOpacity = 1;
  const mazeOpacity = 1;

  return (
    <svg
      width={width || "100%"}
      height={height || "100%"}
      viewBox={`0 0 ${baseWidth} ${baseHeight}`}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      {/* Background */}
      <rect x={0} y={0} width={baseWidth} height={baseHeight} fill={theme.colors.background} />

      {/* Title */}
      {mode !== 'start' && (
        <text x={baseWidth / 2} y={25} textAnchor="middle" fill={theme.colors.primary} fontSize={theme.fontSizes[2]} fontWeight={theme.fontWeights.bold} fontFamily={theme.fonts.body}>
          {getTitle()}
        </text>
      )}

      {/* Revenue Counter - shown when deployed */}
      {deployed && (
        <g>
          <text
            x={baseWidth / 2}
            y={42}
            textAnchor="middle"
            fontSize={theme.fontSizes[1]}
            fill={theme.colors.success}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            Revenue: ${revenue.toLocaleString()}
          </text>
        </g>
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
            x={mazeX - 5}
            y={padding - 5}
            textAnchor="end"
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
            x={mazeX + mazeWidth + 5}
            y={padding + mazeHeight + 15}
            textAnchor="start"
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
                onClick={() => handleCellClick(col, row)}
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

      {/* Start button */}
      {mode === 'start' && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => setMode('initial')}
          >
            <rect
              x={mazeX}
              y={padding + mazeHeight / 2 - 40}
              width={mazeWidth}
              height={80}
              fill={theme.colors.primary}
              rx="8"
            />
            <text
              x={mazeX + mazeWidth / 2}
              y={padding + mazeHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[4]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Start Software Development
            </text>
          </g>
        </g>
      )}

      {/* Initial mode selection */}
      {mode === 'initial' && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => handleModeSelect('no-agentic')}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 130}
              y={60}
              width={120}
              height={40}
              fill={theme.colors.secondary}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2 - 70}
              y={83}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[0]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Artisanal
            </text>
          </g>

          <g
            style={{ cursor: 'pointer' }}
            onClick={() => handleModeSelect('agentic')}
          >
            <rect
              x={mazeX + mazeWidth / 2 + 10}
              y={60}
              width={120}
              height={40}
              fill={theme.colors.primary}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2 + 70}
              y={83}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[0]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Agentic
            </text>
          </g>
        </g>
      )}

      {/* Test Locally button - shown first after selecting mode */}
      {(mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') && !testedLocally && !deployed && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={handleTestLocally}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 60}
              y={padding + mazeHeight + 25}
              width={120}
              height={40}
              fill={theme.colors.primary}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2}
              y={padding + mazeHeight + 48}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[2]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Test Locally
            </text>
          </g>
        </g>
      )}

      {/* Testing status - shown while path is revealing */}
      {(mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') && testedLocally && revealedPathIndex < testPath.length && !deployed && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 20}
            width={mazeWidth}
            height={35}
            fill={theme.colors.primary}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 42}
            textAnchor="middle"
            fontSize={theme.fontSizes[2]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            Testing...
          </text>
        </g>
      )}

      {/* Test Successful status - shown after path is fully revealed */}
      {(mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') && testedLocally && revealedPathIndex >= testPath.length && testPath.length > 0 && !deployed && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 20}
            width={mazeWidth}
            height={35}
            fill={theme.colors.success}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 42}
            textAnchor="middle"
            fontSize={theme.fontSizes[2]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            Test Successful
          </text>
        </g>
      )}

      {/* Deploy and Back buttons - shown after testing locally */}
      {(mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') && testedLocally && revealedPathIndex >= testPath.length && testPath.length > 0 && !deployed && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setMode('initial');
              setTestedLocally(false);
              setTestPath([]);
              setRevenue(0);
            }}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 130}
              y={padding + mazeHeight + 65}
              width={120}
              height={40}
              fill={theme.colors.primary}
              opacity="0.3"
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2 - 70}
              y={padding + mazeHeight + 88}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[2]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Back
            </text>
          </g>

          <g
            style={{ cursor: 'pointer' }}
            onClick={handleDeploy}
          >
            <rect
              x={mazeX + mazeWidth / 2 + 10}
              y={padding + mazeHeight + 65}
              width={120}
              height={40}
              fill={theme.colors.secondary}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2 + 70}
              y={padding + mazeHeight + 88}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[2]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              DEPLOY
            </text>
          </g>
        </g>
      )}

      {/* Running fine message */}
      {deployed && !started && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 20}
            width={mazeWidth}
            height={35}
            fill={theme.colors.success}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 35}
            textAnchor="middle"
            fontSize={theme.fontSizes[0]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.body}
            fontFamily={theme.fonts.body}
          >
            Deployment Successful
          </text>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 50}
            textAnchor="middle"
            fontSize={theme.fontSizes[1]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            All systems operational
          </text>
        </g>
      )}

      {/* Incident cost */}
      {started && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 20}
            width={mazeWidth}
            height={35}
            fill={incidentCost < 1000 ? theme.colors.warning : theme.colors.error}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 35}
            textAnchor="middle"
            fontSize={theme.fontSizes[0]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.body}
            fontFamily={theme.fonts.body}
          >
            Incident Cost
          </text>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 50}
            textAnchor="middle"
            fontSize={theme.fontSizes[3]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            ${incidentCost.toLocaleString()}
          </text>
        </g>
      )}

      {/* Cost savings after Principal mode resolves */}
      {mode === 'principal' && blockageFound && previousIncidentCost > 0 && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 60}
            width={mazeWidth}
            height={30}
            fill={theme.colors.success}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 75}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={theme.fontSizes[0]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.body}
            fontFamily={theme.fonts.body}
          >
            You saved ${(previousIncidentCost - incidentCost).toLocaleString()} vs {previousMode === 'agentic' ? 'Agentic' : 'Artisanal'}
          </text>
        </g>
      )}

      {/* Hints below incident cost */}
      {started && revealedCells.length === 0 && !blockageFound && (
        <g>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 70}
            textAnchor="middle"
            fontSize={theme.fontSizes[1]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.body}
            fontFamily={theme.fonts.body}
          >
            It&apos;s 3:00 AM - Find the blockage!
          </text>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 88}
            textAnchor="middle"
            fontSize={theme.fontSizes[0]}
            fill={theme.colors.text}
            opacity="0.7"
            fontWeight={theme.fontWeights.body}
            fontFamily={theme.fonts.body}
          >
            Click to inspect the deployment
          </text>
        </g>
      )}

      {started && revealedCells.length > 0 && directionHint && !blockageFound && (revealedCells.length % 5 === 0) && (
        <g>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 70}
            textAnchor="middle"
            fontSize={theme.fontSizes[1]}
            fill={theme.colors.text}
            fontWeight={theme.fontWeights.bold}
            fontFamily={theme.fonts.body}
          >
            {directionHint}
          </text>
        </g>
      )}

      {/* Try Again / Try with Principal buttons */}
      {started && blockageFound && mode !== 'principal' && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={handleTryAgain}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 130}
              y={padding + mazeHeight + 65}
              width={120}
              height={25}
              fill={theme.colors.primary}
              opacity="0.2"
              rx="4"
            />
            <text
              x={mazeX + mazeWidth / 2 - 70}
              y={padding + mazeHeight + 79.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[0]}
              fill={theme.colors.primary}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Try Again
            </text>
          </g>

          <g
            style={{ cursor: 'pointer' }}
            onClick={handleTryPrincipal}
          >
            <rect
              x={mazeX + mazeWidth / 2 + 10}
              y={padding + mazeHeight + 65}
              width={150}
              height={25}
              fill={theme.colors.primary}
              opacity="0.8"
              rx="4"
            />
            <text
              x={mazeX + mazeWidth / 2 + 85}
              y={padding + mazeHeight + 79.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[0]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Try with Principal AI
            </text>
          </g>
        </g>
      )}

      {/* Principal mode - Schedule A Call button (after blockage found) */}
      {mode === 'principal' && blockageFound && previousIncidentCost > 0 && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // Navigate to demo page
              if (typeof window !== 'undefined') {
                window.location.href = '/demo';
              }
            }}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 90}
              y={padding + mazeHeight + 95}
              width={180}
              height={25}
              fill={theme.colors.primary}
              opacity="0.9"
              rx="4"
            />
            <text
              x={mazeX + mazeWidth / 2}
              y={padding + mazeHeight + 109.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={theme.fontSizes[0]}
              fill={theme.colors.text}
              fontWeight={theme.fontWeights.bold}
              fontFamily={theme.fonts.body}
              pointerEvents="none"
            >
              Schedule A Call Today
            </text>
          </g>
        </g>
      )}
    </svg>
  );
};
