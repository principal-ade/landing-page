import { NextResponse } from 'next/server';

const REPOSITORY_URL = 'https://github.com/principal-ade/industry-themed-backlogmd-kanban-panel';
const COMMIT_SHA = '0055a21db5ee66b171db7fb5948ea108a5288831';

export async function GET() {
  try {
    const url = new URL('https://app.principal-ade.com/api/versions/schematic');
    url.searchParams.set('repositoryUrl', REPOSITORY_URL);
    url.searchParams.set('commitSha', COMMIT_SHA);

    const response = await fetch(url.toString(), {
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

    return NextResponse.json(schematic, {
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
