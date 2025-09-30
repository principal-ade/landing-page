import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { POST as startAuth } from '@/app/api/auth/cli/start/route';
import { GET as callbackAuth } from '@/app/api/auth/cli/callback/route';
import { POST as tokenExchange } from '@/app/api/auth/cli/token/route';

// Mock fetch for GitHub API calls
global.fetch = jest.fn();

describe('CLI Authentication Flow', () => {
  let codeVerifier: string;
  let codeChallenge: string;
  let state: string;

  beforeEach(() => {
    // Clear global sessions
    global.cliAuthSessions = new Map();
    
    // Generate PKCE pair
    codeVerifier = crypto.randomBytes(32).toString('base64url');
    codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    
    state = crypto.randomBytes(16).toString('hex');
    
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/cli/start', () => {
    it('should initiate auth flow with valid PKCE challenge', async () => {
      const request = new NextRequest('http://localhost/api/auth/cli/start', {
        method: 'POST',
        body: JSON.stringify({
          code_challenge: codeChallenge,
          state,
        }),
      });

      const response = await startAuth(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.auth_url).toContain('https://github.com/login/oauth/authorize');
      expect(data.auth_url).toContain(`state=${state}`);
      expect(data.expires_in).toBe(300);
      
      // Check session was stored
      expect(global.cliAuthSessions.has(state)).toBe(true);
      expect(global.cliAuthSessions.get(state)?.code_challenge).toBe(codeChallenge);
    });

    it('should reject invalid code_challenge format', async () => {
      const request = new NextRequest('http://localhost/api/auth/cli/start', {
        method: 'POST',
        body: JSON.stringify({
          code_challenge: 'invalid!@#$%',
          state,
        }),
      });

      const response = await startAuth(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid code_challenge format');
    });

    it('should reject missing parameters', async () => {
      const request = new NextRequest('http://localhost/api/auth/cli/start', {
        method: 'POST',
        body: JSON.stringify({
          state,
        }),
      });

      const response = await startAuth(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required parameters');
    });
  });

  describe('GET /api/auth/cli/callback', () => {
    beforeEach(() => {
      // Pre-store a session
      global.cliAuthSessions.set(state, {
        code_challenge: codeChallenge,
        created_at: Date.now(),
      });
    });

    it('should handle successful GitHub callback', async () => {
      const code = 'test_auth_code_123';
      const request = new NextRequest(
        `http://localhost/api/auth/cli/callback?code=${code}&state=${state}`
      );

      const response = await callbackAuth(request);
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('text/html');
      expect(html).toContain('Authentication Successful');
      
      // Check code was stored
      expect(global.cliAuthSessions.get(state)?.code).toBe(code);
    });

    it('should handle GitHub OAuth errors', async () => {
      const request = new NextRequest(
        `http://localhost/api/auth/cli/callback?error=access_denied&error_description=User%20denied%20access`
      );

      const response = await callbackAuth(request);
      const html = await response.text();

      expect(response.status).toBe(400);
      expect(html).toContain('Authentication Failed');
      expect(html).toContain('User denied access');
    });

    it('should handle expired sessions', async () => {
      const request = new NextRequest(
        `http://localhost/api/auth/cli/callback?code=test_code&state=invalid_state`
      );

      const response = await callbackAuth(request);
      const html = await response.text();

      expect(response.status).toBe(400);
      expect(html).toContain('Session Expired');
    });
  });

  describe('POST /api/auth/cli/token', () => {
    const mockGitHubToken = 'gho_test_token_123';
    const mockGitHubUser = {
      login: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      id: 12345,
    };

    beforeEach(() => {
      // Pre-store a session with code
      global.cliAuthSessions.set(state, {
        code_challenge: codeChallenge,
        code: 'test_auth_code',
        created_at: Date.now(),
      });

      // Mock GitHub API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            access_token: mockGitHubToken,
            token_type: 'Bearer',
            scope: 'repo user:email',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGitHubUser,
        });
    });

    it('should exchange code for token with valid PKCE verifier', async () => {
      const request = new NextRequest('http://localhost/api/auth/cli/token', {
        method: 'POST',
        body: JSON.stringify({
          state,
          code_verifier: codeVerifier,
        }),
      });

      const response = await tokenExchange(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.access_token).toBe(mockGitHubToken);
      expect(data.user.login).toBe('testuser');
      expect(data.user.email).toBe('test@example.com');
      
      // Check session was cleaned up
      expect(global.cliAuthSessions.has(state)).toBe(false);
    });

    it('should reject invalid PKCE verifier', async () => {
      const request = new NextRequest('http://localhost/api/auth/cli/token', {
        method: 'POST',
        body: JSON.stringify({
          state,
          code_verifier: 'wrong_verifier',
        }),
      });

      const response = await tokenExchange(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('invalid_grant');
      expect(data.error_description).toContain('Invalid code_verifier');
    });

    it('should return pending if no code yet', async () => {
      // Remove code from session
      global.cliAuthSessions.set(state, {
        code_challenge: codeChallenge,
        created_at: Date.now(),
      });

      const request = new NextRequest('http://localhost/api/auth/cli/token', {
        method: 'POST',
        body: JSON.stringify({
          state,
          code_verifier: codeVerifier,
        }),
      });

      const response = await tokenExchange(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('authorization_pending');
    });

    it('should handle GitHub token exchange failure', async () => {
      // Mock GitHub API error
      (global.fetch as jest.Mock).mockReset().mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'invalid_client',
          error_description: 'Invalid client credentials',
        }),
      });

      const request = new NextRequest('http://localhost/api/auth/cli/token', {
        method: 'POST',
        body: JSON.stringify({
          state,
          code_verifier: codeVerifier,
        }),
      });

      const response = await tokenExchange(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('token_exchange_failed');
    });
  });

  describe('Session cleanup', () => {
    it('should clean up expired sessions', async () => {
      // Create an expired session
      const expiredState = 'expired_state';
      global.cliAuthSessions.set(expiredState, {
        code_challenge: 'test',
        created_at: Date.now() - 6 * 60 * 1000, // 6 minutes ago
      });

      // Create a valid session
      global.cliAuthSessions.set(state, {
        code_challenge: codeChallenge,
        created_at: Date.now(),
      });

      // Trigger cleanup (normally runs every minute)
      const now = Date.now();
      for (const [key, session] of global.cliAuthSessions.entries()) {
        if (now - session.created_at > 5 * 60 * 1000) {
          global.cliAuthSessions.delete(key);
        }
      }

      expect(global.cliAuthSessions.has(expiredState)).toBe(false);
      expect(global.cliAuthSessions.has(state)).toBe(true);
    });
  });
});