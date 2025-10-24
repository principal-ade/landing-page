import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      owner,
      repo,
      filePath,
      content,
      branch = "main",
      sha,
      commitMessage,
      token,
    } = body;

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

    if (content === undefined || content === null) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!sha || typeof sha !== "string") {
      return NextResponse.json(
        { error: "File SHA is required for updates" },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "GitHub token is required to save files" },
        { status: 401 }
      );
    }

    // Security check: ensure it's a markdown file
    if (!filePath.endsWith(".md")) {
      return NextResponse.json(
        { error: "Only markdown files can be saved" },
        { status: 400 }
      );
    }

    // Create Octokit instance with user's token
    const octokit = new Octokit({
      auth: token,
    });

    // Generate commit message if not provided
    const defaultCommitMessage = `Update ${filePath}`;
    const message = commitMessage || defaultCommitMessage;

    // Update file on GitHub
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch,
    });

    return NextResponse.json({
      success: true,
      filePath,
      sha: data.content?.sha,
      commit: data.commit,
    });
  } catch (error: any) {
    console.error("Error saving file to GitHub:", error);

    if (error.status === 404) {
      return NextResponse.json(
        { error: "File or repository not found" },
        { status: 404 }
      );
    }

    if (error.status === 403 || error.status === 401) {
      return NextResponse.json(
        { error: "Access denied. Check your GitHub token and repository write permissions" },
        { status: 403 }
      );
    }

    if (error.status === 409) {
      return NextResponse.json(
        { error: "Conflict: File has been modified. Please refresh and try again" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save file to GitHub" },
      { status: 500 }
    );
  }
}
