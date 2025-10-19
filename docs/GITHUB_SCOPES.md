# GitHub OAuth Scopes Configuration

## Current Scopes Used

Your application uses these GitHub OAuth scopes:

```
read:user user:email repo
```

## Scope Breakdown

### 1. `read:user`
**What it does**: Read-only access to user profile data

**Provides access to**:
- Username (`login`)
- Name
- Avatar URL
- Bio
- Company
- Location
- Public repositories count

**Used in your app**:
- `src/app/api/auth/cli/token/route.ts:100-112` - Getting user info after auth

**Alternative**: `user` (includes write access - not needed)

---

### 2. `user:email`
**What it does**: Read access to user's email addresses

**Provides access to**:
- Primary email
- All verified emails
- Private email addresses

**Used in your app**:
- User identification
- Account linking
- Communication

**Alternative**: None (required for email access)

---

### 3. `repo`
**What it does**: Full access to repositories (public and private)

**Provides access to**:
- ✅ **Read** repository content (code, commits, branches)
- ✅ **Read** pull requests and issues
- ✅ **Read** repository metadata
- ⚠️ **Write** code (push commits)
- ⚠️ **Write** issues and pull requests
- ⚠️ **Delete** repositories
- ⚠️ **Manage** webhooks and settings

**Used in your app** (`src/services/githubService.ts`):
- Fetch repository info
- Fetch pull requests and files
- Fetch commits and tree structure
- Read file contents
- Compare refs

**Alternatives** (more restrictive):
```
public_repo          - Public repositories only (no private repo access)
repo:status          - Commit status access
repo:deployment      - Deployment status access
repo:invite          - Repository invitations
```

**⚠️ Current Usage**: Your app only **reads** data, never writes. You could potentially use more restrictive scopes.

---

## Scope Comparison

### Current Setup (Permissive)
```
read:user user:email repo
```
- ✅ Works with public repos
- ✅ Works with private repos
- ⚠️ Gives write access (not used)

### Recommended for Public Repos Only
```
read:user user:email public_repo
```
- ✅ Works with public repos
- ❌ No private repo access
- ✅ No write permissions

### Recommended for Read-Only Access
If GitHub had a `read:repo` scope, we'd use it, but they don't.
You must use `repo` for private repo access, even if read-only.

---

## Configuration in WorkOS

### Option 1: WorkOS Dashboard (Recommended)

1. Go to [WorkOS Dashboard](https://dashboard.workos.com)
2. Navigate to **Authentication** → **Configure**
3. Click on **GitHub**
4. In the **Scopes** field, enter:
   ```
   read:user user:email repo
   ```
5. Click **Save**

### Option 2: Runtime Configuration

WorkOS can request scopes at runtime. The scopes are passed when calling `getAuthorizationUrl()`:

```typescript
// In src/app/api/auth/workos/start/route.ts
const authorizationUrl = workos.userManagement.getAuthorizationUrl({
  provider: "GitHubOAuth",
  clientId: process.env.WORKOS_CLIENT_ID,
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/workos/callback`,
  state,
  scope: "read:user user:email repo", // Add this line
});
```

---

## User Consent Screen

When users authenticate, GitHub will show them:

```
[Your App Name] wants to access your GitHub account

This application will be able to:
✓ Read your user profile
✓ Read your email addresses
✓ Access your repositories (public and private)
✓ Manage your repositories (create, delete)
```

**Note**: Even though your app only reads, GitHub's `repo` scope includes write permissions.

---

## Security Best Practices

### 1. Document Why You Need Each Scope

**`read:user`**: Required to identify the user and display their profile

**`user:email`**: Required for account creation and communication

**`repo`**: Required to:
- View repository metadata
- Access pull request data
- Read file contents
- Access private repositories (if needed)

### 2. Consider Scope Reduction

If your users only work with **public repositories**, change to:
```
read:user user:email public_repo
```

### 3. Re-authorization on Scope Changes

If you add new scopes later:
- Existing users must re-authorize
- Use `force_reauth` parameter in your start endpoint
- Explain why you need additional permissions

---

## Scope Testing

### Test with Minimal Scopes

```bash
# Test with public_repo only
curl -X POST http://localhost:3000/api/auth/cli/start \
  -H "Content-Type: application/json" \
  -d '{
    "code_challenge": "test",
    "state": "test"
  }'

# Manually change scope in the returned URL to:
# scope=read:user+user:email+public_repo

# See if your app still works with public repos
```

### Verify Scope Access

After authentication, check what scopes were actually granted:

```typescript
// In your token endpoint
const userResponse = await fetch("https://api.github.com/user", {
  headers: {
    Authorization: `Bearer ${tokenData.access_token}`,
  },
});

// Check the X-OAuth-Scopes header
const grantedScopes = userResponse.headers.get('X-OAuth-Scopes');
console.log('Granted scopes:', grantedScopes);
```

---

## Migration Considerations

### When Changing Scopes

1. **Adding Scopes**: Users must re-authorize
2. **Removing Scopes**: No re-auth needed, but features may break
3. **During Migration**: Use the **same scopes** in both providers

### WorkOS vs GitHub OAuth Scopes

Use identical scopes in both:

**GitHub OAuth** (legacy):
```typescript
// src/app/api/auth/cli/start/route.ts:67
scope: "read:user user:email repo"
```

**WorkOS** (new):
```
WorkOS Dashboard → GitHub → Scopes:
read:user user:email repo
```

This ensures consistent behavior during migration.

---

## Quick Reference

| Scope | Purpose | Required? | Alternative |
|-------|---------|-----------|-------------|
| `read:user` | User profile | ✅ Yes | `user` |
| `user:email` | Email access | ✅ Yes | None |
| `repo` | Repository access | ⚠️ Maybe | `public_repo` |

**Minimum for public repos**: `read:user user:email public_repo`

**Current (supports private repos)**: `read:user user:email repo`

---

## Support Resources

- [GitHub OAuth Scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)
- [WorkOS Authentication Docs](https://workos.com/docs/user-management/authentication)
- [Your Auth Implementation](../src/app/api/auth/cli/start/route.ts)
