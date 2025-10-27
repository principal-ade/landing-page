import git from 'isomorphic-git';
import FS from '@isomorphic-git/lightning-fs';
import http from 'isomorphic-git/http/web';

export interface GitConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
}

export interface GitFileStatus {
  filePath: string;
  indexStatus: string;
  workingTreeStatus: string;
  status: 'M' | 'A' | 'D' | 'R' | 'C' | 'U' | '??' | '!!' | 'AM' | 'MM' | null;
}

export interface CommitInfo {
  message: string;
  author?: {
    name: string;
    email: string;
  };
}

export interface GitHubUser {
  name: string;
  email: string;
  login: string;
}

/**
 * GitManager - Manages local git operations in the browser using isomorphic-git
 *
 * This class handles:
 * - Initializing a local git repo in IndexedDB (via LightningFS)
 * - Cloning from GitHub (shallow clone for efficiency)
 * - Reading/Writing files
 * - Tracking dirty state (git status)
 * - Committing changes locally
 * - Pushing to GitHub
 */
export class GitManager {
  private fs: FS;
  private dir: string;
  private config: GitConfig;
  private corsProxy = 'https://cors.isomorphic-git.org';
  private initialized = false;
  private userInfo: GitHubUser | null = null;

  constructor(config: GitConfig) {
    this.config = config;
    // Create unique filesystem name for this repo
    const fsName = `md-editor-${config.owner}-${config.repo}`;
    this.fs = new FS(fsName);
    this.dir = '/repo';
  }

  /**
   * Initialize the local git repository
   * If repo doesn't exist locally, clone from GitHub
   * If it exists, fetch latest changes
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if repo already exists locally
      const exists = await this.repoExists();

      if (!exists) {
        console.log('Cloning repository...');
        await this.clone();
      } else {
        console.log('Repository exists, fetching updates...');
        await this.fetch();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize git repository:', error);
      throw error;
    }
  }

  /**
   * Check if the repository exists locally
   */
  private async repoExists(): Promise<boolean> {
    try {
      await this.fs.promises.readdir(this.dir);
      // Check if .git directory exists
      const gitDir = `${this.dir}/.git`;
      await this.fs.promises.stat(gitDir);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clone repository from GitHub (shallow clone)
   */
  private async clone(): Promise<void> {
    const { owner, repo, branch, token } = this.config;

    await git.clone({
      fs: this.fs,
      http,
      dir: this.dir,
      url: `https://github.com/${owner}/${repo}`,
      ref: branch,
      singleBranch: true,
      depth: 1, // Shallow clone - only latest commit
      corsProxy: this.corsProxy,
      onAuth: () => ({
        username: token || 'token',
        password: token || '',
      }),
    });
  }

  /**
   * Fetch latest changes from GitHub
   */
  private async fetch(): Promise<void> {
    const { token, branch } = this.config;

    try {
      await git.fetch({
        fs: this.fs,
        http,
        dir: this.dir,
        ref: branch,
        singleBranch: true,
        depth: 1,
        corsProxy: this.corsProxy,
        onAuth: () => ({
          username: token || 'token',
          password: token || '',
        }),
      });

      // Merge fetched changes
      await git.merge({
        fs: this.fs,
        dir: this.dir,
        ours: branch,
        theirs: `origin/${branch}`,
      });
    } catch (error) {
      console.error('Fetch failed:', error);
      // If fetch fails, we can still work with local version
    }
  }

  /**
   * Read file content from local git filesystem
   */
  async readFile(filePath: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const fullPath = `${this.dir}/${filePath}`;
      const content = await this.fs.promises.readFile(fullPath, 'utf8');
      return content as string;
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Write file content to local git filesystem
   * This does NOT commit - just saves to working directory
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const fullPath = `${this.dir}/${filePath}`;
      await this.fs.promises.writeFile(fullPath, content, 'utf8');
    } catch (error) {
      console.error(`Failed to write file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get status of a specific file
   * Returns: 'modified', 'added', 'deleted', 'unmodified', etc.
   */
  async getFileStatus(filePath: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const status = await git.status({
        fs: this.fs,
        dir: this.dir,
        filepath: filePath,
      });
      return status;
    } catch (error) {
      console.error(`Failed to get status for ${filePath}:`, error);
      return 'unknown';
    }
  }

  /**
   * Get all dirty files (files with uncommitted changes)
   * Returns array in GitFileStatus format for use with Git components
   */
  async getDirtyFiles(): Promise<GitFileStatus[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Get status matrix for all files
      const matrix = await git.statusMatrix({
        fs: this.fs,
        dir: this.dir,
      });

      const dirtyFiles: GitFileStatus[] = [];

      for (const [filepath, headStatus, worktreeStatus, stageStatus] of matrix) {
        // File is dirty if workdir differs from HEAD or stage
        if (worktreeStatus !== headStatus || stageStatus !== headStatus) {
          let status: GitFileStatus['status'] = null;

          // Determine status
          if (headStatus === 0 && worktreeStatus === 2) {
            status = 'A'; // Added
          } else if (headStatus === 1 && worktreeStatus === 0) {
            status = 'D'; // Deleted
          } else if (headStatus === 1 && worktreeStatus === 2) {
            status = 'M'; // Modified
          }

          if (status) {
            dirtyFiles.push({
              filePath: filepath,
              indexStatus: stageStatus === 2 ? status : '',
              workingTreeStatus: worktreeStatus === 2 ? status : '',
              status,
            });
          }
        }
      }

      return dirtyFiles;
    } catch (error) {
      console.error('Failed to get dirty files:', error);
      return [];
    }
  }

  /**
   * Stage a file for commit
   */
  async stageFile(filePath: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await git.add({
        fs: this.fs,
        dir: this.dir,
        filepath: filePath,
      });
    } catch (error) {
      console.error(`Failed to stage file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Stage all dirty files
   */
  async stageAll(): Promise<void> {
    const dirtyFiles = await this.getDirtyFiles();

    for (const file of dirtyFiles) {
      await this.stageFile(file.filePath);
    }
  }

  /**
   * Fetch authenticated user info from GitHub
   */
  async fetchUserInfo(): Promise<GitHubUser> {
    if (this.userInfo) {
      return this.userInfo;
    }

    const { token } = this.config;

    if (!token) {
      throw new Error('GitHub token is required to fetch user info');
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info from GitHub');
      }

      const data = await response.json();

      // If user hasn't set a public email, try to get it from /user/emails
      let email = data.email;
      if (!email) {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        if (emailsResponse.ok) {
          const emails = await emailsResponse.json();
          // Find primary email or first verified email
          const primaryEmail = emails.find((e: any) => e.primary) || emails.find((e: any) => e.verified);
          email = primaryEmail?.email || `${data.login}@users.noreply.github.com`;
        } else {
          email = `${data.login}@users.noreply.github.com`;
        }
      }

      this.userInfo = {
        name: data.name || data.login,
        email,
        login: data.login,
      };

      return this.userInfo;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }

  /**
   * Get cached user info (or fetch if not cached)
   */
  async getUserInfo(): Promise<GitHubUser> {
    return this.fetchUserInfo();
  }

  /**
   * Commit staged changes
   */
  async commit(commitInfo: CommitInfo): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Use provided author info, or fetch from GitHub
      const author = commitInfo.author || (await this.fetchUserInfo());

      const sha = await git.commit({
        fs: this.fs,
        dir: this.dir,
        message: commitInfo.message,
        author: {
          name: author.name,
          email: author.email,
        },
      });

      return sha;
    } catch (error) {
      console.error('Failed to commit:', error);
      throw error;
    }
  }

  /**
   * Push commits to GitHub
   */
  async push(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    const { token, branch } = this.config;

    if (!token) {
      throw new Error('GitHub token is required to push changes');
    }

    try {
      await git.push({
        fs: this.fs,
        http,
        dir: this.dir,
        remote: 'origin',
        ref: branch,
        corsProxy: this.corsProxy,
        onAuth: () => ({
          username: 'token',
          password: token,
        }),
      });
    } catch (error) {
      console.error('Failed to push to GitHub:', error);
      throw error;
    }
  }

  /**
   * Commit all dirty files and push to GitHub
   */
  async commitAndPush(commitInfo: CommitInfo): Promise<void> {
    // Stage all changes
    await this.stageAll();

    // Commit
    const sha = await this.commit(commitInfo);
    console.log('Created commit:', sha);

    // Push to GitHub
    await this.push();
  }

  /**
   * List all markdown files in the repository
   */
  async listMarkdownFiles(): Promise<string[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const files: string[] = [];

    const walk = async (dir: string) => {
      const entries = await this.fs.promises.readdir(dir);

      for (const entry of entries) {
        // Skip .git directory
        if (entry === '.git') continue;

        const fullPath = `${dir}/${entry}`;
        const stat = await this.fs.promises.stat(fullPath);

        if (stat.isDirectory()) {
          await walk(fullPath);
        } else if (entry.endsWith('.md')) {
          // Remove repo dir prefix to get relative path
          const relativePath = fullPath.replace(`${this.dir}/`, '');
          files.push(relativePath);
        }
      }
    };

    await walk(this.dir);
    return files;
  }

  /**
   * Get the underlying filesystem instance
   * Useful for advanced operations
   */
  getFS(): FS {
    return this.fs;
  }

  /**
   * Get the repository directory
   */
  getDir(): string {
    return this.dir;
  }

  /**
   * Clear the local repository
   * WARNING: This deletes all local data
   */
  async clear(): Promise<void> {
    try {
      // Recursively delete all files and directories
      const deleteRecursive = async (path: string) => {
        const entries = await this.fs.promises.readdir(path);

        for (const entry of entries) {
          const fullPath = `${path}/${entry}`;
          const stat = await this.fs.promises.stat(fullPath);

          if (stat.isDirectory()) {
            await deleteRecursive(fullPath);
            await this.fs.promises.rmdir(fullPath);
          } else {
            await this.fs.promises.unlink(fullPath);
          }
        }
      };

      await deleteRecursive(this.dir);
      await this.fs.promises.rmdir(this.dir);
      this.initialized = false;
    } catch (error) {
      console.error('Failed to clear repository:', error);
      throw error;
    }
  }
}
