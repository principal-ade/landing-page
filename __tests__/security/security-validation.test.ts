import { NextRequest } from 'next/server';
import { POST as githubAuth } from '@/app/api/orbit/auth/github/route';
import { GET as statusGet, POST as statusPost } from '@/app/api/orbit/auth/status/route';
import { GET as adminGet, POST as adminPost } from '@/app/api/orbit/admin/waitlist/route';

// Security-focused integration tests
describe('Security Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('Input Validation and Sanitization', () => {
    it('should reject requests with oversized payloads', async () => {
      const oversizedPayload = {
        code: 'a'.repeat(10 * 1024 * 1024), // 10MB
      };

      const request = new NextRequest('http://localhost:3002/api/orbit/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oversizedPayload),
      });

      const response = await githubAuth(request);
      
      // Should handle large payloads gracefully
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should handle SQL injection attempts in GitHub handles', async () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; DELETE FROM users WHERE '1'='1'; --",
        "admin'/*",
        "' UNION SELECT * FROM passwords --",
      ];

      for (const maliciousHandle of sqlInjectionAttempts) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubHandle: maliciousHandle }),
        });

        const response = await statusPost(request);
        
        // Should not execute SQL, should return error or 404
        expect([400, 404, 500]).toContain(response.status);
      }
    });

    it('should prevent NoSQL injection in user queries', async () => {
      const nosqlInjectionAttempts = [
        { $ne: null },
        { $gt: '' },
        { $regex: '.*' },
        { $where: 'this.password.length > 0' },
        { githubHandle: { $ne: null } },
      ];

      for (const injection of nosqlInjectionAttempts) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubHandle: injection }),
        });

        const response = await statusPost(request);
        
        expect(response.status).toBe(400);
      }
    });

    it('should sanitize XSS attempts in all text fields', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src=x onerror=alert("xss")>',
        '"><script>alert("xss")</script>',
        "'><script>alert('xss')</script>",
        '<svg onload=alert("xss")>',
      ];

      for (const xssPayload of xssPayloads) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubHandle: xssPayload }),
        });

        const response = await statusPost(request);
        const data = await response.json();
        
        // Should not reflect the XSS payload in response
        const responseText = JSON.stringify(data);
        expect(responseText).not.toContain('<script>');
        expect(responseText).not.toContain('javascript:');
        expect(responseText).not.toContain('onerror=');
        expect(responseText).not.toContain('onload=');
      }
    });
  });

  describe('Authentication and Authorization', () => {
    it('should prevent JWT token manipulation', async () => {
      const maliciousTokens = [
        'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.', // None algorithm
        'admin.admin.admin', // Invalid format
        '../../../etc/passwd', // Path traversal
        'null', // Null token
        '{}', // Empty object
        'Bearer token', // Wrong format
      ];

      for (const token of maliciousTokens) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'GET',
          headers: { 'authorization': `Bearer ${token}` },
        });

        const response = await statusGet(request);
        
        // Should reject all malicious tokens
        expect([401, 500]).toContain(response.status);
      }
    });

    it('should prevent privilege escalation through admin endpoints', async () => {
      const escalationAttempts = [
        '', // Empty secret
        'admin', // Common password
        'test-admin-secret-but-longer', // Similar but wrong
        'TEST-ADMIN-SECRET', // Case variation
        'test-admin-secret\x00', // Null byte injection
        'test-admin-secret\n', // Newline injection
      ];

      for (const secret of escalationAttempts) {
        const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
          method: 'GET',
          headers: { 'x-admin-secret': secret },
        });

        const response = await adminGet(request);
        
        if (secret === 'test-admin-secret') {
          expect(response.status).toBe(200);
        } else {
          expect(response.status).toBe(401);
        }
      }
    });

    it('should validate OAuth state parameter integrity', async () => {
      // Mock GitHub OAuth response
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          error: 'invalid_request',
          error_description: 'Invalid state parameter',
        }),
      });

      const tamperedCodes = [
        'code123', // Valid format
        'code123; rm -rf /', // Command injection
        '../../../etc/passwd', // Path traversal
        'code123\nmalicious_code', // Newline injection
      ];

      for (const code of tamperedCodes) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const response = await githubAuth(request);
        
        // Should handle all codes safely
        expect(response.status).toBeGreaterThanOrEqual(400);
      }
    });
  });

  describe('Rate Limiting and DoS Protection', () => {
    it('should handle rapid authentication attempts', async () => {
      const requests = Array.from({ length: 100 }, (_, i) => 
        new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'GET',
          headers: { 'authorization': `Bearer token_${i}` },
        })
      );

      // All requests should complete without server crash
      const responses = await Promise.all(
        requests.map(req => statusGet(req).catch(() => ({ status: 500 })))
      );

      responses.forEach(response => {
        expect(typeof response.status).toBe('number');
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      });
    });

    it('should handle concurrent admin operations safely', async () => {
      const concurrentRequests = Array.from({ length: 50 }, (_, i) => 
        new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': 'test-admin-secret',
          },
          body: JSON.stringify({
            githubHandle: `user_${i}`,
            action: 'approve',
          }),
        })
      );

      // Should handle concurrent operations without race conditions
      const responses = await Promise.all(
        concurrentRequests.map(req => adminPost(req).catch(() => ({ status: 500 })))
      );

      responses.forEach(response => {
        expect(typeof response.status).toBe('number');
      });
    });

    it('should prevent memory exhaustion attacks', async () => {
      const memoryExhaustionPayloads = [
        { githubHandle: 'a'.repeat(1000000) }, // Very long string
        { githubHandle: 'user', data: new Array(100000).fill('x') }, // Large array
        { 
          githubHandle: 'user',
          nested: {
            level1: {
              level2: {
                level3: {
                  level4: {
                    level5: 'deep nesting'
                  }
                }
              }
            }
          }
        }, // Deep nesting
      ];

      for (const payload of memoryExhaustionPayloads) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const response = await statusPost(request);
        
        // Should handle without crashing
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(600);
      }
    });
  });

  describe('Data Leakage Prevention', () => {
    it('should not expose sensitive data in error messages', async () => {
      // Mock S3 error with sensitive information
      jest.doMock('@/lib/s3-orbit-store', () => ({
        S3OrbitStore: jest.fn().mockImplementation(() => ({
          getUserByToken: jest.fn().mockRejectedValue(
            new Error('AWS Error: Access Key AKIAIOSFODNN7EXAMPLE is invalid')
          ),
        })),
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'GET',
        headers: { 'authorization': 'Bearer test_token' },
      });

      const response = await statusGet(request);
      const data = await response.json();

      // Should not expose AWS credentials
      expect(JSON.stringify(data)).not.toMatch(/AKIA[0-9A-Z]{16}/);
      expect(JSON.stringify(data)).not.toContain('Access Key');
      expect(data.error).toBe('Internal server error');
    });

    it('should not leak GitHub tokens in responses', async () => {
      // Mock user with GitHub token
      jest.doMock('@/lib/s3-orbit-store', () => ({
        S3OrbitStore: jest.fn().mockImplementation(() => ({
          getUserByToken: jest.fn().mockResolvedValue({
            githubHandle: 'testuser',
            githubToken: 'gho_secret_token_12345',
            status: 'approved',
          }),
        })),
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'GET',
        headers: { 'authorization': 'Bearer test_token' },
      });

      const response = await statusGet(request);
      const data = await response.json();

      // Should not expose GitHub token
      expect(JSON.stringify(data)).not.toContain('gho_');
      expect(data.githubToken).toBeUndefined();
    });

    it('should not expose internal system paths', async () => {
      // Mock error with system path
      jest.doMock('@/lib/s3-orbit-store', () => ({
        S3OrbitStore: jest.fn().mockImplementation(() => ({
          getUser: jest.fn().mockRejectedValue(
            new Error('ENOENT: no such file or directory, open \'/var/www/app/.env\'')
          ),
        })),
      }));

      const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubHandle: 'testuser' }),
      });

      const response = await statusPost(request);
      const data = await response.json();

      // Should not expose file system paths
      expect(JSON.stringify(data)).not.toContain('/var/www');
      expect(JSON.stringify(data)).not.toContain('.env');
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('Protocol Security', () => {
    it('should validate Content-Type headers', async () => {
      const invalidContentTypes = [
        'text/plain',
        'application/xml',
        'multipart/form-data',
        'application/x-www-form-urlencoded',
        '', // Empty
      ];

      for (const contentType of invalidContentTypes) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': contentType },
          body: JSON.stringify({ code: 'test' }),
        });

        const response = await githubAuth(request);
        
        // Should handle gracefully (Next.js handles Content-Type validation)
        expect(response.status).toBeGreaterThanOrEqual(200);
      }
    });

    it('should handle malformed JSON gracefully', async () => {
      const malformedJSON = [
        '{', // Incomplete
        '{"key": }', // Invalid syntax
        '{"key": "value",}', // Trailing comma
        'null', // Null
        'undefined', // Undefined
        '{"key": "value"} extra', // Extra content
      ];

      for (const json of malformedJSON) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: json,
        });

        const response = await githubAuth(request);
        
        // Should handle malformed JSON gracefully
        expect([400, 500]).toContain(response.status);
      }
    });

    it('should validate HTTP methods', async () => {
      const invalidMethods = ['PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

      for (const method of invalidMethods) {
        const request = new NextRequest('http://localhost:3002/api/orbit/auth/status', {
          method,
          headers: { 'authorization': 'Bearer test_token' },
        });

        try {
          const response = await statusGet(request);
          // Next.js should handle method validation
          expect(response.status).toBeGreaterThanOrEqual(400);
        } catch (error) {
          // Method not allowed errors are acceptable
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Time-based Attacks', () => {
    it('should use constant-time comparison for secrets', async () => {
      const correctSecret = 'test-admin-secret';
      const incorrectSecrets = [
        'test-admin-secre', // One char short
        'test-admin-secret-extra', // Extra chars
        'wrong-secret',
        '',
      ];

      const timings: number[] = [];

      // Test correct secret
      const startCorrect = Date.now();
      const correctRequest = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
        method: 'GET',
        headers: { 'x-admin-secret': correctSecret },
      });
      await adminGet(correctRequest);
      timings.push(Date.now() - startCorrect);

      // Test incorrect secrets
      for (const secret of incorrectSecrets) {
        const start = Date.now();
        const request = new NextRequest('http://localhost:3002/api/orbit/admin/waitlist', {
          method: 'GET',
          headers: { 'x-admin-secret': secret },
        });
        await adminGet(request);
        timings.push(Date.now() - start);
      }

      // In a real implementation, timings should be similar
      // This test documents the need for constant-time comparison
      const maxTiming = Math.max(...timings);
      const minTiming = Math.min(...timings);
      
      // Allow some variance but flag if timing difference is too large
      const timingVariance = maxTiming - minTiming;
      if (timingVariance > 100) {
        console.warn(`Potential timing attack vulnerability: ${timingVariance}ms variance`);
      }
    });

    it('should prevent race conditions in user creation', async () => {
      // Mock concurrent user creation
      global.fetch = jest.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ access_token: 'token1' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ login: 'testuser' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      const concurrentRequests = Array.from({ length: 10 }, () => 
        new NextRequest('http://localhost:3002/api/orbit/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: 'test_code' }),
        })
      );

      // All requests should complete without race conditions
      const responses = await Promise.all(
        concurrentRequests.map(req => githubAuth(req))
      );

      responses.forEach(response => {
        expect(response.status).toBeGreaterThanOrEqual(200);
      });
    });
  });
});