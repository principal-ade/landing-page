'use client';

import React, { useMemo, useState } from 'react';
import { TraceListPanel, WorkflowScenariosPanel, type OpenCanvasPayload } from '@industry-theme/principal-view-panels';
import type {
  DataSlice,
  PanelEvent,
  PanelEventEmitter,
} from '@principal-ade/panel-framework-core';
import type { RegisteredTrace, VersionSnapshot } from '@principal-ai/principal-view-core';
import { PanelNavigator, type NavigationRoute, type PanelSlot } from './PanelNavigator';

interface TraceListPanelWrapperProps {
  traces: RegisteredTrace[];
  schematics?: VersionSnapshot[];
  onClear?: () => void;
  onTraceSelect?: (trace: RegisteredTrace) => void;
  onWorkflowClick?: (storyboardId: string, workflowId: string, scenarioId: string) => void;
}

/**
 * Wrapper for TraceListPanel that provides the panel framework context
 * with PanelNavigator for workflow panel transitions
 */
export const TraceListPanelWrapper: React.FC<TraceListPanelWrapperProps> = ({
  traces,
  schematics,
  onClear,
  onTraceSelect,
  onWorkflowClick,
}) => {
  // Store workflow context when navigating to WorkflowScenariosPanel
  const [workflowContext, setWorkflowContext] = useState<OpenCanvasPayload | null>(null);
  // Create telemetry DataSlice
  const telemetrySlice: DataSlice<RegisteredTrace[]> = useMemo(() => ({
    scope: 'workspace',
    name: 'telemetry',
    data: traces,
    loading: false,
    error: null,
    refresh: async () => {},
  }), [traces]);

  // Create schematics DataSlice (optional)
  const schematicsSlice: DataSlice<VersionSnapshot[]> | undefined = useMemo(() => {
    if (!schematics) return undefined;
    return {
      scope: 'workspace',
      name: 'schematics',
      data: schematics,
      loading: false,
      error: null,
      refresh: async () => {},
    };
  }, [schematics]);

  // fileTree with null data - WorkflowScenariosPanel requires this slice
  // but actual workflow data comes via props in demo mode
  const fileTreeSlice: DataSlice<null> = useMemo(() => ({
    scope: 'workspace',
    name: 'fileTree',
    data: null,
    loading: false,
    error: null,
    refresh: async () => {},
  }), []);

  // Create slices map
  const slicesMap = useMemo(() => {
    const map = new Map<string, DataSlice>();
    map.set('telemetry', telemetrySlice);
    if (schematicsSlice) {
      map.set('schematics', schematicsSlice);
    }
    return map;
  }, [telemetrySlice, schematicsSlice]);

  // Create panel context - cast to any for flexibility with the panel framework types
  const context = useMemo(() => ({
    currentScope: {
      type: 'workspace' as const,
      workspace: {
        name: 'Demo Workspace',
        path: '/demo',
      },
    },
    slices: slicesMap,
    getSlice: <T,>(name: string) => slicesMap.get(name) as DataSlice<T> | undefined,
    getWorkspaceSlice: <T,>(name: string) => slicesMap.get(name) as DataSlice<T> | undefined,
    getRepositorySlice: <T,>() => undefined as DataSlice<T> | undefined,
    hasSlice: (name: string, _scope?: 'workspace' | 'repository') => slicesMap.has(name),
    isSliceLoading: (name: string, _scope?: 'workspace' | 'repository') => slicesMap.get(name)?.loading ?? false,
    refresh: async (_scope?: 'workspace' | 'repository', slice?: string) => {
      if (slice) {
        await slicesMap.get(slice)?.refresh();
      }
    },
    telemetry: telemetrySlice,
    schematics: schematicsSlice,
    fileTree: fileTreeSlice,
  }), [slicesMap, telemetrySlice, schematicsSlice, fileTreeSlice]);

  // Create panel actions - intersection of TraceListPanel and WorkflowScenariosPanel needs
  const actions = useMemo(() => ({
    // TraceListPanelActions
    clearTelemetry: onClear ? async () => { onClear(); } : undefined,
    readFile: async (_path: string) => '',
    // PanelActions (optional)
    openFile: undefined,
    openGitDiff: undefined,
    navigateToPanel: undefined,
    notifyPanels: undefined,
  }), [onClear]);

  // Create event emitter with proper typing
  const events: PanelEventEmitter = useMemo(() => {
    const listeners = new Map<string, Set<(event: PanelEvent) => void>>();

    return {
      emit: <T,>(event: PanelEvent<T>) => {
        console.log('[TraceListPanelWrapper] Event:', event.type, event.payload);

        // Handle trace selection events
        if (event.type === 'trace:selected' && onTraceSelect) {
          onTraceSelect(event.payload as RegisteredTrace);
        }
        // Handle workflow click events (legacy)
        if (event.type === 'workflow:clicked' && onWorkflowClick) {
          const { storyboardId, workflowId, scenarioId } = event.payload as {
            storyboardId: string;
            workflowId: string;
            scenarioId: string;
          };
          onWorkflowClick(storyboardId, workflowId, scenarioId);
        }
        // Capture openCanvas payload for WorkflowScenariosPanel navigation
        if (event.type === 'custom') {
          const payload = event.payload as OpenCanvasPayload;
          if (payload?.action === 'openCanvas') {
            setWorkflowContext(payload);
          }
        }
        // Notify listeners
        const typeListeners = listeners.get(event.type);
        if (typeListeners) {
          typeListeners.forEach(listener => listener(event as PanelEvent));
        }
      },
      on: <T,>(type: string, handler: (event: PanelEvent<T>) => void) => {
        if (!listeners.has(type)) {
          listeners.set(type, new Set());
        }
        listeners.get(type)!.add(handler as (event: PanelEvent) => void);
        return () => {
          listeners.get(type)?.delete(handler as (event: PanelEvent) => void);
        };
      },
      off: <T,>(type: string, handler: (event: PanelEvent<T>) => void) => {
        listeners.get(type)?.delete(handler as (event: PanelEvent) => void);
      },
    };
  }, [onTraceSelect, onWorkflowClick]);

  // Panel slots for PanelNavigator
  const panelSlots: PanelSlot[] = useMemo(() => [
    {
      id: 'trace-list',
      render: (navEvents: PanelEventEmitter) => (
        <TraceListPanel
          context={context}
          actions={actions}
          events={navEvents}
        />
      ),
    },
    {
      id: 'workflow-scenarios',
      render: (navEvents: PanelEventEmitter) => (
        <WorkflowScenariosPanel
          context={context}
          actions={actions}
          events={navEvents}
          selectedCanvasId={workflowContext?.canvasId}
          canvasPath={workflowContext?.canvasPath}
          selectedWorkflowId={workflowContext?.workflowId}
          workflowPath={workflowContext?.workflowPath}
          workflowTemplate={workflowContext?.workflow}
          selectedTraceId={workflowContext?.traceId}
          highlightedSpanId={workflowContext?.spanId}
          selectedScenarioIdProp={workflowContext?.scenarioId}
        />
      ),
    },
  ], [context, actions, workflowContext]);

  // Navigation routes
  const routes: NavigationRoute[] = useMemo(() => [
    {
      eventType: 'custom',
      targetPanelId: 'workflow-scenarios',
      condition: (event: PanelEvent) => {
        const payload = event.payload as OpenCanvasPayload;
        return payload?.action === 'openCanvas';
      },
    },
  ], []);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#0a0e17',
    }}>
      <PanelNavigator
        rootPanelId="trace-list"
        panels={panelSlots}
        routes={routes}
        backEventTypes={['navigation:back', 'workflow:close']}
        externalEvents={events}
        animationDuration={300}
      />
    </div>
  );
};

export default TraceListPanelWrapper;
