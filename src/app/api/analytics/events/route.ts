// API route for analytics event tracking
// POST /api/analytics/events

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/analytics/server/db';
import { enrichRequest } from '@/lib/analytics/server/enrichment';
import { getGA4Client } from '@/lib/analytics/server/ga4Client';

export const runtime = 'nodejs';

interface EventRequest {
  sessionId: string;
  eventType: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
}

interface EventResponse {
  success: boolean;
  eventId?: string;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<EventResponse>> {
  try {
    const body: EventRequest = await request.json();
    const { sessionId, eventType, category, action, label, value, params } = body;

    // Validate input
    if (!sessionId || !eventType || !category || !action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: sessionId, eventType, category, action',
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

    // Enrich request
    const enrichment = await enrichRequest();

    // Create event
    const event = await prisma.analyticsEvent.create({
      data: {
        sessionId: session.id,
        eventType,
        category,
        action,
        label: label || null,
        value: value || null,
        params: params || null,
        ipAddress: enrichment.ipAddress,
        userAgent: enrichment.userAgent,
      },
    });

    // Update session activity and event count
    await prisma.session.update({
      where: { sessionId },
      data: {
        lastActivityTime: new Date(),
        totalEvents: {
          increment: 1,
        },
      },
    });

    // Send to GA4 if enabled and not a bot
    const ga4Client = getGA4Client();
    if (ga4Client && !session.isBot) {
      const ga4Params = {
        event_category: category,
        event_label: label,
        value: value,
        ...params,
      };

      const ga4Response = await ga4Client.sendCustomEvent(
        sessionId,
        action,
        ga4Params
      );

      if (ga4Response.success) {
        // Mark as sent to GA4
        await prisma.analyticsEvent.update({
          where: { id: event.id },
          data: {
            sentToGA4: true,
            ga4SentAt: new Date(),
          },
        });
      } else {
        // Log GA4 error
        console.error('[Event] GA4 error:', ga4Response.validationMessages);
        await prisma.analyticsEvent.update({
          where: { id: event.id },
          data: {
            ga4Error: JSON.stringify(ga4Response.validationMessages),
          },
        });

        // Queue for retry
        await prisma.failedEvent.create({
          data: {
            eventType: 'ga4_event',
            eventData: {
              sessionId,
              action,
              params: ga4Params,
            },
            error: JSON.stringify(ga4Response.validationMessages),
            nextRetry: new Date(Date.now() + 60000), // Retry in 1 minute
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      eventId: event.id,
      message: 'Event tracked',
    });
  } catch (error) {
    console.error('[Event] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
