// API route for session initialization
// POST /api/analytics/session/start

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/analytics/server/db';
import { enrichRequest } from '@/lib/analytics/server/enrichment';
import { getGA4Client } from '@/lib/analytics/server/ga4Client';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

interface SessionStartRequest {
  sessionId: string;
  landingPage: string;
  referrer?: string;
}

interface SessionStartResponse {
  success: boolean;
  sessionId: string;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SessionStartResponse>> {
  try {
    const body: SessionStartRequest = await request.json();
    const { sessionId, landingPage, referrer } = body;

    // Validate input
    if (!sessionId || !landingPage) {
      return NextResponse.json(
        {
          success: false,
          sessionId: '',
          error: 'Missing required fields: sessionId, landingPage',
        },
        { status: 400 }
      );
    }

    // Enrich request with server-side data
    const enrichment = await enrichRequest();

    // Check if session already exists
    const existingSession = await prisma.session.findUnique({
      where: { sessionId },
    });

    if (existingSession) {
      // Update last activity time
      await prisma.session.update({
        where: { sessionId },
        data: { lastActivityTime: new Date() },
      });

      return NextResponse.json({
        success: true,
        sessionId,
        message: 'Session resumed',
      });
    }

    // Create new session
    const session = await prisma.session.create({
      data: {
        sessionId,
        landingPage,
        referrer: referrer || null,
        ipAddress: enrichment.ipAddress,
        userAgent: enrichment.userAgent,
        country: enrichment.country,
        city: enrichment.city,
        deviceType: enrichment.deviceType,
        browser: enrichment.browser,
        os: enrichment.os,
        isBot: enrichment.isBot,
        botScore: enrichment.botScore,
      },
    });

    // Send to GA4 if enabled
    const ga4Client = getGA4Client();
    if (ga4Client && !enrichment.isBot) {
      const userProperties = {
        device_type: { value: enrichment.deviceType },
        browser: { value: enrichment.browser || 'unknown' },
        os: { value: enrichment.os || 'unknown' },
        country: { value: enrichment.country || 'unknown' },
      };

      const ga4Response = await ga4Client.sendSessionStart(
        sessionId,
        sessionId,
        landingPage,
        referrer,
        userProperties
      );

      if (!ga4Response.success) {
        console.error('[Session Start] GA4 error:', ga4Response.validationMessages);
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      message: 'Session created',
    });
  } catch (error) {
    console.error('[Session Start] Error:', error);
    return NextResponse.json(
      {
        success: false,
        sessionId: '',
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
