"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  login: string;
  name: string;
  avatar_url: string;
  access_token?: string;
  github_access_token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (codeChallenge: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthRefreshProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/user');
      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh tokens before they expire
  const refreshTokens = useCallback(async () => {
    try {
      // Get current session to extract refresh_token
      const sessionResponse = await fetch('/api/auth/user');
      const sessionData = await sessionResponse.json();

      if (!sessionData.authenticated || !sessionData.user?.refresh_token) {
        console.log('No refresh token available, skipping refresh');
        return false;
      }

      // Call refresh endpoint
      const refreshResponse = await fetch('/api/auth/workos/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: sessionData.user.refresh_token,
        }),
      });

      if (!refreshResponse.ok) {
        const errorData = await refreshResponse.json();

        // If refresh token is invalid, logout user
        if (refreshResponse.status === 401 && errorData.error === 'invalid_grant') {
          console.error('Refresh token expired, logging out');
          await logout();
          return false;
        }

        throw new Error(errorData.error || 'Token refresh failed');
      }

      const refreshData = await refreshResponse.json();
      console.log('Tokens refreshed successfully');

      // Update user state with new tokens
      setUser((prev) => prev ? {
        ...prev,
        access_token: refreshData.access_token,
        github_access_token: refreshData.github_access_token,
      } : null);

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setup automatic token refresh (refresh every 50 minutes, tokens expire in 60 minutes)
  const setupTokenRefresh = useCallback(() => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    // Set up new timer: refresh every 50 minutes (3000000ms)
    refreshTimerRef.current = setInterval(() => {
      console.log('Auto-refreshing tokens...');
      refreshTokens();
    }, 50 * 60 * 1000); // 50 minutes

    // Also do an initial refresh after 50 minutes
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshTokens]);

  // Login function
  const login = useCallback(async (codeChallenge: string) => {
    try {
      // Generate state for CSRF protection
      const state = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("oauth_state", state);

      const response = await fetch('/api/auth/workos/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code_challenge: codeChallenge,
          state,
          return_url: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        console.error('Login failed - no auth URL returned:', data);
        throw new Error(data.error || 'Failed to get authorization URL');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/user', {
        method: 'DELETE',
      });

      setUser(null);

      // Clear refresh timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [router]);

  // Manual refresh function (exposed to consumers)
  const refreshAuth = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Setup token refresh when user is authenticated
  useEffect(() => {
    if (user) {
      const cleanup = setupTokenRefresh();
      return cleanup;
    }
  }, [user, setupTokenRefresh]);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthRefreshProvider');
  }
  return context;
}
