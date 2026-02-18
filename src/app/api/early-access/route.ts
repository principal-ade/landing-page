import { NextRequest, NextResponse } from "next/server";
import { S3EarlyAccessRequests } from '@/lib/s3-early-access';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, teamSize } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    if (!teamSize) {
      return NextResponse.json(
        { error: 'Team size is required' },
        { status: 400 }
      );
    }

    // Initialize early access requests
    const earlyAccessRequests = new S3EarlyAccessRequests();

    // Submit the early access request
    const earlyAccessRequest = await earlyAccessRequests.submitEarlyAccessRequest(
      {
        email,
        role,
        teamSize,
      },
      {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Early access request submitted successfully',
      request: {
        id: earlyAccessRequest.id,
        email: earlyAccessRequest.email,
        submittedAt: earlyAccessRequest.submittedAt,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Early access request error:', error);

    if (error.message === 'Invalid email format') {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (error.message === 'Role is required') {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    if (error.message === 'Team size is required') {
      return NextResponse.json(
        { error: 'Team size is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit early access request' },
      { status: 500 }
    );
  }
}
