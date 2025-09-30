# Non-Gallery Routes Documentation

This document describes routes that are not directly related to the Git Gallery visualization features.

## Authentication & User Management

### `/auth/signin`
**Purpose**: User authentication page
**File**: `src/app/auth/signin/page.tsx`
**Description**: Handles user sign-in through NextAuth.js integration. Supports GitHub OAuth and potentially other providers.

## Configuration Tools

### `/color-palette`
**Purpose**: File type color configuration management
**File**: `src/app/color-palette/page.tsx`
**Features**:
- Manage color schemes for different file extensions
- Discover unmapped file types in repositories
- Submit GitHub issues for missing color mappings
- Contribute to the global color palette configuration

## Downloads

### `/download`
**Purpose**: Desktop application download page
**File**: `src/app/download/page.tsx`
**Description**: Provides platform-specific downloads for the Electron desktop version (now called "Specktor"). Integrates with GitHub releases API to fetch the latest installer versions for Windows, macOS, and Linux. The page auto-detects the user's platform and shows available downloads.

### `/api/updates/[...path]`
**Purpose**: Auto-update proxy for Electron apps
**File**: `src/app/api/updates/[...path]/route.ts`
**Features**:
- Proxies Electron auto-updater requests to GitHub releases
- Handles version check requests (*.yml files) for electron-updater
- Streams binary downloads from GitHub releases
- Supports private repository access with GitHub token
- Includes caching for performance (5 min for version checks, 1 hour for binaries)
- Can be extended with authentication/license checking

**How Auto-Updates Work**:
1. Desktop app checks `/api/updates/{platform}-{arch}/latest.yml` for new versions
2. Proxy fetches latest release from GitHub and returns YAML metadata
3. If update available, app requests binary via `/api/updates/{filename}`
4. Proxy streams the installer from GitHub releases

## System Pages

### `/orbit-success`
**Purpose**: Success confirmation page
**File**: `src/app/orbit-success/page.tsx`
**Description**: Displays success messages after completing certain actions in the application.

## Monitoring & Analytics

### `/live-activity`
**Purpose**: Real-time activity monitoring
**File**: `src/app/live-activity/page.tsx`
**Description**: Displays live activity and usage metrics for the application. May show real-time user interactions or system status.

## Special Tools

### `/specktor`
**Purpose**: Specktor tool interface
**File**: `src/app/specktor/page.tsx`
**Description**: A specialized tool within the application (specific functionality to be determined from implementation details).

## API Routes (Non-Gallery)

### Authentication APIs
- `/api/auth/*` - NextAuth.js endpoints
- `/api/auth/cli/*` - CLI authentication support

### Administrative APIs
- `/api/admin/*` - Administrative functions
- `/api/feedback/*` - User feedback collection
- `/api/waitlist` - Waitlist management system

### Configuration APIs
- `/api/config/color-palette` - Color configuration CRUD operations

### Real-time Features
- `/api/orbit/signal/*` - Live activity signaling
- `/api/sync/rooms/*` - Real-time collaboration rooms

## Notes

These routes provide supporting functionality for the main Git Gallery application but are not directly involved in:
- Repository visualization
- Code city generation
- Git history animation
- PR/release comparison
- Gallery browsing

They handle auxiliary concerns like user management, configuration, downloads, and system monitoring.