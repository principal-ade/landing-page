/**
 * Shared authentication session types for CLI and web auth flows
 */

export interface AuthSession {
  code_challenge: string;
  code?: string;
  created_at: number;
  provider: "github" | "workos";
  return_url?: string;
  pending_auth_token?: string;
  email?: string;
}

declare global {
  var cliAuthSessions: Map<string, AuthSession>;
  var cliAuthCleanupInterval: NodeJS.Timeout;
}

export {};
