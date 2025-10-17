import { NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';
import { Octokit } from '@octokit/rest';

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
 */
export async function GET() {
  try {
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

    // Check GitHub to filter out private repos
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN // Optional, but helps with rate limits
    });

    const publicRepositories = await Promise.all(
      repositories.map(async (repo) => {
        try {
          const { data } = await octokit.repos.get({
            owner: repo.repoOwner,
            repo: repo.repoName
          });

          // Only return if public
          if (!data.private) {
            return repo;
          }
          return null;
        } catch (error) {
          // If we can't fetch the repo, assume it's private or doesn't exist
          console.warn(`Could not fetch visibility for ${repo.repoOwner}/${repo.repoName}:`, error instanceof Error ? error.message : 'Unknown error');
          return null;
        }
      })
    );

    // Filter out nulls (private repos)
    const filteredRepositories = publicRepositories.filter((repo): repo is NonNullable<typeof repo> => repo !== null);

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
