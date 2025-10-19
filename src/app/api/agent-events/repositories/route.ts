import { NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';
import { Octokit } from '@octokit/rest';
import { repoVisibilityCache } from '@/lib/repo-visibility-cache';

export const dynamic = 'force-dynamic';

interface RepositoryRow {
  repoName?: string;
  repoOwner?: string;
  lastActivity?: number;
  sessionCount?: number;
}

/**
 * GET /api/agent-events/repositories
 * Returns a list of repositories from agent sessions
 * Filters based on user's GitHub access
 */
export async function GET(request: Request) {
  try {
    // Get GitHub token from Authorization header or query param
    const url = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const githubToken = authHeader?.replace('Bearer ', '') || url.searchParams.get('token');

    // Validate environment variables
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoAuthToken) {
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          repositories: [],
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    // Create Turso SDK instance
    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Query for repositories from session_start_logs
    // Group by repository and get the most recent activity
    const result = await sdk.execute(
      `SELECT
        repo_name as repoName,
        repo_owner as repoOwner,
        MAX(timestamp) as lastActivity,
        COUNT(DISTINCT session_id) as sessionCount
       FROM session_start_logs
       WHERE repo_name IS NOT NULL
         AND repo_name != ''
       GROUP BY repo_name, repo_owner
       ORDER BY lastActivity DESC
       LIMIT 100`
    ) as { rows?: RepositoryRow[] };

    // Format the results
    const repositories = (result.rows || []).map(row => ({
      repoName: row.repoName || 'Unknown',
      repoOwner: row.repoOwner || 'Unknown',
      lastActivity: row.lastActivity ? new Date(Number(row.lastActivity) * 1000).toISOString() : null,
      sessionCount: Number(row.sessionCount) || 0
    }));

    // Close the connection
    await sdk.close();

    // Use user's GitHub token to check repository access
    // If no token provided, use server token as fallback for public repos only
    const octokit = new Octokit({
      auth: githubToken || process.env.GITHUB_TOKEN
    });

    const accessibleRepositories = await Promise.all(
      repositories.map(async (repo) => {
        try {
          // Try to fetch the repo with the user's token
          // If successful, they have access
          await octokit.repos.get({
            owner: repo.repoOwner,
            repo: repo.repoName
          });

          // User has access to this repo
          return repo;
        } catch (error) {
          // If user doesn't have access or repo doesn't exist, exclude it
          return null;
        }
      })
    );

    // Filter out repos the user doesn't have access to
    const filteredRepositories = accessibleRepositories.filter((repo): repo is NonNullable<typeof repo> => repo !== null);

    return NextResponse.json({
      repositories: filteredRepositories,
      count: filteredRepositories.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Check for common database connection errors
    let userMessage = 'Failed to fetch repositories';
    let status = 500;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('http status 404') || errorMessage.includes('server_error')) {
        userMessage = 'Database not found. Please check TURSO_DATABASE_URL is correct.';
        status = 503; // Service Unavailable
        console.error('[API] Database connection failed - URL not found. Check TURSO_DATABASE_URL environment variable.');
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
        userMessage = 'Database authentication failed. Please check TURSO_AUTH_TOKEN is correct.';
        status = 401;
        console.error('[API] Database authentication failed. Check TURSO_AUTH_TOKEN environment variable.');
      } else if (errorMessage.includes('network') || errorMessage.includes('enotfound')) {
        userMessage = 'Cannot connect to database. Please check your network connection.';
        status = 503;
        console.error('[API] Network error connecting to database:', error.message);
      } else {
        userMessage = error.message;
        console.error('[API] Error fetching repositories:', error);
      }
    } else {
      console.error('[API] Error fetching repositories:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch repositories',
        repositories: [],
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
