/**
 * Authentication Provider Abstraction Layer
 *
 * This module provides a unified interface for authentication,
 * allowing seamless migration between GitHub OAuth and WorkOS.
 *
 * Usage:
 * - Set AUTH_PROVIDER env var to 'github' or 'workos'
 * - Use getAuthEndpoints() to get the correct API endpoints
 * - Both providers work in parallel during migration
 */

export type AuthProvider = "github" | "workos";

export interface AuthEndpoints {
  start: string;
  callback: string;
  token: string;
  provider: AuthProvider;
}

/**
 * Get the authentication provider from environment variables
 * Defaults to 'github' for backward compatibility
 */
export function getAuthProvider(): AuthProvider {
  const provider = process.env.AUTH_PROVIDER?.toLowerCase();

  if (provider === "workos") {
    // Verify WorkOS is configured
    if (!process.env.WORKOS_API_KEY || !process.env.WORKOS_CLIENT_ID) {
      console.warn(
        "AUTH_PROVIDER is set to 'workos' but WorkOS credentials are missing. Falling back to GitHub OAuth.",
      );
      return "github";
    }
    return "workos";
  }

  // Default to github for backward compatibility
  return "github";
}

/**
 * Get authentication endpoints based on the selected provider
 */
export function getAuthEndpoints(
  baseUrl?: string,
  overrideProvider?: AuthProvider,
): AuthEndpoints {
  const provider = overrideProvider || getAuthProvider();
  const base = baseUrl || process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (provider === "workos") {
    return {
      start: `${base}/api/auth/workos/start`,
      callback: `${base}/api/auth/workos/callback`,
      token: `${base}/api/auth/workos/token`,
      provider: "workos",
    };
  }

  // GitHub OAuth (legacy/default)
  return {
    start: `${base}/api/auth/cli/start`,
    callback: `${base}/api/auth/cli/callback`,
    token: `${base}/api/auth/cli/token`,
    provider: "github",
  };
}

/**
 * Check if WorkOS is available and properly configured
 */
export function isWorkOSAvailable(): boolean {
  return !!(process.env.WORKOS_API_KEY && process.env.WORKOS_CLIENT_ID);
}

/**
 * Check if GitHub OAuth is available and properly configured
 */
export function isGitHubOAuthAvailable(): boolean {
  return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

/**
 * Get available authentication providers
 */
export function getAvailableProviders(): AuthProvider[] {
  const providers: AuthProvider[] = [];

  if (isGitHubOAuthAvailable()) {
    providers.push("github");
  }

  if (isWorkOSAvailable()) {
    providers.push("workos");
  }

  return providers;
}

/**
 * Validate that at least one auth provider is configured
 */
export function validateAuthConfiguration(): {
  valid: boolean;
  error?: string;
  availableProviders: AuthProvider[];
} {
  const available = getAvailableProviders();

  if (available.length === 0) {
    return {
      valid: false,
      error:
        "No authentication provider configured. Please set up either GitHub OAuth or WorkOS credentials.",
      availableProviders: [],
    };
  }

  const selectedProvider = getAuthProvider();
  if (!available.includes(selectedProvider)) {
    return {
      valid: false,
      error: `Selected provider '${selectedProvider}' is not properly configured. Available: ${available.join(", ")}`,
      availableProviders: available,
    };
  }

  return {
    valid: true,
    availableProviders: available,
  };
}
