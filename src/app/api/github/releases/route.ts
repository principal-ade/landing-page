import { NextResponse } from "next/server";
import { getGitHubApiUrl } from "@/config/desktop-app";

// This token should ONLY have read access to releases
// Create it with minimal permissions: public_repo (for public) or repo (for private)
// Name it something like: "code-city-landing-releases-readonly"
const RELEASES_ONLY_TOKEN = process.env.GITHUB_RELEASES_READONLY_TOKEN;

export async function GET() {
  try {
    // SECURITY: This endpoint ONLY fetches releases, nothing else
    const ALLOWED_ENDPOINT = getGitHubApiUrl('releases');

    // Build headers - token is optional for public repositories
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    // Add authorization header if token is available (for private repos or higher rate limits)
    if (RELEASES_ONLY_TOKEN) {
      headers.Authorization = `Bearer ${RELEASES_ONLY_TOKEN}`;
    }

    console.log(`Fetching releases from: ${ALLOWED_ENDPOINT}`);
    console.log(`Using token: ${RELEASES_ONLY_TOKEN ? 'Yes (masked)' : 'No (public access)'}`);

    // Fetch releases from the repository (works for public repos without token)
    const response = await fetch(ALLOWED_ENDPOINT, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API error:", response.status, errorText);

      if (response.status === 404) {
        return NextResponse.json(
          { error: "Repository not found or no releases available" },
          { status: 404 },
        );
      }

      if (response.status === 401) {
        // If we got a 401 and we're using a token, the token is invalid
        if (RELEASES_ONLY_TOKEN) {
          console.error("Invalid GitHub token detected. Please check GITHUB_RELEASES_READONLY_TOKEN");
          return NextResponse.json(
            { error: "Invalid GitHub token. Please check your environment variables or remove the token to use public access." },
            { status: 401 },
          );
        }
        // 401 without a token is unusual for public repos
        return NextResponse.json(
          { error: "Authentication failed accessing GitHub API" },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch releases" },
        { status: response.status },
      );
    }

    const releases = await response.json();

    // Security: Only return necessary release data
    // Strip out any sensitive information that might be in the response
    const sanitizedReleases = releases.map((release: any) => ({
      id: release.id,
      tag_name: release.tag_name,
      name: release.name,
      body: release.body,
      published_at: release.published_at,
      assets: release.assets?.map((asset: any) => ({
        id: asset.id,
        name: asset.name,
        browser_download_url: asset.browser_download_url,
        size: asset.size,
      })),
    }));

    // Add cache headers to reduce API calls
    const responseHeaders = new Headers();
    responseHeaders.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );

    return NextResponse.json(sanitizedReleases, { headers: responseHeaders });
  } catch (error) {
    console.error("[SECURITY] Error in releases endpoint:", error);
    // Don't expose internal error details
    return NextResponse.json(
      { error: "Unable to fetch releases" },
      { status: 500 },
    );
  }
}
