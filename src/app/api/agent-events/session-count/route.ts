import { NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';

export const dynamic = 'force-dynamic';

/**
 * GET /api/agent-events/session-count
 * Returns the count of sessions in the last 24 hours
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
          count: 0,
          message: 'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured'
        },
        { status: 500 }
      );
    }

    // Create Turso SDK instance
    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Calculate timestamp for 24 hours ago
    // Note: Turso stores timestamps in SECONDS (Unix timestamp), not milliseconds
    const twentyFourHoursAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);

    // Query for sessions in the last 24 hours
    const result = await sdk.execute(
      `SELECT COUNT(DISTINCT session_id) as count
       FROM session_start_logs
       WHERE timestamp >= ?`,
      [twentyFourHoursAgo]
    ) as { rows?: Array<{ count: unknown }> };

    // Extract count from result
    const count = result.rows?.[0]?.count || 0;

    // Close the connection
    await sdk.close();

    return NextResponse.json({
      count: Number(count),
      period: '24h',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Check for common database connection errors
    let userMessage = 'Failed to fetch session count';
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
        console.error('[API] Error fetching session count:', error);
      }
    } else {
      console.error('[API] Error fetching session count:', error);
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch session count',
        count: 0,
        message: userMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status }
    );
  }
}
