import { NextRequest, NextResponse } from "next/server";
import { S3FileCityRequests } from '@/lib/s3-filecity-requests';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, repoUrl } = body;

    if (!email || !repoUrl) {
      return NextResponse.json(
        { error: 'Email and repository URL are required' },
        { status: 400 }
      );
    }

    // Initialize File City requests
    const fileCityRequests = new S3FileCityRequests();

    // Submit the request
    const fileCityRequest = await fileCityRequests.submitFileCityRequest(
      {
        email,
        repoUrl,
      },
      {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      }
    );

    return NextResponse.json({
      success: true,
      message: 'File City request submitted successfully',
      request: {
        id: fileCityRequest.id,
        email: fileCityRequest.email,
        repoUrl: fileCityRequest.repoUrl,
        submittedAt: fileCityRequest.submittedAt,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('File City request error:', error);

    if (error.message === 'Invalid email format') {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (error.message?.includes('Invalid GitHub repository URL')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit File City request' },
      { status: 500 }
    );
  }
}
