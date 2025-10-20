import { NextRequest, NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';
import { Octokit } from '@octokit/rest';
import { repoVisibilityCache } from '@/lib/repo-visibility-cache';
import { createFallbackOctokit, ensureRepoAccessible } from '../github-access';

export const dynamic = 'force-dynamic';

interface TimelineEvent {
  timestamp?: number;
  event_type?: string;
  tool_name?: string;
  session_id?: string;
  repo_name?: string;
  repo_owner?: string;
}

/**
 * GET /api/agent-events/timeline?hours={hours}
 * Returns all events within the specified time window (default: 24 hours)
 * Only returns timestamp, event_type, and tool_name for privacy
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hours = parseInt(searchParams.get('hours') || '24', 10);

    // Get GitHub token from Authorization header or query param
    const authHeader = request.headers.get('authorization');
    const githubToken = authHeader?.replace('Bearer ', '') || searchParams.get('token');

    // Validate environment variables
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoAuthToken) {
      return NextResponse.json(
        {
          error: 'Database configuration missing',
          events: [],
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    // Create Turso SDK instance
    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Calculate timestamp for X hours ago (Turso stores timestamps as seconds)
    const hoursAgoTimestamp = Math.floor((Date.now() - (hours * 60 * 60 * 1000)) / 1000);

    // Query normalized_events table for events in the last X hours
    const result = await sdk.execute(
      `SELECT
        timestamp,
        event_type,
        tool_name,
        session_id,
        repo_name,
        repo_owner
       FROM normalized_events
       WHERE timestamp >= ?
       ORDER BY timestamp ASC`,
      [hoursAgoTimestamp]
    ) as { rows?: TimelineEvent[] };

    // Format events for timeline (minimal data for privacy)
    const events = (result.rows || []).map((event: TimelineEvent) => ({
      timestampMs: event.timestamp ? Number(event.timestamp) * 1000 : 0,
      timestamp: event.timestamp ? new Date(Number(event.timestamp) * 1000).toISOString() : null,
      eventType: event.event_type,
      toolName: event.tool_name,
      sessionId: event.session_id,
      repoName: event.repo_name,
      repoOwner: event.repo_owner,
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

    const uniqueRepos = new Map<string, { owner: string; name: string }>();
    events.forEach(event => {
      if (event.repoOwner && event.repoName) {
        const key = `${event.repoOwner}/${event.repoName}`;
        if (!uniqueRepos.has(key)) {
          uniqueRepos.set(key, { owner: event.repoOwner, name: event.repoName });
        }
      }
    });

    // Check which repos the user has access to
    const accessibleRepos = new Map<string, boolean>();
    await Promise.all(
      Array.from(uniqueRepos.values()).map(async ({ owner, name }) => {
        const key = `${owner}/${name}`;

        // Try to fetch the repo with the user's token
        // If successful, they have access; if 404/403, they don't
        try {
          const hasAccess = await ensureRepoAccessible(
            octokit,
            fallbackOctokit,
            owner,
            name
          );

          accessibleRepos.set(key, hasAccess);
        } catch (error: any) {
          console.error('[API] Unexpected error checking repo access:', error);
          accessibleRepos.set(key, false);
        }
      })
    );

    // Filter events to only include repos the user has access to
    const eventsWithAccess = events.filter(event => {
      if (!event.repoOwner || !event.repoName) return true;
      const key = `${event.repoOwner}/${event.repoName}`;
      return accessibleRepos.get(key) ?? false;
    });

    return NextResponse.json({
      events: eventsWithAccess,
      count: eventsWithAccess.length,
      timeWindow: `${hours} hours`,
      startTime: new Date(hoursAgoTimestamp * 1000).toISOString(),
      endTime: new Date().toISOString(),
    });
  } catch (error) {
    let userMessage = 'Failed to fetch timeline events';
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
        console.error('[API] Error fetching timeline events:', error);
      }
    } else {
      console.error('[API] Error fetching timeline events:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch timeline events',
        events: [],
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
