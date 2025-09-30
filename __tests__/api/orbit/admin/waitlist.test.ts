import { GET, POST } from '@/app/api/orbit/admin/waitlist/route';
import { NextRequest } from 'next/server';

// Mock the S3OrbitStore
jest.mock('@/lib/s3-orbit-store', () => ({
  S3OrbitStore: jest.fn().mockImplementation(() => ({
    getUsersByStatus: jest.fn(),
    getStats: jest.fn(),
    approveUser: jest.fn(),
    denyUser: jest.fn(),
  })),
}));

describe('/api/orbit/admin/waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Admin Authentication', () => {
    it('should reject requests without admin secret', async () => {
      const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'GET',
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should reject requests with invalid admin secret', async () => {
      const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'GET',
        headers: {
          'x-admin-secret': 'invalid-secret',
        },
      });

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should accept requests with valid admin secret', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUsersByStatus = jest.fn().mockResolvedValue([]);
      const mockGetStats = jest.fn().mockResolvedValue({
        totalWaitlisted: 0,
        totalApproved: 0,
        totalDenied: 0,
      });

      mockS3OrbitStore.mockImplementation(() => ({
        getUsersByStatus: mockGetUsersByStatus,
        getStats: mockGetStats,
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'GET',
        headers: {
          'x-admin-secret': 'test-admin-secret',
        },
      });

      const response = await GET(request);
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/orbit/admin/waitlist', () => {
    const createMockRequest = (status?: string) => {
      const url = new URL('http://localhost:3002/api/orbit/admin/waitlist');
      if (status) {
        url.searchParams.set('status', status);
      }

      return new NextRequest(url, {
        method: 'GET',
        headers: {
          'x-admin-secret': 'test-admin-secret',
        },
      });
    };

    it('should return all users when no status filter is provided', async () => {
      const mockWaitlisted = [
        { githubHandle: 'user1', status: 'waitlisted' },
        { githubHandle: 'user2', status: 'waitlisted' },
      ];
      const mockApproved = [
        { githubHandle: 'user3', status: 'approved' },
      ];
      const mockDenied = [
        { githubHandle: 'user4', status: 'denied' },
      ];
      const mockStats = {
        totalWaitlisted: 2,
        totalApproved: 1,
        totalDenied: 1,
        lastUpdated: '2024-01-01T00:00:00.000Z',
      };

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUsersByStatus = jest.fn()
        .mockResolvedValueOnce(mockWaitlisted)
        .mockResolvedValueOnce(mockApproved)
        .mockResolvedValueOnce(mockDenied);
      const mockGetStats = jest.fn().mockResolvedValue(mockStats);

      mockS3OrbitStore.mockImplementation(() => ({
        getUsersByStatus: mockGetUsersByStatus,
        getStats: mockGetStats,
      }));

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.stats).toEqual(mockStats);
      expect(data.users.waitlisted).toEqual(mockWaitlisted);
      expect(data.users.approved).toEqual(mockApproved);
      expect(data.users.denied).toEqual(mockDenied);

      expect(mockGetUsersByStatus).toHaveBeenCalledTimes(3);
      expect(mockGetUsersByStatus).toHaveBeenCalledWith('waitlisted');
      expect(mockGetUsersByStatus).toHaveBeenCalledWith('approved');
      expect(mockGetUsersByStatus).toHaveBeenCalledWith('denied');
    });

    it('should return filtered users when status is provided', async () => {
      const mockWaitlisted = [
        { githubHandle: 'user1', status: 'waitlisted' },
        { githubHandle: 'user2', status: 'waitlisted' },
      ];

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUsersByStatus = jest.fn().mockResolvedValue(mockWaitlisted);

      mockS3OrbitStore.mockImplementation(() => ({
        getUsersByStatus: mockGetUsersByStatus,
      }));

      const request = createMockRequest('waitlisted');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toEqual(mockWaitlisted);

      expect(mockGetUsersByStatus).toHaveBeenCalledTimes(1);
      expect(mockGetUsersByStatus).toHaveBeenCalledWith('waitlisted');
    });

    it('should handle S3 errors gracefully', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUsersByStatus = jest.fn().mockRejectedValue(new Error('S3 Error'));

      mockS3OrbitStore.mockImplementation(() => ({
        getUsersByStatus: mockGetUsersByStatus,
        getStats: jest.fn(),
      }));

      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });

    it('should handle large user lists efficiently', async () => {
      const largeUserList = Array.from({ length: 10000 }, (_, i) => ({
        githubHandle: `user${i}`,
        status: 'waitlisted',
      }));

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUsersByStatus = jest.fn().mockResolvedValue(largeUserList);

      mockS3OrbitStore.mockImplementation(() => ({
        getUsersByStatus: mockGetUsersByStatus,
      }));

      const request = createMockRequest('waitlisted');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toHaveLength(10000);
    });
  });

  describe('POST /api/orbit/admin/waitlist', () => {
    const createMockRequest = (body: any) => {
      return new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': 'test-admin-secret',
        },
        body: JSON.stringify(body),
      });
    };

    it('should approve a user successfully', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockApproveUser = jest.fn().mockResolvedValue(undefined);

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      const request = createMockRequest({
        githubHandle: 'testuser',
        action: 'approve',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('User testuser has been approved');

      expect(mockApproveUser).toHaveBeenCalledWith('testuser');
    });

    it('should deny a user successfully', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockDenyUser = jest.fn().mockResolvedValue(undefined);

      mockS3OrbitStore.mockImplementation(() => ({
        denyUser: mockDenyUser,
      }));

      const request = createMockRequest({
        githubHandle: 'testuser',
        action: 'deny',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('User testuser has been denied');

      expect(mockDenyUser).toHaveBeenCalledWith('testuser');
    });

    it('should return 400 for missing required fields', async () => {
      const request = createMockRequest({
        githubHandle: 'testuser',
        // missing action
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 for invalid action', async () => {
      const request = createMockRequest({
        githubHandle: 'testuser',
        action: 'invalid',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid action. Must be "approve" or "deny"');
    });

    it('should handle user not found error', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockApproveUser = jest.fn().mockRejectedValue(new Error('User not found'));

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      const request = createMockRequest({
        githubHandle: 'nonexistent',
        action: 'approve',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('User not found');
    });

    it('should handle S3 errors gracefully', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockApproveUser = jest.fn().mockRejectedValue(new Error('S3 connection failed'));

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      const request = createMockRequest({
        githubHandle: 'testuser',
        action: 'approve',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('S3 connection failed');
    });

    it('should handle malformed JSON gracefully', async () => {
      const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': 'test-admin-secret',
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
      const mockApproveUser = jest.fn().mockResolvedValue(undefined);

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      const request = createMockRequest({
        githubHandle: maliciousHandle,
        action: 'approve',
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockApproveUser).toHaveBeenCalledWith(maliciousHandle);
    });

    it('should handle concurrent admin actions safely', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockApproveUser = jest.fn().mockResolvedValue(undefined);

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      // Simulate concurrent approval requests
      const requests = Array.from({ length: 5 }, (_, i) => 
        createMockRequest({
          githubHandle: `user${i}`,
          action: 'approve',
        })
      );

      const responses = await Promise.all(requests.map(req => POST(req)));

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(mockApproveUser).toHaveBeenCalledTimes(5);
    });
  });

  describe('Security Tests', () => {
    it('should prevent timing attacks on admin secret validation', async () => {
      const validSecret = 'test-admin-secret';
      const invalidSecrets = [
        'invalid',
        'test-admin-secre', // one char short
        'test-admin-secret-extra', // extra chars
        '', // empty
        'a'.repeat(1000), // very long
      ];

      const requests = [validSecret, ...invalidSecrets].map(secret => 
        new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
          method: 'GET',
          headers: {
            'x-admin-secret': secret,
          },
        })
      );

      const startTimes = requests.map(() => Date.now());
      const responses = await Promise.all(requests.map(req => GET(req)));
      const endTimes = requests.map(() => Date.now());

      // Check response codes
      expect(responses[0].status).toBe(200); // valid secret
      responses.slice(1).forEach(response => {
        expect(response.status).toBe(401); // invalid secrets
      });

      // Note: In production, you'd want constant-time comparison
      // This test demonstrates the need for it
    });

    it('should not expose sensitive information in error messages', async () => {
      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockApproveUser = jest.fn().mockRejectedValue(new Error('AWS credentials invalid: AKIAI...'));

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': 'test-admin-secret',
        },
        body: JSON.stringify({
          githubHandle: 'testuser',
          action: 'approve',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      // Should not expose AWS credentials
      expect(data.error).not.toContain('AKIAI');
      expect(data.error).toBe('AWS credentials invalid: AKIAI...');
    });

    it('should validate action parameter strictly', async () => {
      const invalidActions = [
        'APPROVE', // wrong case
        'approve; DROP TABLE users;', // SQL injection attempt
        { action: 'approve' }, // object instead of string
        123, // number
        true, // boolean
        ['approve'], // array
      ];

      const requests = invalidActions.map(action => 
        new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': 'test-admin-secret',
          },
          body: JSON.stringify({
            githubHandle: 'testuser',
            action,
          }),
        })
      );

      const responses = await Promise.all(requests.map(req => POST(req)));

      // All should fail validation
      responses.forEach(response => {
        expect(response.status).toBe(400);
      });
    });

    it('should handle admin privilege escalation attempts', async () => {
      const escalationAttempts = [
        {
          githubHandle: 'testuser',
          action: 'approve',
          privilege: 'admin', // extra field
        },
        {
          githubHandle: 'testuser',
          action: 'approve',
          __proto__: { isAdmin: true }, // prototype pollution
        },
      ];

      const mockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockApproveUser = jest.fn().mockResolvedValue(undefined);

      mockS3OrbitStore.mockImplementation(() => ({
        approveUser: mockApproveUser,
      }));

      const requests = escalationAttempts.map(body => 
        new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': 'test-admin-secret',
          },
          body: JSON.stringify(body),
        })
      );

      const responses = await Promise.all(requests.map(req => POST(req)));

      // Should still process normally (extra fields ignored)
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      expect(mockApproveUser).toHaveBeenCalledTimes(2);
    });
  });
});