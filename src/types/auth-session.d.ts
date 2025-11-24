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
  tokens?: {
    access_token: string;
    workos_access_token?: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: {
      id: string | number;
      email: string;
      login: string;
      name: string;
      avatar_url: string | null;
    };
    provider: string;
    workos_user_id?: string;
    github_access_token?: string | null;
  };
}

declare global {
  var cliAuthSessions: Map<string, AuthSession>;
  var cliAuthCleanupInterval: NodeJS.Timeout;
  var githubUserCache: Map<string, {
    id: number;
    email: string;
    login: string;
    name: string;
    avatar_url: string;
  }>;
}

export {};
