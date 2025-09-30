import { NextRequest, NextResponse } from "next/server";
import { getGitHubApiUrl } from "@/config/desktop-app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const path = pathSegments.join("/");

  console.log("[Update Proxy] Request path:", path);
  console.log("[Update Proxy] Path segments:", pathSegments);

  // Handle version check requests (*.yml files)
  if (path.endsWith(".yml")) {
    try {
      // Get latest release info from GitHub API
      console.log("[Update Proxy] Fetching latest release from GitHub API...");
      const response = await fetch(getGitHubApiUrl('latest'), {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_RELEASES_READONLY_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_RELEASES_READONLY_TOKEN}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        console.error(
          `[Update Proxy] Failed to fetch release info: ${response.status} ${response.statusText}`,
        );
        const errorText = await response.text();
        console.error("[Update Proxy] GitHub API error:", errorText);
        return NextResponse.json(
          {
            error: "Failed to fetch release info",
            details: `GitHub API returned ${response.status}: ${response.statusText}`,
            githubError: errorText,
          },
          { status: 500 },
        );
      }

      const release = await response.json();
      const assets = release.assets || [];

      console.log(
        `[Update Proxy] Found ${assets.length} assets in release ${release.tag_name}`,
      );
      console.log(
        "[Update Proxy] Asset names:",
        assets.map((a: any) => a.name),
      );

      // Look for existing platform-specific yml files (e.g., latest-mac.yml)
      // The path might be "darwin-arm64/latest-mac.yml" or just "latest-mac.yml"
      const pathParts = path.split("/");
      const ymlFileName = pathParts[pathParts.length - 1]; // e.g., "latest-mac.yml"
      console.log(`[Update Proxy] Looking for YML file: ${ymlFileName}`);

      const ymlAsset = assets.find((a: any) => a.name === ymlFileName);

      if (ymlAsset) {
        // If the YML file exists in the release, just proxy it directly
        console.log(
          `Found existing ${ymlFileName} in release, proxying directly`,
        );
        console.log(`YML asset URL: ${ymlAsset.browser_download_url}`);

        try {
          // For private repos, we need to use the API URL, not the browser_download_url
          const downloadUrl = process.env.GITHUB_RELEASES_READONLY_TOKEN
            ? ymlAsset.url // This is the API URL that accepts auth tokens
            : ymlAsset.browser_download_url;

          console.log(`[Update Proxy] Using download URL: ${downloadUrl}`);

          const ymlResponse = await fetch(downloadUrl, {
            headers: {
              Accept: "application/octet-stream",
              "User-Agent": "principle-md-update-proxy",
              // Add auth header if the repo is private
              ...(process.env.GITHUB_RELEASES_READONLY_TOKEN
                ? {
                    Authorization: `token ${process.env.GITHUB_RELEASES_READONLY_TOKEN}`,
                  }
                : {}),
            },
          });

          if (!ymlResponse.ok) {
            console.error(
              `Failed to fetch yml file: ${ymlResponse.status} ${ymlResponse.statusText}`,
            );
            const errorText = await ymlResponse.text();
            console.error("Error response:", errorText);
            return NextResponse.json(
              {
                error: "Failed to fetch yml file",
                details: `GitHub returned ${ymlResponse.status}: ${ymlResponse.statusText}`,
                githubError: errorText,
              },
              { status: 500 },
            );
          }

          const ymlContent = await ymlResponse.text();
          console.log(
            `Successfully fetched ${ymlFileName}, size: ${ymlContent.length} bytes`,
          );

          return new NextResponse(ymlContent, {
            headers: {
              "Content-Type": "text/yaml",
              "Cache-Control": "public, max-age=300", // Cache for 5 minutes
            },
          });
        } catch (fetchError) {
          console.error("Error fetching YML file:", fetchError);
          return NextResponse.json(
            {
              error: "Failed to fetch yml file",
              details:
                fetchError instanceof Error
                  ? fetchError.message
                  : "Unknown error",
            },
            { status: 500 },
          );
        }
      }

      // If no yml file exists, generate one (fallback for older releases)
      console.log(`No ${ymlFileName} found in release, generating one`);
      const version = release.tag_name.replace("v", "");

      // Find the appropriate asset for the platform
      const platform = path.split("/")[0]; // e.g., "darwin-x64"

      // Map platform to expected file extension
      const extensionMap: Record<string, string> = {
        darwin: ".dmg",
        win32: ".exe",
        linux: ".AppImage",
      };

      const platformBase = platform.split("-")[0];
      const arch = platform.split("-")[1] || "x64";
      const extension = extensionMap[platformBase] || "";

      // Find matching asset
      const asset = assets.find(
        (a: any) => a.name.includes(arch) && a.name.endsWith(extension),
      );

      if (!asset) {
        return NextResponse.json(
          { error: "No matching release found" },
          { status: 404 },
        );
      }

      // Generate basic YAML response without SHA512 (will fail verification)
      const yaml = `version: ${version}
files:
  - url: ${asset.name}
    sha512: ""
    size: ${asset.size}
path: ${asset.name}
sha512: ""
releaseDate: '${release.published_at}'
`;

      return new NextResponse(yaml, {
        headers: {
          "Content-Type": "text/yaml",
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      });
    } catch (error) {
      console.error("Error fetching release info:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }

  // Handle binary download requests
  else {
    try {
      // Optional: Add authentication/license check here
      // const authHeader = request.headers.get('authorization');
      // if (!isValidLicense(authHeader)) {
      //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }

      // Get latest release to find the download URL
      const releaseResponse = await fetch(getGitHubApiUrl('latest'), {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_RELEASES_READONLY_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_RELEASES_READONLY_TOKEN}`,
              }
            : {}),
        },
      });
      const release = await releaseResponse.json();
      const assets = release.assets || [];

      // Find the requested asset
      const asset = assets.find((a: any) => a.name === path);
      if (!asset) {
        console.error(`[Update Proxy] Asset not found: ${path}`);
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      // For private repos, use the API URL
      const downloadUrl = process.env.GITHUB_RELEASES_READONLY_TOKEN
        ? asset.url
        : asset.browser_download_url;

      console.log(
        `[Update Proxy] Downloading binary: ${path} from ${downloadUrl}`,
      );

      const fileResponse = await fetch(downloadUrl, {
        headers: {
          Accept: "application/octet-stream",
          "User-Agent": "principle-md-update-proxy",
          ...(process.env.GITHUB_RELEASES_READONLY_TOKEN
            ? {
                Authorization: `token ${process.env.GITHUB_RELEASES_READONLY_TOKEN}`,
              }
            : {}),
        },
      });

      if (!fileResponse.ok) {
        console.error(
          `[Update Proxy] Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`,
        );
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      // Stream the file through
      return new NextResponse(fileResponse.body, {
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${path}"`,
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      });
    } catch (error) {
      console.error("Error proxying download:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }
}
