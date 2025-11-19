import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

// JWT secret - in production, use a proper secret management system
function getJWTSecret(): string {
  if (!process.env.ROOM_TOKEN_SECRET) {
    throw new Error("ROOM_TOKEN_SECRET environment variable is required");
  }
  return process.env.ROOM_TOKEN_SECRET;
}

interface RoomTokenRequest {
  repository: string;
  branch?: string;
  github_token: string;
  device_id: string; // Required unique device identifier
}

interface RoomTokenPayload {
  // Standard OpenID claims
  sub: string;
  iss: string;
  iat: number;
  exp: number;

  // Traffic controller required fields
  userId: string;
  repoId: string;
  agentId: string;
  permissions: string[];

  // Additional context fields
  branch: string;
  clientType: 'desktop' | 'web';

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
    const {
      repository,
      branch = "main",
      github_token,
      device_id,
    } = (await request.json()) as RoomTokenRequest;

    if (!repository || !github_token || !device_id) {
      return NextResponse.json(
        { error: "Missing required parameters: repository, github_token, and device_id" },
        { status: 400 },
      );
    }

    // Parse repository URL to get owner/repo
    const repoPattern = /(?:github\.com[\/:]|^)([^\/]+)\/([^\/\.]+)(?:\.git)?$/;
    const match = repository.match(repoPattern);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid repository format" },
        { status: 400 },
      );
    }

    const [, owner, repo] = match;

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

    // Check repository access via GitHub API
    const repoResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${github_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    if (!repoResponse.ok) {
      const status = repoResponse.status;
      if (status === 404) {
        return NextResponse.json(
          { error: "Repository not found or no access" },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { error: "Failed to verify repository access" },
        { status: 403 },
      );
    }

    const repoData = await repoResponse.json();

    // Determine permissions based on GitHub response
    const permissions = {
      canJoin: true, // If we got here, user has at least read access
      canEdit: repoData.permissions?.push || false,
      canAdmin: repoData.permissions?.admin || false,
    };

    // Transform permissions object to array format for traffic controller
    const permissionsArray: string[] = [];
    if (permissions.canJoin) {
      permissionsArray.push('sync:read');
    }
    if (permissions.canEdit) {
      permissionsArray.push('sync:write', 'sync:broadcast');
    }
    if (permissions.canAdmin) {
      permissionsArray.push('sync:admin');
    }

    // Create JWT payload with traffic controller format
    const payload: RoomTokenPayload = {
      // Standard OpenID claims
      sub: user.login,
      iss: "dev-collab-auth-server",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry

      // Traffic controller required fields
      userId: user.login,
      repoId: `${owner}/${repo}`,
      agentId: device_id,
      permissions: permissionsArray,

      // Additional context
      branch,
      clientType: 'desktop',

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

    // Also create a refresh token (optional, longer lived)
    const refreshToken = jwt.sign(
      {
        sub: user.login,
        userId: user.login,
        repoId: `${owner}/${repo}`,
        agentId: device_id,
        type: "refresh",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      },
      getJWTSecret(),
      { algorithm: "HS256" },
    );

    return NextResponse.json({
      access_token: token,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: `repo:${owner}/${repo}:${branch}`,
      permissions,
      user: {
        login: user.login,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Room token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Verify endpoint - for the sync server to validate tokens
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, getJWTSecret()) as RoomTokenPayload;

    // Check if token is expired (jwt.verify should handle this, but double-check)
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      payload: decoded,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Invalid token", details: error.message },
      { status: 401 },
    );
  }
}
