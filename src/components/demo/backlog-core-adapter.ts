/**
 * Backlog Core Adapter for Demo
 *
 * Provides an in-memory filesystem seeded with mock backlog data.
 * The panel creates its own Core instance for task operations,
 * so this adapter only needs to provide file operations.
 */

import { InMemoryFileSystemAdapter } from '@backlog-md/core';
import { PathsFileTreeBuilder, type FileTree } from '@principal-ai/repository-abstraction';
import { mockFileContents } from './mock-data';

export interface BacklogCoreAdapter {
  fs: InMemoryFileSystemAdapter;

  // File operations (for panel context)
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  createDir: (path: string) => Promise<void>;

  // Get current FileTree from in-memory filesystem
  getFileTree: () => FileTree;
}

/**
 * Create a demo backlog adapter with in-memory storage
 * seeded from the mock data.
 *
 * Note: This adapter only provides file operations. The panel's
 * useKanbanData hook creates its own Core instance for task operations,
 * which will create the "core.init" span as a child of "kanban.load".
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

  // No Core initialization here - the panel will create its own Core
  // and initialize it within the kanban.load span context

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
    },

    deleteFile: async (path: string): Promise<void> => {
      const normalized = normalizePath(path);
      const fullPath = `${projectRoot}/${normalized}`;

      const filesBefore = fs.getFiles();
      console.log('[BacklogCore] Deleting file:', path, '-> fullPath:', fullPath);
      console.log('[BacklogCore] Files before delete:', Array.from(filesBefore.keys()));

      await fs.deleteFile(fullPath);

      const filesAfter = fs.getFiles();
      console.log('[BacklogCore] Files after delete:', Array.from(filesAfter.keys()));
    },

    createDir: async (path: string): Promise<void> => {
      const normalized = normalizePath(path);
      const fullPath = `${projectRoot}/${normalized}`;

      await ensureDir(fs, fullPath);
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
