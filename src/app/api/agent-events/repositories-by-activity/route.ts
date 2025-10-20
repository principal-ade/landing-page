import { NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';
import { Octokit } from '@octokit/rest';
import { createFallbackOctokit, ensureRepoAccessible } from '../github-access';

export const dynamic = 'force-dynamic';

interface RepositoryActivityRow {
  repoName?: string;
  repoOwner?: string;
  lastActivity?: number;
  sessionCount?: number;
}

/**
 * GET /api/agent-events/repositories-by-activity
 * Returns repositories ordered by most recent activity
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

    // Query normalized_events table (v2.1.0+) - much faster than UNION across 4 tables
    // This table is specifically optimized for repository activity queries
    const result = await sdk.execute(
      `SELECT
        repo_name as repoName,
        repo_owner as repoOwner,
        MAX(timestamp) as lastActivity,
        COUNT(DISTINCT session_id) as sessionCount
       FROM normalized_events
       WHERE repo_name IS NOT NULL AND repo_name != ''
       GROUP BY repo_name, repo_owner
       ORDER BY lastActivity DESC
       LIMIT 20`
    ) as { rows?: RepositoryActivityRow[] };

    // Format the results
    const repositories = (result.rows || []).map(row => ({
      repoName: row.repoName || 'Unknown',
      repoOwner: row.repoOwner || 'Unknown',
      lastActivity: row.lastActivity ? new Date(Number(row.lastActivity) * 1000).toISOString() : null,
      lastActivityMs: row.lastActivity ? Number(row.lastActivity) * 1000 : 0,
      sessionCount: Number(row.sessionCount) || 0
    }));

    // Close the connection
    await sdk.close();

    // Use user's GitHub token to check repository access
    // If no token provided, use server token as fallback for public repos only
    const effectiveToken = githubToken || process.env.GITHUB_TOKEN;

    if (!effectiveToken) {
      console.warn('[API] No GitHub token available (neither user nor server). Public repo access may be rate-limited.');
    } else if (!githubToken) {
      console.log('[API] Using server token for unauthenticated user - public repos will be visible');
    }

    const octokit = new Octokit({
      auth: effectiveToken,
      request: {
        timeout: 10000 // 10 second timeout
      }
    });

    const fallbackOctokit = createFallbackOctokit(githubToken);

    const accessibleRepositories = await Promise.all(
      repositories.map(async (repo) => {
        try {
          const hasAccess = await ensureRepoAccessible(
            octokit,
            fallbackOctokit,
            repo.repoOwner,
            repo.repoName
          );

          return hasAccess ? repo : null;
        } catch (error) {
          // If an unexpected error occurs, exclude the repo but log the issue
          console.error('[API] Unexpected error checking repo access:', error);
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
    let userMessage = 'Failed to fetch repositories';
    let status = 500;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes('http status 404') || errorMessage.includes('server_error')) {
        userMessage = 'Database not found. Please check TURSO_DATABASE_URL is correct.';
        status = 503;
        console.error('[API] Database connection failed - URL not found.');
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
        userMessage = 'Database authentication failed. Please check TURSO_AUTH_TOKEN is correct.';
        status = 401;
        console.error('[API] Database authentication failed.');
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
