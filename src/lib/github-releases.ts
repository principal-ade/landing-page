/**
 * Client-side GitHub Releases access for the desktop app.
 *
 * The site is statically hosted (GitHub Pages), so there is no server to proxy
 * the GitHub API through. We hit the public releases API directly from the
 * browser — GitHub sends `Access-Control-Allow-Origin: *` for public repos —
 * and link straight to each asset's `browser_download_url` (GitHub's own CDN),
 * so no download redirect endpoint is needed either.
 */

import { getGitHubApiUrl } from '@/config/desktop-app';

export interface GitHubReleaseAsset {
  id: number;
  name: string;
  browser_download_url: string;
  size: number;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  draft?: boolean;
  prerelease?: boolean;
  assets: GitHubReleaseAsset[];
}

export type DesktopPlatform = 'mac' | 'windows' | 'linux';

const RELEASES_PER_PAGE = 5;

/**
 * Fetch the most recent releases from GitHub.
 * Returns `[]` on any failure so callers can fall back gracefully.
 */
export async function fetchReleases(): Promise<GitHubRelease[]> {
  try {
    const response = await fetch(`${getGitHubApiUrl('releases')}?per_page=${RELEASES_PER_PAGE}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      return [];
    }

    const releases = (await response.json()) as GitHubRelease[];
    return releases.filter((release) => !release.draft);
  } catch {
    return [];
  }
}

function isInstallerForPlatform(asset: GitHubReleaseAsset, platform: DesktopPlatform): boolean {
  const name = asset.name.toLowerCase();

  // Skip checksum/metadata sidecars that shadow installers (e.g. *.dmg.blockmap)
  if (name.endsWith('.blockmap') || name.endsWith('.yml') || name.endsWith('.yaml')) {
    return false;
  }

  switch (platform) {
    case 'mac':
      return name.endsWith('.dmg');
    case 'windows':
      return name.endsWith('.exe') || name.endsWith('.msi');
    case 'linux':
      return name.endsWith('.appimage') || name.endsWith('.deb') || name.endsWith('.rpm');
  }
}

/**
 * Pick the best installer asset for a platform from a release.
 *
 * macOS ships both an Apple Silicon (`-arm64`) and an Intel build; we prefer
 * the Apple Silicon `.dmg` and fall back to whichever installer is available.
 */
function getAssetForPlatform(
  release: GitHubRelease,
  platform: DesktopPlatform,
): GitHubReleaseAsset | null {
  const candidates = (release.assets ?? []).filter((asset) =>
    isInstallerForPlatform(asset, platform),
  );

  if (candidates.length === 0) {
    return null;
  }

  if (platform === 'mac') {
    return candidates.find((asset) => /arm64|aarch64/i.test(asset.name)) ?? candidates[0];
  }

  return candidates[0];
}

/** Convenience helper: the download asset for a platform from the newest release. */
export function getLatestAsset(
  releases: GitHubRelease[],
  platform: DesktopPlatform,
): GitHubReleaseAsset | null {
  const latest = releases[0];
  return latest ? getAssetForPlatform(latest, platform) : null;
}
