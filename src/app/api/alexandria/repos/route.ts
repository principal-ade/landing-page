import { NextRequest, NextResponse } from 'next/server';
import { S3AlexandriaStore } from '@/lib/s3-alexandria-store';
import { GitHubAlexandria } from '@/lib/github-alexandria';

/**
 * Add CORS headers for Alexandria frontend
 */
function addCorsHeaders(response: NextResponse) {
  // TODO: Consider restricting CORS to specific origins for better security
  // const allowedOrigins = [
  //   'https://a24z-ai.github.io',
  //   'http://localhost:4321',
  //   'http://localhost:3000',
  // ];
  // const origin = request.headers.get('origin');
  // if (origin && allowedOrigins.includes(origin)) {
  //   response.headers.set('Access-Control-Allow-Origin', origin);
  // }
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
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
 * GET /api/alexandria/repos
 * List all registered repositories from S3
 */
export async function GET() {
  try {
    const store = new S3AlexandriaStore();
    
    // Check S3 connectivity
    const isConnected = await store.checkConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: { code: 'S3_CONNECTION_ERROR', message: 'Unable to connect to S3' } },
        { status: 503 }
      );
    }

    // Get all repositories
    const registryData = await store.getRepositories();
    
    // Return the registry data directly as it already conforms to AlexandriaRepositoryRegistry
    const response = registryData;

    const jsonResponse = NextResponse.json(response);
    return addCorsHeaders(jsonResponse);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    const errorResponse = NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to fetch repositories' } },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}

/**
 * POST /api/alexandria/repos
 * Register a new repository or update existing one
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, name, branch, isDefaultBranch, updateContext } = body;

    // Validate required fields
    if (!owner || !name) {
      const errorResponse = NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Owner and name are required' } },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Initialize helpers
    const store = new S3AlexandriaStore();
    const github = new GitHubAlexandria();

    // Check S3 connectivity
    const isConnected = await store.checkConnection();
    if (!isConnected) {
      const errorResponse = NextResponse.json(
        { error: { code: 'S3_CONNECTION_ERROR', message: 'Unable to connect to S3' } },
        { status: 503 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Validate repository is public
    const isValid = await github.validateRepository(owner, name);
    if (!isValid) {
      const errorResponse = NextResponse.json(
        { 
          error: { 
            code: 'REPOSITORY_NOT_FOUND', 
            message: `Repository ${owner}/${name} not found or is not public` 
          } 
        },
        { status: 404 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Get existing repository to check update rules
    const existingRepo = await store.getRepository(owner, name);
    
    // Determine update behavior based on context
    // - New repos: always register
    // - PR context: update if it's the same PR branch or first registration
    // - Push to default: always update
    // - Push to other branch: only update if it was the originally registered branch
    const shouldUpdate = !existingRepo || // New repository
                        isDefaultBranch || // Push to default branch
                        updateContext === 'pull_request' || // PR updates
                        (existingRepo && existingRepo.github?.defaultBranch === branch); // Same branch as registered

    if (!shouldUpdate) {
      // Return current data without updating
      const response = NextResponse.json({
        success: true,
        repository: {
          id: `${owner}/${name}`,
          owner: owner,
          name: name,
          status: 'skipped',
          message: 'Update skipped - not from default branch or original PR branch',
          hasViews: existingRepo?.hasViews || false,
          viewCount: existingRepo?.viewCount || 0,
          views: existingRepo?.views || [],
        }
      }, { status: 200 });
      return addCorsHeaders(response);
    }

    // Fetch full repository data including views
    const repoData = await github.getFullRepositoryData(owner, name, branch);
    if (!repoData) {
      const errorResponse = NextResponse.json(
        { error: { code: 'GITHUB_API_ERROR', message: 'Failed to fetch repository data' } },
        { status: 502 }
      );
      return addCorsHeaders(errorResponse);
    }

    // Register or update repository in S3
    const isNew = await store.registerRepository(
      owner,
      name,
      repoData.github,  // GitHub metadata
      repoData.views    // View data (hasViews, viewCount, views)
    );

    // Return success response
    const status = isNew ? 'registered' : 'updated';
    const message = isNew 
      ? `Repository registered successfully. Found ${repoData.views.viewCount} codebase views.`
      : `Repository updated successfully. Found ${repoData.views.viewCount} codebase views.`;

    const response = NextResponse.json({
      success: true,
      repository: {
        id: `${owner}/${name}`,
        owner: owner,
        name: name,
        status: status,
        message: message,
        hasViews: repoData.views.hasViews,
        viewCount: repoData.views.viewCount,
        views: repoData.views.views,
      }
    }, { status: isNew ? 201 : 200 });
    
    return addCorsHeaders(response);

  } catch (error: any) {
    console.error('Error registering repository:', error);
    
    // Handle specific GitHub API errors
    if (error.status === 403) {
      const errorResponse = NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'GitHub API rate limit exceeded' } },
        { status: 429 }
      );
      return addCorsHeaders(errorResponse);
    }

    const errorResponse = NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Failed to register repository' } },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
}