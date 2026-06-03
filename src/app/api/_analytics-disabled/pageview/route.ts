// API route for page view tracking
// POST /api/analytics/pageview

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/analytics/server/db';
import { getGA4Client } from '@/lib/analytics/server/ga4Client';

export const runtime = 'nodejs';

interface PageViewRequest {
  sessionId: string;
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
}

interface PageViewResponse {
  success: boolean;
  visitId?: string;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<PageViewResponse>> {
  try {
    const body: PageViewRequest = await request.json();
    const { sessionId, pagePath, pageTitle, referrer } = body;

    // Validate input
    if (!sessionId || !pagePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: sessionId, pagePath',
        },
        { status: 400 }
      );
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session not found. Please initialize session first.',
        },
        { status: 404 }
      );
    }

    // Create page visit record
    const visit = await prisma.pageVisit.create({
      data: {
        sessionId: session.id,
        pagePath,
        pageTitle: pageTitle || null,
      },
    });

    // Update session activity and page count
    await prisma.session.update({
      where: { sessionId },
      data: {
        lastActivityTime: new Date(),
        totalPages: {
          increment: 1,
        },
      },
    });

    // Send to GA4 if enabled and not a bot
    const ga4Client = getGA4Client();
    if (ga4Client && !session.isBot) {
      const ga4Response = await ga4Client.sendPageView(
        sessionId,
        pagePath,
        pageTitle,
        referrer
      );

      if (!ga4Response.success) {
        console.error('[PageView] GA4 error:', ga4Response.validationMessages);
      }
    }

    return NextResponse.json({
      success: true,
      visitId: visit.id,
      message: 'Page view tracked',
    });
  } catch (error) {
    console.error('[PageView] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
