import { NextRequest, NextResponse } from 'next/server';
import { S3PrincipalAIEmailList } from '@/lib/s3-email-list';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Initialize email list
    const emailList = new S3PrincipalAIEmailList();

    // Subscribe the user
    const subscriber = await emailList.subscribe(
      email,
      source || 'footer',
      {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    if (error.message === 'Invalid email format') {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
