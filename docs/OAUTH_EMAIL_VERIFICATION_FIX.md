# OAuth Email Verification Fix for Electron App

## Summary

Fixed the critical bug where Electron app users requiring email verification would get stuck during authentication. The CLI OAuth flow now properly detects email verification requirements and stores pre-exchanged tokens for the Electron app to poll.

## Changes Made

### 1. Updated `/api/auth/workos/callback` (CLI Flow)
**File:** `src/app/api/auth/workos/callback/route.ts:273-425`

**Problem:**
- CLI flow stored OAuth code and immediately showed "Success!" without checking verification requirements
- New users requiring email verification never saw the verification prompt

**Fix:**
- Now attempts to authenticate with WorkOS immediately in the callback
- Detects `email_verification_required` error
- Stores `pending_auth_token` in session
- Redirects to verification page instead of showing success

**Code Flow:**
```javascript
// Try to exchange code immediately
try {
  await workos.userManagement.authenticateWithCode({ code });
  // Success → Show success page
} catch (authError) {
  if (authError.code === "email_verification_required") {
    // Store pending token
    session.pending_auth_token = authError.rawData.pending_authentication_token;
    // Redirect to /auth/verify-email?state=xyz
  }
}
```

---

### 2. Updated `/api/auth/workos/verify`
**File:** `src/app/api/auth/workos/verify/route.ts:45-178`

**Problem:**
- After verification, deleted the session immediately
- Didn't store tokens in a format the Electron app could retrieve
- Only worked for web flows (with `return_url`)

**Fix:**
- Extracts GitHub access token from WorkOS response
- Fetches real GitHub user data using the token
- Stores complete token object in `session.tokens`
- **Keeps** session alive for CLI polling (doesn't delete)
- Returns different responses for web vs CLI flows

**Token Structure:**
```javascript
session.tokens = {
  access_token: githubAccessToken || workosAccessToken,
  workos_access_token: workosAccessToken,
  refresh_token: refreshToken,
  github_access_token: githubAccessToken,
  expires_in: 3600,
  user: {
    id: githubUser.id,
    email: githubUser.email,
    login: githubUser.login,
    name: githubUser.name,
    avatar_url: githubUser.avatar_url,
  },
  // ... more fields
};
```

---

### 3. Updated `/api/auth/workos/token`
**File:** `src/app/api/auth/workos/token/route.ts:36-79`

**Problem:**
- Always tried to exchange OAuth code on-demand
- Failed if email verification was required but not completed

**Fix:**
- **First** checks if `session.tokens` exists (pre-exchanged after verification)
- If tokens exist, verifies PKCE and returns them immediately
- If no tokens, falls back to existing code exchange logic (for existing users)

**Code Flow:**
```javascript
// Check for pre-exchanged tokens first
if (session.tokens) {
  // Verify PKCE
  // Return pre-exchanged tokens
  // Clean up session
}

// Fallback: exchange code on-demand (existing user flow)
if (session.code) {
  // Existing logic...
}
```

---

### 4. Updated Type Definition
**File:** `src/types/auth-session.d.ts:13-29`

**Added:**
- `tokens?` property to `AuthSession` interface
- Complete type definition for token object structure

---

## Authentication Flow Comparison

### Before (Broken for New Users)

```
Electron App                    Landing Page
     │                               │
     ├─ POST /start ────────────────>│
     │<────── auth_url ───────────────┤
     │                               │
     │  User authenticates in browser│
     │                               │
     │                           /callback
     │                               │ ❌ Shows "Success!"
     │                               │ ❌ Doesn't check verification
     │                               │
     ├─ POST /token ────────────────>│
     │                               │ ❌ Tries to exchange code
     │                               │ ❌ Fails - verification required
     │<──── error ────────────────────┤
     │                               │
     │  Times out after 5 min ⏱️
```

### After (Fixed)

```
Electron App                    Landing Page
     │                               │
     ├─ POST /start ────────────────>│
     │<────── auth_url ───────────────┤
     │                               │
     │  User authenticates in browser│
     │                               │
     │                           /callback
     │                               │ ✅ Detects verification required
     │                               │ ✅ Redirects to verify page
     │                               │
     │                         /auth/verify-email
     │                               │
     │  User enters code             │
     │                               │
     │                      POST /verify
     │                               │ ✅ Verifies code
     │                               │ ✅ Exchanges for tokens
     │                               │ ✅ Stores in session.tokens
     │                               │
     ├─ POST /token ────────────────>│
     │                               │ ✅ Finds session.tokens
     │<────── tokens ─────────────────┤ ✅ Returns pre-exchanged tokens
     │                               │
     │  ✅ Authentication complete!
```

---

## Testing Instructions

### Test Case 1: Existing User (No Verification Required)

**Expected Behavior:**
1. User authenticates via GitHub/WorkOS
2. Browser shows "Authentication Successful!"
3. Electron app polls `/token` → receives tokens immediately
4. No verification page shown

**Test Steps:**
```bash
# From Electron app or CLI
1. Initiate auth with existing user credentials
2. Complete OAuth in browser
3. Verify tokens received within 5 seconds
```

---

### Test Case 2: New User (Email Verification Required)

**Expected Behavior:**
1. User authenticates via GitHub/WorkOS
2. Browser redirects to verification page (`/auth/verify-email`)
3. User receives verification email
4. User enters 6-digit code
5. Verification succeeds → "Email verified successfully"
6. Electron app polls `/token` → receives tokens
7. Authentication completes

**Test Steps:**
```bash
# From Electron app or CLI
1. Initiate auth with NEW user (never logged in before)
2. Complete OAuth in browser
3. Verify redirect to /auth/verify-email page
4. Check email for verification code
5. Enter code in browser
6. Verify "Email verified successfully" message
7. Check Electron app receives tokens
```

---

### Test Case 3: Invalid Verification Code

**Expected Behavior:**
1. User enters wrong code
2. Error message: "Verification failed. Please check the code and try again."
3. User can retry with correct code
4. Eventually succeeds

---

### Test Case 4: Session Expiry

**Expected Behavior:**
1. User takes >5 minutes to verify
2. Session expires
3. Error: "Session expired. Please start the login process again."
4. User must restart authentication flow

---

## Debugging

### Enable Detailed Logging

All endpoints now include detailed console logs:

```javascript
// Callback endpoint
console.log('[WorkOS] CLI flow - Email verification required:', { email, hasPendingToken });

// Verify endpoint
console.log('[WorkOS Verify] GitHub token available:', !!githubAccessToken);
console.log('[WorkOS Verify] Tokens stored for state:', state);

// Token endpoint
console.log('[WorkOS] Returning pre-exchanged tokens for state:', state);
```

### Check Session State

You can inspect the session state at any point:

```javascript
// In Node.js console or debug endpoint
global.cliAuthSessions.get('your-state-value');
```

Expected structure after verification:
```javascript
{
  code_challenge: "abc123...",
  created_at: 1234567890,
  provider: "workos",
  pending_auth_token: "pat_...",  // Only during verification
  email: "user@example.com",      // Only during verification
  tokens: {                       // Only after verification completes
    access_token: "...",
    user: { ... },
    // ... full token object
  }
}
```

---

## WorkOS Dashboard Configuration

Ensure the following settings are enabled in WorkOS Dashboard:

1. **GitHub OAuth Provider** is configured
2. **"Return GitHub OAuth tokens"** is enabled
3. **Email verification** is set up for your organization
4. **Redirect URI** includes: `https://your-domain.com/api/auth/workos/callback`

---

## Known Limitations

1. **In-Memory Storage:** Sessions are stored in memory (not Redis). Server restart will lose pending sessions. This is acceptable for temporary auth flows (5-minute TTL).

2. **No Resend Code Endpoint:** The spec includes a `/resend` endpoint. WorkOS may handle this automatically. If needed, we can add it later.

3. **Single Verification Attempt:** Users can retry verification multiple times, but there's no rate limiting on verification attempts.

---

## Related Files

- `/Users/griever/Developer/landing-page/docs/OAUTH_IMPLEMENTATION_REVIEW.md` - Detailed analysis
- `/Users/griever/Developer/electron-app/docs/ELECTRON_OAUTH_VERIFICATION_SPEC.md` - Original spec

---

## Questions or Issues?

If you encounter problems:
1. Check browser console and server logs
2. Verify WorkOS configuration
3. Test with both existing and new users
4. Check that emails are being delivered (spam folder!)
