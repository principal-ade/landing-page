# Electron Version Manager Documentation

## Overview

The Electron Version Manager provides automatic update functionality for the Specktor desktop application. It proxies requests from electron-updater to GitHub Releases, enabling centralized control over updates, analytics, and optional access control.

## Architecture

### How Auto-Updates Work

```
┌──────────────┐                                    ┌──────────────┐                  ┌──────────────┐
│   Electron   │                                    │   Landing    │                  │   GitHub     │
│     App      │                                    │     Page     │                  │   Releases   │
│              │                                    │   (Proxy)    │                  │              │
└──────┬───────┘                                    └──────┬───────┘                  └──────┬───────┘
       │                                                   │                                 │
       │ 1. Check for updates                             │                                 │
       │    GET /api/updates/darwin-arm64/latest-mac.yml  │                                 │
       ├──────────────────────────────────────────────────>                                 │
       │                                                   │                                 │
       │                                      2. Fetch latest release info                  │
       │                                                   ├────────────────────────────────>
       │                                                   │                                 │
       │                                      3. Return release metadata                    │
       │                                                   <────────────────────────────────┤
       │                                                   │                                 │
       │                                      4. Find latest-mac.yml asset                  │
       │                                                   │                                 │
       │                                      5. Proxy yml file                             │
       │                                                   ├────────────────────────────────>
       │                                                   │                                 │
       │                                                   <────────────────────────────────┤
       │                                                   │                                 │
       │ 6. Return yml with version info                  │                                 │
       <──────────────────────────────────────────────────┤                                 │
       │                                                   │                                 │
       │ 7. Compare versions, download if newer           │                                 │
       │    GET /api/updates/Specktor-1.0.0-arm64.dmg    │                                 │
       ├──────────────────────────────────────────────────>                                 │
       │                                                   │                                 │
       │                                      8. Find asset in release                      │
       │                                                   │                                 │
       │                                      9. Stream binary                              │
       │                                                   ├────────────────────────────────>
       │                                                   │                                 │
       │                                                   <────────────────────────────────┤
       │                                                   │                                 │
       │ 10. Stream installer to app                      │                                 │
       <──────────────────────────────────────────────────┤                                 │
       │                                                   │                                 │
       │ 11. Verify, install, restart                     │                                 │
       │                                                   │                                 │
```

## API Endpoints

### Version Check

**Endpoint**: `GET /api/updates/{platform}-{arch}/{yml-filename}`

**Examples**:
- `/api/updates/darwin-arm64/latest-mac.yml`
- `/api/updates/darwin-x64/latest-mac.yml`
- `/api/updates/win32-x64/latest.yml`
- `/api/updates/linux-x64/latest-linux.yml`

**Purpose**: Returns version metadata for electron-updater

**Response** (YAML):
```yaml
version: 1.0.0
files:
  - url: Specktor-1.0.0-arm64.dmg
    sha512: K8Vjz...
    size: 89474234
path: Specktor-1.0.0-arm64.dmg
sha512: K8Vjz...
releaseDate: '2024-09-30T12:00:00Z'
```

**Flow**:
1. Fetch latest release from GitHub API
2. Look for platform-specific yml file in release assets (e.g., `latest-mac.yml`)
3. If found, proxy it directly from GitHub
4. If not found, generate basic yml (without SHA512 - not recommended)

**Caching**: 5 minutes (`max-age=300`)

**Environment Variables**:
- `GITHUB_RELEASES_READONLY_TOKEN` (optional) - For private repositories

**File**: `src/app/api/updates/[...path]/route.ts`

---

### Binary Download

**Endpoint**: `GET /api/updates/{filename}`

**Examples**:
- `/api/updates/Specktor-1.0.0-arm64.dmg`
- `/api/updates/Specktor-Setup-1.0.0.exe`
- `/api/updates/Specktor-1.0.0.AppImage`

**Purpose**: Proxies installer downloads from GitHub Releases

**Flow**:
1. Fetch latest release metadata
2. Find asset matching requested filename
3. Stream binary from GitHub to client

**Caching**: 1 hour (`max-age=3600`)

**Features**:
- Streams large files efficiently
- Supports private repositories with token auth
- Optional authentication (commented out)
- Download analytics via logs

**Environment Variables**:
- `GITHUB_RELEASES_READONLY_TOKEN` (optional) - For private repositories

**File**: `src/app/api/updates/[...path]/route.ts`

---

## Electron App Configuration

### electron-updater Setup

In your Electron app's `main.ts` or `main.js`:

```typescript
import { autoUpdater } from 'electron-updater';

// Configure update server
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://principal-ade.com/api/updates'
});

// Optional: Add custom headers (e.g., for authentication)
autoUpdater.requestHeaders = {
  'User-Agent': 'Specktor-Desktop/1.0.0'
  // 'Authorization': 'Bearer user-license-key' // Uncomment for auth
};

// Configure update behavior
autoUpdater.autoDownload = false; // Let user choose
autoUpdater.autoInstallOnAppQuit = true;

// Check for updates
autoUpdater.checkForUpdates();

// Handle events
autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  // Show dialog to user
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  // Prompt user to restart
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
});
```

### Package Configuration

In `package.json`:

```json
{
  "name": "specktor",
  "version": "1.0.0",
  "build": {
    "appId": "com.principlemd.specktor",
    "productName": "Specktor",
    "publish": [
      {
        "provider": "generic",
        "url": "https://principal-ade.com/api/updates"
      }
    ],
    "mac": {
      "category": "public.app-category.developer-tools",
      "target": [
        {
          "target": "dmg",
          "arch": ["arm64", "x64"]
        }
      ]
    },
    "win": {
      "target": ["nsis"],
      "arch": ["x64"]
    },
    "linux": {
      "target": ["AppImage"],
      "category": "Development"
    }
  }
}
```

---

## Publishing Releases

### 1. Build with electron-builder

```bash
# Build for current platform
npm run build

# Build for all platforms (requires proper setup)
npm run build:mac
npm run build:win
npm run build:linux
```

### 2. Publish to GitHub Releases

electron-builder automatically publishes to GitHub if configured:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "a24z-ai",
      "repo": "electron-app"
    }
  }
}
```

**Manual publish**:
```bash
# Set GitHub token
export GH_TOKEN=ghp_your_personal_access_token

# Publish release
npm run publish
```

This will:
1. Create a GitHub release with tag (e.g., `v1.0.0`)
2. Upload platform-specific installers
3. Generate and upload yml files (`latest-mac.yml`, `latest.yml`, etc.)

### 3. Verify Release

Check that the release includes:
- ✅ Installer files (`.dmg`, `.exe`, `.AppImage`)
- ✅ YAML metadata files (`latest-mac.yml`, `latest.yml`, `latest-linux.yml`)
- ✅ Checksums and signatures

Example release assets:
```
Specktor-1.0.0-arm64.dmg         (89 MB)
Specktor-1.0.0-x64.dmg           (92 MB)
Specktor-Setup-1.0.0.exe         (78 MB)
Specktor-1.0.0.AppImage          (85 MB)
latest-mac.yml                   (2 KB)
latest.yml                       (2 KB)
latest-linux.yml                 (2 KB)
```

---

## Environment Variables

### Required

None - works with public repositories out of the box

### Optional

```bash
# For private repositories or rate limit issues
GITHUB_RELEASES_READONLY_TOKEN=ghp_your_token_here
```

**Creating the token**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes:
   - For public repos: `public_repo`
   - For private repos: `repo` (full control)
4. Generate and copy token
5. Add to deployment environment

---

## Features

### ✅ Implemented

- **Zero Storage**: All files stored on GitHub
- **Efficient Streaming**: Large files streamed directly
- **Caching**: Version checks cached 5 min, binaries 1 hour
- **Private Repo Support**: Optional token authentication
- **Cross-Platform**: macOS, Windows, Linux
- **Logging**: Download requests logged for analytics

### 🔧 Optional Enhancements

#### 1. Authentication/Licensing

Uncomment in `route.ts`:

```typescript
// Add at top of binary download section
const authHeader = request.headers.get('authorization');
if (!isValidLicense(authHeader)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Implement license validation:

```typescript
async function isValidLicense(authHeader: string | null): Promise<boolean> {
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');

  // Check against database or license server
  const response = await fetch('https://your-license-api.com/validate', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  return response.ok;
}
```

Update Electron app:

```typescript
autoUpdater.requestHeaders = {
  'Authorization': `Bearer ${userLicenseKey}`
};
```

#### 2. Download Analytics

Add tracking in `route.ts`:

```typescript
// After successful download
await trackDownload({
  filename: path,
  platform: platform,
  version: release.tag_name,
  userAgent: request.headers.get('user-agent'),
  timestamp: new Date().toISOString()
});
```

#### 3. Rollout Control

Add feature flags to control updates:

```typescript
// Check if user is in rollout group
const rolloutPercentage = await getRolloutPercentage(release.tag_name);
const userId = await getUserId(authHeader);
const userHash = hashUserId(userId);

if (userHash % 100 >= rolloutPercentage) {
  // Return previous version
  return getPreviousVersion();
}
```

#### 4. Custom Update Channels

Support beta/alpha channels:

```typescript
// Check channel from request
const channel = request.headers.get('x-update-channel') || 'stable';

// Fetch releases with tag matching channel
const releases = await fetchReleasesByChannel(channel);
// Tags: v1.0.0, v1.1.0-beta.1, v1.2.0-alpha.2
```

---

## Testing

### Local Testing

```bash
# 1. Start dev server
npm run dev

# 2. Test version check
curl http://localhost:3000/api/updates/darwin-arm64/latest-mac.yml

# 3. Test binary download (will be large!)
curl -O http://localhost:3000/api/updates/Specktor-1.0.0-arm64.dmg
```

### Electron App Testing

```typescript
// In main process
import { autoUpdater } from 'electron-updater';

// Point to local dev server
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'http://localhost:3000/api/updates'
});

// Enable verbose logging
autoUpdater.logger = {
  info: console.log,
  warn: console.warn,
  error: console.error
};

// Check for updates
autoUpdater.checkForUpdates();
```

### Production Testing

```bash
# Test against production API
curl https://principal-ade.com/api/updates/darwin-arm64/latest-mac.yml

# Should return latest version metadata
```

---

## Troubleshooting

### "No matching release found"

**Symptom**: Version check returns 404

**Solutions**:
1. Verify release exists in GitHub: https://github.com/a24z-ai/electron-app/releases
2. Check release has the required yml files
3. Ensure release is published (not draft)
4. Verify `GITHUB_RELEASES_READONLY_TOKEN` if private repo

### "Failed to fetch release info"

**Symptom**: 500 error or GitHub API errors

**Solutions**:
1. Check GitHub API rate limits (60/hour without token, 5000/hour with token)
2. Verify token has correct permissions if using private repo
3. Check GitHub status: https://www.githubstatus.com/

### Updates Not Detected

**Symptom**: Electron app doesn't see new version

**Solutions**:
1. Verify yml files in GitHub release contain correct version
2. Check electron-updater feed URL is correct
3. Clear electron-updater cache: `~/Library/Application Support/Specktor` (macOS)
4. Enable verbose logging in electron-updater
5. Check version comparison: must be semantic versioning (1.0.0, not 1.0)

### Download Fails

**Symptom**: Update downloads but fails to install

**Solutions**:
1. Verify SHA512 checksums in yml files match binaries
2. Check file permissions on downloaded installer
3. Ensure app has proper code signing (macOS/Windows)
4. Check installer isn't corrupted (compare file sizes)

### Authentication Issues

**Symptom**: 401 Unauthorized errors

**Solutions**:
1. Verify `GITHUB_RELEASES_READONLY_TOKEN` is set correctly
2. Check token hasn't expired
3. Ensure token has correct scopes (`repo` or `public_repo`)
4. Test token directly: `curl -H "Authorization: token $TOKEN" https://api.github.com/repos/a24z-ai/electron-app/releases/latest`

---

## Security Considerations

### Code Signing

**macOS**:
```json
{
  "mac": {
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  }
}
```

**Windows**:
```json
{
  "win": {
    "certificateFile": "cert.pfx",
    "certificatePassword": "password",
    "signingHashAlgorithms": ["sha256"]
  }
}
```

### Update Integrity

electron-updater verifies updates using:
- ✅ SHA512 checksums (from yml files)
- ✅ Code signatures (platform-specific)
- ✅ HTTPS transport

Never skip signature verification:
```typescript
// DON'T DO THIS
autoUpdater.allowDowngrade = true;
autoUpdater.allowPrerelease = true;
```

### Token Security

✅ **DO**:
- Use read-only tokens
- Rotate tokens regularly
- Store in secrets manager (not code)
- Use separate tokens per environment

❌ **DON'T**:
- Commit tokens to git
- Use tokens with write access
- Share tokens across services
- Log tokens in console

---

## Performance

### Caching Strategy

| Resource | Cache Duration | Rationale |
|----------|---------------|-----------|
| `.yml` files | 5 minutes | Version checks are frequent |
| Binary installers | 1 hour | Large files, infrequent downloads |
| Release API calls | Same as response | Leverage GitHub's caching |

### CDN Integration

For high-traffic deployments, consider CDN:

```typescript
// In route.ts
const cdnUrl = process.env.CDN_URL;
if (cdnUrl) {
  // Redirect to CDN instead of proxying
  return NextResponse.redirect(`${cdnUrl}/releases/${path}`);
}
```

### Monitoring

Log key metrics:

```typescript
console.log(`[Update Proxy] Version check: ${platform}-${arch}`);
console.log(`[Update Proxy] Binary download: ${filename} (${fileSize} bytes)`);
console.log(`[Update Proxy] GitHub API calls: ${apiCallCount}`);
```

Track in your analytics:
- Version check frequency
- Download completion rate
- Platform distribution
- Update adoption rate

---

## Configuration Reference

### Desktop App Config

`src/config/desktop-app.ts`:

```typescript
export const DESKTOP_APP_CONFIG = {
  github: {
    owner: 'a24z-ai',
    repo: 'electron-app',
    fullRepo: 'a24z-ai/electron-app'
  },
  branding: {
    name: 'Specktor',
    displayName: 'Specktor Desktop'
  },
  autoUpdate: {
    versionCheckCacheDuration: 300,    // 5 minutes
    binaryCacheDuration: 3600          // 1 hour
  }
};
```

Update these values if:
- Repository changes
- App is renamed
- Cache strategy needs adjustment

---

## Related Documentation

- [ELECTRON_AUTH.md](./ELECTRON_AUTH.md) - Authentication system
- [apprunner.yaml](./apprunner.yaml) - Deployment configuration
- [src/config/desktop-app.ts](./src/config/desktop-app.ts) - Desktop app config
- [electron-updater docs](https://www.electron.build/auto-update)

## Support

For issues:
1. Check server logs for error details
2. Verify GitHub release structure
3. Test with curl commands above
4. Check electron-updater logs in app
5. Open issue with logs (redact tokens!)
