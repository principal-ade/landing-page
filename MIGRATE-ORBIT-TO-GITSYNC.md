# Migration Plan: Orbit Signaling to Git-Sync Server

## Overview

The code-city-landing currently has an Orbit signaling system for WebRTC connections. This should be replaced with the new Git-Sync server for better functionality and consistency across the platform.

## Current Orbit System

### Components to Remove/Replace:
1. **Signaling Server** (`/src/lib/signaling-server.ts`)
   - WebSocket-based signaling for WebRTC
   - Room management for repositories
   - Peer connection handling

2. **S3 Orbit Store** (`/src/lib/s3-orbit-store.ts`)
   - User authentication storage in S3
   - Room/peer management
   - Waitlist functionality

3. **API Routes** (`/src/app/api/orbit/*`)
   - `/auth/github` - GitHub OAuth
   - `/auth/status` - Auth status check
   - `/signal/join` - Join room
   - `/signal/leave` - Leave room
   - `/signal/send` - Send signal
   - `/signal/poll` - Poll for signals
   - `/admin/waitlist` - Manage waitlist

## Migration to Git-Sync

### Advantages of Git-Sync:
- **Branch-aware locking**: Prevents conflicts at the file/directory level
- **JWT authentication**: More secure token management
- **Event history**: New subscribers get historical events
- **Cross-branch warnings**: Better collaboration awareness
- **Merge coordination**: Safe merge operations
- **Already deployed**: Server running at http://34.226.213.143:3001

### Migration Steps:

#### 1. Replace Authentication
```typescript
// OLD: Orbit auth with S3 storage
const store = new S3OrbitStore();
const user = await store.getUserByToken(token);

// NEW: Git-Sync JWT auth
const response = await fetch('http://34.226.213.143:3001/api/register', {
  method: 'POST',
  body: JSON.stringify({ githubToken })
});
const { token } = await response.json();
```

#### 2. Replace Signaling with Git-Sync Client
```typescript
// OLD: WebRTC signaling
const ws = new WebSocket('/orbit/signal');
ws.send(JSON.stringify({ type: 'join', repoUrl, token }));

// NEW: Git-Sync WebSocket
import { GitSyncClient } from '@/lib/git-sync-client';
const client = new GitSyncClient({
  serverUrl: 'http://34.226.213.143:3001',
  token: jwtToken,
  repoUrl,
  branch: 'main'
});
await client.connect();
```

#### 3. Replace Room Management
```typescript
// OLD: Orbit rooms for repos
await store.joinRoom(repoUrl, githubHandle, peerId);
const peers = await store.getRoomPeers(repoUrl);

// NEW: Git-Sync repository rooms
// Automatic room management on connection
client.on('peer_joined', (peer) => {
  console.log(`${peer.userId} joined on branch ${peer.branch}`);
});
```

#### 4. Add File Locking (New Feature)
```typescript
// Not available in Orbit, new in Git-Sync
const result = await client.acquireLock({
  resource: 'src/index.ts',
  type: 'file',
  exclusive: true
});

if (result.success) {
  // Edit file safely
  await client.releaseLock(result.lock.id);
}
```

## Implementation Plan

### Phase 1: Setup (Week 1)
- [ ] Create Git-Sync client library for Next.js
- [ ] Add environment variables for Git-Sync server
- [ ] Create migration flag to run both systems

### Phase 2: Authentication (Week 2)
- [ ] Implement JWT token exchange
- [ ] Migrate user data from S3 to Git-Sync
- [ ] Update auth status checks

### Phase 3: Replace Signaling (Week 3)
- [ ] Replace WebSocket connections
- [ ] Implement room management
- [ ] Add peer discovery

### Phase 4: Add New Features (Week 4)
- [ ] Implement file locking UI
- [ ] Add branch awareness
- [ ] Show cross-branch warnings

### Phase 5: Cleanup (Week 5)
- [ ] Remove Orbit code
- [ ] Remove S3 dependencies
- [ ] Update documentation

## Files to Remove After Migration

```
src/lib/signaling-server.ts
src/lib/s3-orbit-store.ts
src/app/api/orbit/**/*
src/app/orbit-success/page.tsx
__tests__/lib/signaling-server.test.ts
```

## Environment Variables

### Remove:
```env
GITHUB_CLIENT_ID_ORBIT
GITHUB_CLIENT_SECRET_ORBIT
AWS_S3_BUCKET_ORBIT
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

### Add:
```env
GIT_SYNC_SERVER_URL=http://34.226.213.143:3001
GIT_SYNC_JWT_SECRET=<from-server>
```

## Testing Plan

1. **Parallel Testing**: Run both systems with feature flag
2. **Migration Testing**: Test data migration from S3
3. **Performance Testing**: Compare latency and throughput
4. **Integration Testing**: Test with electron-react app

## Rollback Plan

Keep Orbit code in a separate branch until Git-Sync is stable:
```bash
git checkout -b legacy/orbit-signaling
git push origin legacy/orbit-signaling
```

## Benefits After Migration

1. **Unified System**: Same sync server for all components
2. **Better Features**: File locking, branch awareness
3. **Lower Costs**: No S3 storage needed
4. **Better Performance**: Event history caching
5. **Improved Security**: JWT tokens instead of GitHub tokens

## Timeline

- Week 1-2: Development
- Week 3: Testing
- Week 4: Staged rollout (10% → 50% → 100%)
- Week 5: Cleanup and documentation

## Success Metrics

- Zero data loss during migration
- < 100ms connection time (improvement from ~500ms)
- 99.9% uptime
- Support for 1000+ concurrent connections
- Positive user feedback on new features