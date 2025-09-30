# Electron Authentication Documentation

## Overview

This document describes the authentication system for the Specktor Electron desktop application. The authentication flow uses OAuth 2.0 with PKCE (Proof Key for Code Exchange) to securely authenticate users with GitHub without exposing client secrets.

## Architecture

### Why PKCE?

PKCE is essential for desktop applications because:
- Desktop apps cannot securely store client secrets
- Native apps can be decompiled, exposing any embedded secrets
- PKCE eliminates the need for a client secret by using cryptographic proof

### Authentication Flow

```
┌─────────────┐                                  ┌─────────────┐
│   Electron  │                                  │   Landing   │
│     App     │                                  │    Page     │
└──────┬──────┘                                  └──────┬──────┘
       │                                                │
       │ 1. Generate code_verifier + code_challenge    │
       │                                                │
       │ 2. POST /api/auth/cli/start                   │
       │    { code_challenge, state }                  │
       ├───────────────────────────────────────────────>
       │                                                │
       │ 3. Return auth_url                            │
       │    (GitHub OAuth with state)                  │
       <───────────────────────────────────────────────┤
       │                                                │
       │ 4. Open browser to auth_url                   │
       │                                                │
       │         ┌──────────────┐                      │
       │    ────>│   GitHub     │                      │
       │         │   OAuth      │                      │
       │         └──────┬───────┘                      │
       │                │                               │
       │         5. User authorizes                    │
       │                │                               │
       │         6. Redirect to callback               │
       │                └──────────────────────────────>
       │                                                │
       │                      7. GET /api/auth/cli/callback
       │                         ?code=xxx&state=yyy   │
       │                                                │
       │                      8. Store code, show success page
       │                                                │
       │ 9. Poll POST /api/auth/cli/token              │
       │    { state, code_verifier }                   │
       ├───────────────────────────────────────────────>
       │                                                │
       │                      10. Verify PKCE challenge│
       │                      11. Exchange code for token with GitHub
       │                                                │
       │ 12. Return access_token + user info           │
       <───────────────────────────────────────────────┤
       │                                                │
       │ 13. Authenticated! Use token for API calls    │
       │                                                │
```

## API Endpoints

### 1. Start Authentication

**Endpoint**: `POST /api/auth/cli/start`

**Purpose**: Initiates the OAuth flow and stores the PKCE challenge

**Request Body**:
```json
{
  "code_challenge": "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  "state": "unique-random-state-string",
  "force_reauth": false
}
```

**Response**:
```json
{
  "auth_url": "https://github.com/login/oauth/authorize?client_id=...&state=...",
  "expires_in": 300
}
```

**Parameters**:
- `code_challenge` (required): SHA256 hash of code_verifier, base64url encoded
- `state` (required): Random string to prevent CSRF attacks
- `force_reauth` (optional): Force repository grant screen

**Environment Variables**:
- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `NEXTAUTH_URL` - Base URL for callback (e.g., `https://principal-ade.com`)

**File**: `src/app/api/auth/cli/start/route.ts`

---

### 2. OAuth Callback

**Endpoint**: `GET /api/auth/cli/callback`

**Purpose**: Handles GitHub OAuth redirect and stores authorization code

**Query Parameters**:
- `code`: Authorization code from GitHub
- `state`: State parameter for validation
- `error`: Error code (if auth failed)
- `error_description`: Error details

**Response**: HTML page with:
- ✅ Success message (auto-closes in 3s)
- ❌ Error message (with details)
- ⏱️ Session expired message

**Flow**:
1. Validates state parameter
2. Stores authorization code in session
3. Shows user-friendly success page
4. Electron app polls for completion

**Environment Variables**:
- None (uses global session store)

**File**: `src/app/api/auth/cli/callback/route.ts`

---

### 3. Token Exchange

**Endpoint**: `POST /api/auth/cli/token`

**Purpose**: Exchanges authorization code for access token using PKCE verification

**Request Body**:
```json
{
  "state": "unique-random-state-string",
  "code_verifier": "random-43-to-128-character-string"
}
```

**Response**:
```json
{
  "access_token": "gho_xxxxxxxxxxxx",
  "token_type": "Bearer",
  "scope": "read:user user:email repo",
  "user": {
    "login": "username",
    "email": "user@example.com",
    "name": "Full Name",
    "id": 12345
  }
}
```

**PKCE Verification**:
```javascript
// Server verifies:
SHA256(code_verifier) === code_challenge
```

**Error Responses**:
- `authorization_pending`: User hasn't completed auth yet (poll again)
- `invalid_grant`: PKCE verification failed
- `token_exchange_failed`: GitHub token exchange failed

**Environment Variables**:
- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret
- `NEXTAUTH_URL` - Base URL for callback

**File**: `src/app/api/auth/cli/token/route.ts`

---

### 4. Room Token (Collaboration)

**Endpoint**: `POST /api/auth/cli/room-token`

**Purpose**: Generates JWT tokens for real-time collaboration rooms

**Request Body**:
```json
{
  "repository": "owner/repo",
  "branch": "main",
  "github_token": "gho_xxxxxxxxxxxx",
  "device_id": "unique-device-identifier"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "repo:owner/repo:main",
  "permissions": {
    "canJoin": true,
    "canEdit": true,
    "canAdmin": false
  },
  "user": {
    "login": "username",
    "email": "user@example.com",
    "name": "Full Name",
    "avatar_url": "https://..."
  }
}
```

**Features**:
- Verifies GitHub token validity
- Checks repository access permissions
- Generates short-lived JWT (1 hour)
- Includes refresh token (7 days)
- Maps GitHub permissions to room permissions

**Environment Variables**:
- `ROOM_TOKEN_SECRET` - Secret for JWT signing (generate with `openssl rand -base64 32`)

**File**: `src/app/api/auth/cli/room-token/route.ts`

**Verify Token**:
```bash
# GET /api/auth/cli/room-token
# Authorization: Bearer <token>
```

---

## Environment Variables

### Required Variables

Create these in your deployment environment (AWS Secrets Manager, Vercel env, etc.):

```bash
# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_oauth_app_secret

# NextAuth Configuration
NEXTAUTH_URL=https://principal-ade.com
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Room Collaboration (if using sync features)
ROOM_TOKEN_SECRET=<generate with: openssl rand -base64 32>
```

### Setting Up GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in details:
   - **Application name**: Specktor Desktop
   - **Homepage URL**: `https://principal-ade.com`
   - **Authorization callback URL**: `https://principal-ade.com/api/auth/cli/callback`
4. Click "Register application"
5. Copy the **Client ID** → `GITHUB_CLIENT_ID`
6. Click "Generate a new client secret"
7. Copy the **Client Secret** → `GITHUB_CLIENT_SECRET`

### OAuth Scopes

The authentication flow requests these GitHub scopes:
- `read:user` - Read user profile information
- `user:email` - Read user email addresses
- `repo` - Full repository access (for collaboration features)

## Security Considerations

### PKCE Implementation

1. **Code Verifier**:
   - Random 43-128 character string
   - Base64url encoded
   - Generated client-side, never sent to server initially

2. **Code Challenge**:
   - SHA256 hash of code_verifier
   - Base64url encoded
   - Sent to server in start request

3. **Verification**:
   - Server stores code_challenge
   - Client later sends code_verifier
   - Server verifies: `SHA256(code_verifier) === code_challenge`

### Session Storage

**Current Implementation** (Development):
- In-memory global Map
- 5-minute expiration
- Auto-cleanup every 60 seconds

**Production Recommendation**:
```javascript
// Replace global.cliAuthSessions with:
// - Redis for multi-instance deployments
// - DynamoDB for serverless
// - PostgreSQL for traditional hosting
```

### Security Best Practices

✅ **DO**:
- Generate strong random values for state and code_verifier
- Use HTTPS for all endpoints
- Implement rate limiting on auth endpoints
- Rotate secrets regularly (90 days)
- Use short-lived JWT tokens (1 hour)
- Store tokens securely in Electron (electron-store with encryption)

❌ **DON'T**:
- Store client secrets in desktop app code
- Expose ROOM_TOKEN_SECRET publicly
- Reuse state values
- Log tokens or secrets
- Allow long-lived sessions without refresh

## Electron Integration Example

```typescript
// Electron app authentication flow
import crypto from 'crypto';

class AuthService {
  async authenticate() {
    // 1. Generate PKCE values
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = crypto.randomBytes(32).toString('hex');

    // 2. Start auth flow
    const { auth_url } = await fetch('https://principal-ade.com/api/auth/cli/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code_challenge: codeChallenge, state })
    }).then(r => r.json());

    // 3. Open browser
    await shell.openExternal(auth_url);

    // 4. Poll for completion
    const token = await this.pollForToken(state, codeVerifier);

    // 5. Store token securely
    await this.storeToken(token);

    return token;
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    return crypto.createHash('sha256')
      .update(verifier)
      .digest('base64url');
  }

  private async pollForToken(state: string, codeVerifier: string) {
    for (let i = 0; i < 60; i++) { // Poll for 60 seconds
      try {
        const response = await fetch('https://principal-ade.com/api/auth/cli/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state, code_verifier: codeVerifier })
        });

        if (response.ok) {
          return await response.json();
        }

        const error = await response.json();
        if (error.error !== 'authorization_pending') {
          throw new Error(error.error);
        }
      } catch (err) {
        // Continue polling
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
    }

    throw new Error('Authentication timeout');
  }
}
```

## Troubleshooting

### Authentication Fails

**Symptom**: "Invalid signature parameters" or callback errors

**Solutions**:
1. Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly
2. Check OAuth callback URL matches: `https://principal-ade.com/api/auth/cli/callback`
3. Ensure `NEXTAUTH_URL` is set to production domain

### Session Expired

**Symptom**: "Session expired" message in callback

**Solutions**:
1. Sessions expire after 5 minutes
2. Reduce polling interval in Electron app
3. Consider using Redis for persistent sessions in production

### PKCE Verification Failed

**Symptom**: "invalid_grant" error from token endpoint

**Solutions**:
1. Verify code_verifier matches original value
2. Check SHA256 hashing implementation
3. Ensure base64url encoding (not standard base64)

### Token Exchange Failed

**Symptom**: "token_exchange_failed" error

**Solutions**:
1. Verify GitHub OAuth credentials are correct
2. Check authorization code hasn't been used already (they're single-use)
3. Ensure code hasn't expired (10 minutes from GitHub)

## Testing

### Local Development

```bash
# 1. Set environment variables
export GITHUB_CLIENT_ID=your_dev_client_id
export GITHUB_CLIENT_SECRET=your_dev_client_secret
export NEXTAUTH_URL=http://localhost:3000
export NEXTAUTH_SECRET=$(openssl rand -base64 32)
export ROOM_TOKEN_SECRET=$(openssl rand -base64 32)

# 2. Start dev server
npm run dev

# 3. Test with curl or Electron app
```

### Manual Testing

```bash
# 1. Start auth flow
curl -X POST http://localhost:3000/api/auth/cli/start \
  -H "Content-Type: application/json" \
  -d '{
    "code_challenge": "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    "state": "test-state-123"
  }'

# 2. Open returned auth_url in browser
# 3. Complete GitHub authorization
# 4. Poll for token

curl -X POST http://localhost:3000/api/auth/cli/token \
  -H "Content-Type: application/json" \
  -d '{
    "state": "test-state-123",
    "code_verifier": "test-verifier-that-matches-challenge"
  }'
```

## Related Documentation

- [ELECTRON_VERSION_MANAGER.md](./ELECTRON_VERSION_MANAGER.md) - Auto-update system
- [apprunner.yaml](./apprunner.yaml) - Deployment configuration
- [.env.example](./.env.example) - Environment variable template

## Support

For issues or questions:
1. Check server logs for specific errors
2. Verify all environment variables are set
3. Test with manual curl commands
4. Open an issue on GitHub with logs (redact secrets!)
