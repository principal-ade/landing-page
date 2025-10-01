# Update Proxy API

This endpoint proxies Electron auto-update requests to GitHub releases while maintaining control over access.

## How it works

1. **Electron app** requests: `https://principle-md.com/api/updates/darwin-x64/latest.yml`
2. **Proxy** fetches latest release from GitHub API
3. **Proxy** returns properly formatted YAML for electron-updater
4. **Electron app** requests: `https://principle-md.com/api/updates/MyApp-1.0.0.dmg`
5. **Proxy** streams the file from GitHub releases

## Endpoints

### Version Check
`GET /api/updates/{platform}-{arch}/latest.yml`

Returns YAML metadata for the latest release.

### File Download
`GET /api/updates/{filename}`

Proxies the actual installer download from GitHub.

## Benefits

✅ **Simple**: Just proxy existing GitHub releases  
✅ **No Storage**: Files stay on GitHub  
✅ **Access Control**: Add auth checks easily  
✅ **Analytics**: Log download attempts  
✅ **Caching**: Cache responses for performance  

## Adding Authentication

Uncomment and implement the auth check in `route.ts`:

```typescript
const authHeader = request.headers.get('authorization');
if (!isValidLicense(authHeader)) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

Then in your Electron app:

```typescript
autoUpdater.requestHeaders = {
  'Authorization': `Bearer ${userToken}`
};
```

## Environment Variables

Add to your `.env`:

```env
GITHUB_RELEASES_READONLY_TOKEN=ghp_your_token_here  # Required for accessing private releases
```

## Testing

1. Deploy the API endpoint
2. Build and test your Electron app
3. Check logs at `~/Library/Logs/principle.md/main.log`

The proxy will automatically work with your existing GitHub release process!