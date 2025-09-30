import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

// CORS headers for Electron app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * OPTIONS /api/orbit/auth/status - Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * GET /api/orbit/auth/status - Check user's waitlist status
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  console.log(
    "[/api/orbit/auth/status] Received request with auth header:",
    authHeader ? "Bearer token present" : "No auth header",
  );

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("[/api/orbit/auth/status] Invalid or missing auth header");
    return NextResponse.json(
      { error: "Missing or invalid authorization header" },
      { status: 401, headers: corsHeaders },
    );
  }

  const token = authHeader.substring(7);
  console.log(
    "[/api/orbit/auth/status] Token extracted:",
    token.substring(0, 10) + "...",
  );

  try {
    const store = new S3OrbitStore();
    console.log("[/api/orbit/auth/status] Looking up user by token...");
    const user = await store.getUserByToken(token);

    if (!user) {
      console.log("[/api/orbit/auth/status] No user found for token");
      return NextResponse.json(
        { status: "new" },
        { status: 200, headers: corsHeaders },
      );
    }

    console.log(
      "[/api/orbit/auth/status] User found:",
      user.githubHandle,
      "Status:",
      user.status,
    );
    return NextResponse.json(
      {
        status: user.status,
        githubHandle: user.githubHandle,
        email: user.email,
        metadata: user.metadata,
      },
      { headers: corsHeaders },
    );
  } catch (error: unknown) {
    console.error("[/api/orbit/auth/status] Error details:", error);
    console.error("[/api/orbit/auth/status] Error stack:", error);

    const errorObj = error as any;

    // Check if it's an S3 permissions issue
    if (
      errorObj.name === "AccessDenied" ||
      (errorObj.message && errorObj.message.includes("AccessDenied"))
    ) {
      console.error(
        "[/api/orbit/auth/status] S3 Access Denied - check IAM permissions",
      );
      return NextResponse.json(
        { error: "S3 access denied - check IAM permissions" },
        { status: 500, headers: corsHeaders },
      );
    }

    // Check if it's a missing bucket issue
    if (
      errorObj.name === "NoSuchBucket" ||
      (errorObj.message && errorObj.message.includes("NoSuchBucket"))
    ) {
      console.error(
        "[/api/orbit/auth/status] S3 bucket not found - check ORBIT_S3_BUCKET env var",
      );
      return NextResponse.json(
        { error: "S3 bucket not found - check configuration" },
        { status: 500, headers: corsHeaders },
      );
    }

    // Return more detailed error in development
    const errorMessage =
      process.env.NODE_ENV === "development" && errorObj.name && errorObj.message
        ? `Internal server error: ${errorObj.name}: ${errorObj.message}`
        : "Internal server error";

    return NextResponse.json(
      {
        error: errorMessage,
        debug: {
          errorName: errorObj.name,
          bucket: process.env.ORBIT_S3_BUCKET ? "configured" : "missing",
          region: process.env.AWS_REGION || "not-set",
        },
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

/**
 * POST /api/orbit/auth/status - Check status by GitHub handle (for admin)
 */
export async function POST(request: NextRequest) {
  try {
    const { githubHandle } = await request.json();

    if (!githubHandle) {
      return NextResponse.json(
        { error: "Missing GitHub handle" },
        { status: 400, headers: corsHeaders },
      );
    }

    const store = new S3OrbitStore();
    const user = await store.getUser(githubHandle);

    if (!user) {
      return NextResponse.json(
        { status: "not_found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      {
        status: user.status,
        githubHandle: user.githubHandle,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      { headers: corsHeaders },
    );
  } catch (error: unknown) {
    console.error("Status lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
