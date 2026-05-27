// Session management for user journey tracking
// Uses sessionStorage for client-side persistence

import { trackSessionStart, trackSessionEnd, trackNavigation } from '../core';

const SESSION_STORAGE_KEY = 'analytics_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export interface SessionData {
  sessionId: string;
  startTime: number;
  lastActivityTime: number;
  landingPage: string;
  referrer: string;
  pagesVisited: string[];
  currentPage: string;
}

// Generate a unique session ID
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Get current session from storage
const getStoredSession = (): SessionData | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;

    const session: SessionData = JSON.parse(stored);

    // Check if session has expired
    const now = Date.now();
    if (now - session.lastActivityTime > SESSION_TIMEOUT_MS) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }

    return session;
  } catch (error) {
    console.error('[SessionManager] Error reading session:', error);
    return null;
  }
};

// Save session to storage
const saveSession = (session: SessionData): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('[SessionManager] Error saving session:', error);
  }
};

// Initialize or resume a session
export const initSession = (currentPath: string): SessionData => {
  const existingSession = getStoredSession();

  if (existingSession) {
    // Resume existing session
    existingSession.lastActivityTime = Date.now();
    saveSession(existingSession);
    return existingSession;
  }

  // Create new session
  const newSession: SessionData = {
    sessionId: generateSessionId(),
    startTime: Date.now(),
    lastActivityTime: Date.now(),
    landingPage: currentPath,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    pagesVisited: [currentPath],
    currentPage: currentPath,
  };

  saveSession(newSession);
  trackSessionStart(newSession.sessionId, newSession.landingPage, newSession.referrer);

  if (process.env.NODE_ENV === 'development') {
    console.log('[SessionManager] New session started:', newSession.sessionId);
  }

  return newSession;
};

// Track a page navigation
export const trackPageNavigation = (
  newPath: string,
  navigationType: 'link' | 'back' | 'forward' | 'direct' = 'link'
): void => {
  const session = getStoredSession();
  if (!session) {
    // Session expired or doesn't exist, initialize new one
    initSession(newPath);
    return;
  }

  const previousPage = session.currentPage;

  // Track navigation if it's a new page
  if (previousPage !== newPath) {
    trackNavigation(previousPage, newPath, navigationType);

    // Update session
    session.currentPage = newPath;
    session.lastActivityTime = Date.now();

    // Add to pages visited if not already there
    if (!session.pagesVisited.includes(newPath)) {
      session.pagesVisited.push(newPath);
    }

    saveSession(session);

    if (process.env.NODE_ENV === 'development') {
      console.log('[SessionManager] Navigation:', previousPage, '→', newPath);
    }
  }
};

// Update session activity (called on user interaction)
export const updateSessionActivity = (): void => {
  const session = getStoredSession();
  if (!session) return;

  session.lastActivityTime = Date.now();
  saveSession(session);
};

// End the session (called on page unload)
export const endSession = (): void => {
  const session = getStoredSession();
  if (!session) return;

  const now = Date.now();
  const sessionDurationSeconds = Math.round((now - session.startTime) / 1000);

  trackSessionEnd(
    session.sessionId,
    session.currentPage,
    session.pagesVisited.length,
    sessionDurationSeconds,
    session.pagesVisited
  );

  if (process.env.NODE_ENV === 'development') {
    console.log('[SessionManager] Session ended:', {
      sessionId: session.sessionId,
      duration: sessionDurationSeconds,
      pages: session.pagesVisited.length,
    });
  }

  sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

// Get current session (for debugging/export)
export const getCurrentSession = (): SessionData | null => {
  return getStoredSession();
};

// Export session data as JSON (for debugging)
export const exportSessionData = (): string => {
  const session = getStoredSession();
  if (!session) return JSON.stringify({ error: 'No active session' }, null, 2);

  return JSON.stringify(
    {
      ...session,
      sessionDuration: Math.round((Date.now() - session.startTime) / 1000),
      timeActive: Math.round((session.lastActivityTime - session.startTime) / 1000),
    },
    null,
    2
  );
};
