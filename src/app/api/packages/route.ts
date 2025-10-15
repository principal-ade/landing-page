/**
 * API Route: /api/packages
 * Discover packages in a GitHub repository
 */

import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/services/githubService";
import { GitHubPackageService } from "@/services/githubPackageService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const ref = searchParams.get("ref") || "HEAD";
    const action = searchParams.get("action") || "discover";

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Missing required parameters: owner and repo" },
        { status: 400 },
      );
    }

    // Initialize services
    const githubService = new GitHubService(process.env.GITHUB_TOKEN);
    const packageService = new GitHubPackageService(githubService);

    switch (action) {
      case "discover":
        // Discover all packages
        const packages = await packageService.discoverPackages(
          owner,
          repo,
          ref,
        );
        return NextResponse.json(packages);

      case "summary":
        // Get package summary
        const summary = await packageService.getPackageSummary(
          owner,
          repo,
          ref,
        );
        return NextResponse.json(summary);

      case "dependencies":
        // Get all dependencies
        const dependencies = await packageService.getAllDependencies(
          owner,
          repo,
          ref,
        );

        // Convert Maps and Sets to plain objects for JSON serialization
        const serializedDeps = {
          dependencies: Array.from(dependencies.dependencies.entries()).map(
            ([name, versions]) => ({
              name,
              versions: Array.from(versions),
            }),
          ),
          devDependencies: Array.from(
            dependencies.devDependencies.entries(),
          ).map(([name, versions]) => ({
            name,
            versions: Array.from(versions),
          })),
          peerDependencies: Array.from(
            dependencies.peerDependencies.entries(),
          ).map(([name, versions]) => ({
            name,
            versions: Array.from(versions),
          })),
          totalUniqueDependencies: dependencies.totalUniqueDependencies,
        };

        return NextResponse.json(serializedDeps);

      case "conflicts":
        // Find version conflicts
        const conflicts = await packageService.findVersionConflicts(
          owner,
          repo,
          ref,
        );
        return NextResponse.json({ conflicts });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Error in packages API:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch package information",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
