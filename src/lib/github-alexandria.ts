import { Octokit } from '@octokit/rest';
import { GitHubFileSystemAdapter } from './github-filesystem-adapter';
import type { CodebaseView, GithubRepository, CodebaseViewSummary } from '@a24z/core-library';
import { extractCodebaseViewSummary } from '@a24z/core-library';


/**
 * GitHub API helper for Alexandria repository registration
 * Fetches repository metadata and codebase views
 */
export class GitHubAlexandria {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });
  }

  /**
   * Fetch repository information from GitHub
   * Returns null if repository doesn't exist or is private
   */
  async getRepositoryInfo(owner: string, name: string): Promise<GithubRepository | null> {
    try {
      const { data: repo } = await this.octokit.repos.get({
        owner,
        repo: name,
      });

      // Only allow public repositories
      if (repo.private) {
        return null;
      }

      // Get the last commit date
      let lastCommit: string | undefined;
      try {
        const { data: commits } = await this.octokit.repos.listCommits({
          owner,
          repo: name,
          per_page: 1,
        });
        if (commits.length > 0) {
          lastCommit = commits[0].commit.author?.date || undefined;
        }
      } catch (error) {
        console.error('Failed to fetch last commit:', error);
      }

      return {
        id: `${owner}/${name}`,
        owner: repo.owner.login,
        name: repo.name,
        description: repo.description || undefined,
        stars: repo.stargazers_count,
        primaryLanguage: repo.language || undefined,
        topics: repo.topics || [],
        license: repo.license?.spdx_id || undefined,
        defaultBranch: repo.default_branch,
        isPublic: !repo.private,
        lastCommit,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error: any) {
      if (error.status === 404) {
        // Repository not found or private
        return null;
      }
      throw error;
    }
  }

  /**
   * Fetch codebase views from .alexandria/views directory
   * Uses the GitHubFileSystemAdapter to work with a24z-Memory patterns
   */
  async getCodebaseViews(
    owner: string, 
    name: string, 
    branch: string = 'main'
  ): Promise<{ hasViews: boolean; viewCount: number; views: CodebaseViewSummary[] }> {
    const result = {
      hasViews: false,
      viewCount: 0,
      views: [] as CodebaseViewSummary[],
    };

    const adapter = new GitHubFileSystemAdapter(owner, name, branch, process.env.GITHUB_TOKEN);
    
    try {
      // Check if .alexandria/views directory exists
      const viewsPath = '.alexandria/views';
      const hasViewsDir = await adapter.exists(viewsPath);
      
      if (!hasViewsDir) {
        return result;
      }

      // Read all JSON files in the views directory
      const viewFiles = await adapter.readDir(viewsPath);
      const jsonFiles = viewFiles.filter(f => f.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        return result;
      }

      result.hasViews = true;
      result.viewCount = jsonFiles.length;

      // Parse each view file to extract summary information
      for (const file of jsonFiles) {
        try {
          const viewPath = adapter.join(viewsPath, file);
          const content = await adapter.readFile(viewPath);
          const view = JSON.parse(content) as CodebaseView;
          
          // Use the extraction function from a24z-memory
          const summary = extractCodebaseViewSummary(view);
          result.views.push(summary);
        } catch (error) {
          console.error(`Failed to parse view file ${file}:`, error);
          // Continue with other files even if one fails
        }
      }
    } catch (error: any) {
      if (error.status !== 404) {
        console.error('Error fetching codebase views:', error);
      }
      // Return result with hasViews: false
    }

    return result;
  }

  /**
   * Validate that a repository is public and accessible
   */
  async validateRepository(owner: string, name: string): Promise<boolean> {
    const repoInfo = await this.getRepositoryInfo(owner, name);
    return repoInfo !== null && (repoInfo.isPublic ?? false);
  }

  /**
   * Fetch all repository data needed for Alexandria registration
   */
  async getFullRepositoryData(owner: string, name: string, branch?: string): Promise<{
    github: GithubRepository;
    views: { hasViews: boolean; viewCount: number; views: CodebaseViewSummary[] };
  } | null> {
    const repoInfo = await this.getRepositoryInfo(owner, name);
    
    if (!repoInfo) {
      return null;
    }

    const viewsInfo = await this.getCodebaseViews(
      owner, 
      name, 
      branch || repoInfo.defaultBranch
    );

    return {
      github: repoInfo,
      views: viewsInfo,
    };
  }
}
