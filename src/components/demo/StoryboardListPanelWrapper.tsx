'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { StoryboardListPanel, CanvasEditorPanel } from '@industry-theme/principal-view-panels';
import type {
  DataSlice,
  PanelEvent,
  PanelEventEmitter,
} from '@principal-ade/panel-framework-core';
import type { VersionSnapshot, WorkflowTemplate } from '@principal-ai/principal-view-core';
import type { FileTree } from '@principal-ai/repository-abstraction';
import { PathsFileTreeBuilder } from '@principal-ai/repository-abstraction';
import { PanelNavigator, type NavigationRoute, type PanelSlot } from './PanelNavigator';

/**
 * Canvas context extracted from openCanvas event payload
 * Handles both direct properties and nested canvas object
 */
interface CanvasContext {
  canvasPath: string;
  canvasName: string;
  workflowPath?: string;
  workflowId?: string;
  workflow?: WorkflowTemplate;
}

/**
 * Request payload for programmatic panel control
 * Used by tour controllers to trigger panel actions
 */
export interface StoryboardListRequest {
  action: 'selectCanvas' | 'closeCanvas';
  canvasId?: string;
  canvasPath?: string;
  canvasName?: string;
  workflowId?: string;
  workflowPath?: string;
}

/**
 * Response payload for programmatic panel control
 */
export interface StoryboardListResponse {
  success: boolean;
  action: string;
  canvasId?: string;
  error?: string;
}

interface StoryboardListPanelWrapperProps {
  schematics?: VersionSnapshot[];
  onStoryboardSelect?: (storyboardId: string) => void;
  /** Callback when the events emitter is ready - use this for programmatic control */
  onEventsReady?: (events: PanelEventEmitter) => void;
}

/**
 * Wrapper for StoryboardListPanel that provides the panel framework context.
 * Displays storyboards from the loaded schematics with CanvasEditorPanel overlay.
 */
export const StoryboardListPanelWrapper: React.FC<StoryboardListPanelWrapperProps> = ({
  schematics,
  onStoryboardSelect,
  onEventsReady,
}) => {
  // Store canvas/workflow context when navigating to CanvasEditorPanel
  const [canvasContext, setCanvasContext] = useState<CanvasContext | null>(null);

  // Controlled selection state - synced to StoryboardListPanel via context
  // Format: 'canvas:{canvasId}' or 'workflow:{workflowId}'
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Hardcoded demo files loaded from public folder
  const [hardcodedContent, setHardcodedContent] = useState<Map<string, string>>(new Map());

  // Fetch hardcoded demo files from public folder
  useEffect(() => {
    const hardcodedFiles = [
      '.principal-views/task-lifecycle.canvas',
      '.principal-views/task-lifecycle.md',
    ];

    Promise.all(
      hardcodedFiles.map(async (path) => {
        try {
          const response = await fetch(`/${path}`);
          if (response.ok) {
            const content = await response.text();
            return [path, content] as [string, string];
          }
        } catch (e) {
          console.warn(`[StoryboardListPanelWrapper] Failed to fetch ${path}:`, e);
        }
        return null;
      })
    ).then((results) => {
      const map = new Map<string, string>();
      for (const result of results) {
        if (result) {
          map.set(result[0], result[1]);
        }
      }
      setHardcodedContent(map);
    });
  }, []);

  // Helper to find workflow template from schematics
  const findWorkflowTemplate = useCallback((workflowId: string, workflowPath: string): WorkflowTemplate | undefined => {
    if (!schematics) return undefined;
    for (const schematic of schematics) {
      for (const storyboard of schematic.storyboards || []) {
        for (const workflow of (storyboard.workflows || []) as Array<{ id: string; path: string; content?: unknown }>) {
          if (workflow.id === workflowId || workflow.path === workflowPath) {
            return workflow.content as WorkflowTemplate | undefined;
          }
        }
      }
    }
    return undefined;
  }, [schematics]);

  // Build file content map and file paths from schematics
  const { fileContentMap, filePaths, storyboardCount: _storyboardCount } = useMemo(() => {
    const map = new Map<string, string>();
    const paths: string[] = [];
    let count = 0;
    if (!schematics) return { fileContentMap: map, filePaths: paths, storyboardCount: 0 };

    for (const schematic of schematics) {
      for (const storyboard of schematic.storyboards || []) {
        count++;
        // Add canvas content
        const canvas = storyboard.canvas as { path: string; content?: unknown };
        if (canvas?.path) {
          paths.push(canvas.path);
          if (canvas.content) {
            map.set(canvas.path, JSON.stringify(canvas.content));
            // Also store with ./ prefix for compatibility
            map.set('./' + canvas.path, JSON.stringify(canvas.content));
          }
        }
        // Add workflow content
        for (const workflow of (storyboard.workflows || []) as Array<{ path: string; content?: unknown }>) {
          if (workflow?.path) {
            paths.push(workflow.path);
            if (workflow.content) {
              map.set(workflow.path, JSON.stringify(workflow.content));
              // Also store with ./ prefix for compatibility
              map.set('./' + workflow.path, JSON.stringify(workflow.content));
            }
          }
        }
      }
    }
    // Add hardcoded demo paths only when content is loaded
    // This ensures discovery runs after content is available
    if (hardcodedContent.size > 0) {
      for (const [path, content] of hardcodedContent) {
        paths.push(path);
        map.set(path, content);
        // Also store with ./ prefix for compatibility
        map.set('./' + path, content);
      }
    }

    console.log('[StoryboardListPanelWrapper] File content map built:', Array.from(map.keys()), 'storyboards:', count, 'hardcoded:', hardcodedContent.size);
    return { fileContentMap: map, filePaths: paths, storyboardCount: count };
  }, [schematics, hardcodedContent]);

  // Build file tree from schematic paths
  const fileTreeSlice: DataSlice<FileTree | null> = useMemo(() => {
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

  // Create schematics DataSlice (used by the panel to discover storyboards)
  const schematicsSlice: DataSlice<VersionSnapshot[]> = useMemo(() => {
    return {
      scope: 'workspace',
      name: 'schematics',
      data: schematics || [],
      loading: false,
      error: null,
      refresh: async () => {},
    };
  }, [schematics]);

  // Create slices map
  const slicesMap = useMemo(() => {
    const map = new Map<string, DataSlice>();
    map.set('fileTree', fileTreeSlice);
    map.set('schematics', schematicsSlice);
    return map;
  }, [fileTreeSlice, schematicsSlice]);

  // Create panel context
  const context = useMemo(() => ({
    currentScope: {
      type: 'workspace' as const,
      workspace: {
        name: 'Demo Workspace',
        path: '/demo',
      },
    },
    repositoryPath: '.',
    slices: slicesMap,
    getSlice: <T,>(name: string) => slicesMap.get(name) as DataSlice<T> | undefined,
    getWorkspaceSlice: <T,>(name: string) => slicesMap.get(name) as DataSlice<T> | undefined,
    getRepositorySlice: <T,>() => undefined as DataSlice<T> | undefined,
    hasSlice: (name: string) => slicesMap.has(name),
    isSliceLoading: (name: string) => slicesMap.get(name)?.loading ?? false,
    refresh: async () => {},
    fileTree: fileTreeSlice,
    schematics: schematicsSlice,
    // Controlled selection for programmatic control (tours)
    selectedNodeId,
    // Add stable gitStatusData to prevent useMemo dependency array size changes
    gitStatusData: undefined,
  }), [slicesMap, fileTreeSlice, schematicsSlice, selectedNodeId]);

  // Create panel actions with readFile for CanvasEditorPanel
  const actions = useMemo(() => ({
    readFile: async (path: string) => {
      // Normalize path - handle both './path' and '/path' formats
      let normalizedPath = path;
      if (normalizedPath.startsWith('./')) {
        normalizedPath = normalizedPath.slice(2);
      } else if (normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.slice(1);
      }
      console.log('[StoryboardListPanelWrapper] readFile called:', path, '-> normalized:', normalizedPath);

      const content = fileContentMap.get(normalizedPath);
      if (content) {
        console.log('[StoryboardListPanelWrapper] File found, content length:', content.length);
        return content;
      }

      console.warn('[StoryboardListPanelWrapper] File not found:', normalizedPath, 'Available:', Array.from(fileContentMap.keys()));
      return '';
    },
    openFile: undefined,
    openGitDiff: undefined,
    navigateToPanel: undefined,
    notifyPanels: undefined,
  }), [fileContentMap]);

  // Create event emitter
  const events: PanelEventEmitter = useMemo(() => {
    const listeners = new Map<string, Set<(event: PanelEvent) => void>>();

    return {
      emit: <T,>(event: PanelEvent<T>) => {
        console.log('[StoryboardListPanelWrapper] Event:', event.type, event.payload);

        // Handle storyboard selection events
        if (event.type === 'storyboard:selected' && onStoryboardSelect) {
          const { storyboardId } = event.payload as { storyboardId: string };
          onStoryboardSelect(storyboardId);
        }

        // Capture openCanvas payload for CanvasEditorPanel navigation
        if (event.type === 'custom') {
          const payload = event.payload as Record<string, unknown>;
          if (payload?.action === 'openCanvas') {
            // Extract canvas path - could be direct or nested in canvas object
            const canvas = payload.canvas as { path?: string; name?: string; id?: string } | undefined;
            const canvasPath = (payload.canvasPath as string) || canvas?.path || '';
            const canvasName = canvas?.name || (payload.canvasId as string) || canvas?.id || '';

            // Extract workflow data
            const workflowPath = payload.workflowPath as string | undefined;
            const workflowId = payload.workflowId as string | undefined;
            const workflow = payload.workflow as WorkflowTemplate | undefined;

            console.log('[StoryboardListPanelWrapper] openCanvas:', {
              canvasPath,
              canvasName,
              workflowPath,
              workflowId,
              hasWorkflow: !!workflow,
            });

            if (canvasPath) {
              setCanvasContext({
                canvasPath,
                canvasName,
                workflowPath,
                workflowId,
                workflow,
              });
            }
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
  }, [onStoryboardSelect]);

  // Handle programmatic control requests (for tours)
  useEffect(() => {
    const handleRequest = (event: PanelEvent) => {
      const payload = event.payload as StoryboardListRequest;
      console.log('[StoryboardListPanelWrapper] Request received:', payload);

      if (payload.action === 'selectCanvas') {
        // Validate required fields
        if (!payload.canvasPath) {
          events.emit({
            type: 'storyboard-list:response',
            source: 'storyboard-list-panel',
            timestamp: Date.now(),
            payload: {
              success: false,
              action: 'selectCanvas',
              error: 'canvasPath is required',
            } as StoryboardListResponse,
          });
          return;
        }

        // Find workflow template if workflowId is provided
        const workflow = payload.workflowId && payload.workflowPath
          ? findWorkflowTemplate(payload.workflowId, payload.workflowPath)
          : undefined;

        // Update selection state to highlight in StoryboardListPanel
        // Format: 'canvas:{id}' or 'workflow:{id}'
        const nodeId = payload.workflowId
          ? `workflow:${payload.workflowId}`
          : `canvas:${payload.canvasId || payload.canvasPath}`;
        setSelectedNodeId(nodeId);

        // Emit openCanvas event to trigger navigation
        events.emit({
          type: 'custom',
          source: 'tour-controller',
          timestamp: Date.now(),
          payload: {
            action: 'openCanvas',
            canvasId: payload.canvasId || payload.canvasPath,
            canvasPath: payload.canvasPath,
            canvas: {
              id: payload.canvasId || payload.canvasPath,
              path: payload.canvasPath,
              name: payload.canvasName || payload.canvasId || 'Canvas',
            },
            workflowId: payload.workflowId,
            workflowPath: payload.workflowPath,
            workflow,
            openMode: workflow ? 'detail' : 'editor',
          },
        });

        // Emit success response
        events.emit({
          type: 'storyboard-list:response',
          source: 'storyboard-list-panel',
          timestamp: Date.now(),
          payload: {
            success: true,
            action: 'selectCanvas',
            canvasId: payload.canvasId || payload.canvasPath,
          } as StoryboardListResponse,
        });
      } else if (payload.action === 'closeCanvas') {
        // Clear selection state
        setSelectedNodeId(null);

        // Emit navigation:back to close the overlay
        events.emit({
          type: 'navigation:back',
          source: 'tour-controller',
          timestamp: Date.now(),
          payload: {},
        });

        // Emit success response
        events.emit({
          type: 'storyboard-list:response',
          source: 'storyboard-list-panel',
          timestamp: Date.now(),
          payload: {
            success: true,
            action: 'closeCanvas',
          } as StoryboardListResponse,
        });
      }
    };

    // Subscribe to request events
    const unsubscribe = events.on('storyboard-list:request', handleRequest);

    // Notify parent that events are ready
    onEventsReady?.(events);

    return unsubscribe;
  }, [events, findWorkflowTemplate, onEventsReady]);

  // Panel slots for PanelNavigator
  const panelSlots: PanelSlot[] = useMemo(() => [
    {
      id: 'storyboard-list',
      render: (navEvents: PanelEventEmitter) => (
        <StoryboardListPanel
          context={context}
          actions={actions}
          events={navEvents}
        />
      ),
    },
    {
      id: 'canvas-editor',
      render: (navEvents: PanelEventEmitter) => (
        <CanvasEditorPanel
          context={context}
          actions={actions}
          events={navEvents}
          canvasPath={canvasContext?.canvasPath}
          canvasName={canvasContext?.canvasName}
          workflowTemplate={canvasContext?.workflow}
          selectedWorkflowId={canvasContext?.workflowId}
          workflowPath={canvasContext?.workflowPath}
          onClosePanel={() => {
            // Emit navigation:back event to close the overlay
            navEvents.emit({
              type: 'navigation:back',
              source: 'canvas-editor-panel',
              timestamp: Date.now(),
              payload: {},
            });
          }}
        />
      ),
    },
  ], [context, actions, canvasContext]);

  // Navigation routes - open canvas editor on openCanvas action
  const routes: NavigationRoute[] = useMemo(() => [
    {
      eventType: 'custom',
      targetPanelId: 'canvas-editor',
      condition: (event: PanelEvent) => {
        const payload = event.payload as Record<string, unknown>;
        return payload?.action === 'openCanvas';
      },
    },
  ], []);

  // Show loading state while schematics are being fetched
  if (!schematics || schematics.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0e17',
        color: '#00C2FF',
        fontFamily: 'Inter, sans-serif',
        gap: '16px',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          border: '2px solid rgba(0, 194, 255, 0.3)',
          borderTopColor: '#00C2FF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <span>Loading storyboards...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: '#0a0e17',
    }}>
      <PanelNavigator
        rootPanelId="storyboard-list"
        panels={panelSlots}
        routes={routes}
        backEventTypes={['navigation:back', 'canvas:close']}
        externalEvents={events}
        animationDuration={300}
      />
    </div>
  );
};

export default StoryboardListPanelWrapper;
