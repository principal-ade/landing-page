'use client';

import React, { useMemo } from 'react';
import { TraceListPanel } from '@industry-theme/principal-view-panels';
import type {
  DataSlice,
  PanelEvent,
} from '@principal-ade/panel-framework-core';
import type { RegisteredTrace, VersionSnapshot } from '@principal-ai/principal-view-core';

interface TraceListPanelWrapperProps {
  traces: RegisteredTrace[];
  schematics?: VersionSnapshot[];
  onClear?: () => void;
  onTraceSelect?: (trace: RegisteredTrace) => void;
  onWorkflowClick?: (storyboardId: string, workflowId: string, scenarioId: string) => void;
}

/**
 * Wrapper for TraceListPanel that provides the panel framework context
 */
export const TraceListPanelWrapper: React.FC<TraceListPanelWrapperProps> = ({
  traces,
  schematics,
  onClear,
  onTraceSelect,
  onWorkflowClick,
}) => {
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
  }), [slicesMap, telemetrySlice, schematicsSlice]);

  // Create panel actions
  const actions = useMemo(() => ({
    emit: () => {},
    clearTelemetry: onClear ? async () => { onClear(); } : undefined,
    readFile: async () => '',
  }), [onClear]);

  // Create event emitter with proper typing
  const events = useMemo(() => {
    const listeners = new Map<string, Set<(event: PanelEvent) => void>>();

    return {
      emit: <T,>(event: PanelEvent<T>) => {
        // Handle trace selection events
        if (event.type === 'trace:selected' && onTraceSelect) {
          onTraceSelect(event.payload as RegisteredTrace);
        }
        // Handle workflow click events
        if (event.type === 'workflow:clicked' && onWorkflowClick) {
          const { storyboardId, workflowId, scenarioId } = event.payload as {
            storyboardId: string;
            workflowId: string;
            scenarioId: string;
          };
          onWorkflowClick(storyboardId, workflowId, scenarioId);
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

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#0a0e17',
    }}>
      <TraceListPanel
        context={context}
        actions={actions}
        events={events}
      />
    </div>
  );
};

export default TraceListPanelWrapper;
