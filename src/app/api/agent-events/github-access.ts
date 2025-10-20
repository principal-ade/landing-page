import { Octokit } from '@octokit/rest';
import { repoVisibilityCache } from '@/lib/repo-visibility-cache';

export type OctokitLike = Pick<InstanceType<typeof Octokit>, 'repos'>;

const GITHUB_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second
const MAX_CONCURRENT_REQUESTS = 5; // Limit concurrent GitHub API calls

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

/**
 * Limits concurrent execution of async tasks
 */
async function limitConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  const executing: Promise<void>[] = [];

  for (let i = 0; i < tasks.length; i++) {
    const index = i;
    const promise = tasks[index]().then((result) => {
      results[index] = result;
      // Remove from executing array
      const execIndex = executing.indexOf(promise);
      if (execIndex !== -1) {
        executing.splice(execIndex, 1);
      }
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
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

  // Check cache first
  const cachedResult = repoVisibilityCache.get(owner, repo);
  if (cachedResult !== null) {
    return cachedResult;
  }

  let hasAccess = false;

  try {
    hasAccess = await tryRepoAccess(primaryOctokit, owner, repo);
  } catch (error) {
    if (!isCredentialError(error)) {
      // Log the error but don't fail the entire request
      console.error(`[API] Error checking ${owner}/${repo}:`, error);
      // Cache the negative result to avoid retrying
      repoVisibilityCache.set(owner, repo, false);
      return false;
    }

    // Credential error - try fallback
    try {
      hasAccess = await tryRepoAccess(fallbackOctokit, owner, repo);
    } catch (fallbackError) {
      console.error(`[API] Fallback also failed for ${owner}/${repo}:`, fallbackError);
      // Cache the negative result
      repoVisibilityCache.set(owner, repo, false);
      return false;
    }
  }

  // Cache the result (positive or negative)
  repoVisibilityCache.set(owner, repo, hasAccess);
  return hasAccess;
}

/**
 * Batch check repository access with concurrency limiting
 */
export async function batchCheckRepoAccess(
  primaryOctokit: OctokitLike,
  fallbackOctokit: OctokitLike,
  repos: Array<{ owner: string; name: string }>
): Promise<Map<string, boolean>> {
  const tasks = repos.map(({ owner, name }) => async () => {
    const hasAccess = await ensureRepoAccessible(primaryOctokit, fallbackOctokit, owner, name);
    return { key: `${owner}/${name}`, hasAccess };
  });

  const results = await limitConcurrency(tasks, MAX_CONCURRENT_REQUESTS);

  const accessMap = new Map<string, boolean>();
  results.forEach(({ key, hasAccess }) => {
    accessMap.set(key, hasAccess);
  });

  return accessMap;
}
