# OAuth Implementation Review: Electron Spec vs Actual Implementation

## Executive Summary

The Electron OAuth verification spec makes several assumptions about our implementation that are **partially correct**. We already have email verification support, but there's a **critical bug** in the CLI flow that prevents the Electron app from receiving tokens after email verification.

## Storage Architecture

### Spec Assumption
```javascript
// Redis-based storage
redis.set(`auth:${state}`, JSON.stringify(tokens), 'EX', 300);
redis.set(`auth:pending:${state}`, JSON.stringify({...}), 'EX', 600);
```

### Actual Implementation
```javascript
// In-memory Map (global.cliAuthSessions)
global.cliAuthSessions.set(state, {
  code_challenge,
  created_at: Date.now(),
  provider: "workos",
  return_url,
  // Later: code, pending_auth_token, email
});
```

**Status:** ✅ Functionally equivalent
- We use in-memory storage instead of Redis
- Cleanup happens via `setInterval` every 60 seconds (removes sessions older than 5 minutes)
- Both approaches work for the OAuth flow

**Consideration:** In-memory storage is lost on server restart, but this is acceptable for temporary auth sessions.

---

## Flow Comparison

### 1. `/api/auth/workos/start` - Initialize Auth

**Spec Expectation:** ✅ MATCHES
- Receives `code_challenge` and `state`
- Returns `auth_url`
- Stores session data

**Actual Implementation:** ✅ CORRECT (src/app/api/auth/workos/start/route.ts:22-97)

---

### 2. `/api/auth/workos/callback` - Handle OAuth Callback

This is where things diverge significantly.

#### Web Flow (has `return_url`)

**Spec Expectation:**
```javascript
if (requiresVerification) {
  // Store pending auth data
  await redis.set(`auth:pending:${state}`, ...);
  // Redirect to /auth/verify?state=xyz
  return res.redirect(`/auth/verify?state=${state}`);
}
// Otherwise: store tokens and redirect
await redis.set(`auth:${state}`, JSON.stringify(tokens));
```

**Actual Implementation:** ✅ CORRECT (src/app/api/auth/workos/callback/route.ts:162-270)
```javascript
try {
  authResponse = await workos.userManagement.authenticateWithCode({...});
} catch (authError) {
  if (authError?.rawData?.code === "email_verification_required") {
    session.pending_auth_token = authError.rawData.pending_authentication_token;
    session.email = authError.rawData.email;
    global.cliAuthSessions.set(state, session);

    const verifyUrl = new URL(session.return_url);
    verifyUrl.pathname = "/auth/verify-email";
    return NextResponse.redirect(verifyUrl.toString());
  }
}
// Success: set cookie and redirect
```

**Status:** ✅ Web flow handles email verification correctly

#### CLI Flow (no `return_url`)

**Spec Expectation:** Should check for email verification and store pending data

**Actual Implementation:** ❌ **CRITICAL BUG** (src/app/api/auth/workos/callback/route.ts:273-328)
```javascript
// Store the code with the session
session.code = code;
global.cliAuthSessions.set(state, session);

// For CLI flow, return success page
return new NextResponse(`<!DOCTYPE html>...Authentication Successful!...`);
```

**Problem:**
1. We store the code but **never check if email verification is required**
2. We immediately show "Authentication Successful" even if verification is pending
3. When `/api/auth/workos/token` polls and tries to exchange the code, it will fail if email isn't verified
4. The user is stuck because they never see a verification prompt

---

### 3. `/api/auth/workos/token` - Poll for Tokens

**Spec Expectation:**
```javascript
// Retrieve tokens from Redis (already exchanged)
const tokens = await redis.get(`auth:${state}`);
if (!tokens) {
  return res.status(400).json({ error: 'Authorization pending' });
}
return res.json(JSON.parse(tokens));
```

**Actual Implementation:** ❌ **DIFFERENT PATTERN** (src/app/api/auth/workos/token/route.ts:5-189)
```javascript
const session = global.cliAuthSessions.get(state);
if (!session || !session.code) {
  return NextResponse.json({ error: "authorization_pending" }, { status: 400 });
}

// EXCHANGES THE CODE HERE (not pre-exchanged)
const authResponse = await workos.userManagement.authenticateWithCode({
  clientId: process.env.WORKOS_CLIENT_ID,
  code: session.code,
});

// Fetch GitHub user data and return tokens
```

**Status:** ❌ **MAJOR ARCHITECTURAL DIFFERENCE**
- Spec assumes tokens are pre-exchanged and stored
- Our implementation exchanges the code **on-demand** when polled
- This will fail if email verification is required because the code can't be exchanged until verification completes

---

### 4. `/api/auth/workos/verify` - Complete Verification

**Spec Expectation:**
```javascript
// Get pending data
const pendingData = await redis.get(`auth:pending:${state}`);

// Verify code with WorkOS
await workos.verifyEmailCode({ userId, code });

// Get tokens and store them
const tokens = await workos.getTokensWithCode(oauthCode);
await redis.set(`auth:${state}`, JSON.stringify(tokenData));
```

**Actual Implementation:** ⚠️ **WORKS BUT INCOMPLETE** (src/app/api/auth/workos/verify/route.ts:8-92)
```javascript
const session = global.cliAuthSessions.get(state);
if (!session.pending_auth_token) {
  return NextResponse.json({ error: "No pending authentication token found." });
}

// Complete verification with WorkOS
const authResponse = await workos.userManagement.authenticateWithEmailVerification({
  clientId: process.env.WORKOS_CLIENT_ID!,
  code: verificationCode,
  pendingAuthenticationToken: session.pending_auth_token,
});

// Clean up session
global.cliAuthSessions.delete(state);

// Return user data (designed for web flow)
return NextResponse.json({
  success: true,
  user: {...},
  sessionData: userData,
  return_url: session.return_url,
});
```

**Status:** ⚠️ **WORKS FOR WEB, MISSING CLI SUPPORT**
- Correctly verifies email using WorkOS API
- **Problem:** Deletes the session after verification
- **Problem:** Doesn't store tokens in a way that `/token` endpoint can retrieve them
- **Result:** CLI polling will fail because session is gone

---

## The Critical Bug: CLI Email Verification Flow

### Current Broken Flow

```
1. Electron: POST /start → gets auth_url ✅
2. User: Opens browser, authenticates ✅
3. Callback: Receives code, stores it, shows "Success!" ❌ (no verification check)
4. Electron: POST /token → tries to exchange code ❌ (fails if verification required)
5. User: Never sees verification prompt ❌
6. Electron: Times out after 5 minutes ❌
```

### What Should Happen

```
1. Electron: POST /start → gets auth_url ✅
2. User: Opens browser, authenticates ✅
3. Callback: Detects verification required, shows verification page ✅
4. User: Enters verification code ✅
5. Verify endpoint: Stores exchanged tokens keyed by state ✅
6. Electron: POST /token → retrieves pre-exchanged tokens ✅
```

---

## Required Changes

### Change 1: Fix `/api/auth/workos/callback` - CLI Flow
**File:** `src/app/api/auth/workos/callback/route.ts:273-328`

**Current:**
```javascript
// Store the code with the session
session.code = code;
global.cliAuthSessions.set(state, session);

// Return success page
return new NextResponse(`...Authentication Successful!...`);
```

**Required:**
```javascript
// Try to exchange code (will throw if verification required)
try {
  const authResponse = await workos.userManagement.authenticateWithCode({
    clientId: process.env.WORKOS_CLIENT_ID!,
    code: code,
  });

  // Success - store code for later token exchange
  session.code = code;
  global.cliAuthSessions.set(state, session);

  return new NextResponse(`...Authentication Successful!...`);

} catch (authError: any) {
  // Check if email verification is required
  if (
    authError?.rawData?.code === "email_verification_required" ||
    authError?.message?.includes("Email ownership must be verified")
  ) {
    console.log("[WorkOS] CLI flow - Email verification required");

    // Store pending auth token
    session.pending_auth_token = authError.rawData.pending_authentication_token;
    session.email = authError.rawData.email;
    global.cliAuthSessions.set(state, session);

    // Show verification page (NOT success page)
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verification Required</title>
          <meta http-equiv="refresh" content="0;url=/auth/verify-email?state=${state}&email=${encodeURIComponent(authError.rawData.email)}">
        </head>
        <body>
          <p>Redirecting to email verification...</p>
        </body>
      </html>
    `, {
      status: 302,
      headers: { 'Location': `/auth/verify-email?state=${state}&email=${encodeURIComponent(authError.rawData.email)}` }
    });
  }

  // Re-throw other errors
  throw authError;
}
```

### Change 2: Fix `/api/auth/workos/verify` - CLI Support
**File:** `src/app/api/auth/workos/verify/route.ts:8-92`

**Current:**
```javascript
// Clean up the session
global.cliAuthSessions.delete(state);

// Return session data (cookie will be set on the client)
return NextResponse.json({
  success: true,
  user: {...},
  sessionData: userData,
  return_url: session.return_url,
});
```

**Required:**
```javascript
// CRITICAL: Store tokens for CLI polling
// Extract GitHub access token (same logic as token endpoint)
let githubAccessToken: string | null = null;
if ((authResponse as any).impersonator?.accessToken) {
  githubAccessToken = (authResponse as any).impersonator.accessToken;
} else if ((authResponse as any).oauthTokens?.accessToken) {
  githubAccessToken = (authResponse as any).oauthTokens.accessToken;
}

// Fetch GitHub user data if available
let githubUserData = null;
if (githubAccessToken) {
  try {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubAccessToken}`,
        Accept: "application/json",
      },
    });
    if (userResponse.ok) {
      githubUserData = await userResponse.json();
    }
  } catch (error) {
    console.error("[WorkOS] Error fetching GitHub user data:", error);
  }
}

// Store full token data in session for CLI polling
session.tokens = {
  access_token: githubAccessToken || authResponse.accessToken,
  workos_access_token: authResponse.accessToken,
  refresh_token: authResponse.refreshToken,
  github_access_token: githubAccessToken,
  expires_in: 3600,
  user: githubUserData ? {
    id: githubUserData.id,
    email: githubUserData.email || authResponse.user.email,
    login: githubUserData.login,
    name: githubUserData.name || authResponse.user.email,
    avatar_url: githubUserData.avatar_url,
  } : {
    id: authResponse.user.id,
    email: authResponse.user.email,
    login: authResponse.user.email?.split("@")[0] || authResponse.user.id,
    name: authResponse.user.email,
    avatar_url: userProfile.profilePictureUrl || null,
  },
};

// DO NOT delete session - keep it for CLI polling
global.cliAuthSessions.set(state, session);

// Return appropriate response based on flow type
if (session.return_url) {
  // Web flow - return session data
  return NextResponse.json({
    success: true,
    user: session.tokens.user,
    sessionData: userData,
    return_url: session.return_url,
  });
} else {
  // CLI flow - return success (tokens will be polled)
  return NextResponse.json({
    success: true,
    message: "Email verified. You can close this window and return to your terminal.",
  });
}
```

### Change 3: Update `/api/auth/workos/token` - Use Pre-Exchanged Tokens
**File:** `src/app/api/auth/workos/token/route.ts:5-189`

**Current:**
```javascript
if (!session.code) {
  return NextResponse.json({ error: "authorization_pending" }, { status: 400 });
}

// Exchange code
const authResponse = await workos.userManagement.authenticateWithCode({...});
```

**Required:**
```javascript
// Check if tokens are already available (after verification)
if (session.tokens) {
  console.log("[WorkOS] Returning pre-exchanged tokens for state:", state);

  // Clean up session
  global.cliAuthSessions.delete(state);

  return NextResponse.json(session.tokens);
}

// If no tokens but have code, exchange it (existing user flow)
if (!session.code) {
  return NextResponse.json({ error: "authorization_pending" }, { status: 400 });
}

// Rest of existing exchange logic...
const authResponse = await workos.userManagement.authenticateWithCode({...});
```

---

## Testing Checklist

### Existing User (No Verification)
- [ ] CLI flow: User authenticates → tokens received immediately
- [ ] Web flow: User authenticates → redirected to return_url with cookie

### New User (Email Verification Required)
- [ ] CLI flow: User authenticates → sees verification page
- [ ] User enters code → verification succeeds
- [ ] Electron app polls `/token` → receives tokens
- [ ] Web flow: User authenticates → sees verification page → redirected after verification

### Error Cases
- [ ] Invalid verification code → shows error, allows retry
- [ ] Expired state → shows appropriate error
- [ ] Session cleanup works correctly (5 min timeout)

---

## WorkOS API Methods Used

Our implementation correctly uses:
- `workos.userManagement.getAuthorizationUrl()` ✅
- `workos.userManagement.authenticateWithCode()` ✅
- `workos.userManagement.authenticateWithEmailVerification()` ✅
- `workos.userManagement.getUser()` ✅

The spec's pseudo-code methods don't exist in WorkOS SDK:
- ❌ `workos.verifyEmailCode()` - Not a real method
- ❌ `workos.getTokensWithCode()` - Not a real method
- ❌ `workos.resendVerificationEmail()` - Not a real method

**We use the correct WorkOS SDK methods.**

---

## Questions for Electron Team

1. **Resend Code Feature:** The spec includes a resend endpoint. WorkOS may handle this automatically. Do we need to implement `/api/auth/workos/resend`?

2. **Session Cleanup:** After tokens are retrieved via `/token`, should we keep or delete the session?

3. **Error Handling:** If email verification fails multiple times, should we invalidate the session?

4. **Token Expiry:** The spec mentions 5-minute expiry for tokens in Redis. Our sessions expire after 5 minutes. Is this acceptable?

---

## Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Storage (Redis vs In-Memory) | ✅ OK | Functionally equivalent |
| `/start` endpoint | ✅ OK | Matches spec |
| `/callback` - Web flow | ✅ OK | Email verification works |
| `/callback` - CLI flow | ❌ **BROKEN** | Doesn't check verification |
| `/token` endpoint | ⚠️ **NEEDS UPDATE** | Should use pre-exchanged tokens |
| `/verify` endpoint | ⚠️ **NEEDS UPDATE** | Doesn't store tokens for CLI |
| Verification page | ✅ OK | Works correctly |

**Critical Fix Required:** The CLI flow needs to detect email verification requirements and store pre-exchanged tokens so the Electron app can retrieve them via polling.
