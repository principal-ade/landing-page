import { Octokit } from '@octokit/rest';

export type OctokitLike = Pick<InstanceType<typeof Octokit>, 'repos'>;

export function createFallbackOctokit(userToken: string | null): OctokitLike {
  const serverToken = process.env.GITHUB_TOKEN;

  if (serverToken && userToken && userToken !== serverToken) {
    return new Octokit({ auth: serverToken });
  }

  return new Octokit();
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
    await primaryOctokit.repos.get({ owner, repo });
    return true;
  } catch (error) {
    if (!isCredentialError(error)) {
      if (isAccessDenied(error)) {
        return false;
      }

      throw error;
    }

    try {
      await fallbackOctokit.repos.get({ owner, repo });
      return true;
    } catch (fallbackError) {
      if (isAccessDenied(fallbackError)) {
        return false;
      }

      throw fallbackError;
    }
  }
}
