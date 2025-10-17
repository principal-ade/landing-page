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

    // Use the new normalized_events table (v2.1.0+)
    // This provides normalized file paths and repository context in a single query
    const result = await sdk.execute(
      `SELECT
        timestamp,
        event_type,
        tool_name,
        operation,
        provider,
        working_directory,
        normalized_working_directory,
        normalized_files,
        repository_context
       FROM normalized_events
       WHERE session_id = ?
       ORDER BY timestamp ASC`,
      [sessionId]
    ) as { rows?: any[] };

    // Format events for the API response
    const events = (result.rows || []).map((event: any) => ({
      timestamp: event.timestamp ? new Date(Number(event.timestamp) * 1000).toISOString() : null,
      timestampMs: event.timestamp ? Number(event.timestamp) * 1000 : 0,
      event_type: event.event_type,
      tool_name: event.tool_name,
      operation: event.operation,
      provider: event.provider,
      working_directory: event.working_directory,
      normalized_working_directory: event.normalized_working_directory,
      normalized_files: event.normalized_files ? JSON.parse(event.normalized_files) : null,
      repository_context: event.repository_context ? JSON.parse(event.repository_context) : null,
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
