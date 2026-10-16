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

/**
 * Kanban panel action request for programmatic control.
 */
export interface KanbanPanelAction {
  type: 'task:selected' | 'task:deselected' | 'task:delete-open-modal' | 'task:delete-confirm';
  taskId?: string;
}

/** Actions available to the demo tour. */
export type TourPanelAction = KanbanPanelAction;

/**
 * Delayed action for executing multiple actions with pauses
 */
export interface DelayedTourAction {
  /** Delay in ms before executing this action */
  delay: number;
  /** The action to execute */
  action: KanbanPanelAction;
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
  /** Show as a centered white lightbox card instead of full-screen or bottom overlay */
  lightbox?: boolean;
  target?: {
    /** CSS selector for spotlight element */
    selector?: string;
    /** Kanban action to execute when entering this step */
    tourAction?: KanbanPanelAction;
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

  // Kanban panel events integration
  setKanbanEvents: (events: PanelEventEmitter | null) => void;
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

  const kanbanEventsRef = useRef<PanelEventEmitter | null>(null);
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

  // Enter a step
  const enterStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      console.log('[Tour] Entering step:', index, step.id);

      // Execute Kanban action if defined
      if (step.target?.tourAction) {
        executeKanbanAction(step.target.tourAction);
      }

      // Execute delayed tour actions if defined
      if (step.target?.tourActions) {
        // Clear any existing delayed actions first
        clearDelayedActions();

        step.target.tourActions.forEach((delayedAction) => {
          const timeoutId = setTimeout(() => {
            executeKanbanAction(delayedAction.action);
          }, delayedAction.delay);
          delayedActionsRef.current.push(timeoutId);
        });
      }

      // Call onEnter callback
      step.onEnter?.();
    },
    [steps, executeKanbanAction, clearDelayedActions]
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

    // Deselect any selected kanban task
    if (kanbanEventsRef.current) {
      executeKanbanAction({ type: 'task:deselected' });
    }

    setIsActive(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setProgress(0);
  }, [clearTimers, exitStep, executeKanbanAction]);

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

  const setKanbanEvents = useCallback((events: PanelEventEmitter | null) => {
    kanbanEventsRef.current = events;
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
      setKanbanEvents,
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
      setKanbanEvents,
    ]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export default TourProvider;
