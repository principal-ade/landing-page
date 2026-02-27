'use client';

import React, {
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import type { PanelEvent, PanelEventEmitter } from '@principal-ade/panel-framework-core';

/**
 * Navigation route - maps an event type to a target panel
 */
export interface NavigationRoute {
  /** Event type that triggers this navigation */
  eventType: string;
  /** Panel ID to navigate to */
  targetPanelId: string;
}

/**
 * Panel definition with its component
 */
export interface PanelSlot {
  id: string;
  /** Render function that receives the shared events emitter */
  render: (events: PanelEventEmitter) => ReactNode;
}

/**
 * Stack entry
 */
interface StackEntry {
  panelId: string;
  data?: unknown;
}

interface PanelNavigatorProps {
  /** Root panel ID to show initially */
  rootPanelId: string;
  /** Available panels */
  panels: PanelSlot[];
  /** Navigation routes - which events trigger which panel transitions */
  routes: NavigationRoute[];
  /** Event type(s) that trigger going back (default: ['navigation:back']) */
  backEventTypes?: string[];
  /** Event type that triggers going to root (default: 'navigation:pop-to-root') */
  popToRootEventType?: string;
  /** Animation duration in ms */
  animationDuration?: number;
  /** External events emitter to bridge with */
  externalEvents?: PanelEventEmitter;
}

/**
 * PanelNavigator - Manages panel stack with slide transitions via events
 *
 * Panels emit events, and routes determine which panel to navigate to.
 *
 * Example:
 * ```tsx
 * <PanelNavigator
 *   rootPanelId="list"
 *   panels={[
 *     { id: 'list', render: (events) => <ListPanel events={events} /> },
 *     { id: 'detail', render: (events) => <DetailPanel events={events} /> },
 *   ]}
 *   routes={[
 *     { eventType: 'item:selected', targetPanelId: 'detail' },
 *   ]}
 * />
 * ```
 */
export const PanelNavigator: React.FC<PanelNavigatorProps> = ({
  rootPanelId,
  panels,
  routes,
  backEventTypes = ['navigation:back'],
  popToRootEventType = 'navigation:pop-to-root',
  animationDuration = 300,
  externalEvents,
}) => {
  const [stack, setStack] = useState<StackEntry[]>([{ panelId: rootPanelId }]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [previousStack, setPreviousStack] = useState<StackEntry[] | null>(null);

  const currentEntry = stack[stack.length - 1];
  const previousEntry = previousStack ? previousStack[previousStack.length - 1] : null;

  // Panel map for quick lookup
  const panelMap = useRef(new Map(panels.map(p => [p.id, p]))).current;

  // Route map for quick lookup
  const routeMap = useRef(new Map(routes.map(r => [r.eventType, r]))).current;

  // Event handlers storage for cleanup
  const handlersRef = useRef(new Map<string, Set<(event: PanelEvent) => void>>());

  // Refs to access current state in event emitter (avoid stale closures)
  const stackRef = useRef(stack);
  const isAnimatingRef = useRef(isAnimating);
  const backEventTypesRef = useRef(backEventTypes);
  const lastNavigationEventRef = useRef<PanelEvent | null>(null);
  stackRef.current = stack;
  isAnimatingRef.current = isAnimating;
  backEventTypesRef.current = backEventTypes;

  // Create internal event emitter that handles navigation
  const internalEvents: PanelEventEmitter = useRef({
    emit: <T,>(event: PanelEvent<T>) => {
      // Check if this event triggers a navigation
      const route = routeMap.get(event.type);
      if (route && !isAnimatingRef.current) {
        // Save the event to re-emit after animation
        lastNavigationEventRef.current = event as PanelEvent;
        // Push to new panel
        setPreviousStack(stackRef.current);
        setAnimationDirection('left');
        setIsAnimating(true);
        setStack(prev => [...prev, { panelId: route.targetPanelId, data: event.payload }]);
      } else if (backEventTypesRef.current.includes(event.type) && stackRef.current.length > 1 && !isAnimatingRef.current) {
        // Pop back
        setPreviousStack(stackRef.current);
        setAnimationDirection('right');
        setIsAnimating(true);
        setStack(prev => prev.slice(0, -1));
      } else if (event.type === popToRootEventType && stackRef.current.length > 1 && !isAnimatingRef.current) {
        // Pop to root
        setPreviousStack(stackRef.current);
        setAnimationDirection('right');
        setIsAnimating(true);
        setStack([{ panelId: rootPanelId }]);
      }

      // Notify internal handlers
      const handlers = handlersRef.current.get(event.type);
      if (handlers) {
        handlers.forEach(handler => handler(event as PanelEvent));
      }

      // Forward to external events if provided
      externalEvents?.emit(event);
    },
    on: <T,>(type: string, handler: (event: PanelEvent<T>) => void) => {
      if (!handlersRef.current.has(type)) {
        handlersRef.current.set(type, new Set());
      }
      handlersRef.current.get(type)!.add(handler as (event: PanelEvent) => void);

      return () => {
        handlersRef.current.get(type)?.delete(handler as (event: PanelEvent) => void);
      };
    },
    off: <T,>(type: string, handler: (event: PanelEvent<T>) => void) => {
      handlersRef.current.get(type)?.delete(handler as (event: PanelEvent) => void);
    },
  }).current;

  // Update routeMap when routes change
  useEffect(() => {
    routeMap.clear();
    routes.forEach(r => routeMap.set(r.eventType, r));
  }, [routes, routeMap]);

  // Handle animation end and re-emit navigation event
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
        setPreviousStack(null);

        // Re-emit the navigation event so the new panel receives it
        if (lastNavigationEventRef.current) {
          const handlers = handlersRef.current.get(lastNavigationEventRef.current.type);
          if (handlers) {
            handlers.forEach(handler => handler(lastNavigationEventRef.current!));
          }
          lastNavigationEventRef.current = null;
        }
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, animationDuration]);

  // Subscribe to external events for navigation
  useEffect(() => {
    if (!externalEvents) return;

    const unsubscribes: (() => void)[] = [];

    // Subscribe to route events
    routes.forEach(route => {
      const unsub = externalEvents.on(route.eventType, (event) => {
        if (!isAnimating) {
          setPreviousStack(stack);
          setAnimationDirection('left');
          setIsAnimating(true);
          setStack(prev => [...prev, { panelId: route.targetPanelId, data: event.payload }]);
        }
      });
      unsubscribes.push(unsub);
    });

    // Subscribe to back events
    backEventTypes.forEach(backEventType => {
      const unsubBack = externalEvents.on(backEventType, () => {
        if (stack.length > 1 && !isAnimating) {
          setPreviousStack(stack);
          setAnimationDirection('right');
          setIsAnimating(true);
          setStack(prev => prev.slice(0, -1));
        }
      });
      unsubscribes.push(unsubBack);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [externalEvents, routes, backEventTypes, stack, isAnimating]);

  // Get panel render function
  const currentPanel = panelMap.get(currentEntry.panelId);
  const previousPanel = previousEntry ? panelMap.get(previousEntry.panelId) : null;

  // Calculate animation styles
  const getContainerStyle = (): React.CSSProperties => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  });

  // For overlay-style animation:
  // PUSH: previous (board) stays put at z-index 1, current (detail) slides in from right at z-index 2
  // POP: current (board) stays put at z-index 1, previous (detail) slides out to right at z-index 2

  const getOverlayPanel = (): 'current' | 'previous' => {
    // The overlay is the panel that slides - when pushing it's current, when popping it's previous
    return animationDirection === 'left' ? 'current' : 'previous';
  };

  const getPanelStyle = (position: 'current' | 'previous'): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0e17', // Opaque background to prevent bleed-through during animations
    };

    const isOverlay = position === getOverlayPanel();

    return {
      ...base,
      zIndex: isOverlay ? 2 : 1,
    };
  };

  const getInitialTransform = (position: 'current' | 'previous'): string => {
    const isOverlay = position === getOverlayPanel();

    if (!isOverlay) {
      // Base panel stays in place
      return 'translateX(0)';
    }

    if (animationDirection === 'left') {
      // Pushing: overlay (current) starts off-screen right
      return 'translateX(100%)';
    } else {
      // Popping: overlay (previous) starts in place
      return 'translateX(0)';
    }
  };

  const getFinalTransform = (position: 'current' | 'previous'): string => {
    const isOverlay = position === getOverlayPanel();

    if (!isOverlay) {
      // Base panel stays in place
      return 'translateX(0)';
    }

    if (animationDirection === 'left') {
      // Pushing: overlay (current) ends in place
      return 'translateX(0)';
    } else {
      // Popping: overlay (previous) ends off-screen right
      return 'translateX(100%)';
    }
  };

  // Force initial position before animation
  // Use double rAF to ensure browser has painted the initial state before transitioning
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (isAnimating && !mounted) {
      // Double requestAnimationFrame ensures the browser has painted the initial position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMounted(true));
      });
    } else if (!isAnimating) {
      setMounted(false);
    }
  }, [isAnimating, mounted]);

  return (
    <div style={getContainerStyle()}>
      {/* Previous panel - needs transform during pop (when it's the overlay sliding out) */}
      {isAnimating && previousPanel && (
        <div
          style={{
            ...getPanelStyle('previous'),
            // Only apply transition AFTER initial position is painted (mounted=true)
            transition: mounted ? `transform ${animationDuration}ms ease-out` : 'none',
            transform: mounted ? getFinalTransform('previous') : getInitialTransform('previous'),
          }}
        >
          {previousPanel.render(internalEvents)}
        </div>
      )}

      {/* Current panel - needs transform during push (when it's the overlay sliding in) */}
      {currentPanel && (
        <div
          style={{
            ...getPanelStyle('current'),
            // Only apply transition AFTER initial position is painted (mounted=true)
            transition: isAnimating && mounted ? `transform ${animationDuration}ms ease-out` : 'none',
            transform: isAnimating
              ? (mounted ? getFinalTransform('current') : getInitialTransform('current'))
              : 'translateX(0)',
          }}
        >
          {currentPanel.render(internalEvents)}
        </div>
      )}
    </div>
  );
};

/**
 * Helper to create a back button that emits navigation:back
 */
interface BackButtonProps {
  events: PanelEventEmitter;
  label?: string;
  style?: React.CSSProperties;
}

export const PanelBackButton: React.FC<BackButtonProps> = ({
  events,
  label = 'Back',
  style,
}) => {
  const handleClick = () => {
    events.emit({
      type: 'navigation:back',
      source: 'panel-back-button',
      timestamp: Date.now(),
      payload: {},
    });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        color: '#888',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.color = '#888';
      }}
    >
      <span style={{ fontSize: '16px' }}>←</span>
      {label}
    </button>
  );
};

export default PanelNavigator;
