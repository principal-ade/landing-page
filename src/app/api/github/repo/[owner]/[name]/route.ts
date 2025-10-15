import { NextRequest, NextResponse } from "next/server";

function addCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  return response;
}

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

const GITHUB_API_BASE = "https://api.github.com";

async function makeGitHubRequest(endpoint: string) {
  const token = process.env.GITHUB_TOKEN || null;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "CodeCity-App/1.0",
  };

  if (token) {
    headers["Authorization"] = `token ${token}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });

  if (!response.ok) {
    let errorMessage = `GitHub API Error: ${response.status} ${response.statusText}`;

    // Add token diagnostic information for 401 errors
    if (response.status === 401) {
      const tokenSource = token ? "environment" : "none";
      const tokenPrefix = token ? `${token.substring(0, 8)}...` : "null";

      errorMessage += `\nToken Status: ${tokenSource} (${tokenPrefix})`;

      if (!token) {
        errorMessage +=
          "\nSuggestion: No GitHub token available. Please set GITHUB_TOKEN environment variable.";
      } else {
        errorMessage +=
          "\nSuggestion: Token may be expired or invalid. Please check your GitHub token permissions and expiration.";
      }
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; name: string }> },
) {
  try {
    const { owner, name } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "info";

    let data;

    switch (action) {
      case "info":
        data = await makeGitHubRequest(`/repos/${owner}/${name}`);
        break;

      case "pulls":
        const state = searchParams.get("state") || "open";
        const pullsData = await makeGitHubRequest(
          `/repos/${owner}/${name}/pulls?state=${state}&per_page=50`,
        );

        // Fetch detailed information for each PR to get changed_files, additions, deletions
        const detailedPulls = await Promise.all(
          pullsData.map(async (pr: any) => {
            try {
              const detailData = await makeGitHubRequest(
                `/repos/${owner}/${name}/pulls/${pr.number}`,
              );
              return {
                ...pr,
                changed_files: detailData.changed_files,
                additions: detailData.additions,
                deletions: detailData.deletions,
              };
            } catch (error) {
              console.warn(
                `Failed to fetch details for PR #${pr.number}:`,
                error,
              );
              return pr; // Return original PR data if detail fetch fails
            }
          }),
        );

        data = detailedPulls;
        break;

      case "pull-files":
        const prNumber = searchParams.get("pr");
        if (!prNumber) {
          return NextResponse.json(
            { error: "PR number required" },
            { status: 400 },
          );
        }
        data = await makeGitHubRequest(
          `/repos/${owner}/${name}/pulls/${prNumber}/files`,
        );
        break;

      case "pull-comments":
        const prNum = searchParams.get("pr");
        if (!prNum) {
          return NextResponse.json(
            { error: "PR number required" },
            { status: 400 },
          );
        }
        data = await makeGitHubRequest(
          `/repos/${owner}/${name}/pulls/${prNum}/comments`,
        );
        break;

      case "tree":
        // Fetch from GitHub
        const ref = searchParams.get("ref") || "HEAD";
        data = await makeGitHubRequest(
          `/repos/${owner}/${name}/git/trees/${ref}?recursive=1`,
        );
        break;

      case "readme":
        data = await makeGitHubRequest(`/repos/${owner}/${name}/readme`);
        break;

      case "contributors":
        data = await makeGitHubRequest(
          `/repos/${owner}/${name}/contributors?per_page=100`,
        );
        break;

      case "file":
        const filePath = searchParams.get("path");
        if (!filePath) {
          return NextResponse.json(
            { error: "File path required" },
            { status: 400 },
          );
        }
        data = await makeGitHubRequest(
          `/repos/${owner}/${name}/contents/${filePath}`,
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub API proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
