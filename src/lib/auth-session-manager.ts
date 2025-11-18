import { AuthSession } from "@/types/auth-session";

/**
 * Session configuration
 */
const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // Run cleanup every 1 minute

/**
 * Initialize the global session store and cleanup interval
 */
export function initializeSessionStore() {
  if (!global.cliAuthSessions) {
    global.cliAuthSessions = new Map();
  }

  // Set up cleanup interval if not already running
  if (!global.cliAuthCleanupInterval) {
    global.cliAuthCleanupInterval = setInterval(() => {
      cleanupExpiredSessions();
    }, CLEANUP_INTERVAL_MS);

    // Prevent the interval from keeping the process alive
    global.cliAuthCleanupInterval.unref();
  }
}

/**
 * Check if a session has expired
 */
export function isSessionExpired(session: AuthSession): boolean {
  const now = Date.now();
  const age = now - session.created_at;
  return age > SESSION_TTL_MS;
}

/**
 * Get a session by state and validate it hasn't expired
 * Returns null if session doesn't exist or has expired
 */
export function getValidSession(state: string): AuthSession | null {
  initializeSessionStore();

  const session = global.cliAuthSessions.get(state);
  if (!session) {
    return null;
  }

  if (isSessionExpired(session)) {
    global.cliAuthSessions.delete(state);
    return null;
  }

  return session;
}

/**
 * Clean up all expired sessions
 */
export function cleanupExpiredSessions(): number {
  initializeSessionStore();

  let cleanedCount = 0;

  for (const [state, session] of global.cliAuthSessions.entries()) {
    if (isSessionExpired(session)) {
      global.cliAuthSessions.delete(state);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`[Auth] Cleaned up ${cleanedCount} expired session(s)`);
  }

  return cleanedCount;
}

/**
 * Create or update a session
 */
export function setSession(state: string, session: AuthSession): void {
  initializeSessionStore();
  global.cliAuthSessions.set(state, session);
}

/**
 * Delete a session
 */
export function deleteSession(state: string): void {
  initializeSessionStore();
  global.cliAuthSessions.delete(state);
}

/**
 * Get session age in milliseconds
 */
export function getSessionAge(session: AuthSession): number {
  return Date.now() - session.created_at;
}

/**
 * Get session TTL in milliseconds
 */
export function getSessionTTL(): number {
  return SESSION_TTL_MS;
}
