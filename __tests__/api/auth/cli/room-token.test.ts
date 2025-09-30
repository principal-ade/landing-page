import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/auth/cli/room-token/route';
import jwt from 'jsonwebtoken';

// Mock fetch
global.fetch = jest.fn();

describe('/api/auth/cli/room-token', () => {
  const mockGitHubUser = {
    login: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    id: 12345,
    avatar_url: 'https://github.com/testuser.png'
  };

  const mockGitHubRepo = {
    full_name: 'testowner/testrepo',
    permissions: {
      admin: false,
      maintain: false,
      push: true,
      triage: false,
      pull: true
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ROOM_TOKEN_SECRET = 'test-secret-key';
  });

  describe('POST - Generate Room Token', () => {
    it('should generate a valid JWT room token for authorized user', async () => {
      // Mock GitHub API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGitHubUser
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGitHubRepo
        });

      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'POST',
        body: JSON.stringify({
          repository: 'github.com/testowner/testrepo',
          branch: 'main',
          github_token: 'ghp_test123'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('access_token');
      expect(data).toHaveProperty('refresh_token');
      expect(data.permissions).toEqual({
        canJoin: true,
        canEdit: true,
        canAdmin: false
      });
      expect(data.user.login).toBe('testuser');

      // Verify JWT structure
      const decoded = jwt.verify(data.access_token, 'test-secret-key') as any;
      expect(decoded.sub).toBe('testuser');
      expect(decoded.repository).toBe('testowner/testrepo');
      expect(decoded.permissions.canEdit).toBe(true);
    });

    it('should return 401 for invalid GitHub token', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          status: 401
        });

      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'POST',
        body: JSON.stringify({
          repository: 'github.com/testowner/testrepo',
          branch: 'main',
          github_token: 'invalid'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid GitHub token');
    });

    it('should return 403 for repository without access', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGitHubUser
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404
        });

      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'POST',
        body: JSON.stringify({
          repository: 'github.com/private/noaccess',
          branch: 'main',
          github_token: 'ghp_test123'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Repository not found or no access');
    });

    it('should handle various repository URL formats', async () => {
      const formats = [
        'github.com/owner/repo',
        'https://github.com/owner/repo',
        'https://github.com/owner/repo.git',
        'owner/repo'
      ];

      for (const format of formats) {
        (global.fetch as jest.Mock)
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockGitHubUser
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockGitHubRepo
          });

        const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
          method: 'POST',
          body: JSON.stringify({
            repository: format,
            branch: 'main',
            github_token: 'ghp_test123'
          })
        });

        const response = await POST(request);
        expect(response.status).toBe(200);
      }
    });

    it('should return 400 for missing parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'POST',
        body: JSON.stringify({
          repository: 'github.com/owner/repo'
          // missing github_token
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required parameters');
    });
  });

  describe('GET - Verify Room Token', () => {
    it('should verify a valid token', async () => {
      const token = jwt.sign(
        {
          sub: 'testuser',
          repository: 'owner/repo',
          branch: 'main',
          permissions: {
            canJoin: true,
            canEdit: false,
            canAdmin: false
          },
          iss: 'dev-collab-auth-server',
          exp: Math.floor(Date.now() / 1000) + 3600
        },
        'test-secret-key',
        { algorithm: 'HS256' }
      );

      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.payload.sub).toBe('testuser');
    });

    it('should reject an expired token', async () => {
      const token = jwt.sign(
        {
          sub: 'testuser',
          repository: 'owner/repo',
          branch: 'main',
          permissions: {
            canJoin: true,
            canEdit: false,
            canAdmin: false
          },
          iss: 'dev-collab-auth-server',
          exp: Math.floor(Date.now() / 1000) - 3600 // expired 1 hour ago
        },
        'test-secret-key',
        { algorithm: 'HS256' }
      );

      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('expired');
    });

    it('should reject an invalid signature', async () => {
      const token = jwt.sign(
        {
          sub: 'testuser',
          repository: 'owner/repo'
        },
        'wrong-secret',
        { algorithm: 'HS256' }
      );

      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Invalid token');
    });

    it('should return 401 for missing authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/cli/room-token', {
        method: 'GET'
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toContain('Missing or invalid authorization header');
    });
  });
});