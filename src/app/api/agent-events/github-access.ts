import { Octokit } from '@octokit/rest';

export type OctokitLike = Pick<InstanceType<typeof Octokit>, 'repos'>;

const GITHUB_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

export function createFallbackOctokit(userToken: string | null): OctokitLike {
  const serverToken = process.env.GITHUB_TOKEN;

  if (serverToken && userToken && userToken !== serverToken) {
    return new Octokit({
      auth: serverToken,
      request: {
        timeout: GITHUB_TIMEOUT
      }
    });
  }

  return new Octokit({
    request: {
      timeout: GITHUB_TIMEOUT
    }
  });
}

function isCredentialError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const status = (error as { status?: number }).status;
  const message = String((error as { message?: string }).message || '').toLowerCase();

  if (status !== 401 && status !== 403) {
    return false;
  }

  return message.includes('bad credentials') || message.includes('requires authentication');
}

function isAccessDenied(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const status = (error as { status?: number }).status;
  return status === 403 || status === 404;
}

function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const message = String((error as { message?: string }).message || '').toLowerCase();
  const code = (error as { code?: string }).code;

  // Check for common network error patterns
  return (
    message.includes('fetch failed') ||
    message.includes('socket') ||
    message.includes('econnreset') ||
    message.includes('timeout') ||
    code === 'UND_ERR_SOCKET' ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT'
  );
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryRepoAccess(
  octokit: OctokitLike,
  owner: string,
  repo: string,
  retries = MAX_RETRIES
): Promise<boolean> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await octokit.repos.get({ owner, repo });
      return true;
    } catch (error) {
      // If it's a network error and we have retries left, try again
      if (isNetworkError(error) && attempt < retries) {
        console.warn(
          `[API] Network error checking ${owner}/${repo}, retrying (${attempt + 1}/${retries})...`
        );
        await sleep(RETRY_DELAY * (attempt + 1)); // Exponential backoff
        continue;
      }

      // If it's access denied, return false (don't retry)
      if (isAccessDenied(error)) {
        return false;
      }

      // For other errors, throw
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  return false;
}

export async function ensureRepoAccessible(
  primaryOctokit: OctokitLike,
  fallbackOctokit: OctokitLike,
  owner?: string,
  repo?: string
): Promise<boolean> {
  if (!owner || !repo) {
    return false;
  }

  try {
    return await tryRepoAccess(primaryOctokit, owner, repo);
  } catch (error) {
    if (!isCredentialError(error)) {
      // Log the error but don't fail the entire request
      console.error(`[API] Error checking ${owner}/${repo}:`, error);
      return false;
    }

    // Credential error - try fallback
    try {
      return await tryRepoAccess(fallbackOctokit, owner, repo);
    } catch (fallbackError) {
      console.error(`[API] Fallback also failed for ${owner}/${repo}:`, fallbackError);
      return false;
    }
  }
}
