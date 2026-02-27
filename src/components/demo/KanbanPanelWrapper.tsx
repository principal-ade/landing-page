'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { ThemeProvider } from '@principal-ade/industry-theme';
import { mockFileTree, mockFileContents, getFileContent } from './mock-data';
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
 */
function createMockPanelContext(fileTree: FileTree, _fileContents: Record<string, string>) {
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
    refresh: async () => {},

    // Adapters for file operations
    adapters: {
      readFile: async (path: string): Promise<string> => {
        const content = getFileContent(path);
        if (!content) {
          console.warn(`[Demo] File not found: ${path}`);
        }
        return content;
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
 * Create mock actions for the panel
 */
function createMockActions() {
  return {
    openFile: (filePath: string) => {
      console.log('[Demo Action] openFile:', filePath);
    },
    openGitDiff: (filePath: string, status?: string) => {
      console.log('[Demo Action] openGitDiff:', filePath, status);
    },
    navigateToPanel: (panelId: string) => {
      console.log('[Demo Action] navigateToPanel:', panelId);
    },
    notifyPanels: (event: any) => {
      console.log('[Demo Action] notifyPanels:', event);
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
 * for use in the demo page.
 */
export function KanbanPanelWrapper({ onEvent }: KanbanPanelWrapperProps) {
  // Track file contents in state so we can update them
  const [fileContents, setFileContents] = useState<Record<string, string>>(() => ({ ...mockFileContents }));

  // Create event emitter
  const events = useMemo(() => {
    const emitter = createEventEmitter();

    // If onEvent callback is provided, subscribe to all events
    if (onEvent) {
      emitter.on('*', onEvent);
    }

    return emitter;
  }, [onEvent]);

  // Create context with the current file contents
  const context = useMemo(
    () => createMockPanelContext(mockFileTree, fileContents),
    [fileContents]
  );

  // Create actions
  const actions = useMemo(() => createMockActions(), []);

  // Handle file writes (for CRUD operations) - available for future use
  const _handleWriteFile = useCallback((path: string, content: string) => {
    setFileContents(prev => ({
      ...prev,
      [path]: content,
    }));
    console.log('[Demo] File written:', path);
  }, []);

  // Handle file deletes - available for future use
  const _handleDeleteFile = useCallback((path: string) => {
    setFileContents(prev => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
    console.log('[Demo] File deleted:', path);
  }, []);

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
