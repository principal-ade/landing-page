// API route for session end
// POST /api/analytics/session/end

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/analytics/server/db';
import { getGA4Client } from '@/lib/analytics/server/ga4Client';

export const runtime = 'nodejs';

interface SessionEndRequest {
  sessionId: string;
}

interface SessionEndResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SessionEndResponse>> {
  try {
    const body: SessionEndRequest = await request.json();
    const { sessionId } = body;

    // Validate input
    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: sessionId',
        },
        { status: 400 }
      );
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { sessionId },
      include: {
        pageVisits: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session not found',
        },
        { status: 404 }
      );
    }

    // Calculate session duration
    const endTime = new Date();
    const sessionDuration = Math.round(
      (endTime.getTime() - session.startTime.getTime()) / 1000
    );

    // Get exit page (last page visited)
    const exitPage = session.pageVisits.length > 0
      ? session.pageVisits[session.pageVisits.length - 1].pagePath
      : session.landingPage;

    // Get all pages visited
    const pagesVisited = session.pageVisits.map(visit => visit.pagePath);
    if (pagesVisited.length === 0) {
      pagesVisited.push(session.landingPage);
    }

    // Update session
    await prisma.session.update({
      where: { sessionId },
      data: {
        endTime,
        exitPage,
        sessionDuration,
      },
    });

    // Send to GA4 if enabled
    const ga4Client = getGA4Client();
    if (ga4Client && !session.isBot) {
      const ga4Response = await ga4Client.sendSessionEnd(
        sessionId,
        sessionId,
        exitPage,
        pagesVisited.length,
        sessionDuration,
        pagesVisited
      );

      if (!ga4Response.success) {
        console.error('[Session End] GA4 error:', ga4Response.validationMessages);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Session ended',
    });
  } catch (error) {
    console.error('[Session End] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
