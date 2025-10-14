import { NextResponse } from 'next/server';
import { TursoObservabilitySDK } from '@a24z/observability-sdk';

export const dynamic = 'force-dynamic';

/**
 * GET /api/agent-events/debug
 * Debug endpoint to check what's in the database
 */
export async function GET() {
  try {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

    if (!tursoUrl || !tursoAuthToken) {
      return NextResponse.json({
        error: 'Database configuration missing',
      }, { status: 500 });
    }

    const sdk = TursoObservabilitySDK.createCloud(tursoUrl, tursoAuthToken);

    // Check if session_start_logs table exists and has data
    const allSessions = await sdk.execute(
      `SELECT session_id, timestamp FROM session_start_logs LIMIT 10`
    ) as { rows?: Array<{ session_id: unknown; timestamp: unknown }> };

    // Get total count
    const totalCount = await sdk.execute(
      `SELECT COUNT(DISTINCT session_id) as count FROM session_start_logs`
    ) as { rows?: Array<{ count: unknown }> };

    // Get min/max timestamps
    const timestampRange = await sdk.execute(
      `SELECT MIN(timestamp) as min_ts, MAX(timestamp) as max_ts FROM session_start_logs`
    ) as { rows?: Array<{ min_ts: unknown; max_ts: unknown }> };

    // Calculate 24 hours ago
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const nowTimestamp = Date.now();

    await sdk.close();

    return NextResponse.json({
      debug: {
        currentTime: nowTimestamp,
        currentTimeReadable: new Date(nowTimestamp).toISOString(),
        twentyFourHoursAgo: twentyFourHoursAgo,
        twentyFourHoursAgoReadable: new Date(twentyFourHoursAgo).toISOString(),
      },
      totalSessions: totalCount.rows?.[0]?.count || 0,
      timestampRange: {
        min: timestampRange.rows?.[0]?.min_ts,
        max: timestampRange.rows?.[0]?.max_ts,
        minReadable: timestampRange.rows?.[0]?.min_ts
          ? new Date(Number(timestampRange.rows[0].min_ts)).toISOString()
          : null,
        maxReadable: timestampRange.rows?.[0]?.max_ts
          ? new Date(Number(timestampRange.rows[0].max_ts)).toISOString()
          : null,
      },
      sampleSessions: allSessions.rows?.map(row => ({
        sessionId: row.session_id,
        timestamp: row.timestamp,
        timestampReadable: new Date(Number(row.timestamp)).toISOString(),
      })) || [],
    });
  } catch (error) {
    console.error('[API] Debug error:', error);
    return NextResponse.json({
      error: 'Failed to debug',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
