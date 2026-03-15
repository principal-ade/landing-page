# ADE Desktop Application Downloads

The download page allows users to download the ADE (Application Development Environment) desktop application, also known as "Specktor". It provides a seamless experience for users across different operating systems.

## What Problem Does This Solve?

Users need a reliable way to download the correct version of the desktop application for their operating system. The download system:

- **Auto-detects platform**: Automatically identifies if the user is on macOS, Windows, or Linux
- **Fetches latest releases**: Dynamically pulls release information from GitHub
- **Proxies downloads**: Securely streams binaries through our API to avoid exposing GitHub tokens to clients
- **Handles unavailable platforms**: Shows waitlist signup for platforms without builds

## Available Operations

### For Users
1. **Visit download page** (`/download`) - See available downloads with platform auto-detection
2. **Select platform** - Choose macOS, Windows, or Linux (only available if a build exists)
3. **Download application** - Click download button to receive the installer
4. **Join waitlist** - Sign up on Discord for notifications about upcoming platform support

### Platform-Specific Assets
| Platform | File Types |
|----------|------------|
| macOS    | `.dmg`     |
| Windows  | `.exe`, `.msi` |
| Linux    | `.AppImage`, `.deb`, `.rpm` |

## Design Choices

### GitHub as Release Backend
Releases are stored in the `principal-ade/landing-page` GitHub repository. This provides:
- Version history and release notes
- CDN-backed binary hosting
- Familiar workflow for developers

### Redirect Download Architecture
Downloads go through `/api/github/download` which redirects to GitHub's CDN:
1. **Security**: The GitHub token stays server-side (used for HEAD request only)
2. **Analytics**: We track downloads client-side with `trackDownload()` before redirect
3. **Performance**: Users download directly from GitHub's global CDN (S3/CloudFront)
4. **Low memory**: Server only does a HEAD request, no binary buffering

### Response Sanitization
The `/api/github/releases` endpoint strips the GitHub response to only essential fields:
- `id`, `tag_name`, `name`, `body`, `published_at`
- `assets[]` with `id`, `name`, `browser_download_url`, `size`

This prevents accidental exposure of internal metadata.

### Caching Strategy
- Releases API: 5-minute cache with 10-minute stale-while-revalidate
- Reduces GitHub API calls while keeping releases relatively fresh

## Common Workflow Patterns

### Happy Path
1. User visits `/download`
2. Page fetches releases and detects macOS
3. macOS button auto-selected, download button shows
4. User clicks download, triggers client-side analytics
5. Browser requests `/api/github/download?assetId=X`
6. Server does HEAD request to GitHub, gets signed CDN URL
7. Server returns 302 redirect to CDN URL
8. Browser downloads directly from GitHub's CDN at full speed
9. Browser saves `.dmg` to downloads folder

### Platform Not Available
1. User on Windows visits `/download`
2. No Windows assets in latest release
3. Windows button shows "Coming Soon"
4. User clicks "Join Waitlist on Discord"

## Error Scenarios

| Error | Cause | User Experience |
|-------|-------|-----------------|
| 404 from GitHub | No releases or repo not found | "No Downloads Available" message |
| 401 from GitHub | Invalid token | Error message, logs security warning |
| Network error | API unreachable | "Failed to load releases" with retry option |
| Missing asset | Platform build not uploaded | "Coming Soon" indicator |

## Key Files

- `src/app/download/page.tsx` - Download page UI
- `src/app/api/github/releases/route.ts` - Releases fetch + sanitization
- `src/app/api/github/download/route.ts` - Binary download proxy
- `src/config/desktop-app.ts` - GitHub repo configuration
