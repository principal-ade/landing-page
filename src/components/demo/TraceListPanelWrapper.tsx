'use client';

import React, { useMemo, useState } from 'react';
import { TraceListPanel, WorkflowScenariosPanel, type OpenCanvasPayload } from '@industry-theme/principal-view-panels';
import type {
  DataSlice,
  PanelEvent,
  PanelEventEmitter,
} from '@principal-ade/panel-framework-core';
import type { RegisteredTrace, VersionSnapshot } from '@principal-ai/principal-view-core';
import { PathsFileTreeBuilder } from '@principal-ai/repository-abstraction';
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

  // Build file content map and file paths from schematics
  const { fileContentMap, filePaths } = useMemo(() => {
    const map = new Map<string, string>();
    const paths: string[] = [];
    if (!schematics) return { fileContentMap: map, filePaths: paths };

    for (const schematic of schematics) {
      for (const storyboard of schematic.storyboards || []) {
        // Add canvas content
        const canvas = storyboard.canvas as { path: string; content?: unknown };
        if (canvas?.path) {
          paths.push(canvas.path);
          if (canvas.content) {
            map.set(canvas.path, JSON.stringify(canvas.content));
          }
        }
        // Add workflow content
        for (const workflow of (storyboard.workflows || []) as Array<{ path: string; content?: unknown }>) {
          if (workflow?.path) {
            paths.push(workflow.path);
            if (workflow.content) {
              map.set(workflow.path, JSON.stringify(workflow.content));
            }
          }
        }
      }
    }
    console.log('[TraceListPanelWrapper] File content map built:', Array.from(map.keys()));
    return { fileContentMap: map, filePaths: paths };
  }, [schematics]);

  // Build proper FileTree from schematic paths using PathsFileTreeBuilder
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileTreeSlice: DataSlice<any> = useMemo(() => {
    const builder = new PathsFileTreeBuilder();
    const fileTree = builder.build({ files: filePaths, rootPath: '.' });

    return {
      scope: 'workspace' as const,
      name: 'fileTree',
      data: fileTree,
      loading: false,
      error: null,
      refresh: async () => {},
    };
  }, [filePaths]);

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
    // repositoryPath is used by WorkflowScenariosPanel to construct full paths
    // Using '.' to represent current directory (must be non-empty to pass panel check)
    repositoryPath: '.',
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
    readFile: async (path: string) => {
      // Normalize path - handle both './path' and '/path' formats
      let normalizedPath = path;
      if (normalizedPath.startsWith('./')) {
        normalizedPath = normalizedPath.slice(2); // Remove './'
      } else if (normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.slice(1); // Remove leading '/'
      }
      console.log('[TraceListPanelWrapper] readFile called:', path, '-> normalized:', normalizedPath);
      const content = fileContentMap.get(normalizedPath);
      if (content) {
        console.log('[TraceListPanelWrapper] File found, content length:', content.length);
        return content;
      }
      console.warn('[TraceListPanelWrapper] File not found in schematic:', normalizedPath, 'Available:', Array.from(fileContentMap.keys()));
      return '';
    },
    // PanelActions (optional)
    openFile: undefined,
    openGitDiff: undefined,
    navigateToPanel: undefined,
    notifyPanels: undefined,
  }), [onClear, fileContentMap]);

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
