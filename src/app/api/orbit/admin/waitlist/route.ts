import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

// Simple admin authentication - in production, use proper auth
function getAdminSecret(): string {
  if (!process.env.ORBIT_ADMIN_SECRET) {
    throw new Error("ORBIT_ADMIN_SECRET environment variable is required");
  }
  return process.env.ORBIT_ADMIN_SECRET;
}

function isAdmin(request: NextRequest): boolean {
  const adminHeader = request.headers.get("x-admin-secret");
  return adminHeader === getAdminSecret();
}

/**
 * GET /api/orbit/admin/waitlist - Get all waitlisted users
 */
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const store = new S3OrbitStore();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as
      | "waitlisted"
      | "approved"
      | "denied"
      | null;

    if (status) {
      const users = await store.getUsersByStatus(status);
      return NextResponse.json({ users });
    }

    // Get all users by status
    const [waitlisted, approved, denied] = await Promise.all([
      store.getUsersByStatus("waitlisted"),
      store.getUsersByStatus("approved"),
      store.getUsersByStatus("denied"),
    ]);

    const stats = await store.getStats();

    return NextResponse.json({
      stats,
      users: {
        waitlisted,
        approved,
        denied,
      },
    });
  } catch (error) {
    console.error("Admin waitlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/orbit/admin/waitlist - Approve or deny a user
 */
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { githubHandle, action } = await request.json();

    if (!githubHandle || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["approve", "deny"].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "deny"' },
        { status: 400 },
      );
    }

    const store = new S3OrbitStore();

    if (action === "approve") {
      await store.approveUser(githubHandle);
    } else {
      await store.denyUser(githubHandle);
    }

    return NextResponse.json({
      success: true,
      message: `User ${githubHandle} has been ${action}d`,
    });
  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
