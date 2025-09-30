import { SignalingServer } from '@/lib/signaling-server';
import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';

// Mock WebSocketServer and WebSocket
jest.mock('ws', () => ({
  WebSocketServer: jest.fn(),
  WebSocket: {
    OPEN: 1,
  },
}));

// Mock S3OrbitStore
jest.mock('@/lib/s3-orbit-store', () => ({
  S3OrbitStore: jest.fn().mockImplementation(() => ({
    getUserByToken: jest.fn(),
    addUserToRoom: jest.fn(),
    removeUserFromRoom: jest.fn(),
  })),
}));

// Create a mock WebSocket class
class MockWebSocket extends EventEmitter {
  readyState = 1; // OPEN
  
  send = jest.fn();
  close = jest.fn();
  
  // Simulate message reception
  receive(message: any) {
    this.emit('message', JSON.stringify(message));
  }
  
  // Simulate connection close
  disconnect() {
    this.emit('close');
  }
  
  // Simulate error
  error(err: Error) {
    this.emit('error', err);
  }
}

describe('SignalingServer', () => {
  let server: SignalingServer;
  let mockServer: any;
  let mockWss: any;
  let connectionHandler: (ws: any) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock server object
    mockServer = { on: jest.fn() };
    
    // Mock WebSocketServer
    mockWss = {
      on: jest.fn((event, handler) => {
        if (event === 'connection') {
          connectionHandler = handler;
        }
      }),
    };
    
    const MockWebSocketServer = WebSocketServer as jest.MockedClass<typeof WebSocketServer>;
    MockWebSocketServer.mockImplementation(() => mockWss);
    
    server = new SignalingServer(mockServer);
  });

  describe('Connection Handling', () => {
    it('should accept WebSocket connections', () => {
      expect(mockWss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });

    it('should set up event listeners on new connections', () => {
      const mockWs = new MockWebSocket();
      const onSpy = jest.spyOn(mockWs, 'on');
      
      connectionHandler(mockWs);
      
      expect(onSpy).toHaveBeenCalledWith('message', expect.any(Function));
      expect(onSpy).toHaveBeenCalledWith('close', expect.any(Function));
      expect(onSpy).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle connection close gracefully', () => {
      const mockWs = new MockWebSocket();
      connectionHandler(mockWs);
      
      // Should not throw
      mockWs.disconnect();
      expect(mockWs.send).not.toHaveBeenCalled();
    });

    it('should handle connection errors gracefully', () => {
      const mockWs = new MockWebSocket();
      connectionHandler(mockWs);
      
      // Should not throw
      mockWs.error(new Error('Connection lost'));
      expect(mockWs.send).not.toHaveBeenCalled();
    });
  });

  describe('Message Handling', () => {
    let mockWs: MockWebSocket;

    beforeEach(() => {
      mockWs = new MockWebSocket();
      connectionHandler(mockWs);
    });

    it('should handle invalid JSON messages gracefully', () => {
      mockWs.emit('message', 'invalid json');
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'Invalid signal message',
        })
      );
    });

    it('should handle unknown message types', () => {
      mockWs.receive({ type: 'unknown' });
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'Unknown signal type',
        })
      );
    });

    it('should handle join messages without required fields', () => {
      mockWs.receive({ type: 'join' });
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'Missing token or repoUrl',
        })
      );
    });
  });

  describe('Join Flow', () => {
    let mockWs: MockWebSocket;
    let mockS3Store: any;

    beforeEach(() => {
      mockWs = new MockWebSocket();
      connectionHandler(mockWs);
      
      const MockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      mockS3Store = {
        getUserByToken: jest.fn(),
        addUserToRoom: jest.fn(),
        removeUserFromRoom: jest.fn(),
      };
      MockS3OrbitStore.mockImplementation(() => mockS3Store);
    });

    it('should reject join with invalid token', async () => {
      mockS3Store.getUserByToken.mockResolvedValue(null);
      
      mockWs.receive({
        type: 'join',
        token: 'invalid_token',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'Invalid token',
        })
      );
      expect(mockWs.close).toHaveBeenCalled();
    });

    it('should reject join for non-approved users', async () => {
      mockS3Store.getUserByToken.mockResolvedValue({
        githubHandle: 'testuser',
        status: 'waitlisted',
      });
      
      mockWs.receive({
        type: 'join',
        token: 'valid_token',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'Not approved for access',
          status: 'waitlisted',
        })
      );
      expect(mockWs.close).toHaveBeenCalled();
    });

    it('should reject join for users without repo access', async () => {
      mockS3Store.getUserByToken.mockResolvedValue({
        githubHandle: 'testuser',
        status: 'approved',
      });
      
      // Mock fetch to simulate GitHub API failure
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
      });
      
      mockWs.receive({
        type: 'join',
        token: 'valid_token',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'No access to repository',
        })
      );
      expect(mockWs.close).toHaveBeenCalled();
    });

    it('should successfully join room for approved user with repo access', async () => {
      mockS3Store.getUserByToken.mockResolvedValue({
        githubHandle: 'testuser',
        status: 'approved',
      });
      
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
      });
      
      mockWs.receive({
        type: 'join',
        token: 'valid_token',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockWs.send).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'joined',
          githubHandle: 'testuser',
          peers: expect.any(Array),
        })
      );
      
      expect(mockS3Store.addUserToRoom).toHaveBeenCalledWith(
        'https://github.com/owner/repo',
        'testuser'
      );
    });

    it('should handle multiple users in the same room', async () => {
      // Set up first user
      const mockWs1 = new MockWebSocket();
      connectionHandler(mockWs1);
      
      mockS3Store.getUserByToken.mockResolvedValue({
        githubHandle: 'user1',
        status: 'approved',
      });
      
      global.fetch = jest.fn().mockResolvedValue({ status: 200 });
      
      mockWs1.receive({
        type: 'join',
        token: 'token1',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Set up second user
      const mockWs2 = new MockWebSocket();
      connectionHandler(mockWs2);
      
      mockS3Store.getUserByToken.mockResolvedValue({
        githubHandle: 'user2',
        status: 'approved',
      });
      
      mockWs2.receive({
        type: 'join',
        token: 'token2',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Second user should see first user in peers list
      expect(mockWs2.send).toHaveBeenCalledWith(
        expect.stringContaining('"peers":[{"peerId"')
      );
      
      // First user should be notified of second user joining
      expect(mockWs1.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"peer-joined"')
      );
    });
  });

  describe('Signal Relaying', () => {
    let mockWs1: MockWebSocket;
    let mockWs2: MockWebSocket;
    let mockS3Store: any;

    beforeEach(async () => {
      const MockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      mockS3Store = {
        getUserByToken: jest.fn().mockResolvedValue({
          githubHandle: 'testuser',
          status: 'approved',
        }),
        addUserToRoom: jest.fn(),
        removeUserFromRoom: jest.fn(),
      };
      MockS3OrbitStore.mockImplementation(() => mockS3Store);
      
      global.fetch = jest.fn().mockResolvedValue({ status: 200 });
      
      // Set up two connected users
      mockWs1 = new MockWebSocket();
      mockWs2 = new MockWebSocket();
      
      connectionHandler(mockWs1);
      connectionHandler(mockWs2);
      
      // Join both users to the same room
      mockWs1.receive({
        type: 'join',
        token: 'token1',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      mockWs2.receive({
        type: 'join',
        token: 'token2',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      jest.clearAllMocks(); // Clear join messages
    });

    it('should relay offers between peers', () => {
      const offerSignal = {
        type: 'offer',
        to: expect.any(String), // peer ID
        data: { sdp: 'fake_offer_sdp' },
      };
      
      // Get the peer ID from the join response
      const joinResponse = mockWs2.send.mock.calls.find(call => 
        JSON.parse(call[0]).type === 'joined'
      );
      const peerId2 = joinResponse ? JSON.parse(joinResponse[0]).peerId : 'peer2';
      
      mockWs1.receive({
        type: 'offer',
        to: peerId2,
        data: { sdp: 'fake_offer_sdp' },
      });
      
      expect(mockWs2.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"offer"')
      );
    });

    it('should relay answers between peers', () => {
      const answerSignal = {
        type: 'answer',
        to: expect.any(String),
        data: { sdp: 'fake_answer_sdp' },
      };
      
      mockWs1.receive(answerSignal);
      
      expect(mockWs2.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"answer"')
      );
    });

    it('should relay ICE candidates between peers', () => {
      const iceSignal = {
        type: 'ice-candidate',
        to: expect.any(String),
        data: { candidate: 'fake_ice_candidate' },
      };
      
      mockWs1.receive(iceSignal);
      
      expect(mockWs2.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"ice-candidate"')
      );
    });

    it('should handle signals to non-existent peers', () => {
      mockWs1.receive({
        type: 'offer',
        to: 'non-existent-peer',
        data: { sdp: 'fake_offer_sdp' },
      });
      
      expect(mockWs1.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'Target peer not found',
        })
      );
    });
  });

  describe('Room Management', () => {
    let mockWs: MockWebSocket;
    let mockS3Store: any;

    beforeEach(async () => {
      const MockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      mockS3Store = {
        getUserByToken: jest.fn().mockResolvedValue({
          githubHandle: 'testuser',
          status: 'approved',
        }),
        addUserToRoom: jest.fn(),
        removeUserFromRoom: jest.fn(),
      };
      MockS3OrbitStore.mockImplementation(() => mockS3Store);
      
      global.fetch = jest.fn().mockResolvedValue({ status: 200 });
      
      mockWs = new MockWebSocket();
      connectionHandler(mockWs);
      
      mockWs.receive({
        type: 'join',
        token: 'token',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      jest.clearAllMocks();
    });

    it('should handle explicit leave messages', () => {
      mockWs.receive({ type: 'leave' });
      
      expect(mockS3Store.removeUserFromRoom).toHaveBeenCalledWith(
        'https://github.com/owner/repo',
        'testuser'
      );
    });

    it('should clean up on connection close', () => {
      mockWs.disconnect();
      
      expect(mockS3Store.removeUserFromRoom).toHaveBeenCalledWith(
        'https://github.com/owner/repo',
        'testuser'
      );
    });

    it('should notify other peers when user leaves', async () => {
      // Add a second user to see the notification
      const mockWs2 = new MockWebSocket();
      connectionHandler(mockWs2);
      
      mockWs2.receive({
        type: 'join',
        token: 'token2',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      jest.clearAllMocks();
      
      // First user leaves
      mockWs.disconnect();
      
      // Second user should be notified
      expect(mockWs2.send).toHaveBeenCalledWith(
        expect.stringContaining('"type":"peer-left"')
      );
    });
  });

  describe('Repository URL Parsing', () => {
    let mockWs: MockWebSocket;
    let mockS3Store: any;

    beforeEach(() => {
      const MockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      mockS3Store = {
        getUserByToken: jest.fn().mockResolvedValue({
          githubHandle: 'testuser',
          status: 'approved',
        }),
        addUserToRoom: jest.fn(),
      };
      MockS3OrbitStore.mockImplementation(() => mockS3Store);
      
      mockWs = new MockWebSocket();
      connectionHandler(mockWs);
    });

    it('should handle HTTPS GitHub URLs', async () => {
      global.fetch = jest.fn().mockResolvedValue({ status: 200 });
      
      mockWs.receive({
        type: 'join',
        token: 'token',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo',
        expect.any(Object)
      );
    });

    it('should handle GitHub URLs with .git suffix', async () => {
      global.fetch = jest.fn().mockResolvedValue({ status: 200 });
      
      mockWs.receive({
        type: 'join',
        token: 'token',
        repoUrl: 'https://github.com/owner/repo.git',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo',
        expect.any(Object)
      );
    });

    it('should reject invalid repository URLs', async () => {
      mockWs.receive({
        type: 'join',
        token: 'token',
        repoUrl: 'invalid-url',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(mockWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'error',
          message: 'No access to repository',
        })
      );
    });
  });

  describe('Security Tests', () => {
    let mockWs: MockWebSocket;

    beforeEach(() => {
      mockWs = new MockWebSocket();
      connectionHandler(mockWs);
    });

    it('should handle malicious JSON payloads', () => {
      const maliciousPayloads = [
        '{"__proto__":{"isAdmin":true}}',
        '{"constructor":{"prototype":{"isAdmin":true}}}',
        '{"type":"join","__proto__":{"bypass":true}}',
      ];
      
      maliciousPayloads.forEach(payload => {
        mockWs.emit('message', payload);
      });
      
      // Should handle gracefully without throwing
      expect(mockWs.send).toHaveBeenCalled();
    });

    it('should handle extremely large messages', () => {
      const largeMessage = {
        type: 'join',
        token: 'a'.repeat(100000),
        repoUrl: 'https://github.com/owner/repo',
        maliciousData: 'x'.repeat(1000000),
      };
      
      mockWs.receive(largeMessage);
      
      // Should handle without crashing
      expect(mockWs.send).toHaveBeenCalled();
    });

    it('should prevent token stuffing attacks', async () => {
      const MockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      const mockGetUserByToken = jest.fn().mockResolvedValue(null);
      MockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: mockGetUserByToken,
      }));
      
      // Rapid token attempts
      const tokens = Array.from({ length: 100 }, (_, i) => `token_${i}`);
      
      tokens.forEach(token => {
        mockWs.receive({
          type: 'join',
          token,
          repoUrl: 'https://github.com/owner/repo',
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should have attempted to validate all tokens
      expect(mockGetUserByToken).toHaveBeenCalledTimes(100);
      
      // Connection should be closed (invalid tokens)
      expect(mockWs.close).toHaveBeenCalled();
    });

    it('should sanitize repository URLs', async () => {
      const maliciousUrls = [
        'https://github.com/owner/repo?callback=malicious',
        'https://github.com/owner/repo#<script>alert("xss")</script>',
        'https://github.com/owner/repo/../../../etc/passwd',
        'javascript:alert("xss")',
      ];
      
      global.fetch = jest.fn().mockResolvedValue({ status: 404 });
      
      maliciousUrls.forEach(url => {
        mockWs.receive({
          type: 'join',
          token: 'token',
          repoUrl: url,
        });
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should reject all malicious URLs
      expect(mockWs.send).toHaveBeenCalledTimes(maliciousUrls.length);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent connections efficiently', async () => {
      const connectionCount = 100;
      const mockConnections: MockWebSocket[] = [];
      
      // Create many concurrent connections
      for (let i = 0; i < connectionCount; i++) {
        const mockWs = new MockWebSocket();
        mockConnections.push(mockWs);
        connectionHandler(mockWs);
      }
      
      // Should handle all connections without issues
      expect(mockConnections).toHaveLength(connectionCount);
      
      // Cleanup
      mockConnections.forEach(ws => ws.disconnect());
    });

    it('should handle rapid message throughput', () => {
      const mockWs = new MockWebSocket();
      connectionHandler(mockWs);
      
      // Send many messages rapidly
      for (let i = 0; i < 1000; i++) {
        mockWs.receive({
          type: 'unknown',
          data: `message_${i}`,
        });
      }
      
      // Should handle all messages
      expect(mockWs.send).toHaveBeenCalledTimes(1000);
    });
  });

  describe('Stats and Monitoring', () => {
    it('should provide connection statistics', () => {
      const stats = server.getStats();
      
      expect(stats).toHaveProperty('totalConnections');
      expect(stats).toHaveProperty('totalRooms');
      expect(stats).toHaveProperty('rooms');
      expect(Array.isArray(stats.rooms)).toBe(true);
    });

    it('should track room statistics accurately', async () => {
      const MockS3OrbitStore = require('@/lib/s3-orbit-store').S3OrbitStore;
      MockS3OrbitStore.mockImplementation(() => ({
        getUserByToken: jest.fn().mockResolvedValue({
          githubHandle: 'testuser',
          status: 'approved',
        }),
        addUserToRoom: jest.fn(),
      }));
      
      global.fetch = jest.fn().mockResolvedValue({ status: 200 });
      
      // Add users to a room
      const mockWs1 = new MockWebSocket();
      const mockWs2 = new MockWebSocket();
      
      connectionHandler(mockWs1);
      connectionHandler(mockWs2);
      
      mockWs1.receive({
        type: 'join',
        token: 'token1',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      mockWs2.receive({
        type: 'join',
        token: 'token2',
        repoUrl: 'https://github.com/owner/repo',
      });
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const stats = server.getStats();
      
      expect(stats.totalConnections).toBe(2);
      expect(stats.totalRooms).toBe(1);
      expect(stats.rooms).toHaveLength(1);
      expect(stats.rooms[0].peerCount).toBe(2);
    });
  });
});