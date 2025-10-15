import { NextRequest, NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';

export const dynamic = 'force-dynamic';

/**
 * GET /api/agent-events/events?sessionId={sessionId}
 * Returns events for a specific session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        {
          error: 'Missing parameters',
          message: 'sessionId parameter is required',
          events: []
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
          events: [],
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    // Create Turso SDK instance
    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Query pre_hook_logs (events before tool execution)
    const preHookResult = await sdk.execute(
      `SELECT
        timestamp,
        tool_name,
        tool_call_id,
        'pre_hook' as event_type,
        tool_input,
        cwd
       FROM pre_hook_logs
       WHERE session_id = ?
       ORDER BY timestamp ASC`,
      [sessionId]
    ) as { rows?: any[] };

    // Query post_hook_logs (events after tool execution)
    const postHookResult = await sdk.execute(
      `SELECT
        timestamp,
        tool_name,
        tool_call_id,
        'post_hook' as event_type,
        tool_response,
        error_message,
        success,
        duration_ms,
        cwd
       FROM post_hook_logs
       WHERE session_id = ?
       ORDER BY timestamp ASC`,
      [sessionId]
    ) as { rows?: any[] };

    // Query user_prompt_logs (user interactions)
    const userPromptResult = await sdk.execute(
      `SELECT
        timestamp,
        'user_prompt' as event_type,
        prompt,
        character_count,
        word_count,
        cwd
       FROM user_prompt_logs
       WHERE session_id = ?
       ORDER BY timestamp ASC`,
      [sessionId]
    ) as { rows?: any[] };

    // Combine all events
    const allEvents = [
      ...(preHookResult.rows || []),
      ...(postHookResult.rows || []),
      ...(userPromptResult.rows || [])
    ];

    // Sort by timestamp
    allEvents.sort((a, b) => {
      const tsA = Number(a.timestamp) || 0;
      const tsB = Number(b.timestamp) || 0;
      return tsA - tsB;
    });

    // Format events
    const events = allEvents.map(row => ({
      ...row,
      timestamp: row.timestamp ? new Date(Number(row.timestamp) * 1000).toISOString() : null,
      timestampMs: row.timestamp ? Number(row.timestamp) * 1000 : 0,
    }));

    // Close the connection
    await sdk.close();

    return NextResponse.json({
      events,
      count: events.length,
      sessionId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    let userMessage = 'Failed to fetch events';
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
        console.error('[API] Error fetching events:', error);
      }
    } else {
      console.error('[API] Error fetching events:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch events',
        events: [],
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
