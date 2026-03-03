import { NextResponse } from 'next/server';

const REPOSITORY_URL = 'https://github.com/principal-ai/Backlog-Core';
const CUSTOMER_ID = 'principal-ai/Backlog-Core';

export async function GET() {
  try {
    // First, fetch the latest version registration to get the current SHA
    const latestUrl = new URL('https://app.principal-ade.com/api/versions/latest');
    latestUrl.searchParams.set('customerId', CUSTOMER_ID);

    const latestResponse = await fetch(latestUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 60, // Short cache - latest can change with new deployments
      },
    });

    if (!latestResponse.ok) {
      const error = await latestResponse.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to fetch latest version', details: error },
        { status: latestResponse.status }
      );
    }

    const latestData = await latestResponse.json();

    if (!latestData.success || !latestData.registration?.gitSHA) {
      return NextResponse.json(
        { error: 'No version registration found for repository' },
        { status: 404 }
      );
    }

    const commitSha = latestData.registration.gitSHA;

    // Now fetch the schematic using the latest SHA
    const schematicUrl = new URL('https://app.principal-ade.com/api/versions/schematic');
    schematicUrl.searchParams.set('repositoryUrl', REPOSITORY_URL);
    schematicUrl.searchParams.set('commitSha', commitSha);

    const response = await fetch(schematicUrl.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to fetch schematic', details: error },
        { status: response.status }
      );
    }

    const schematic = await response.json();

    // Include repositoryUrl and commitSha in the response for GitHub linking
    return NextResponse.json({
      ...schematic,
      repositoryUrl: REPOSITORY_URL,
      commitSha,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching schematic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
