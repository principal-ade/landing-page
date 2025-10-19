/**
 * Authentication Provider Usage Examples
 *
 * This file demonstrates how to use the authentication abstraction layer
 * to work with both GitHub OAuth and WorkOS seamlessly.
 */

import {
  getAuthProvider,
  getAuthEndpoints,
  isWorkOSAvailable,
  isGitHubOAuthAvailable,
  getAvailableProviders,
  validateAuthConfiguration,
  type AuthProvider,
} from "./auth-provider";

// ============================================
// Example 1: Get Current Provider
// ============================================
export function getCurrentProvider() {
  const provider = getAuthProvider();
  console.log(`Current auth provider: ${provider}`);

  // Use this to show users which provider they're using
  return provider;
}

// ============================================
// Example 2: Get Endpoints for Auth Flow
// ============================================
export async function initiateAuthFlow(codeChallenge: string, state: string) {
  const endpoints = getAuthEndpoints();

  // This works with both GitHub and WorkOS
  const response = await fetch(endpoints.start, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code_challenge: codeChallenge,
      state,
    }),
  });

  const data = await response.json();
  console.log(`Using ${endpoints.provider} provider`);
  console.log(`Auth URL: ${data.auth_url}`);

  return data;
}

// ============================================
// Example 3: Exchange Code for Token
// ============================================
export async function exchangeCodeForToken(
  state: string,
  codeVerifier: string,
) {
  const endpoints = getAuthEndpoints();

  const response = await fetch(endpoints.token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      state,
      code_verifier: codeVerifier,
    }),
  });

  const tokenData = await response.json();

  // Both providers return similar structure
  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token, // Only with WorkOS
    user: tokenData.user,
    provider: endpoints.provider,
  };
}

// ============================================
// Example 4: Check Available Providers
// ============================================
export function checkAuthStatus() {
  const validation = validateAuthConfiguration();

  if (!validation.valid) {
    console.error(`Auth configuration error: ${validation.error}`);
    return null;
  }

  return {
    current: getAuthProvider(),
    available: validation.availableProviders,
    hasGitHub: isGitHubOAuthAvailable(),
    hasWorkOS: isWorkOSAvailable(),
  };
}

// ============================================
// Example 5: Test Both Providers (Development)
// ============================================
export async function testBothProviders() {
  const available = getAvailableProviders();

  console.log("Available providers:", available);

  for (const provider of available) {
    console.log(`\nTesting ${provider} provider...`);

    const endpoints = getAuthEndpoints(undefined, provider);
    console.log("Endpoints:", endpoints);

    try {
      // Test the start endpoint
      const response = await fetch(endpoints.start, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code_challenge: "test_challenge",
          state: "test_state",
        }),
      });

      const data = await response.json();
      console.log(`✅ ${provider} is working`);
      console.log(`   Auth URL format: ${data.auth_url?.substring(0, 50)}...`);
    } catch (error) {
      console.error(`❌ ${provider} test failed:`, error);
    }
  }
}

// ============================================
// Example 6: Conditional Features by Provider
// ============================================
export function getProviderFeatures() {
  const provider = getAuthProvider();

  const features = {
    github: {
      name: "GitHub OAuth",
      supportsSSO: false,
      supportsMultiProvider: false,
      hasBuiltInUserManagement: false,
      autoTokenRefresh: false,
    },
    workos: {
      name: "WorkOS",
      supportsSSO: true,
      supportsMultiProvider: true,
      hasBuiltInUserManagement: true,
      autoTokenRefresh: true,
    },
  };

  return features[provider];
}

// ============================================
// Example 7: Migration Helper
// ============================================
export async function migrateUser(userId: string, from: AuthProvider, to: AuthProvider) {
  console.log(`Migrating user ${userId} from ${from} to ${to}`);

  // Step 1: Get user's current auth data
  // (This would come from your database - e.g., userId, provider, etc.)

  // Step 2: Initiate new auth flow with target provider
  const endpoints = getAuthEndpoints(undefined, to);

  // Step 3: Guide user through re-authentication
  // (This would be done through your UI)
  console.log(`Redirect user to: ${endpoints.start}`);

  // Step 4: Once new auth is complete, update user record
  // (This would update your database)
  console.log(`Update user ${userId} to use ${to} provider`);

  return {
    success: true,
    oldProvider: from,
    newProvider: to,
    endpoints,
  };
}

// ============================================
// Example 8: Provider-Specific Logic
// ============================================
export function getGitHubAccessToken(authData: any): string | null {
  const provider = getAuthProvider();

  if (provider === "github") {
    // Direct GitHub OAuth - access_token is directly usable
    return authData.access_token;
  } else if (provider === "workos") {
    // WorkOS - you have a WorkOS access token
    // For GitHub API calls, you'd need to get the connection token
    // This would require additional WorkOS API calls
    console.warn(
      "Getting GitHub token from WorkOS requires additional API call",
    );
    return null; // Implement WorkOS connection token retrieval
  }

  return null;
}
