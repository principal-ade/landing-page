import { useMemo, useState, useEffect, useCallback } from "react";
import { MazeGenerator } from "@/lib/mazeGenerator";
import { RevealedCell, BlockageWall, GameMode } from "@/components/maze/types";

interface UseMazeGameProps {
  mazeSeed?: number;
  incidentCostPerSecond?: number;
  startRevenue?: boolean;
}

export interface UseMazeGameReturn {
  // State
  mode: GameMode;
  revealedCells: RevealedCell[];
  directionHint: string;
  timeCost: number;
  clickCost: number;
  incidentCost: number;
  incidentDurationSeconds: number;
  blockageFound: boolean;
  bugFixed: boolean;
  started: boolean;
  deployed: boolean;
  testedLocally: boolean;
  testPath: RevealedCell[];
  revealedPathIndex: number;
  revenue: number;
  previousIncidentCost: number;
  previousMode: 'conventional' | null;
  previousIncidentDuration: number;

  // Maze data
  horizontalWalls: number[][];
  verticalWalls: number[][];
  blockageWall: BlockageWall | null;
  actualBlockageCol: number;
  actualBlockageRow: number;
  blockageInjected: boolean;

  // Maze configuration (constants)
  gridSize: number;
  cellSize: number;
  padding: number;
  mazeWidth: number;
  mazeHeight: number;
  mazeX: number;
  startCol: number;
  startRow: number;
  destCol: number;
  destRow: number;
  baseWidth: number;
  baseHeight: number;

  // Handlers
  handleModeSelect: (selectedMode: 'conventional' | 'principal') => void;
  handleTestLocally: () => void;
  handleDeploy: () => void;
  startIncident: () => void;
  handleTryPrincipal: () => void;
  handleTryAgain: () => void;
  handleCellClick: (col: number, row: number) => void;
  handleFixBug: () => void;
  setMode: (mode: GameMode) => void;
}

export function useMazeGame(props?: UseMazeGameProps): UseMazeGameReturn {
  // Extract props
  const incidentCostPerSecond = props?.incidentCostPerSecond ?? 225;
  const propsMazeSeed = props?.mazeSeed;
  const propsStartRevenue = props?.startRevenue ?? false;

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
  const [incidentDurationSeconds, setIncidentDurationSeconds] = useState<number>(0);
  const [blockageFound, setBlockageFound] = useState<boolean>(false);
  const [bugFixed, setBugFixed] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [currentSeed, setCurrentSeed] = useState<number>(() => Math.floor(Math.random() * 10000));
  const [blockageInjected, setBlockageInjected] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [testedLocally, setTestedLocally] = useState<boolean>(false);
  const [testPath, setTestPath] = useState<RevealedCell[]>([]);
  const [revealedPathIndex, setRevealedPathIndex] = useState<number>(0);
  const [mode, setMode] = useState<GameMode>('start');
  const [revenue, setRevenue] = useState<number>(0);
  const [previousIncidentCost, setPreviousIncidentCost] = useState<number>(0);
  const [previousMode, setPreviousMode] = useState<'conventional' | null>(null);
  const [previousIncidentDuration, setPreviousIncidentDuration] = useState<number>(0);

  // Total incident cost
  const incidentCost = timeCost + clickCost;

  // Update currentSeed when mazeSeed prop changes (only if provided)
  useEffect(() => {
    if (propsMazeSeed !== undefined) {
      setCurrentSeed(propsMazeSeed);
    }
  }, [propsMazeSeed]);

  // Increment time cost and duration
  useEffect(() => {
    if (bugFixed || !startTime || !started) return;

    const interval = setInterval(() => {
      setTimeCost(prev => prev + (incidentCostPerSecond / 100));
      setIncidentDurationSeconds(prev => prev + 0.01); // Increment by 0.01 seconds every 10ms
    }, 10); // Increment based on cost per second (divided by 100 for 10ms intervals)

    return () => clearInterval(interval);
  }, [bugFixed, startTime, started, incidentCostPerSecond]);

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

  // Increment revenue while deployed but before incident starts (and after startRevenue flag is set)
  useEffect(() => {
    if (!deployed || started || !propsStartRevenue) return;

    const interval = setInterval(() => {
      setRevenue(prev => prev + (incidentCostPerSecond / 10));
    }, 100); // Increment revenue based on incident cost rate (divided by 10 for 100ms intervals)

    return () => clearInterval(interval);
  }, [deployed, started, propsStartRevenue, incidentCostPerSecond]);

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
  }, [currentSeed, blockageInjected, gridSize, startRow, startCol, destRow, destCol]);

  // Handlers
  const handleModeSelect = (selectedMode: 'conventional' | 'principal') => {
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
  };

  const startIncident = useCallback(() => {
    setBlockageInjected(true);
    setStarted(true);
    setStartTime(Date.now());
  }, []);

  const handleTryPrincipal = () => {
    // Store the current incident cost, mode, and duration for comparison
    setPreviousIncidentCost(incidentCost);
    setPreviousMode(mode === 'conventional' ? 'conventional' : null);
    setPreviousIncidentDuration(incidentDurationSeconds);
    setMode('principal');
    setRevealedCells([]);
    setDirectionHint("");
    setBlockageFound(false);
    setBugFixed(false);
    setTimeCost(0);
    setClickCost(0);
    setIncidentDurationSeconds(0);
    setStartTime(null);
    setStarted(false);
    setDeployed(false);
    setBlockageInjected(false);
    setTestedLocally(false);
    setTestPath([]);
    setRevenue(0);
  };

  const handleFixBug = useCallback(() => {
    setBugFixed(true);
  }, []);

  const handleTryAgain = () => {
    setRevealedCells([]);
    setDirectionHint("");
    setBlockageFound(false);
    setBugFixed(false);
    setTimeCost(0);
    setClickCost(0);
    setIncidentDurationSeconds(0);
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
    setPreviousIncidentDuration(0);
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

  return {
    // State
    mode,
    revealedCells,
    directionHint,
    timeCost,
    clickCost,
    incidentCost,
    incidentDurationSeconds,
    blockageFound,
    bugFixed,
    started,
    deployed,
    testedLocally,
    testPath,
    revealedPathIndex,
    revenue,
    previousIncidentCost,
    previousMode,
    previousIncidentDuration,

    // Maze data
    horizontalWalls,
    verticalWalls,
    blockageWall,
    actualBlockageCol,
    actualBlockageRow,
    blockageInjected,

    // Configuration
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
    baseWidth,
    baseHeight,

    // Handlers
    handleModeSelect,
    handleTestLocally,
    handleDeploy,
    startIncident,
    handleTryPrincipal,
    handleTryAgain,
    handleCellClick,
    handleFixBug,
    setMode,
  };
}
