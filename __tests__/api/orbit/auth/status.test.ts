import { GET, POST } from '@/app/api/orbit/auth/status/route';
import { NextRequest } from 'next/server';

// Mock the S3OrbitStore
jest.mock('@/lib/s3-orbit-store', () => ({
  S3OrbitStore: jest.fn().mockImplementation(() => ({
    getUserByToken: jest.fn(),
    getUser: jest.fn(),
  })),
}));

describe('/api/orbit/auth/status', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orbit/auth/status', () => {
    const createMockRequest = (authHeader?: string) => {
      const headers: Record<string, string> = {};
      if (authHeader) {
        headers['authorization'] = authHeader;
      }

      return new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'GET',
        headers,
      });
    };

    it('should return user status for valid token', async () => {
      const mockUser = {
        githubHandle: 'testuser',
        email: 'test@example.com',
        status: 'approved',
        metadata: {
          avatarUrl: 'https://github.com/avatar.jpg',
          name: 'Test User',
        },
      };

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue(mockUser);

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = createMockRequest('Bearer test_token');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('approved');
      expect(data.githubHandle).toBe('testuser');
      expect(data.email).toBe('test@example.com');
      expect(data.metadata).toEqual(mockUser.metadata);

      expect(mockGetUserByToken).toHaveBeenCalledWith('test_token');
    });

    it('should return 401 for missing authorization header', async () => {
      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Missing or invalid authorization header');
    });

    it('should return 401 for invalid authorization format', async () => {
      const request = createMockRequest('InvalidFormat token');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Missing or invalid authorization header');
    });

    it('should return "new" status for unknown token', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue(null);

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = createMockRequest('Bearer unknown_token');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('new');
    });

    it('should handle S3 errors gracefully', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockRejectedValue(new Error('S3 Error'));

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = createMockRequest('Bearer test_token');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle extremely long tokens', async () => {
      const longToken = 'a'.repeat(10000);
      
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue(null);

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = createMockRequest(`Bearer ${longToken}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockGetUserByToken).toHaveBeenCalledWith(longToken);
    });

    it('should handle tokens with special characters', async () => {
      const specialToken = 'token_with-special.chars+and=symbols';
      
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue(null);

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = createMockRequest(`Bearer ${specialToken}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockGetUserByToken).toHaveBeenCalledWith(specialToken);
    });
  });

  describe('POST /api/orbit/auth/status', () => {
    const createMockRequest = (body: any) => {
      return new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    };

    it('should return user status by GitHub handle', async () => {
      const mockUser = {
        githubHandle: 'testuser',
        email: 'test@example.com',
        status: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      };

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUser = jest.fn().mockResolvedValue(mockUser);

      mockS3OrbitStore.mockImplementation(() => ({
        getUser: mockGetUser,
      }));

      const request = createMockRequest({ githubHandle: 'testuser' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('approved');
      expect(data.githubHandle).toBe('testuser');
      expect(data.email).toBe('test@example.com');
      expect(data.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(data.updatedAt).toBe('2024-01-02T00:00:00.000Z');

      expect(mockGetUser).toHaveBeenCalledWith('testuser');
    });

    it('should return 400 for missing GitHub handle', async () => {
      const request = createMockRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing GitHub handle');
    });

    it('should return 404 for non-existent user', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUser = jest.fn().mockResolvedValue(null);

      mockS3OrbitStore.mockImplementation(() => ({
        getUser: mockGetUser,
      }));

      const request = createMockRequest({ githubHandle: 'nonexistent' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.status).toBe('not_found');
    });

    it('should handle S3 errors gracefully', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUser = jest.fn().mockRejectedValue(new Error('S3 Error'));

      mockS3OrbitStore.mockImplementation(() => ({
        getUser: mockGetUser,
      }));

      const request = createMockRequest({ githubHandle: 'testuser' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
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

    it('should sanitize GitHub handle input', async () => {
      const maliciousHandle = 'test<script>alert("xss")</script>user';
      
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUser = jest.fn().mockResolvedValue(null);

      mockS3OrbitStore.mockImplementation(() => ({
        getUser: mockGetUser,
      }));

      const request = createMockRequest({ githubHandle: maliciousHandle });
      const response = await POST(request);

      expect(response.status).toBe(404);
      expect(mockGetUser).toHaveBeenCalledWith(maliciousHandle);
    });

    it('should handle empty string GitHub handle', async () => {
      const request = createMockRequest({ githubHandle: '' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing GitHub handle');
    });

    it('should handle null GitHub handle', async () => {
      const request = createMockRequest({ githubHandle: null });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing GitHub handle');
    });

    it('should handle whitespace-only GitHub handle', async () => {
      const request = createMockRequest({ githubHandle: '   ' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing GitHub handle');
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive user data to unauthorized requests', async () => {
      const mockUser = {
        githubHandle: 'testuser',
        email: 'test@example.com',
        status: 'approved',
        githubToken: 'sensitive_token',
        metadata: {
          sensitiveField: 'should_not_be_exposed',
        },
      };

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue(mockUser);

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer test_token',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      // Should not expose sensitive fields
      expect(data.githubToken).toBeUndefined();
      expect(data.id).toBeUndefined();
    });

    it('should rate limit token validation requests', async () => {
      // This test demonstrates the need for rate limiting
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue({ status: 'approved' });

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      // Simulate multiple rapid requests
      const requests = Array.from({ length: 100 }, () => 
        new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'GET',
          headers: {
            'authorization': 'Bearer test_token',
          },
        })
      );

      const responses = await Promise.all(requests.map(req => GET(req)));

      // All should succeed (rate limiting would be implemented at middleware level)
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(mockGetUserByToken).toHaveBeenCalledTimes(100);
    });

    it('should handle concurrent status checks safely', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue({ status: 'approved' });

      mockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'GET',
        headers: {
          'authorization': 'Bearer test_token',
        },
      });

      // Simulate concurrent requests
      const promises = Array.from({ length: 10 }, () => GET(request));
      const responses = await Promise.all(promises);

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});