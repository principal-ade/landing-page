# Authentication Migration Guide: GitHub OAuth → WorkOS

This guide explains how to migrate from direct GitHub OAuth to WorkOS authentication while maintaining support for both during the transition.

## Overview

Your application now supports **dual authentication**, allowing you to:

1. Keep existing GitHub OAuth users authenticated
2. Onboard new users via WorkOS
3. Gradually migrate existing users to WorkOS
4. Remove GitHub OAuth once migration is complete

## Architecture

### Current Setup (Dual Provider)

```
┌─────────────────────────────────────────────┐
│          Authentication Layer               │
├─────────────────────────────────────────────┤
│                                             │
│  GitHub OAuth (Legacy)    WorkOS (New)      │
│  ├── /api/auth/cli/*     ├── /api/auth/     │
│  │                       │   workos/*        │
│  └── Direct GitHub       └── Multi-provider │
│      integration             abstraction     │
│                                             │
└─────────────────────────────────────────────┘
```

## Provider Comparison

| Feature | GitHub OAuth | WorkOS |
|---------|-------------|--------|
| **Setup Complexity** | Simple | Moderate |
| **Providers Supported** | GitHub only | GitHub, Google, Microsoft, SSO |
| **Enterprise SSO** | ❌ No | ✅ Yes |
| **User Management** | DIY | ✅ Built-in |
| **Session Management** | DIY | ✅ Built-in |
| **Token Refresh** | Manual | ✅ Automatic |
| **Rate Limits** | GitHub's limits | WorkOS handles |
| **Cost** | Free | Paid (free tier available) |

## Configuration

### 1. Environment Variables

Add to your `.env` file:

```bash
# ======================================
# GitHub OAuth (Legacy - Keep during migration)
# ======================================
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret

# ======================================
# WorkOS (New)
# ======================================
WORKOS_API_KEY=sk_live_your_workos_api_key
WORKOS_CLIENT_ID=client_your_workos_client_id

# ======================================
# Provider Selection
# ======================================
# Options: 'github' (default) or 'workos'
AUTH_PROVIDER=github
```

### 2. WorkOS Dashboard Setup

1. Sign up at [https://dashboard.workos.com](https://dashboard.workos.com)
2. Create a new application
3. Configure GitHub OAuth connection:
   - Go to **Authentication** → **Connections**
   - Click **+ New Connection**
   - Select **GitHub OAuth**
   - Enter your GitHub OAuth App credentials
4. Set redirect URI: `https://your-domain.com/api/auth/workos/callback`
5. Copy your **Client ID** and **API Key**

## Migration Strategies

### Strategy 1: Gradual Migration (Recommended)

**Phase 1: Setup (Week 1)**
- ✅ Add WorkOS credentials to environment
- ✅ Keep `AUTH_PROVIDER=github` (no user impact)
- ✅ Test WorkOS flow in staging

**Phase 2: Pilot (Week 2-3)**
- Switch specific test users to WorkOS
- Monitor for issues
- Gather feedback

**Phase 3: Migration (Week 4-8)**
```bash
# Option A: Environment-based migration
AUTH_PROVIDER=workos  # All new users use WorkOS

# Option B: Feature flag migration (requires code changes)
# Gradually move users based on feature flags
```

**Phase 4: Cleanup (Week 9+)**
- Ensure all users migrated
- Remove GitHub OAuth routes
- Remove GitHub credentials
- Update documentation

### Strategy 2: Big Bang Migration

**Week 1: Preparation**
1. Set up WorkOS
2. Test thoroughly in staging
3. Communicate to users

**Week 2: Migration**
```bash
# Switch the provider
AUTH_PROVIDER=workos
```

**Week 3: Cleanup**
- Monitor for issues
- Remove GitHub OAuth code

## API Endpoints

### Both Providers Available

During migration, both sets of endpoints work:

**GitHub OAuth (Legacy):**
- `POST /api/auth/cli/start`
- `GET /api/auth/cli/callback`
- `POST /api/auth/cli/token`

**WorkOS (New):**
- `POST /api/auth/workos/start`
- `GET /api/auth/workos/callback`
- `POST /api/auth/workos/token`

### Using the Abstraction Layer

```typescript
import { getAuthEndpoints, getAuthProvider } from "@/lib/auth-provider";

// Get current provider
const provider = getAuthProvider();
console.log(`Using ${provider} for authentication`);

// Get endpoints for current provider
const endpoints = getAuthEndpoints();
console.log(endpoints);
// {
//   start: '/api/auth/workos/start',
//   callback: '/api/auth/workos/callback',
//   token: '/api/auth/workos/token',
//   provider: 'workos'
// }

// Override provider for testing
const githubEndpoints = getAuthEndpoints(undefined, "github");
```

## Client Migration

### CLI/SDK Updates

If you have CLI tools or SDKs, update them to support both providers:

```typescript
// Old (GitHub only)
const authUrl = await fetch('/api/auth/cli/start', {
  method: 'POST',
  body: JSON.stringify({ code_challenge, state })
});

// New (Provider-aware)
import { getAuthEndpoints } from './auth-provider';

const endpoints = getAuthEndpoints();
const authUrl = await fetch(endpoints.start, {
  method: 'POST',
  body: JSON.stringify({ code_challenge, state })
});
```

## Testing Both Providers

```bash
# Test GitHub OAuth
AUTH_PROVIDER=github npm run dev

# Test WorkOS
AUTH_PROVIDER=workos npm run dev

# Test with missing credentials (should fallback gracefully)
AUTH_PROVIDER=workos npm run dev
# Should log warning and fallback to GitHub
```

## Monitoring

Track these metrics during migration:

1. **Auth Success Rate** by provider
2. **Auth Latency** (WorkOS has one extra hop)
3. **Error Rates** by provider
4. **User Experience** feedback
5. **Cost** (WorkOS pricing vs GitHub rate limits)

## Rollback Plan

If issues arise with WorkOS:

```bash
# Immediate rollback
AUTH_PROVIDER=github

# Then restart your application
```

No code changes needed - just environment variable change.

## Security Considerations

1. **PKCE Flow**: Both providers support PKCE for secure CLI authentication
2. **Session Storage**: Currently in-memory (upgrade to Redis/DB for production)
3. **Secrets Management**: Keep `WORKOS_API_KEY` and `GITHUB_CLIENT_SECRET` secure
4. **Token Rotation**: WorkOS handles this automatically; GitHub requires manual refresh

## Common Issues

### WorkOS Not Working

**Symptom**: Falls back to GitHub even with `AUTH_PROVIDER=workos`

**Solution**: Check that both environment variables are set:
```bash
echo $WORKOS_API_KEY
echo $WORKOS_CLIENT_ID
```

### GitHub Scopes Not Working with WorkOS

**Symptom**: Can't access GitHub repos after WorkOS migration

**Solution**: Configure scopes in WorkOS dashboard:
1. Go to your connection settings
2. Add GitHub scopes: `read:user`, `user:email`, `repo`

### Session Expired Errors

**Symptom**: "Session expired" errors during auth

**Solution**: Sessions are shared between providers but expire after 5 minutes. Increase timeout in both start routes if needed.

## Cleanup Checklist

Once all users are migrated to WorkOS:

- [ ] Verify no users using GitHub OAuth endpoints (check logs)
- [ ] Remove GitHub OAuth environment variables
- [ ] Delete `/api/auth/cli/*` routes
- [ ] Remove GitHub OAuth from `.env.example`
- [ ] Update documentation
- [ ] Archive GitHub OAuth App in GitHub settings
- [ ] Remove `AUTH_PROVIDER` env var (WorkOS becomes default)

## Support

For issues:
- **GitHub OAuth**: Check GitHub App settings
- **WorkOS**: Check [WorkOS documentation](https://workos.com/docs)
- **General**: See application logs in `/var/log/auth.log`

## Next Steps

1. ✅ Configure WorkOS in dashboard
2. ✅ Add credentials to `.env`
3. ✅ Test in development
4. ✅ Deploy to staging
5. ✅ Pilot with test users
6. ✅ Monitor metrics
7. ✅ Full migration
8. ✅ Cleanup legacy code
