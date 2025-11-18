import { NextRequest, NextResponse } from "next/server";
import { S3DemoRequests } from '@/lib/s3-demo-requests';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, teamSize, preferredDateTime, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Initialize demo requests
    const demoRequests = new S3DemoRequests();

    // Submit the demo request
    const demoRequest = await demoRequests.submitDemoRequest(
      {
        name,
        email,
        company,
        teamSize,
        preferredDateTime,
        message,
      },
      {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      request: {
        id: demoRequest.id,
        name: demoRequest.name,
        email: demoRequest.email,
        submittedAt: demoRequest.submittedAt,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Demo request error:', error);

    if (error.message === 'Invalid email format') {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (error.message === 'Name is required') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit demo request' },
      { status: 500 }
    );
  }
}
