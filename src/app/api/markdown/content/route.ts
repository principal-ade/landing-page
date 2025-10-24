import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, repo, filePath, branch = "main", token } = body;

    if (!owner || typeof owner !== "string") {
      return NextResponse.json(
        { error: "Repository owner is required" },
        { status: 400 }
      );
    }

    if (!repo || typeof repo !== "string") {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 }
      );
    }

    if (!filePath || typeof filePath !== "string") {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Security check: ensure it's a markdown file
    if (!filePath.endsWith(".md")) {
      return NextResponse.json(
        { error: "Only markdown files are supported" },
        { status: 400 }
      );
    }

    // Create Octokit instance with token if provided
    const octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });

    // Get file content from GitHub
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });

    // Ensure we got a file, not a directory
    if (Array.isArray(data) || data.type !== "file") {
      return NextResponse.json(
        { error: "Path is not a file" },
        { status: 400 }
      );
    }

    // Decode content from base64
    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return NextResponse.json({
      content,
      filePath,
      sha: data.sha,
      owner,
      repo,
      branch,
    });
  } catch (error: any) {
    console.error("Error reading file from GitHub:", error);

    if (error.status === 404) {
      return NextResponse.json(
        { error: "File not found in repository" },
        { status: 404 }
      );
    }

    if (error.status === 403 || error.status === 401) {
      return NextResponse.json(
        { error: "Access denied. Check your GitHub token or repository permissions" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to read file from GitHub" },
      { status: 500 }
    );
  }
}
