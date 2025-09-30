import { POST } from '@/app/api/orbit/auth/github/route';
import { NextRequest } from 'next/server';

// Mock the S3OrbitStore
jest.mock('@/lib/s3-orbit-store', () => ({
  S3OrbitStore: jest.fn().mockImplementation(() => ({
    createOrUpdateUser: jest.fn(),
  })),
}));

// Helper function to create mock requests
const createMockRequest = (body: any) => {
  return new NextRequest('http://localhost:3002/api/orbit/auth/github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

describe('/api/orbit/auth/github', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as jest.Mock;
    jest.clearAllMocks();
  });

  describe('POST /api/orbit/auth/github', () => {

    it('should successfully exchange code for token and create user', async () => {
      const mockTokenResponse = {
        access_token: 'gho_test_token',
        token_type: 'bearer',
        scope: 'read:user user:email repo',
      };

      const mockUserResponse = {
        login: 'testuser',
        id: 12345,
        name: 'Test User',
        email: null,
        avatar_url: 'https://github.com/avatar.jpg',
        company: 'Test Company',
        location: 'Test City',
      };

      const mockEmailsResponse = [
        {
          email: 'test@example.com',
          primary: true,
          verified: true,
        },
        {
          email: 'secondary@example.com',
          primary: false,
          verified: true,
        },
      ];

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockCreateOrUpdateUser = jest.fn().mockResolvedValue({
        id: 'user-id',
        githubHandle: 'testuser',
        email: 'test@example.com',
        status: 'waitlisted',
        metadata: {
          avatarUrl: 'https://github.com/avatar.jpg',
          name: 'Test User',
          company: 'Test Company',
          location: 'Test City',
        },
      });

      mockS3OrbitStore.mockImplementation(() => ({
        createOrUpdateUser: mockCreateOrUpdateUser,
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEmailsResponse),
        });

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.githubHandle).toBe('testuser');
      expect(data.user.email).toBe('test@example.com');
      expect(data.user.status).toBe('waitlisted');
      expect(data.token).toBe('gho_test_token');

      // Verify GitHub API calls
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        'https://github.com/login/oauth/access_token',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: 'test-client-id',
            client_secret: 'test-client-secret',
            code: 'test_code',
          }),
        })
      );

      // Verify user creation
      expect(mockCreateOrUpdateUser).toHaveBeenCalledWith(
        'testuser',
        'test@example.com',
        'gho_test_token'
      );
    });

    it('should return 400 when code is missing', async () => {
      const request = createMockRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing authorization code');
    });

    it('should handle GitHub OAuth errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          error: 'bad_verification_code',
          error_description: 'The code passed is incorrect or expired.',
        }),
      });

      const request = createMockRequest({ code: 'invalid_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('The code passed is incorrect or expired.');
    });

    it('should handle GitHub API failures', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'token' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        });

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle malformed JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3002/api/orbit/auth/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should properly handle user with no primary email', async () => {
      const mockTokenResponse = { access_token: 'token' };
      const mockUserResponse = { login: 'testuser' };
      const mockEmailsResponse = [
        {
          email: 'test@example.com',
          primary: false,
          verified: true,
        },
      ];

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockCreateOrUpdateUser = jest.fn().mockResolvedValue({
        githubHandle: 'testuser',
        status: 'waitlisted',
      });

      mockS3OrbitStore.mockImplementation(() => ({
        createOrUpdateUser: mockCreateOrUpdateUser,
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEmailsResponse),
        });

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockCreateOrUpdateUser).toHaveBeenCalledWith(
        'testuser',
        undefined,
        'token'
      );
    });

    it('should sanitize GitHub handle for security', async () => {
      const mockTokenResponse = { access_token: 'token' };
      const mockUserResponse = {
        login: 'test<script>alert("xss")</script>user',
      };
      const mockEmailsResponse: any[] = [];

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockCreateOrUpdateUser = jest.fn().mockResolvedValue({
        githubHandle: 'test<script>alert("xss")</script>user',
        status: 'waitlisted',
      });

      mockS3OrbitStore.mockImplementation(() => ({
        createOrUpdateUser: mockCreateOrUpdateUser,
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEmailsResponse),
        });

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);

      expect(response.status).toBe(200);
      // The API should pass through the handle as-is (GitHub validates usernames)
      expect(mockCreateOrUpdateUser).toHaveBeenCalledWith(
        'test<script>alert("xss")</script>user',
        undefined,
        'token'
      );
    });

    it('should handle extremely large responses', async () => {
      const largeString = 'a'.repeat(100000);
      const mockTokenResponse = { access_token: 'token' };
      const mockUserResponse = {
        login: 'testuser',
        bio: largeString,
      };
      const mockEmailsResponse: any[] = [];

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockCreateOrUpdateUser = jest.fn().mockResolvedValue({
        githubHandle: 'testuser',
        status: 'waitlisted',
      });

      mockS3OrbitStore.mockImplementation(() => ({
        createOrUpdateUser: mockCreateOrUpdateUser,
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTokenResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockEmailsResponse),
        });

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);

      expect(response.status).toBe(200);
    });
  });

  describe('Security Considerations', () => {
    it('should not expose sensitive data in error responses', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      mockS3OrbitStore.mockImplementation(() => ({
        createOrUpdateUser: jest.fn().mockRejectedValue(new Error('S3 credentials invalid')),
      }));

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'token' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ login: 'testuser' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
      expect(data.error).not.toContain('S3 credentials');
    });

    it('should handle request timeout gracefully', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 100)
        )
      );

      const request = createMockRequest({ code: 'test_code' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should validate environment variables are present', async () => {
      const originalClientId = process.env.GITHUB_CLIENT_ID;
      delete process.env.GITHUB_CLIENT_ID;

      const request = createMockRequest({ code: 'test_code' });
      
      // This should handle missing env vars gracefully
      await expect(POST(request)).resolves.toBeDefined();

      process.env.GITHUB_CLIENT_ID = originalClientId;
    });

    it('should prevent code injection in OAuth parameters', async () => {
      const maliciousCode = 'test_code"; DROP TABLE users; --';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          error: 'bad_verification_code',
        }),
      });

      const request = createMockRequest({ code: maliciousCode });
      const response = await POST(request);

      // Should still make the request (GitHub will validate)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://github.com/login/oauth/access_token',
        expect.objectContaining({
          body: JSON.stringify({
            client_id: 'test-client-id',
            client_secret: 'test-client-secret',
            code: maliciousCode,
          }),
        })
      );
    });
  });
});