import { NextRequest, NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';
import { Octokit } from '@octokit/rest';
import { repoVisibilityCache } from '@/lib/repo-visibility-cache';

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

    // Check visibility for unique repos
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const uniqueRepos = new Map<string, { owner: string; name: string }>();
    events.forEach(event => {
      if (event.repoOwner && event.repoName) {
        const key = `${event.repoOwner}/${event.repoName}`;
        if (!uniqueRepos.has(key)) {
          uniqueRepos.set(key, { owner: event.repoOwner, name: event.repoName });
        }
      }
    });

    const visibilityMap = new Map<string, boolean>();
    await Promise.all(
      Array.from(uniqueRepos.values()).map(async ({ owner, name }) => {
        const key = `${owner}/${name}`;

        // Check cache first
        const cachedVisibility = repoVisibilityCache.get(owner, name);
        if (cachedVisibility !== null) {
          visibilityMap.set(key, cachedVisibility);
          return;
        }

        // Not in cache, fetch from GitHub
        try {
          const { data } = await octokit.repos.get({ owner, repo: name });
          const isPublic = !data.private;
          repoVisibilityCache.set(owner, name, isPublic);
          visibilityMap.set(key, isPublic);
        } catch (error) {
          // Assume private if we can't fetch
          repoVisibilityCache.set(owner, name, false);
          visibilityMap.set(key, false);
        }
      })
    );

    // Add visibility info to events
    const eventsWithVisibility = events.map(event => ({
      ...event,
      isPublic: event.repoOwner && event.repoName
        ? visibilityMap.get(`${event.repoOwner}/${event.repoName}`) ?? false
        : false
    }));

    return NextResponse.json({
      events: eventsWithVisibility,
      count: eventsWithVisibility.length,
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
