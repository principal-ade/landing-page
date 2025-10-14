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
    console.error('[API] Error fetching session count:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch session count',
        count: 0,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
