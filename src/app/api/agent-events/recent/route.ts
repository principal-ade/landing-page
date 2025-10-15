import { NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';

export const dynamic = 'force-dynamic';

interface RecentEventRow {
  sessionId?: string;
  timestamp?: number;
  repoName?: string;
  repoOwner?: string;
  toolName?: string;
  eventType?: string;
  prompt?: string;
}

/**
 * GET /api/agent-events/recent
 * Returns the most recent agent event across all sessions
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
          event: null,
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    // Create Turso SDK instance
    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Try to get most recent event from different tables
    // First try pre_hook_logs (tool calls)
    const preHookResult = await sdk.execute(
      `SELECT
        session_id as sessionId,
        timestamp,
        repo_name as repoName,
        repo_owner as repoOwner,
        tool_name as toolName,
        'tool_call' as eventType
       FROM pre_hook_logs
       ORDER BY timestamp DESC
       LIMIT 1`
    ) as { rows?: RecentEventRow[] };

    // Try user_prompt_logs
    const userPromptResult = await sdk.execute(
      `SELECT
        session_id as sessionId,
        timestamp,
        repo_name as repoName,
        repo_owner as repoOwner,
        'user_prompt' as eventType,
        prompt
       FROM user_prompt_logs
       ORDER BY timestamp DESC
       LIMIT 1`
    ) as { rows?: RecentEventRow[] };

    // Try session_start_logs
    const sessionStartResult = await sdk.execute(
      `SELECT
        session_id as sessionId,
        timestamp,
        repo_name as repoName,
        repo_owner as repoOwner,
        'session_start' as eventType
       FROM session_start_logs
       ORDER BY timestamp DESC
       LIMIT 1`
    ) as { rows?: RecentEventRow[] };

    // Combine and find the most recent
    const allEvents = [
      ...(preHookResult.rows || []),
      ...(userPromptResult.rows || []),
      ...(sessionStartResult.rows || [])
    ];

    if (allEvents.length === 0) {
      await sdk.close();
      return NextResponse.json({
        event: null,
        message: 'No events found',
        timestamp: new Date().toISOString()
      });
    }

    // Sort by timestamp to get the most recent
    allEvents.sort((a, b) => {
      const tsA = Number(a.timestamp) || 0;
      const tsB = Number(b.timestamp) || 0;
      return tsB - tsA;
    });

    const mostRecent = allEvents[0];

    // Format the response
    const event = {
      sessionId: mostRecent.sessionId || 'Unknown',
      timestamp: mostRecent.timestamp ? new Date(Number(mostRecent.timestamp) * 1000).toISOString() : null,
      timestampMs: mostRecent.timestamp ? Number(mostRecent.timestamp) * 1000 : 0,
      repoName: mostRecent.repoName || 'Unknown',
      repoOwner: mostRecent.repoOwner || 'Unknown',
      eventType: mostRecent.eventType || 'unknown',
      toolName: mostRecent.toolName,
      prompt: mostRecent.prompt ? (String(mostRecent.prompt).substring(0, 100) + '...') : undefined,
    };

    // Close the connection
    await sdk.close();

    return NextResponse.json({
      event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    let userMessage = 'Failed to fetch recent event';
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
        console.error('[API] Error fetching recent event:', error);
      }
    } else {
      console.error('[API] Error fetching recent event:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch recent event',
        event: null,
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
