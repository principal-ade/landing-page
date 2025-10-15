import { NextRequest, NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';

export const dynamic = 'force-dynamic';

interface SessionRow {
  sessionId?: string;
  timestamp?: number;
  repoName?: string;
  repoOwner?: string;
}

/**
 * GET /api/agent-events/sessions?owner={owner}&repo={repo}
 * Returns sessions for a specific repository
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json(
        {
          error: 'Missing parameters',
          message: 'Both owner and repo parameters are required',
          sessions: []
        },
        { status: 400 }
      );
    }

    // Validate environment variables
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoAuthToken) {
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          sessions: [],
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    // Create Turso SDK instance
    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Query for sessions for this specific repository
    const result = await sdk.execute(
      `SELECT
        session_id as sessionId,
        timestamp,
        repo_name as repoName,
        repo_owner as repoOwner
       FROM session_start_logs
       WHERE repo_owner = ? AND repo_name = ?
       ORDER BY timestamp DESC
       LIMIT 100`,
      [owner, repo]
    ) as { rows?: SessionRow[] };

    // Format the results
    const sessions = (result.rows || []).map(row => ({
      sessionId: row.sessionId || 'Unknown',
      timestamp: row.timestamp ? new Date(Number(row.timestamp) * 1000).toISOString() : null,
      timestampMs: row.timestamp ? Number(row.timestamp) * 1000 : 0,
      repoName: row.repoName || repo,
      repoOwner: row.repoOwner || owner,
    }));

    // Close the connection
    await sdk.close();

    return NextResponse.json({
      sessions,
      count: sessions.length,
      repository: `${owner}/${repo}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    let userMessage = 'Failed to fetch sessions';
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
        console.error('[API] Error fetching sessions:', error);
      }
    } else {
      console.error('[API] Error fetching sessions:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch sessions',
        sessions: [],
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
