/**
 * POST /api/auth/browser/room-token
 *
 * Browser-specific endpoint for generating JWT tokens for WebSocket authentication.
 * Unlike the CLI endpoint, this doesn't require a device_id since browsers use
 * session-based authentication.
 */

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

// JWT secret - in production, use a proper secret management system
function getJWTSecret(): string {
  if (!process.env.ROOM_TOKEN_SECRET) {
    throw new Error("ROOM_TOKEN_SECRET environment variable is required");
  }
  return process.env.ROOM_TOKEN_SECRET;
}

interface BrowserRoomTokenRequest {
  repository: string;
  branch?: string;
  github_token: string;
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
    } = (await request.json()) as BrowserRoomTokenRequest;

    if (!repository || !github_token) {
      return NextResponse.json(
        { error: "Missing required parameters: repository and github_token" },
        { status: 400 },
      );
    }

    // Generate a browser-specific agent ID (session-based, ephemeral)
    const agentId = `browser-${randomBytes(16).toString('hex')}`;

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
      agentId, // Browser-generated ephemeral agent ID
      permissions: permissionsArray,

      // Additional context
      branch,

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
        agentId,
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
      repository: `${owner}/${repo}`,
      branch,
    });
  } catch (error) {
    console.error("Browser room token generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
