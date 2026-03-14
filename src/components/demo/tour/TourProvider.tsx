'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import type { PanelEventEmitter } from '@principal-ade/panel-framework-core';
import type { StoryboardListRequest } from '../StoryboardListPanelWrapper';
import type { TraceListPanelAction } from '@industry-theme/principal-view-panels';

/**
 * Kanban panel action request for programmatic control
 * See: PROGRAMMATIC_CONTROL.md in backlogmd-kanban-panel
 */
export interface KanbanPanelAction {
  type: 'task:selected' | 'task:deselected' | 'task:delete-open-modal' | 'task:delete-confirm';
  taskId?: string;
}

/**
 * Storyboard panel programmatic control actions
 * See: PROGRAMMATIC_CONTROL.md in principal-view-panels
 */
export interface StoryboardPanelAction {
  action: 'switchTab' | 'toggleNode' | 'selectNode' | 'selectScenario' | 'selectEvent';
  tab?: 'otel' | 'regular';
  nodeId?: string;
  open?: boolean;
  /** For selectScenario action */
  scenarioId?: string;
  mode?: 'list' | 'carousel';
  /** For selectEvent action */
  eventIndex?: number;
  eventName?: string;
}

/**
 * Raw event to emit directly to a panel's event emitter
 */
export interface RawPanelEvent {
  type: string;
  payload?: unknown;
}

/**
 * Union type for all panel actions the tour can execute
 */
export type TourPanelAction =
  | { panel: 'storyboard'; action: StoryboardListRequest }
  | { panel: 'storyboard-custom'; action: StoryboardPanelAction }
  | { panel: 'kanban'; action: KanbanPanelAction }
  | { panel: 'trace-list'; action: TraceListPanelAction }
  | { panel: 'trace-list-event'; event: RawPanelEvent };

/**
 * Delayed action for executing multiple actions with pauses
 */
export interface DelayedTourAction {
  /** Delay in ms before executing this action */
  delay: number;
  /** The action to execute */
  action: TourPanelAction;
}

/**
 * Tour step definition
 */
export interface TourStep {
  id: string;
  title?: string;
  description: string;
  /** Optional color for the description text (e.g., '#ff4444' for red) */
  descriptionColor?: string;
  /** Duration in ms before auto-advance (default: 5000) */
  duration?: number;
  /** Tab to switch to when entering this step */
  tab?: 'storyboards' | 'kanban' | 'story-monitoring' | 'traditional-monitoring';
  /** Show as a centered white lightbox card instead of full-screen or bottom overlay */
  lightbox?: boolean;
  target?: {
    /** CSS selector for spotlight element */
    selector?: string;
    /** Panel action to execute when entering this step (legacy - storyboard only) */
    panelAction?: StoryboardListRequest;
    /** Multi-panel action to execute when entering this step */
    tourAction?: TourPanelAction;
    /** Multiple actions with delays between them */
    tourActions?: DelayedTourAction[];
  };
  /** Called when entering this step */
  onEnter?: () => void;
  /** Called when leaving this step */
  onExit?: () => void;
  /** Event type that triggers auto-advance to the next step (e.g., 'task:delete-confirm') */
  advanceOnEvent?: string;
}

/**
 * Tour context state and methods
 */
interface TourContextValue {
  // State
  isActive: boolean;
  isPlaying: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  steps: TourStep[];
  progress: number; // 0-1 progress through current step duration

  // Methods
  start: () => void;
  stop: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  goToStep: (index: number) => void;

  // Panel events integration
  setPanelEvents: (events: PanelEventEmitter | null) => void;
  setKanbanEvents: (events: PanelEventEmitter | null) => void;
  setTraceListEvents: (events: PanelEventEmitter | null) => void;
  // Tab switching
  setTabHandler: (handler: ((tab: string) => void) | null) => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: React.ReactNode;
  steps: TourStep[];
  /** Auto-start the tour when mounted */
  autoStart?: boolean;
  /** Default duration per step in ms (default: 5000) */
  defaultDuration?: number;
  /** Called when tour ends (completed or skipped) */
  onComplete?: () => void;
}

export const TourProvider: React.FC<TourProviderProps> = ({
  children,
  steps,
  autoStart = false,
  defaultDuration = 5000,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(autoStart);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const panelEventsRef = useRef<PanelEventEmitter | null>(null);
  const kanbanEventsRef = useRef<PanelEventEmitter | null>(null);
  const traceListEventsRef = useRef<PanelEventEmitter | null>(null);
  const tabHandlerRef = useRef<((tab: string) => void) | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const delayedActionsRef = useRef<NodeJS.Timeout[]>([]);
  const startTimeRef = useRef<number>(0);

  const currentStep = useMemo(
    () => (isActive && steps[currentStepIndex]) || null,
    [isActive, steps, currentStepIndex]
  );

  const stepDuration = currentStep?.duration ?? defaultDuration;

  // Clear auto-advance timers (but not delayed step actions)
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Clear delayed step actions (called when exiting a step)
  const clearDelayedActions = useCallback(() => {
    delayedActionsRef.current.forEach(clearTimeout);
    delayedActionsRef.current = [];
  }, []);

  // Execute storyboard panel action (legacy)
  const executeStoryboardAction = useCallback((action: StoryboardListRequest) => {
    const events = panelEventsRef.current;
    if (!events) {
      console.warn('[Tour] No storyboard panel events available for action:', action);
      return;
    }

    console.log('[Tour] Executing storyboard panel action:', action);
    events.emit({
      type: 'storyboard-list:request',
      source: 'tour-controller',
      timestamp: Date.now(),
      payload: action,
    });
  }, []);

  // Execute kanban panel action
  const executeKanbanAction = useCallback((action: KanbanPanelAction) => {
    const events = kanbanEventsRef.current;
    if (!events) {
      console.warn('[Tour] No kanban panel events available for action:', action);
      return;
    }

    events.emit({
      type: action.type,
      source: 'tour-controller',
      timestamp: Date.now(),
      payload: { taskId: action.taskId },
    });
  }, []);

  // Execute trace list panel action (selectTrace, clickSpan)
  const executeTraceListAction = useCallback((action: TraceListPanelAction) => {
    const events = traceListEventsRef.current;
    if (!events) {
      console.warn('[Tour] No trace list panel events available for action:', action);
      return;
    }

    console.log('[Tour] Executing trace list panel action:', action);
    events.emit({
      type: 'custom',
      source: 'tour-controller',
      timestamp: Date.now(),
      payload: action,
    });
  }, []);

  // Execute storyboard panel custom action (selectNode, toggleNode, switchTab, selectScenario, selectEvent)
  const executeStoryboardCustomAction = useCallback((action: StoryboardPanelAction) => {
    const events = panelEventsRef.current;
    if (!events) {
      console.warn('[Tour] No storyboard panel events available for custom action:', action);
      return;
    }

    events.emit({
      type: 'custom',
      source: 'tour-controller',
      timestamp: Date.now(),
      payload: action,
    });
  }, []);

  // Execute raw event on trace-list panel
  const executeTraceListEvent = useCallback((event: RawPanelEvent) => {
    const events = traceListEventsRef.current;
    if (!events) {
      console.warn('[Tour] No trace list panel events available for raw event:', event);
      return;
    }

    console.log('[Tour] Emitting raw event to trace-list:', event);
    events.emit({
      type: event.type,
      source: 'tour-controller',
      timestamp: Date.now(),
      payload: event.payload ?? {},
    });
  }, []);

  // Execute tour panel action (multi-panel)
  const executeTourAction = useCallback((tourAction: TourPanelAction) => {
    if (tourAction.panel === 'storyboard') {
      executeStoryboardAction(tourAction.action);
    } else if (tourAction.panel === 'storyboard-custom') {
      executeStoryboardCustomAction(tourAction.action);
    } else if (tourAction.panel === 'kanban') {
      executeKanbanAction(tourAction.action);
    } else if (tourAction.panel === 'trace-list') {
      executeTraceListAction(tourAction.action);
    } else if (tourAction.panel === 'trace-list-event') {
      executeTraceListEvent(tourAction.event);
    }
  }, [executeStoryboardAction, executeStoryboardCustomAction, executeKanbanAction, executeTraceListAction, executeTraceListEvent]);

  // Enter a step
  const enterStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      console.log('[Tour] Entering step:', index, step.id);

      // Switch tab if specified
      if (step.tab && tabHandlerRef.current) {
        tabHandlerRef.current(step.tab);
      }

      // Execute tour action if defined (new multi-panel system)
      if (step.target?.tourAction) {
        executeTourAction(step.target.tourAction);
      }
      // Execute legacy panel action if defined (storyboard only)
      else if (step.target?.panelAction) {
        executeStoryboardAction(step.target.panelAction);
      }

      // Execute delayed tour actions if defined
      if (step.target?.tourActions) {
        // Clear any existing delayed actions first
        clearDelayedActions();

        step.target.tourActions.forEach((delayedAction) => {
          const timeoutId = setTimeout(() => {
            executeTourAction(delayedAction.action);
          }, delayedAction.delay);
          delayedActionsRef.current.push(timeoutId);
        });
      }

      // Call onEnter callback
      step.onEnter?.();
    },
    [steps, executeTourAction, executeStoryboardAction, clearDelayedActions]
  );

  // Exit current step
  const exitStep = useCallback(() => {
    const step = steps[currentStepIndex];
    if (step) {
      step.onExit?.();
    }
    // Clear any pending delayed actions when leaving a step
    clearDelayedActions();
  }, [steps, currentStepIndex, clearDelayedActions]);

  // Start auto-advance timer
  const startAutoAdvance = useCallback(() => {
    clearTimers();

    if (!isPlaying || !isActive) return;

    startTimeRef.current = Date.now();
    setProgress(0);

    // Progress update interval (60fps)
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / stepDuration, 1);
      setProgress(newProgress);
    }, 16);

    // Auto-advance timer
    timerRef.current = setTimeout(() => {
      clearTimers();
      // Auto-advance to next step
      if (currentStepIndex < steps.length - 1) {
        exitStep();
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        // Tour complete
        setIsActive(false);
        setIsPlaying(false);
        onComplete?.();
      }
    }, stepDuration);
  }, [
    isPlaying,
    isActive,
    stepDuration,
    currentStepIndex,
    steps.length,
    clearTimers,
    exitStep,
    onComplete,
  ]);

  // Effect: Enter step when index changes
  useEffect(() => {
    if (isActive) {
      enterStep(currentStepIndex);
    }
  }, [isActive, currentStepIndex, enterStep]);

  // Effect: Handle play/pause
  useEffect(() => {
    if (isPlaying && isActive) {
      startAutoAdvance();
    } else {
      clearTimers();
    }

    return clearTimers;
  }, [isPlaying, isActive, currentStepIndex, startAutoAdvance, clearTimers]);

  // Effect: Auto-start
  useEffect(() => {
    if (autoStart && steps.length > 0) {
      setIsActive(true);
      setIsPlaying(true);
    }
  }, [autoStart, steps.length]);

  // Effect: Listen for advanceOnEvent triggers from kanban panel
  useEffect(() => {
    if (!isActive || !currentStep?.advanceOnEvent) return;

    const kanbanEvents = kanbanEventsRef.current;
    if (!kanbanEvents) return;

    const eventType = currentStep.advanceOnEvent;
    console.log('[Tour] Listening for event to auto-advance:', eventType);

    const unsubscribe = kanbanEvents.on(eventType, (event: any) => {
      console.log('[Tour] Received event, auto-advancing:', event);
      // Small delay to allow the UI to process the event first
      setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          clearTimers();
          exitStep();
          setCurrentStepIndex((prev) => prev + 1);
          setProgress(0);
        }
      }, 500);
    });

    return unsubscribe;
  }, [isActive, currentStep, currentStepIndex, steps.length, clearTimers, exitStep]);

  // Methods
  const start = useCallback(() => {
    setCurrentStepIndex(0);
    setProgress(0);
    setIsActive(true);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    exitStep();

    // Close any open storyboard panels
    if (panelEventsRef.current) {
      executeStoryboardAction({ action: 'closeCanvas' });
    }

    // Deselect any selected kanban task
    if (kanbanEventsRef.current) {
      executeKanbanAction({ type: 'task:deselected' });
    }

    setIsActive(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setProgress(0);
  }, [clearTimers, exitStep, executeStoryboardAction, executeKanbanAction]);

  const play = useCallback(() => {
    if (isActive) {
      setIsPlaying(true);
    }
  }, [isActive]);

  const pause = useCallback(() => {
    clearTimers();
    setIsPlaying(false);
  }, [clearTimers]);

  const next = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      clearTimers();
      exitStep();
      setCurrentStepIndex((prev) => prev + 1);
      setProgress(0);
      // Resume playing if was playing
      if (isPlaying) {
        startTimeRef.current = Date.now();
      }
    } else {
      // Last step - end tour
      stop();
      onComplete?.();
    }
  }, [currentStepIndex, steps.length, clearTimers, exitStep, isPlaying, stop, onComplete]);

  const prev = useCallback(() => {
    if (currentStepIndex > 0) {
      clearTimers();
      exitStep();
      setCurrentStepIndex((prev) => prev - 1);
      setProgress(0);
      if (isPlaying) {
        startTimeRef.current = Date.now();
      }
    }
  }, [currentStepIndex, clearTimers, exitStep, isPlaying]);

  const skip = useCallback(() => {
    stop();
    onComplete?.();
  }, [stop, onComplete]);

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) {
        clearTimers();
        exitStep();
        setCurrentStepIndex(index);
        setProgress(0);
        if (isPlaying) {
          startTimeRef.current = Date.now();
        }
      }
    },
    [steps.length, clearTimers, exitStep, isPlaying]
  );

  const setPanelEvents = useCallback((events: PanelEventEmitter | null) => {
    panelEventsRef.current = events;
  }, []);

  const setKanbanEvents = useCallback((events: PanelEventEmitter | null) => {
    kanbanEventsRef.current = events;
  }, []);

  const setTraceListEvents = useCallback((events: PanelEventEmitter | null) => {
    traceListEventsRef.current = events;
  }, []);

  const setTabHandler = useCallback((handler: ((tab: string) => void) | null) => {
    tabHandlerRef.current = handler;
  }, []);

  const value: TourContextValue = useMemo(
    () => ({
      isActive,
      isPlaying,
      currentStepIndex,
      currentStep,
      steps,
      progress,
      start,
      stop,
      play,
      pause,
      next,
      prev,
      skip,
      goToStep,
      setPanelEvents,
      setKanbanEvents,
      setTraceListEvents,
      setTabHandler,
    }),
    [
      isActive,
      isPlaying,
      currentStepIndex,
      currentStep,
      steps,
      progress,
      start,
      stop,
      play,
      pause,
      next,
      prev,
      skip,
      goToStep,
      setPanelEvents,
      setKanbanEvents,
      setTraceListEvents,
      setTabHandler,
    ]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export default TourProvider;
