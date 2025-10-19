# WorkOS Setup Guide

## Prerequisites
- [ ] WorkOS account created
- [ ] GitHub account with admin access

## Step-by-Step Setup

### 1. Create GitHub OAuth App for WorkOS

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"** (or **"New GitHub App"** if you prefer)
3. Fill in the details:

```
Application name: Your App Name (WorkOS)
Homepage URL: https://your-domain.com
Application description: Authentication via WorkOS
Authorization callback URL: https://api.workos.com/sso/oauth/github/callback
```

⚠️ **Critical**: The callback URL MUST be `https://api.workos.com/sso/oauth/github/callback`

4. Click **"Register application"**
5. Click **"Generate a new client secret"**
6. **Copy both**:
   - Client ID
   - Client Secret (you'll only see this once!)

### 2. Configure WorkOS Dashboard

1. Go to [WorkOS Dashboard](https://dashboard.workos.com)
2. Navigate to **Authentication** → **Configure**
3. Find **GitHub** in the list of providers
4. Click **Configure** or **Enable**
5. Paste your GitHub OAuth credentials:
   - **Client ID**: `<your-github-client-id>`
   - **Client Secret**: `<your-github-client-secret>`
6. Click **Save**

### 3. Get WorkOS Credentials

1. In WorkOS Dashboard, go to **API Keys**
2. Copy your:
   - **Client ID** (starts with `client_`)
   - **API Key** (starts with `sk_test_` or `sk_live_`)

### 4. Configure Your Application

Add to your `.env` file:

```bash
# ======================================
# WorkOS Configuration
# ======================================
WORKOS_API_KEY=sk_test_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here

# ======================================
# Legacy GitHub OAuth (keep during migration)
# ======================================
GITHUB_CLIENT_ID=your_legacy_github_client_id
GITHUB_CLIENT_SECRET=your_legacy_github_secret

# ======================================
# Provider Selection
# ======================================
AUTH_PROVIDER=workos
```

### 5. Configure Redirect URIs in WorkOS

1. In WorkOS Dashboard, go to **Redirects**
2. Add your application's callback URL:

**Development:**
```
http://localhost:3000/api/auth/workos/callback
```

**Production:**
```
https://your-domain.com/api/auth/workos/callback
```

### 6. Test the Integration

```bash
# Start your application
npm run dev

# Test the auth flow
curl -X POST http://localhost:3000/api/auth/workos/start \
  -H "Content-Type: application/json" \
  -d '{
    "code_challenge": "test_challenge_123",
    "state": "test_state_123"
  }'
```

You should get back an `auth_url` that starts with WorkOS's domain.

## Comparison: GitHub OAuth Setup

### Direct GitHub OAuth (Current/Legacy)
```
Your App → GitHub OAuth → Your Callback
           ↑
    Uses YOUR GitHub OAuth App
    Callback: https://your-domain.com/api/auth/cli/callback
```

### WorkOS + GitHub (New)
```
Your App → WorkOS → GitHub OAuth → WorkOS → Your App
                    ↑
            Uses WORKOS's GitHub OAuth App
            Callback: https://api.workos.com/sso/oauth/github/callback
```

## Do You Need TWO GitHub OAuth Apps?

**Option 1: Use Two Separate Apps (Recommended during migration)**
- ✅ GitHub OAuth App #1: For legacy direct auth
- ✅ GitHub OAuth App #2: For WorkOS auth
- Benefit: Clean separation, easy rollback

**Option 2: Reuse Same App (Possible but tricky)**
- You CAN use the same GitHub OAuth app
- But you need to add BOTH callback URLs:
  ```
  https://your-domain.com/api/auth/cli/callback
  https://api.workos.com/sso/oauth/github/callback
  ```
- Risk: If something breaks, both systems affected

**My Recommendation**: Use two separate GitHub OAuth apps during migration.

## Scopes Configuration

Make sure your GitHub OAuth app (the one for WorkOS) has these scopes:

```
read:user
user:email
repo (if you need repository access)
```

Configure these in:
1. GitHub OAuth App settings, OR
2. WorkOS Dashboard → Authentication → GitHub → Scopes

## Verification Checklist

Once set up, verify:

- [ ] WorkOS API Key starts with `sk_test_` or `sk_live_`
- [ ] WorkOS Client ID starts with `client_`
- [ ] GitHub OAuth app callback URL is `https://api.workos.com/sso/oauth/github/callback`
- [ ] WorkOS Redirect URI includes your app's callback
- [ ] Environment variables are set in `.env`
- [ ] Can access `/api/auth/workos/start` endpoint without errors

## Testing

### Test WorkOS Auth Flow

```typescript
// Test script
import { getAuthEndpoints } from '@/lib/auth-provider';

const endpoints = getAuthEndpoints(undefined, 'workos');

// 1. Start auth flow
const startResponse = await fetch(endpoints.start, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code_challenge: 'test123',
    state: 'state123',
  }),
});

const { auth_url } = await startResponse.json();
console.log('WorkOS Auth URL:', auth_url);

// 2. User completes auth in browser
// 3. Exchange code for token (after callback)
const tokenResponse = await fetch(endpoints.token, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    state: 'state123',
    code_verifier: 'verifier123',
  }),
});

const tokenData = await tokenResponse.json();
console.log('User:', tokenData.user);
```

## Troubleshooting

### Error: "workos_not_configured"
**Cause**: Missing `WORKOS_API_KEY` or `WORKOS_CLIENT_ID`
**Fix**: Check your `.env` file has both variables

### Error: "redirect_uri_mismatch"
**Cause**: Callback URL not configured in WorkOS
**Fix**: Add `http://localhost:3000/api/auth/workos/callback` to WorkOS Redirects

### Error: "invalid_client" from GitHub
**Cause**: GitHub OAuth credentials incorrect in WorkOS
**Fix**: Double-check Client ID and Secret in WorkOS dashboard

### Error: "authorization_pending"
**Cause**: User hasn't completed auth flow yet
**Fix**: Normal during polling; user needs to complete auth in browser

## Next Steps

After successful setup:

1. [ ] Test login flow end-to-end
2. [ ] Test with your CLI tool
3. [ ] Verify user data is returned correctly
4. [ ] Check GitHub API access works (if needed)
5. [ ] Deploy to staging environment
6. [ ] Test with real users
7. [ ] Monitor for errors
8. [ ] Gradually migrate production users

## Support

- **WorkOS Docs**: https://workos.com/docs
- **WorkOS Support**: support@workos.com
- **GitHub OAuth Docs**: https://docs.github.com/en/apps/oauth-apps
