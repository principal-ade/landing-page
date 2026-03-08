'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
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
  /** Optional condition to further filter events (e.g., check payload.action) */
  condition?: (event: PanelEvent) => boolean;
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
  /** Which side the overlay should appear on */
  overlaySide?: 'left' | 'right';
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
  /** Event types to forward to panels without navigation (e.g., 'task:delete-open-modal') */
  forwardEventTypes?: string[];
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
  forwardEventTypes = [],
  animationDuration = 300,
  externalEvents,
}) => {
  const [stack, setStack] = useState<StackEntry[]>([{ panelId: rootPanelId }]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [previousStack, setPreviousStack] = useState<StackEntry[] | null>(null);

  const currentEntry = stack[stack.length - 1];
  const previousEntry = previousStack ? previousStack[previousStack.length - 1] : null;

  // Panel map for quick lookup - must update when panels change
  const panelMap = useMemo(() => new Map(panels.map(p => [p.id, p])), [panels]);

  // Routes ref (for access in event emitter)
  const routesRef = useRef(routes);
  routesRef.current = routes;

  // Find matching route for an event
  const findRoute = useCallback((event: PanelEvent): NavigationRoute | undefined => {
    return routesRef.current.find(route => {
      if (route.eventType !== event.type) return false;
      if (route.condition && !route.condition(event)) return false;
      return true;
    });
  }, []);

  // Event handlers storage for cleanup
  const handlersRef = useRef(new Map<string, Set<(event: PanelEvent) => void>>());

  // Refs to access current state in event emitter (avoid stale closures)
  const stackRef = useRef(stack);
  const isAnimatingRef = useRef(isAnimating);
  const backEventTypesRef = useRef(backEventTypes);
  const lastNavigationEventRef = useRef<PanelEvent | null>(null);
  const lastProcessedEventRef = useRef<{ timestamp: number; source: string } | null>(null); // Track last processed event
  stackRef.current = stack;
  isAnimatingRef.current = isAnimating;
  backEventTypesRef.current = backEventTypes;

  // Create internal event emitter that handles navigation
  const internalEvents: PanelEventEmitter = useRef({
    emit: <T,>(event: PanelEvent<T>) => {
      // Skip duplicate events (same timestamp AND source = already processed)
      const lastProcessed = lastProcessedEventRef.current;
      if (lastProcessed && event.timestamp === lastProcessed.timestamp && event.source === lastProcessed.source) {
        return;
      }
      lastProcessedEventRef.current = { timestamp: event.timestamp, source: event.source ?? '' };

      // Check if this event triggers a navigation
      const route = findRoute(event as PanelEvent);
      if (route && !isAnimatingRef.current) {
        // Detect if this is a "done" task - slide from left side
        const payload = event.payload as Record<string, unknown> | undefined;
        // Status might be at payload.status or payload.task.status
        const taskStatus = (payload?.status ?? (payload?.task as Record<string, unknown>)?.status) as string | undefined;
        const isDone = taskStatus?.toLowerCase() === 'done';
        const overlaySide = isDone ? 'left' : 'right';

        // Check if overlay is already visible (stack > 1)
        const overlayAlreadyVisible = stackRef.current.length > 1;

        if (overlayAlreadyVisible) {
          // Overlay already visible - update/replace the top of the stack
          setStack(prev => [...prev.slice(0, -1), { panelId: route.targetPanelId, data: event.payload, overlaySide }]);
        } else {
          // Save the event to re-emit after animation
          lastNavigationEventRef.current = event as PanelEvent;
          // Push to new panel with animation
          setPreviousStack(stackRef.current);
          setAnimationDirection('left');
          setIsAnimating(true);
          setStack(prev => [...prev, { panelId: route.targetPanelId, data: event.payload, overlaySide }]);
        }
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

    // Get unique event types from routes
    const routeEventTypes = [...new Set(routes.map(r => r.eventType))];

    // Subscribe to route events
    routeEventTypes.forEach(eventType => {
      const unsub = externalEvents.on(eventType, (event) => {
        // Skip if already processed (forwarded from internal emitter)
        const lastProcessed = lastProcessedEventRef.current;
        if (lastProcessed && event.timestamp === lastProcessed.timestamp && event.source === lastProcessed.source) {
          return;
        }
        lastProcessedEventRef.current = { timestamp: event.timestamp, source: event.source ?? '' };

        // For task:selected from tour/programmatic sources,
        // forward to internal handlers so KanbanPanel can process and re-emit with full data.
        // These sources emit with just taskId, KanbanPanel will re-emit with full task data.
        const isProgrammaticSource = event.source === 'tour-controller' || event.source === 'landing-page-tour';
        if (event.type === 'task:selected' && isProgrammaticSource) {
          const handlers = handlersRef.current.get(event.type);
          if (handlers) {
            handlers.forEach(handler => handler(event));
          }
          return; // Don't navigate yet - wait for KanbanPanel to re-emit
        }

        // For custom events with programmatic control actions (selectNode, toggleNode, switchTab, selectTrace, clickSpan),
        // forward to internal handlers so the panel can process them.
        if (event.type === 'custom' && isProgrammaticSource) {
          const payload = event.payload as Record<string, unknown>;
          const isProgrammaticAction = ['selectNode', 'toggleNode', 'switchTab', 'selectScenario', 'selectEvent', 'selectTrace', 'clickSpan'].includes(payload?.action as string);
          if (isProgrammaticAction) {
            const handlers = handlersRef.current.get(event.type);
            if (handlers) {
              handlers.forEach(handler => handler(event));
            }
            return;
          }
        }

        const route = findRoute(event);
        if (route && !isAnimating) {
          // Detect if this is a "done" task - slide from left side
          const payload = event.payload as Record<string, unknown> | undefined;
          // Status might be at payload.status or payload.task.status
          const taskStatus = (payload?.status ?? (payload?.task as Record<string, unknown>)?.status) as string | undefined;
          const isDone = taskStatus?.toLowerCase() === 'done';
          const overlaySide = isDone ? 'left' : 'right';

          // Check if overlay is already visible (stack > 1)
          const overlayAlreadyVisible = stack.length > 1;

          if (overlayAlreadyVisible) {
            // Overlay already visible - update/replace the top of the stack
            setStack(prev => [...prev.slice(0, -1), { panelId: route.targetPanelId, data: event.payload, overlaySide }]);
            // Forward to internal handlers so panels can update their state
            const handlers = handlersRef.current.get(event.type);
            if (handlers) {
              handlers.forEach(handler => handler(event));
            }
          } else {
            // Save the event to re-emit after animation
            lastNavigationEventRef.current = event;
            setPreviousStack(stack);
            setAnimationDirection('left');
            setIsAnimating(true);
            setStack(prev => [...prev, { panelId: route.targetPanelId, data: event.payload, overlaySide }]);
          }
        }
      });
      unsubscribes.push(unsub);
    });

    // Subscribe to back events
    backEventTypes.forEach(backEventType => {
      const unsubBack = externalEvents.on(backEventType, (event) => {
        // Skip if already processed (forwarded from internal emitter)
        const lastProcessed = lastProcessedEventRef.current;
        if (lastProcessed && event.timestamp === lastProcessed.timestamp && event.source === lastProcessed.source) {
          return;
        }
        lastProcessedEventRef.current = { timestamp: event.timestamp, source: event.source ?? '' };

        // Forward to internal handlers so panels can update their state
        const handlers = handlersRef.current.get(event.type);
        if (handlers) {
          handlers.forEach(handler => handler(event));
        }

        if (stack.length > 1 && !isAnimating) {
          setPreviousStack(stack);
          setAnimationDirection('right');
          setIsAnimating(true);
          setStack(prev => prev.slice(0, -1));
        }
      });
      unsubscribes.push(unsubBack);
    });

    // Subscribe to forward events (events that should be passed to panels without navigation)
    forwardEventTypes.forEach(forwardEventType => {
      const unsubForward = externalEvents.on(forwardEventType, (event) => {
        // Skip if already processed (forwarded from internal emitter)
        const lastProcessed = lastProcessedEventRef.current;
        if (lastProcessed && event.timestamp === lastProcessed.timestamp && event.source === lastProcessed.source) {
          return;
        }
        lastProcessedEventRef.current = { timestamp: event.timestamp, source: event.source ?? '' };

        // Forward to internal handlers so panels can process the event
        const handlers = handlersRef.current.get(event.type);
        if (handlers) {
          handlers.forEach(handler => handler(event));
        }
      });
      unsubscribes.push(unsubForward);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [externalEvents, routes, backEventTypes, forwardEventTypes, stack, isAnimating, findRoute]);

  // Get panel render function
  const previousPanel = previousEntry ? panelMap.get(previousEntry.panelId) : null;

  // Root panel is always first in stack - needed for half-width overlay mode
  const rootEntry = stack[0];
  const rootPanel = rootEntry ? panelMap.get(rootEntry.panelId) : null;

  // Are we showing an overlay panel? (stack has more than just root)
  const hasOverlay = stack.length > 1;
  const overlayEntry = hasOverlay ? currentEntry : null;
  const overlayPanel = overlayEntry ? panelMap.get(overlayEntry.panelId) : null;
  const overlaySide = overlayEntry?.overlaySide ?? 'right';

  // For pop animation, get the side from the previous entry
  const previousOverlaySide = previousEntry?.overlaySide ?? 'right';

  // Calculate animation styles
  const getContainerStyle = (): React.CSSProperties => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  });

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

  // Handle Escape key to dismiss overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stack.length > 1 && !isAnimating) {
        internalEvents.emit({
          type: 'navigation:back',
          source: 'keyboard',
          timestamp: Date.now(),
          payload: {},
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stack.length, isAnimating, internalEvents]);

  return (
    <div style={getContainerStyle()}>
      {/* Base panel (root/kanban) - always visible */}
      {rootPanel && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0e17',
            zIndex: 1,
          }}
        >
          {rootPanel.render(internalEvents)}
        </div>
      )}

      {/* Overlay panel sliding out during pop animation */}
      {isAnimating && animationDirection === 'right' && previousPanel && previousEntry?.panelId !== rootEntry.panelId && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            ...(previousOverlaySide === 'left' ? { left: 0 } : { right: 0 }),
            width: (previousEntry?.panelId === 'workflow-scenarios' || previousEntry?.panelId === 'canvas-editor') ? '65%' : '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0e17',
            zIndex: 2,
            boxShadow: previousOverlaySide === 'left'
              ? '4px 0 20px rgba(0, 0, 0, 0.5)'
              : '-4px 0 20px rgba(0, 0, 0, 0.5)',
            ...(previousOverlaySide === 'left'
              ? { borderRight: '1px solid rgba(255, 255, 255, 0.1)' }
              : { borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }),
            transition: mounted ? `transform ${animationDuration}ms ease-out` : 'none',
            transform: mounted
              ? (previousOverlaySide === 'left' ? 'translateX(-100%)' : 'translateX(100%)')
              : 'translateX(0)',
          }}
        >
          {previousPanel.render(internalEvents)}
        </div>
      )}

      {/* Overlay panel (task detail) - shown when stack > 1 or animating in */}
      {(hasOverlay || (isAnimating && animationDirection === 'left')) && overlayPanel && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            ...(overlaySide === 'left' ? { left: 0 } : { right: 0 }),
            width: (overlayEntry?.panelId === 'workflow-scenarios' || overlayEntry?.panelId === 'canvas-editor') ? '65%' : '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0e17',
            zIndex: 2,
            boxShadow: overlaySide === 'left'
              ? '4px 0 20px rgba(0, 0, 0, 0.5)'
              : '-4px 0 20px rgba(0, 0, 0, 0.5)',
            ...(overlaySide === 'left'
              ? { borderRight: '1px solid rgba(255, 255, 255, 0.1)' }
              : { borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }),
            transition: isAnimating && mounted ? `transform ${animationDuration}ms ease-out` : 'none',
            transform: isAnimating
              ? (mounted ? 'translateX(0)' : (overlaySide === 'left' ? 'translateX(-100%)' : 'translateX(100%)'))
              : 'translateX(0)',
          }}
        >
          {overlayPanel.render(internalEvents)}
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
