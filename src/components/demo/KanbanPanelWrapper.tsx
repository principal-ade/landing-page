'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ThemeProvider, slateTheme, overrideColors } from '@principal-ade/industry-theme';

// Custom theme with cyan primary color (same as backlog panel storybook)
const customTheme = overrideColors(slateTheme, {
  primary: '#07c0ca',
  secondary: '#06a8b1',
});
import { createDemoBacklog, type BacklogCoreAdapter } from './backlog-core-adapter';
import type { FileTree } from '@principal-ai/repository-abstraction';
import type { DataSlice, PanelEventEmitter } from '@principal-ade/panel-framework-core';
import { PanelNavigator } from './PanelNavigator';

// Import panel components
import { panels } from '@industry-theme/backlogmd-kanban-panel';

// Get the panel components from the panels export
const KanbanPanel = panels[0].component;
const TaskDetailPanel = panels[1].component;

/**
 * Simple event emitter for panel events
 */
function createEventEmitter() {
  const handlers = new Map<string, Set<(event: any) => void>>();

  return {
    emit: (event: { type: string; source: string; timestamp: number; payload: any }) => {
      const typeHandlers = handlers.get(event.type);
      if (typeHandlers) {
        typeHandlers.forEach(handler => handler(event));
      }
      // Also emit to wildcard handlers
      const wildcardHandlers = handlers.get('*');
      if (wildcardHandlers) {
        wildcardHandlers.forEach(handler => handler(event));
      }
    },
    on: (type: string, handler: (event: any) => void) => {
      if (!handlers.has(type)) {
        handlers.set(type, new Set());
      }
      handlers.get(type)!.add(handler);
      // Return unsubscribe function
      return () => {
        handlers.get(type)?.delete(handler);
      };
    },
    off: (type: string, handler: (event: any) => void) => {
      handlers.get(type)?.delete(handler);
    },
  };
}

/**
 * Create a DataSlice for the fileTree
 */
function createFileTreeSlice(fileTree: FileTree): DataSlice<FileTree> {
  return {
    scope: 'repository',
    name: 'fileTree',
    data: fileTree,
    loading: false,
    error: null,
    refresh: async () => {},
  };
}

/**
 * Create the panel context with all required properties
 * Uses BacklogCoreAdapter for file operations when available
 */
function createPanelContext(
  fileTree: FileTree,
  backlogAdapter: BacklogCoreAdapter | null
) {
  const fileTreeSlice = createFileTreeSlice(fileTree);
  const slices = new Map<string, DataSlice>([['fileTree', fileTreeSlice]]);

  return {
    // Typed slice access (modern approach)
    fileTree: fileTreeSlice,

    // Current scope
    currentScope: {
      type: 'repository' as const,
      workspace: {
        name: 'Demo Workspace',
        path: '/demo-project',
      },
      repository: {
        name: 'demo-project',
        path: '/demo-project',
      },
    },

    // Legacy slice access methods
    slices,
    getSlice: <T,>(name: string): DataSlice<T> | undefined => {
      return slices.get(name) as DataSlice<T> | undefined;
    },
    getWorkspaceSlice: <T,>(name: string): DataSlice<T> | undefined => {
      const slice = slices.get(name);
      return slice?.scope === 'workspace' ? (slice as DataSlice<T>) : undefined;
    },
    getRepositorySlice: <T,>(name: string): DataSlice<T> | undefined => {
      const slice = slices.get(name);
      return slice?.scope === 'repository' ? (slice as DataSlice<T>) : undefined;
    },

    // Utility methods
    hasSlice: (name: string) => slices.has(name),
    isSliceLoading: (name: string) => slices.get(name)?.loading ?? false,
    refresh: async () => {
      // No-op: panel's Core handles its own state
    },

    // Adapters for file operations - uses BacklogCoreAdapter when available
    adapters: {
      readFile: async (path: string): Promise<string> => {
        if (backlogAdapter) {
          const content = await backlogAdapter.readFile(path);
          return content;
        }
        console.warn(`[Demo] Backlog adapter not initialized, cannot read: ${path}`);
        return '';
      },
      // Optional: glob matching (not implemented for demo)
      matchesPath: (pattern: string, path: string): boolean => {
        // Simple pattern matching for demo
        if (pattern === '*') return true;
        if (pattern.endsWith('/*')) {
          const dir = pattern.slice(0, -2);
          return path.startsWith(dir);
        }
        return path === pattern;
      },
    },
  };
}

/**
 * Create actions for the panel
 * File operations use the BacklogCoreAdapter, task operations are handled
 * by the panel's own Core instance via useKanbanData
 */
function createActions(
  backlogAdapter: BacklogCoreAdapter | null,
  onWriteFile: (path: string, content: string) => Promise<void>,
  onDeleteFile: (path: string) => Promise<void>
) {
  return {
    readFile: async (path: string): Promise<string> => {
      if (backlogAdapter) {
        return backlogAdapter.readFile(path);
      }
      console.warn(`[Demo Action] Backlog adapter not ready, cannot read: ${path}`);
      return '';
    },

    writeFile: onWriteFile,

    deleteFile: onDeleteFile,

    createDir: async (path: string): Promise<void> => {
      if (backlogAdapter) {
        await backlogAdapter.createDir(path);
        console.log('[Demo Action] Directory created via Backlog Core:', path);
      } else {
        console.warn('[Demo Action] Backlog adapter not ready, cannot create dir:', path);
      }
    },

    openFile: (filePath: string) => {
      console.log('[Demo Action] openFile:', filePath);
    },

    openGitDiff: (filePath: string, status?: string) => {
      console.log('[Demo Action] openGitDiff:', filePath, status);
    },

    navigateToPanel: (panelId: string) => {
      console.log('[Demo Action] navigateToPanel:', panelId);
    },

    notifyPanels: (event: unknown) => {
      console.log('[Demo Action] notifyPanels:', event);
    },

    // Note: deleteTask is now handled by the panel's Core instance directly,
    // which properly resolves file paths. No action needed here.
  };
}

export interface KanbanPanelWrapperProps {
  /**
   * Callback when an event is emitted from the panel
   */
  onEvent?: (event: { type: string; source: string; timestamp: number; payload: any }) => void;
  /**
   * Callback when the events emitter is ready - use this for programmatic control
   */
  onEventsReady?: (events: PanelEventEmitter) => void;
}

/**
 * KanbanPanelWrapper
 *
 * Wraps the KanbanPanel component with mock data and context
 * for use in the demo page. Uses @backlog-md/core for realistic
 * file operations with in-memory storage.
 */
export function KanbanPanelWrapper({ onEvent, onEventsReady }: KanbanPanelWrapperProps) {
  // Backlog Core adapter - initialized on mount
  const [backlogAdapter, setBacklogAdapter] = useState<BacklogCoreAdapter | null>(null);
  const [fileTree, setFileTree] = useState<FileTree | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the backlog adapter on mount
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        console.log('[Demo] Initializing Backlog Core adapter...');
        const adapter = await createDemoBacklog();

        if (mounted) {
          setBacklogAdapter(adapter);
          setFileTree(adapter.getFileTree());
          setIsLoading(false);
          console.log('[Demo] Backlog adapter initialized (filesystem ready)');
          // Note: Tasks will be loaded by the panel's Core instance
        }
      } catch (error) {
        console.error('[Demo] Failed to initialize Backlog Core adapter:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Create event emitter
  const events = useMemo(() => {
    const emitter = createEventEmitter();

    // If onEvent callback is provided, subscribe to all events
    if (onEvent) {
      emitter.on('*', onEvent);
    }

    return emitter;
  }, [onEvent]);

  // Notify parent when events emitter is ready (for programmatic control)
  useEffect(() => {
    if (events && onEventsReady) {
      onEventsReady(events as PanelEventEmitter);
    }
  }, [events, onEventsReady]);

  // Create context with the backlog adapter and reactive fileTree
  const context = useMemo(() => {
    if (!fileTree) return null;
    console.log('[Demo] Creating context with fileTree sha:', fileTree.sha, 'files:', fileTree.allFiles.length);
    return createPanelContext(fileTree, backlogAdapter);
  }, [fileTree, backlogAdapter]);

  // Handle file writes using Backlog Core
  const handleWriteFile = useCallback(async (path: string, content: string) => {
    if (!backlogAdapter) {
      console.warn('[Demo] Cannot write file - adapter not initialized');
      return;
    }

    try {
      await backlogAdapter.writeFile(path, content);
      console.log('[Demo] File written via Backlog Core:', path);
      // Update fileTree to reflect the change
      setFileTree(backlogAdapter.getFileTree());
    } catch (error) {
      console.error('[Demo] Failed to write file:', path, error);
    }
  }, [backlogAdapter]);

  // Handle file deletes using Backlog Core
  const handleDeleteFile = useCallback(async (path: string) => {
    if (!backlogAdapter) {
      console.warn('[Demo] Cannot delete file - adapter not initialized');
      return;
    }

    try {
      await backlogAdapter.deleteFile(path);
      console.log('[Demo] File deleted via Backlog Core:', path);
      // Update fileTree to reflect the change
      const newFileTree = backlogAdapter.getFileTree();
      console.log('[Demo] New fileTree sha:', newFileTree.sha);
      console.log('[Demo] New fileTree file count:', newFileTree.allFiles.length);
      setFileTree(newFileTree);
    } catch (error) {
      console.error('[Demo] Failed to delete file:', path, error);
    }
  }, [backlogAdapter]);

  // Create actions for file operations
  const actions = useMemo(
    () => createActions(backlogAdapter, handleWriteFile, handleDeleteFile),
    [backlogAdapter, handleWriteFile, handleDeleteFile]
  );

  // Panel definitions for navigator
  // Note: context is guaranteed non-null when these render functions are called
  // due to the early return guard below
  const panelSlots = useMemo(() => [
    {
      id: 'kanban',
      render: (navEvents: PanelEventEmitter) => (
        <KanbanPanel
          context={context!}
          actions={actions}
          events={navEvents}
        />
      ),
    },
    {
      id: 'task-detail',
      render: (navEvents: PanelEventEmitter) => (
        <TaskDetailPanel
          context={context!}
          actions={actions}
          events={navEvents}
        />
      ),
    },
  ], [context, actions]);

  // Navigation routes
  const routes = useMemo(() => [
    { eventType: 'task:selected', targetPanelId: 'task-detail' },
  ], []);

  // Show loading state while initializing Backlog Core or fileTree
  if (isLoading || !context) {
    return (
      <ThemeProvider theme={customTheme}>
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1c1e',
          color: '#6b7280',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Initializing backlog...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1c1e',
      }}>
        <PanelNavigator
          rootPanelId="kanban"
          panels={panelSlots}
          routes={routes}
          backEventTypes={['navigation:back', 'task:deselected', 'task:deleted']}
          forwardEventTypes={['task:delete-open-modal', 'task:delete-confirm']}
          externalEvents={events}
          animationDuration={300}
        />
      </div>
    </ThemeProvider>
  );
}

export default KanbanPanelWrapper;
