'use client';

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from '@principal-ade/industry-theme';
import { mockFileTree } from './mock-data';
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
      console.log('[Demo EventEmitter] Event:', event.type, event.payload);
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
      if (backlogAdapter) {
        await backlogAdapter.reload();
      }
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
 * Create actions for the panel with Backlog Core integration
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

    // Task-specific actions using Backlog Core
    updateTask: async (taskId: string, updates: Record<string, unknown>) => {
      if (!backlogAdapter) {
        console.warn('[Demo Action] Cannot update task - adapter not initialized');
        return;
      }

      try {
        const task = await backlogAdapter.updateTask(taskId, updates);
        console.log('[Demo Action] Task updated via Backlog Core:', taskId, task);
        return task;
      } catch (error) {
        console.error('[Demo Action] Failed to update task:', taskId, error);
        throw error;
      }
    },

    createTask: async (input: { title: string; status?: string; description?: string }) => {
      if (!backlogAdapter) {
        console.warn('[Demo Action] Cannot create task - adapter not initialized');
        return;
      }

      try {
        const task = await backlogAdapter.createTask(input);
        console.log('[Demo Action] Task created via Backlog Core:', task);
        return task;
      } catch (error) {
        console.error('[Demo Action] Failed to create task:', error);
        throw error;
      }
    },

    deleteTask: async (taskId: string) => {
      if (!backlogAdapter) {
        console.warn('[Demo Action] Cannot delete task - adapter not initialized');
        return;
      }

      try {
        await backlogAdapter.deleteTask(taskId);
        console.log('[Demo Action] Task deleted via Backlog Core:', taskId);
      } catch (error) {
        console.error('[Demo Action] Failed to delete task:', taskId, error);
        throw error;
      }
    },

    archiveTask: async (taskId: string) => {
      if (!backlogAdapter) {
        console.warn('[Demo Action] Cannot archive task - adapter not initialized');
        return;
      }

      try {
        await backlogAdapter.archiveTask(taskId);
        console.log('[Demo Action] Task archived via Backlog Core:', taskId);
      } catch (error) {
        console.error('[Demo Action] Failed to archive task:', taskId, error);
        throw error;
      }
    },
  };
}

export interface KanbanPanelWrapperProps {
  /**
   * Callback when an event is emitted from the panel
   */
  onEvent?: (event: { type: string; source: string; timestamp: number; payload: any }) => void;
}

/**
 * KanbanPanelWrapper
 *
 * Wraps the KanbanPanel component with mock data and context
 * for use in the demo page. Uses @backlog-md/core for realistic
 * file operations with in-memory storage.
 */
export function KanbanPanelWrapper({ onEvent }: KanbanPanelWrapperProps) {
  // Backlog Core adapter - initialized on mount
  const [backlogAdapter, setBacklogAdapter] = useState<BacklogCoreAdapter | null>(null);
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
          setIsLoading(false);
          console.log('[Demo] Backlog Core adapter initialized');

          // Log initial state
          const tasks = await adapter.listTasks();
          const milestones = await adapter.listMilestones();
          console.log(`[Demo] Loaded ${tasks.length} tasks and ${milestones.length} milestones`);
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

  // Create context with the backlog adapter
  const context = useMemo(
    () => createPanelContext(mockFileTree, backlogAdapter),
    [backlogAdapter]
  );

  // Handle file writes using Backlog Core
  const handleWriteFile = useCallback(async (path: string, content: string) => {
    if (!backlogAdapter) {
      console.warn('[Demo] Cannot write file - adapter not initialized');
      return;
    }

    try {
      await backlogAdapter.writeFile(path, content);
      console.log('[Demo] File written via Backlog Core:', path);
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
    } catch (error) {
      console.error('[Demo] Failed to delete file:', path, error);
    }
  }, [backlogAdapter]);

  // Create actions with Backlog Core integration
  const actions = useMemo(() => createActions(backlogAdapter, handleWriteFile, handleDeleteFile), [backlogAdapter, handleWriteFile, handleDeleteFile]);

  // Panel definitions for navigator
  const panelSlots = useMemo(() => [
    {
      id: 'kanban',
      render: (navEvents: PanelEventEmitter) => (
        <KanbanPanel
          context={context}
          actions={actions}
          events={navEvents}
        />
      ),
    },
    {
      id: 'task-detail',
      render: (navEvents: PanelEventEmitter) => (
        <TaskDetailPanel
          context={context}
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

  // Show loading state while initializing Backlog Core
  if (isLoading) {
    return (
      <ThemeProvider>
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0e17',
          color: '#6b7280',
          fontFamily: 'system-ui, sans-serif',
        }}>
          Initializing backlog...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0e17',
      }}>
        <PanelNavigator
          rootPanelId="kanban"
          panels={panelSlots}
          routes={routes}
          backEventTypes={['navigation:back', 'task:deselected']}
          externalEvents={events}
          animationDuration={300}
        />
      </div>
    </ThemeProvider>
  );
}

export default KanbanPanelWrapper;
