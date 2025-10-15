/**
 * GitHub FileSystem Adapter
 * Implements FileSystemAdapter interface for GitHub repositories
 * Bridges GitHub API to codebase-composition package discovery
 */

import { GitHubService } from "../services/githubService";

/**
 * FileSystemAdapter interface from @principal-ai/codebase-composition
 * This interface is required by PackageLayerModule for discovering packages
 */
export interface FileSystemAdapter {
  readFile(path: string): Promise<{ content: string } | null>;
  fileExists?(path: string): Promise<boolean>;
  isDirectory?(path: string): Promise<boolean>;
  readDirectory?(path: string): Promise<string[]>;
  getFileStats?(
    path: string,
  ): Promise<{
    size: number;
    isDirectory: boolean;
    lastModified: Date;
  } | null>;
  buildFilteredFileTree(
    directoryPath: string,
    patterns?: string[],
    sourceDirectory?: string,
  ): Promise<{
    paths: string[];
    stats?: Map<
      string,
      {
        size: number;
        isDirectory: boolean;
        lastModified: Date;
      }
    >;
  }>;
}

/**
 * GitHubFileSystemAdapter
 * Implements FileSystemAdapter for GitHub repositories via GitHub API
 */
export class GitHubFileSystemAdapter implements FileSystemAdapter {
  private tree: Awaited<
    ReturnType<typeof GitHubService.prototype.fetchFileSystemTree>
  > | null = null;
  private treePromise: Promise<
    Awaited<ReturnType<typeof GitHubService.prototype.fetchFileSystemTree>>
  > | null = null;

  constructor(
    private githubService: GitHubService,
    private owner: string,
    private repo: string,
    private ref: string = "HEAD",
  ) {}

  /**
   * Lazy load and cache the repository tree
   */
  private async getTree() {
    if (this.tree) {
      return this.tree;
    }

    // Prevent multiple concurrent fetches
    if (!this.treePromise) {
      this.treePromise = this.githubService.fetchFileSystemTree(
        this.owner,
        this.repo,
        this.ref,
      );
    }

    this.tree = await this.treePromise;
    return this.tree;
  }

  /**
   * Read file content from GitHub
   */
  async readFile(path: string): Promise<{ content: string } | null> {
    try {
      const content = await this.githubService.fetchFileContent(
        this.owner,
        this.repo,
        path,
      );
      return content ? { content } : null;
    } catch (error) {
      console.error(`Error reading file ${path}:`, error);
      return null;
    }
  }

  /**
   * Check if file exists in the repository
   */
  async fileExists(path: string): Promise<boolean> {
    const tree = await this.getTree();
    return tree.allFiles.some((f) => f.path === path);
  }

  /**
   * Check if path is a directory
   */
  async isDirectory(path: string): Promise<boolean> {
    const tree = await this.getTree();
    return tree.allDirectories.some((d) => d.path === path);
  }

  /**
   * Read directory contents
   */
  async readDirectory(path: string): Promise<string[]> {
    const tree = await this.getTree();

    // Find the directory
    const directory = tree.allDirectories.find((d) => d.path === path);
    if (!directory) {
      // If it's the root directory
      if (path === "" || path === "." || path === "/") {
        return tree.root.children.map((child) => child.name);
      }
      return [];
    }

    return directory.children.map((child) => child.name);
  }

  /**
   * Get file statistics
   */
  async getFileStats(path: string): Promise<{
    size: number;
    isDirectory: boolean;
    lastModified: Date;
  } | null> {
    const tree = await this.getTree();

    // Check if it's a file
    const file = tree.allFiles.find((f) => f.path === path);
    if (file) {
      return {
        size: file.size,
        isDirectory: false,
        lastModified: file.lastModified,
      };
    }

    // Check if it's a directory
    const directory = tree.allDirectories.find((d) => d.path === path);
    if (directory) {
      return {
        size: directory.totalSize,
        isDirectory: true,
        lastModified: new Date(), // GitHub API doesn't provide directory timestamps
      };
    }

    return null;
  }

  /**
   * Build filtered file tree
   * This is the main method used by PackageLayerModule
   */
  async buildFilteredFileTree(
    directoryPath: string,
    patterns?: string[],
    _sourceDirectory?: string,
  ): Promise<{
    paths: string[];
    stats?: Map<
      string,
      {
        size: number;
        isDirectory: boolean;
        lastModified: Date;
      }
    >;
  }> {
    const tree = await this.getTree();

    // Normalize directory path
    const normalizedDir = directoryPath.replace(/^\//, "").replace(/\/$/, "");

    // Filter files based on directory path
    let filteredFiles = tree.allFiles;

    if (normalizedDir && normalizedDir !== ".") {
      filteredFiles = filteredFiles.filter((f) =>
        f.path.startsWith(normalizedDir + "/"),
      );
    }

    // TODO: Apply gitignore-style patterns if provided
    // For now, we'll implement basic filtering
    if (patterns && patterns.length > 0) {
      filteredFiles = this.applyPatternFiltering(filteredFiles, patterns);
    }

    // Build stats map
    const stats = new Map(
      filteredFiles.map((f) => [
        f.path,
        {
          size: f.size,
          isDirectory: false,
          lastModified: f.lastModified,
        },
      ]),
    );

    return {
      paths: filteredFiles.map((f) => f.path),
      stats,
    };
  }

  /**
   * Apply gitignore-style pattern filtering
   * Basic implementation - can be enhanced with ignore library
   */
  private applyPatternFiltering<
    T extends { path: string; size: number; lastModified: Date },
  >(files: T[], patterns: string[]): T[] {
    return files.filter((file) => {
      for (const pattern of patterns) {
        // Simple pattern matching - enhance this with proper gitignore parsing
        if (pattern.startsWith("!")) {
          // Negation pattern - include this file
          continue;
        }

        // Check for common patterns
        if (pattern === "node_modules" && file.path.includes("node_modules/")) {
          return false;
        }
        if (pattern === "dist" && file.path.includes("dist/")) {
          return false;
        }
        if (pattern === ".git" && file.path.includes(".git/")) {
          return false;
        }

        // Wildcard patterns
        if (pattern.includes("*")) {
          const regex = new RegExp(
            pattern.replace(/\*/g, ".*").replace(/\?/g, "."),
          );
          if (regex.test(file.path)) {
            return false;
          }
        }

        // Exact match
        if (file.path === pattern || file.path.startsWith(pattern + "/")) {
          return false;
        }
      }
      return true;
    });
  }
}
