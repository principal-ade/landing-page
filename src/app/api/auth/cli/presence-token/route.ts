import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// JWT secret - in production, use a proper secret management system
function getJWTSecret(): string {
  if (!process.env.ROOM_TOKEN_SECRET) {
    throw new Error("ROOM_TOKEN_SECRET environment variable is required");
  }
  return process.env.ROOM_TOKEN_SECRET;
}

interface PresenceTokenRequest {
  github_token: string;
  device_id: string; // Required unique device identifier
}

interface PresenceTokenPayload {
  // Standard OpenID claims
  sub: string;
  iss: string;
  iat: number;
  exp: number;

  // Traffic controller required fields
  userId: string;
  roomId: string; // Required for room join authorization
  agentId: string;
  permissions: string[];

  // Optional user info for presence display
  userInfo?: {
    login: string;
    email: string;
    name: string;
    avatar_url: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { github_token, device_id } =
      (await request.json()) as PresenceTokenRequest;

    if (!github_token || !device_id) {
      return NextResponse.json(
        { error: "Missing required parameters: github_token and device_id" },
        { status: 400 },
      );
    }

    // Verify user's GitHub token and get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${github_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: "Invalid GitHub token" },
        { status: 401 },
      );
    }

    const user = await userResponse.json();

    // Create permissions for presence-only connection
    const permissionsArray = ["presence:read", "presence:write"];

    // Create JWT payload for presence-only connection
    const payload: PresenceTokenPayload = {
      // Standard OpenID claims
      sub: user.login,
      iss: "dev-collab-auth-server",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2, // 2 hours expiry (longer than room tokens)

      // Traffic controller required fields
      userId: user.login,
      roomId: "__global_presence__", // Authorize access to global presence room
      agentId: device_id,
      permissions: permissionsArray,

      // User info for presence display
      userInfo: {
        login: user.login,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    };

    // Sign the JWT
    const token = jwt.sign(payload, getJWTSecret(), {
      algorithm: "HS256",
    });

    return NextResponse.json({
      access_token: token,
      token_type: "Bearer",
      expires_in: 7200, // 2 hours
      scope: "presence:global",
      permissions: {
        canJoin: true,
        canEdit: false,
        canAdmin: false,
      },
      user: {
        login: user.login,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Presence token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
