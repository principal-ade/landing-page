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

/**
 * Tour step definition
 */
export interface TourStep {
  id: string;
  title?: string;
  description: string;
  /** Duration in ms before auto-advance (default: 5000) */
  duration?: number;
  target?: {
    /** CSS selector for spotlight element */
    selector?: string;
    /** Panel action to execute when entering this step */
    panelAction?: StoryboardListRequest;
  };
  /** Called when entering this step */
  onEnter?: () => void;
  /** Called when leaving this step */
  onExit?: () => void;
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
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const panelEventsRef = useRef<PanelEventEmitter | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentStep = useMemo(
    () => (isActive && steps[currentStepIndex]) || null,
    [isActive, steps, currentStepIndex]
  );

  const stepDuration = currentStep?.duration ?? defaultDuration;

  // Clear all timers
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

  // Execute panel action for current step
  const executePanelAction = useCallback((action: StoryboardListRequest) => {
    const events = panelEventsRef.current;
    if (!events) {
      console.warn('[Tour] No panel events available for action:', action);
      return;
    }

    console.log('[Tour] Executing panel action:', action);
    events.emit({
      type: 'storyboard-list:request',
      source: 'tour-controller',
      timestamp: Date.now(),
      payload: action,
    });
  }, []);

  // Enter a step
  const enterStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      console.log('[Tour] Entering step:', index, step.id);

      // Execute panel action if defined
      if (step.target?.panelAction) {
        executePanelAction(step.target.panelAction);
      }

      // Call onEnter callback
      step.onEnter?.();
    },
    [steps, executePanelAction]
  );

  // Exit current step
  const exitStep = useCallback(() => {
    const step = steps[currentStepIndex];
    if (step) {
      step.onExit?.();
    }
  }, [steps, currentStepIndex]);

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

    // Close any open panels
    if (panelEventsRef.current) {
      executePanelAction({ action: 'closeCanvas' });
    }

    setIsActive(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setProgress(0);
  }, [clearTimers, exitStep, executePanelAction]);

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
    ]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export default TourProvider;
