# Refactoring Notes

## Overview
This document describes the refactoring work done to improve the maintainability of the game flow code.

## Changes Made

### 1. Created Constants File (`src/app/game/constants.ts`)

Extracted all magic numbers and timing values into named constants:

- **TIMINGS**: All delay and animation timing values
  - Test phase timings
  - Deploy phase timings
  - Revenue and incident timings
  - Typewriter speeds

- **COSTS**: Game cost constants
  - Incident cost per second ($225)
  - Manual inspection cost ($500)

- **MAZE_CONFIG**: Maze configuration values
  - Grid dimensions
  - Cell sizes
  - Start/destination positions
  - Game mechanics values (hint frequency, reveal radius)

**Benefits**:
- Easy to adjust timings without hunting through code
- Self-documenting code
- Centralized configuration

### 2. Created Types File (`src/app/game/types.ts`)

Introduced a state machine for game flow:

```typescript
type GameFlowState =
  | 'start'
  | 'agent-question'
  | 'testing-intro'
  | 'testing-running'
  | 'test-complete'
  | 'deploy-question'
  | 'cost-info'
  | 'deployed-running'
  | 'incident-active'
  | 'incident-resolved'
  | 'principal-comparison';
```

**Benefits**:
- Single source of truth for flow state
- Explicit state transitions
- Easier to reason about flow logic
- Reduced number of interdependent boolean flags

### 3. Refactored Game Page Component

#### Before:
- 10+ boolean state variables (`showTestComplete`, `showDeployQuestion`, etc.)
- Complex interdependent useEffects
- Magic numbers throughout
- Mode (`'start' | 'initial' | 'agentic'` etc.) mixed with UI state

#### After:
- Single `flowState` variable
- Derived UI states from `flowState`
- All timings use named constants
- Clear state transitions in useEffects
- Cleaner separation between game mode and UI flow state

#### Key Improvements:

**State Management**:
```typescript
// Before
const [showTestComplete, setShowTestComplete] = useState(false);
const [showDeployQuestion, setShowDeployQuestion] = useState(false);
const [showDeployButtons, setShowDeployButtons] = useState(false);
// ... many more

// After
const [flowState, setFlowState] = useState<GameFlowState>('start');
const showTestComplete = flowState === 'test-complete';
const showDeployQuestion = flowState === 'deploy-question';
// ... derived from flowState
```

**State Transitions**:
```typescript
// Before
useEffect(() => {
  if (showTestComplete && !showDeployQuestion && !deployed) {
    const timer = setTimeout(() => setShowDeployQuestion(true), 2000);
    return () => clearTimeout(timer);
  }
}, [showTestComplete, showDeployQuestion, deployed]);

// After
useEffect(() => {
  if (flowState === 'test-complete') {
    const timer = setTimeout(() => setFlowState('deploy-question'), TIMINGS.TEST_COMPLETE_PAUSE);
    return () => clearTimeout(timer);
  }
}, [flowState]);
```

**Using Constants**:
```typescript
// Before
const timer = setTimeout(() => setShowMaze(true), 200);

// After
const timer = setTimeout(() => setShowMaze(true), TIMINGS.MAZE_FADE_IN_DELAY);
```

## Files Modified

- `src/app/game/page.tsx` - Main game component refactored
- `src/app/game/constants.ts` - New constants file
- `src/app/game/types.ts` - New types file

## Testing

All checks passed:
- ✅ Build successful
- ✅ TypeScript type checking passed
- ✅ ESLint passed with no warnings
- ✅ Bundle size: 8.75 kB (slight increase due to constants file, acceptable)

## Future Improvements

Potential next steps for further refactoring:

1. **Extract UI Components**: Break down the large `renderTextPanel` function into smaller components:
   - `GameStartScreen`
   - `AgentUsageQuestion`
   - `TestingPhase`
   - `DeployPhase`
   - etc.

2. **Create TypewriterText Component**: Abstract the typewriter pattern into a reusable component

3. **Create useSequentialFlow Hook**: Abstract the pattern of sequential state transitions

4. **Move More Logic to useMazeGame**: Further separate game logic from UI rendering

## Migration Notes

The refactoring maintains backward compatibility:
- All existing functionality preserved
- No changes to external APIs
- Game behavior unchanged
- Only internal implementation improved
