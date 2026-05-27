# Analytics System Setup Guide

## Overview

This project now includes a comprehensive analytics system with three tracking modes:

1. **Client-side** - Traditional browser-based GA4 tracking (default)
2. **Server-side** - Database-backed tracking with server-to-server GA4 integration
3. **Hybrid** - Both client-side and server-side tracking for maximum reliability

## Features Implemented

### Phase 1: Client-Side Improvements ✓
- ✓ Error handling for GA4 events
- ✓ Event queue with localStorage persistence
- ✓ Exponential backoff retry logic
- ✓ Automatic queue processing on reconnection
- ✓ Protection against ad blockers (via queue)

### Phase 2: Server-Side Architecture ✓
- ✓ PostgreSQL database schema (Prisma)
- ✓ Session tracking with enrichment
- ✓ Server-side API routes
- ✓ IP geolocation (Vercel geo headers)
- ✓ User-agent parsing
- ✓ Bot detection and filtering
- ✓ GA4 Measurement Protocol integration
- ✓ Configurable tracking modes

## Quick Start

### 1. Environment Configuration

Create or update `.env.local`:

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Analytics Mode: 'client', 'server', or 'hybrid'
NEXT_PUBLIC_ANALYTICS_MODE=client

# For server-side tracking, add:
GA4_API_SECRET=your_ga4_api_secret
DATABASE_URL=postgresql://user:password@localhost:5432/analytics

# Optional: Enable Prisma logging
# PRISMA_LOG_LEVEL=info
```

### 2. Choose Your Tracking Mode

#### Option A: Client-Side Only (Default)

Best for: Simple setups, no database required

```env
NEXT_PUBLIC_ANALYTICS_MODE=client
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Features:**
- ✓ Direct browser → GA4 tracking
- ✓ Event queue with retry logic
- ✓ Works without database
- ✗ Affected by ad blockers (but events queued for retry)
- ✗ No server-side enrichment

#### Option B: Server-Side Only

Best for: Enterprise, ad blocker resistance, GDPR compliance

```env
NEXT_PUBLIC_ANALYTICS_MODE=server
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_measurement_protocol_secret
DATABASE_URL=postgresql://user:password@localhost:5432/analytics
```

**Features:**
- ✓ All events stored in database
- ✓ Server-side enrichment (IP, geolocation, device)
- ✓ Bot filtering
- ✓ Ad blocker resistant
- ✓ GDPR-compliant data deletion
- ✓ Server → GA4 via Measurement Protocol
- ✗ Requires database setup

#### Option C: Hybrid (Recommended for Q3)

Best for: Maximum reliability and data accuracy

```env
NEXT_PUBLIC_ANALYTICS_MODE=hybrid
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_ga4_measurement_protocol_secret
DATABASE_URL=postgresql://user:password@localhost:5432/analytics
```

**Features:**
- ✓ All benefits of both modes
- ✓ Client-side for speed
- ✓ Server-side for reliability
- ✓ Double-tracking ensures no data loss

### 3. Database Setup (Server-Side or Hybrid Mode)

```bash
# Install Prisma
npm install prisma @prisma/client

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Get GA4 API Secret (Server-Side or Hybrid Mode)

1. Go to Google Analytics Admin
2. Navigate to Data Streams → Your Web Stream
3. Scroll to "Measurement Protocol API secrets"
4. Click "Create" and copy the secret value
5. Add to `.env.local` as `GA4_API_SECRET`

## How It Works

### Client-Side Mode Flow

```
User Action → Browser
  ↓
Event Queue (localStorage)
  ↓
window.gtag() → GA4
  ↓
If error: Queue for retry with exponential backoff
```

### Server-Side Mode Flow

```
User Action → Browser
  ↓
POST /api/analytics/events
  ↓
Server enrichment (IP, user-agent, bot detection)
  ↓
Database (PostgreSQL)
  ↓
GA4 Measurement Protocol → GA4
  ↓
If error: Queue in failed_events table
```

### Hybrid Mode Flow

```
User Action → Browser
  ↓
Both paths run in parallel
  ├─ Client-side: window.gtag() → GA4
  └─ Server-side: API → DB → GA4 Measurement Protocol
```

## API Routes

All routes return JSON with `{ success: boolean, ... }`.

### POST /api/analytics/session/start
Initialize a new analytics session.

**Request:**
```json
{
  "sessionId": "unique-session-id",
  "landingPage": "/",
  "referrer": "https://google.com"
}
```

### POST /api/analytics/session/end
End an analytics session.

**Request:**
```json
{
  "sessionId": "unique-session-id"
}
```

### POST /api/analytics/pageview
Track a page view.

**Request:**
```json
{
  "sessionId": "unique-session-id",
  "pagePath": "/about",
  "pageTitle": "About Us"
}
```

### POST /api/analytics/events
Track a custom event.

**Request:**
```json
{
  "sessionId": "unique-session-id",
  "eventType": "click",
  "category": "Button",
  "action": "download",
  "label": "Get Started",
  "value": 1,
  "params": {
    "button_location": "hero"
  }
}
```

## Database Schema

### sessions
- Session metadata (sessionId, startTime, endTime)
- Enrichment data (IP, country, city, device, browser, OS)
- Bot detection (isBot, botScore)
- Relations to pageVisits and analyticsEvents

### page_visits
- Individual page views within a session
- Time on page tracking

### analytics_events
- All tracked events
- GA4 sync status
- Custom parameters as JSON

### failed_events
- Retry queue for failed GA4 sync
- Exponential backoff logic

## Event Queue Status

Check queue status in browser console:

```javascript
import { getEventQueue } from '@/lib/analytics/eventQueue';

const queue = getEventQueue();
console.log(queue.getStatus());
// {
//   queueSize: 3,
//   processing: false,
//   isOnline: true,
//   events: [...]
// }
```

## Bot Filtering

Server-side mode automatically filters bot traffic:

- Common crawlers (Googlebot, Bingbot, etc.)
- Headless browsers
- Suspicious user-agents
- Bot score > 0.5 = filtered

Filtered bots are stored in the database but NOT sent to GA4.

## GDPR Compliance

Server-side mode enables:

1. **Data deletion**: Delete user sessions by sessionId
2. **IP anonymization**: Option to hash IPs before storage
3. **Consent management**: Check consent before tracking
4. **Data export**: Export user data as JSON

Example deletion:

```typescript
// In a GDPR deletion handler
await prisma.session.delete({
  where: { sessionId: 'user-session-id' }
  // Cascades to pageVisits and analyticsEvents
});
```

## Monitoring

### View Analytics Data

```bash
npx prisma studio
```

### Query Examples

```typescript
// Get session stats
const stats = await prisma.session.aggregate({
  _avg: { sessionDuration: true, totalPages: true },
  _count: true,
  where: { isBot: false }
});

// Get top pages
const topPages = await prisma.pageVisit.groupBy({
  by: ['pagePath'],
  _count: true,
  orderBy: { _count: { pagePath: 'desc' } }
});

// Get failed GA4 syncs
const failed = await prisma.analyticsEvent.findMany({
  where: { sentToGA4: false },
  orderBy: { timestamp: 'desc' }
});
```

## Migration Guide

### From Client-Side to Hybrid

1. Add environment variables:
   ```env
   NEXT_PUBLIC_ANALYTICS_MODE=hybrid
   GA4_API_SECRET=xxx
   DATABASE_URL=postgresql://...
   ```

2. Run database setup:
   ```bash
   npx prisma migrate dev
   ```

3. Deploy and verify both tracking modes are working

4. Monitor for 1 week, compare data accuracy

5. (Optional) Switch to `server` mode if satisfied

## Troubleshooting

### Events not appearing in GA4
- Check browser console for errors
- Verify `NEXT_PUBLIC_GA_ID` is set
- Check event queue: `getEventQueue().getStatus()`
- For server-side: Check `GA4_API_SECRET` is valid

### Database connection errors
- Verify `DATABASE_URL` format
- Check database is running
- Run `npx prisma migrate dev`

### High bot traffic in database
- Bot filtering is enabled by default
- Check `sessions` table: `WHERE isBot = true`
- Adjust bot patterns in `enrichment.ts`

## Performance Impact

### Client-Side Mode
- **Overhead**: ~5KB JavaScript (event queue)
- **Network**: Direct to GA4 (no additional requests)

### Server-Side Mode
- **Overhead**: API roundtrip (~50-100ms)
- **Network**: 1 POST per event
- **Database**: 1 INSERT per event

### Hybrid Mode
- **Overhead**: Both of the above
- **Benefit**: Maximum data accuracy

## Next Steps

- [ ] Review trail notes from SquallLeonhart13 and TheKicker25
- [ ] Test hybrid mode in staging
- [ ] Monitor ad blocker impact (currently ~40%)
- [ ] Set up alerting for failed GA4 syncs
- [ ] Implement data retention policy (GDPR)
- [ ] Add analytics dashboard for session insights

## Support

For issues or questions:
1. Check browser console for errors
2. Review Prisma Studio for database state
3. Check API route responses in Network tab
4. Review this guide's troubleshooting section
