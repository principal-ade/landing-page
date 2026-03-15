import { NextRequest, NextResponse } from "next/server";
import { getAssetDownloadUrl } from "@/config/desktop-app";

// This endpoint redirects download requests to GitHub's CDN
// Uses a read-only GitHub token to get the signed download URL
const RELEASES_ONLY_TOKEN = process.env.GITHUB_RELEASES_READONLY_TOKEN;

export async function GET(request: NextRequest) {
  try {
    // Get the asset ID from query parameters
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("assetId");
    const filename = searchParams.get("filename");

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 },
      );
    }

    if (!RELEASES_ONLY_TOKEN) {
      const isDevelopment = process.env.NODE_ENV === "development";

      if (isDevelopment) {
        console.log("========================================");
        console.log("🔧 DEVELOPMENT MODE - Download Request");
        console.log("========================================");
        console.log(`Attempted download of asset ID: ${assetId}`);
        console.log(`Filename: ${filename || "not provided"}`);
        console.log("");
        console.log("In production, this would redirect to GitHub's CDN.");
        console.log("Token required: GITHUB_RELEASES_READONLY_TOKEN");
        console.log("========================================");

        return NextResponse.json(
          {
            message: "Download would redirect in production with proper token",
            assetId,
            filename,
            note: "Set GITHUB_RELEASES_READONLY_TOKEN in .env.local to test downloads",
          },
          { status: 200 },
        );
      }

      console.error(
        "[SECURITY] Missing GITHUB_RELEASES_READONLY_TOKEN for download",
      );
      return NextResponse.json(
        { error: "Download service not configured" },
        { status: 500 },
      );
    }

    // SECURITY: Only allow downloads from our specific repository
    const DOWNLOAD_ENDPOINT = getAssetDownloadUrl(assetId);

    // Use HEAD request to get GitHub's signed CDN URL without downloading the file
    // GitHub redirects to a signed S3 URL - we follow that redirect to get the final URL
    const response = await fetch(DOWNLOAD_ENDPOINT, {
      method: "HEAD",
      headers: {
        Authorization: `Bearer ${RELEASES_ONLY_TOKEN}`,
        Accept: "application/octet-stream",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.error("[SECURITY] GitHub download error:", response.status);

      if (response.status === 404) {
        return NextResponse.json(
          { error: "Download not found" },
          { status: 404 },
        );
      }

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Download access denied" },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: "Download failed" },
        { status: response.status },
      );
    }

    // response.url contains the final URL after following redirects
    // This is GitHub's signed S3/CDN URL that allows direct download
    const cdnUrl = response.url;

    console.log(`Redirecting download for asset ${assetId} to CDN`);

    // Redirect user directly to GitHub's CDN for fast, direct download
    // The signed URL is temporary and doesn't expose our token
    return NextResponse.redirect(cdnUrl);
  } catch (error) {
    console.error("[SECURITY] Error in download endpoint:", error);
    return NextResponse.json(
      { error: "Download service unavailable" },
      { status: 500 },
    );
  }
}
