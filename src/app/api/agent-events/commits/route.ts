import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { createFallbackOctokit, ensureRepoAccessible } from '../github-access';

export const dynamic = 'force-dynamic';

interface CommitData {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
}

/**
 * GET /api/agent-events/commits?owner={owner}&repo={repo}&since={since}&until={until}
 * Returns commits for a specific repository within the time window
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');
    const since = searchParams.get('since'); // ISO 8601 timestamp
    const until = searchParams.get('until'); // ISO 8601 timestamp

    if (!owner || !repo) {
      return NextResponse.json(
        {
          error: 'Missing parameters',
          message: 'Both owner and repo parameters are required',
          commits: []
        },
        { status: 400 }
      );
    }

    // Get GitHub token from Authorization header or query param
    const authHeader = request.headers.get('authorization');
    const githubToken = authHeader?.replace('Bearer ', '') || searchParams.get('token');

    // Use user's GitHub token, or fallback to server token for public repos
    const effectiveToken = githubToken || process.env.GITHUB_TOKEN;

    if (!effectiveToken) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          message: 'GitHub token is required to fetch commit data',
          commits: []
        },
        { status: 401 }
      );
    }

    const octokit = new Octokit({
      auth: effectiveToken,
      request: {
        timeout: 10000 // 10 second timeout
      }
    });

    const fallbackOctokit = createFallbackOctokit(githubToken);

    // Check if user has access to this repository
    const hasAccess = await ensureRepoAccessible(octokit, fallbackOctokit, owner, repo);

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Access denied',
          message: `You don't have access to ${owner}/${repo}`,
          commits: []
        },
        { status: 403 }
      );
    }

    // Fetch commits from GitHub
    const params: {
      owner: string;
      repo: string;
      per_page: number;
      since?: string;
      until?: string;
    } = {
      owner,
      repo,
      per_page: 100, // Max commits to fetch
    };

    if (since) params.since = since;
    if (until) params.until = until;

    const response = await octokit.repos.listCommits(params);

    // Format the commits for the timeline
    const commits: CommitData[] = response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author?.name || 'Unknown',
        email: commit.commit.author?.email || '',
        date: commit.commit.author?.date || new Date().toISOString(),
      },
      url: commit.html_url,
    }));

    return NextResponse.json({
      commits,
      count: commits.length,
      repository: `${owner}/${repo}`,
      timeWindow: {
        since: since || 'N/A',
        until: until || 'N/A',
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    let userMessage = 'Failed to fetch commits';
    let status = 500;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('not found')) {
        userMessage = 'Repository not found or you do not have access';
        status = 404;
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
        userMessage = 'GitHub authentication failed. Please check your token.';
        status = 401;
      } else if (errorMessage.includes('rate limit')) {
        userMessage = 'GitHub API rate limit exceeded. Please try again later.';
        status = 429;
      } else {
        userMessage = error.message;
      }

      console.error('[API] Error fetching commits:', error);
    } else {
      console.error('[API] Error fetching commits:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch commits',
        commits: [],
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
