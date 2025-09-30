import { NextRequest, NextResponse } from 'next/server';
import { S3AlexandriaStore } from '@/lib/s3-alexandria-store';
import { GitHubAlexandria } from '@/lib/github-alexandria';

/**
 * Add CORS headers for Alexandria frontend
 */
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  response.headers.set(
    'Access-Control-Max-Age',
    '3600'
  );
  return response;
}

/**
 * Handle preflight OPTIONS requests
 */
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

/**
 * GET /api/alexandria/repos/[owner]/[name]
 * Get detailed information about a specific repository
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; name: string }> }
) {
  try {
    const { owner, name } = await params;

    const store = new S3AlexandriaStore();
    
    // Check S3 connectivity
    const isConnected = await store.checkConnection();
    if (!isConnected) {
      const errorResponse = NextResponse.json(
        { error: { code: 'S3_CONNECTION_ERROR', message: 'Unable to connect to S3' } },
        { status: 503 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Get repository from S3
    const repo = await store.getRepository(owner, name);
    
    if (!repo) {
      const errorResponse = NextResponse.json(
        { 
          error: { 
            code: 'REPOSITORY_NOT_FOUND', 
            message: `Repository ${owner}/${name} not found in registry` 
          } 
        },
        { status: 404 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Check if we should refresh the data (if last checked > 1 hour ago)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const lastChecked = repo.lastChecked ? new Date(repo.lastChecked) : new Date(0);
    const shouldRefresh = lastChecked < hourAgo;

    if (shouldRefresh) {
      try {
        // Try to refresh data from GitHub
        const github = new GitHubAlexandria();
        const freshData = await github.getFullRepositoryData(owner, name, repo.github?.defaultBranch);
        
        if (freshData) {
          // Update the repository with fresh data
          await store.updateRepositoryStats(owner, name, {
            github: freshData.github,
            hasViews: freshData.views.hasViews,
            viewCount: freshData.views.viewCount,
            views: freshData.views.views,
          });

          // Return the updated data
          const updatedRepo = await store.getRepository(owner, name);
          if (updatedRepo) {
            const response = NextResponse.json(updatedRepo);
            return addCorsHeaders(response);
          }
        }
      } catch (error) {
        // If refresh fails, continue with cached data
        console.error('Failed to refresh repository data:', error);
      }
    }

    // Return repository data directly (already conforms to AlexandriaRepository)
    const response = NextResponse.json(repo);
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Error fetching repository details:', error);
    const errorResponse = NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to fetch repository details' } },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}