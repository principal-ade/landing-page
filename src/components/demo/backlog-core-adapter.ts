/**
 * Backlog Core Adapter for Demo
 *
 * Provides an in-memory backlog instance using @backlog-md/core
 * for realistic file operations in the observability demo.
 */

import { Core, InMemoryFileSystemAdapter, type Task, type Milestone } from '@backlog-md/core';
import { PathsFileTreeBuilder, type FileTree } from '@principal-ai/repository-abstraction';
import { mockFileContents } from './mock-data';

export interface BacklogCoreAdapter {
  core: Core;
  fs: InMemoryFileSystemAdapter;

  // File operations (for panel context)
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  createDir: (path: string) => Promise<void>;

  // Task operations
  getTask: (id: string) => Promise<Task | undefined>;
  listTasks: () => Promise<Task[]>;
  getTasksByStatus: () => Promise<Record<string, Task[]>>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  createTask: (input: { title: string; status?: string; description?: string; labels?: string[]; priority?: string }) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;

  // Milestone operations
  listMilestones: () => Promise<Milestone[]>;

  // Reload from filesystem
  reload: () => Promise<void>;

  // Get current FileTree from in-memory filesystem
  getFileTree: () => FileTree;
}

/**
 * Create a demo backlog instance with in-memory storage
 * seeded from the mock data.
 */
export async function createDemoBacklog(): Promise<BacklogCoreAdapter> {
  const fs = new InMemoryFileSystemAdapter();
  const projectRoot = '/demo-project';

  // Seed the in-memory filesystem with mock data
  for (const [relativePath, content] of Object.entries(mockFileContents)) {
    const fullPath = `${projectRoot}/${relativePath}`;

    // Ensure parent directories exist
    const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
    await ensureDir(fs, dir);

    await fs.writeFile(fullPath, content);
  }

  // Initialize Core with the in-memory filesystem
  const core = new Core({
    projectRoot,
    adapters: { fs },
  });

  // Load all tasks and config
  await core.initialize();

  // Helper to normalize paths for lookups
  const normalizePath = (path: string): string => {
    // Remove leading ./ or /
    let normalized = path;
    if (normalized.startsWith('./')) {
      normalized = normalized.slice(2);
    }
    if (normalized.startsWith('/')) {
      normalized = normalized.slice(1);
    }
    // Handle paths that include the project root
    if (normalized.startsWith('demo-project/')) {
      normalized = normalized.slice('demo-project/'.length);
    }
    return normalized;
  };

  return {
    core,
    fs,

    // File operations
    readFile: async (path: string): Promise<string> => {
      const normalized = normalizePath(path);
      const fullPath = `${projectRoot}/${normalized}`;

      try {
        const content = await fs.readFile(fullPath);
        return content;
      } catch {
        console.warn(`[BacklogCore] File not found: ${path} (resolved to ${fullPath})`);
        return '';
      }
    },

    writeFile: async (path: string, content: string): Promise<void> => {
      const normalized = normalizePath(path);
      const fullPath = `${projectRoot}/${normalized}`;

      // Ensure parent directory exists
      const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));
      await ensureDir(fs, dir);

      await fs.writeFile(fullPath, content);

      // Reload core to pick up changes
      await core.reload();
    },

    deleteFile: async (path: string): Promise<void> => {
      const normalized = normalizePath(path);
      const fullPath = `${projectRoot}/${normalized}`;

      await fs.deleteFile(fullPath);

      // Reload core to pick up changes
      await core.reload();
    },

    createDir: async (path: string): Promise<void> => {
      const normalized = normalizePath(path);
      const fullPath = `${projectRoot}/${normalized}`;

      await ensureDir(fs, fullPath);
    },

    // Task operations
    getTask: async (id: string): Promise<Task | undefined> => {
      return core.getTask(id);
    },

    listTasks: async (): Promise<Task[]> => {
      return core.listTasks();
    },

    getTasksByStatus: async (): Promise<Record<string, Task[]>> => {
      const map = core.getTasksByStatus();
      const record: Record<string, Task[]> = {};
      for (const [status, tasks] of map) {
        record[status] = tasks;
      }
      return record;
    },

    updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
      const task = await core.updateTask(id, updates);
      if (!task) {
        throw new Error(`Task not found: ${id}`);
      }
      return task;
    },

    createTask: async (input): Promise<Task> => {
      const task = await core.createTask({
        title: input.title,
        status: input.status || 'To Do',
        description: input.description,
        labels: input.labels,
        priority: input.priority as 'high' | 'medium' | 'low' | undefined,
      });
      return task;
    },

    deleteTask: async (id: string): Promise<void> => {
      await core.deleteTask(id);
    },

    archiveTask: async (id: string): Promise<void> => {
      await core.archiveTask(id);
    },

    // Milestone operations
    listMilestones: async (): Promise<Milestone[]> => {
      return core.listMilestones();
    },

    // Reload
    reload: async (): Promise<void> => {
      await core.reload();
    },

    // Build FileTree from current in-memory filesystem state
    getFileTree: (): FileTree => {
      const filesMap = fs.getFiles();
      const filePaths: string[] = [];

      for (const fullPath of filesMap.keys()) {
        // Convert absolute paths to relative (remove projectRoot prefix)
        if (fullPath.startsWith(projectRoot)) {
          const relativePath = fullPath.slice(projectRoot.length + 1); // +1 for the slash
          filePaths.push(relativePath);
        } else {
          filePaths.push(fullPath);
        }
      }

      const builder = new PathsFileTreeBuilder();
      return builder.build({
        files: filePaths,
        rootPath: projectRoot,
      });
    },
  };
}

/**
 * Ensure a directory path exists in the in-memory filesystem
 */
async function ensureDir(fs: InMemoryFileSystemAdapter, dirPath: string): Promise<void> {
  const parts = dirPath.split('/').filter(Boolean);
  let current = '';

  for (const part of parts) {
    current = current ? `${current}/${part}` : `/${part}`;
    const exists = await fs.exists(current);
    if (!exists) {
      await fs.createDir(current);
    }
  }
}

/**
 * React hook for using the backlog core adapter
 * Returns a promise that resolves to the adapter
 */
export type { Task, Milestone };
