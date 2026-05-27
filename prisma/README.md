# Analytics Database Setup

This directory contains the Prisma schema for server-side analytics tracking.

## Quick Start

### 1. Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Set Database URL

Add to `.env.local`:

```env
# For PostgreSQL (recommended for production)
DATABASE_URL="postgresql://user:password@localhost:5432/analytics?schema=public"

# For local development with SQLite
# DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Migrations

```bash
# Create and apply migration
npx prisma migrate dev --name init

# For production
npx prisma migrate deploy
```

### 5. (Optional) Open Prisma Studio

View and edit data in the browser:

```bash
npx prisma studio
```

## Database Providers

### PostgreSQL (Recommended)

Best for production. Supports all features, scales well.

**Vercel Postgres:**
```bash
npm install @vercel/postgres
```

### MySQL

Alternative to PostgreSQL. Change `datasource db` provider to `"mysql"`.

### SQLite

Good for local development only. Change provider to `"sqlite"`.

## Schema Overview

### Tables

- `sessions` - User session metadata and journey tracking
- `page_visits` - Individual page visits within sessions
- `analytics_events` - All analytics events (clicks, forms, scrolls, etc.)
- `failed_events` - Queue for failed GA4 sync attempts

### Key Features

- **Session tracking** with automatic timeout
- **Device/location enrichment** from IP and user-agent
- **Bot detection** scoring
- **GA4 sync status** tracking
- **Automatic cascade deletes** when sessions end

## Migrations

Migrations are stored in `prisma/migrations/`. Each migration is a timestamped folder containing SQL.

**Create new migration:**
```bash
npx prisma migrate dev --name descriptive_name
```

**Reset database (dev only):**
```bash
npx prisma migrate reset
```

## Prisma Client Usage

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create session
const session = await prisma.session.create({
  data: {
    sessionId: 'unique-session-id',
    landingPage: '/',
    referrer: 'https://google.com',
  }
})

// Track event
await prisma.analyticsEvent.create({
  data: {
    sessionId: session.id,
    eventType: 'click',
    category: 'Button',
    action: 'download',
    label: 'Get Started',
  }
})
```

## Environment Variables

Required:
- `DATABASE_URL` - Database connection string

Optional:
- `DIRECT_URL` - Direct database connection (for connection pooling)
- `SHADOW_DATABASE_URL` - Shadow database for migrations (dev only)
