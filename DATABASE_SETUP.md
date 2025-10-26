# Database Setup Guide - Vercel Postgres

This guide will help you set up Vercel Postgres for your blog's analytics system.

## 🎯 Overview

Your blog has been migrated from JSON file storage to **Vercel Postgres**, which provides:
- ✅ Persistent data storage
- ✅ Serverless-friendly architecture
- ✅ Automatic scaling
- ✅ Free tier: 256 MB storage, 60 hours compute/month

---

## 📋 Prerequisites

Before you begin:
- Vercel account (sign up at https://vercel.com)
- Your project deployed on Vercel (or ready to deploy)
- Repository: `me-vaisakhr/blogs`

---

## 🚀 Step 1: Create Vercel Postgres Database

### Option A: Create via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project: `blogs`
3. Click the **"Storage"** tab in the top navigation
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Choose a name: `blog-analytics-db` (or any name you prefer)
7. Select region: Choose closest to your primary audience
8. Click **"Create"**

### Option B: Create via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create Postgres database
vercel postgres create blog-analytics-db
```

---

## 🔌 Step 2: Connect Database to Your Project

**Good News:** Vercel automatically injects the database environment variables into your project!

### Verify Connection

1. Go to your project settings on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. You should see these variables (automatically added):
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

**You don't need to add these manually!** They're automatically available in your serverless functions.

---

## 📊 Step 3: Initialize Database Schema

You need to create the tables for views and feedback.

### Option A: Run SQL via Vercel Dashboard (Recommended)

1. Go to your Vercel project
2. Click **Storage** → Select your database
3. Click **"Query"** tab (or **".sql"** tab)
4. Copy and paste this SQL:

```sql
-- Create views table
CREATE TABLE IF NOT EXISTS views (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_id TEXT NOT NULL,
  user_agent TEXT
);

-- Create indexes for views
CREATE INDEX IF NOT EXISTS idx_views_slug ON views(slug);
CREATE INDEX IF NOT EXISTS idx_views_timestamp ON views(timestamp);
CREATE INDEX IF NOT EXISTS idx_views_session_slug ON views(session_id, slug);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_id TEXT NOT NULL
);

-- Create indexes for feedback
CREATE INDEX IF NOT EXISTS idx_feedback_slug ON feedback(slug);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_session_slug ON feedback(session_id, slug);

-- Create reading_analytics table
CREATE TABLE IF NOT EXISTS reading_analytics (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  session_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  max_scroll_depth INTEGER NOT NULL,
  reached_25 BOOLEAN DEFAULT FALSE,
  reached_50 BOOLEAN DEFAULT FALSE,
  reached_75 BOOLEAN DEFAULT FALSE,
  reached_100 BOOLEAN DEFAULT FALSE,
  time_on_page INTEGER NOT NULL,
  exit_scroll_position INTEGER NOT NULL,
  user_agent TEXT
);

-- Create indexes for reading_analytics
CREATE INDEX IF NOT EXISTS idx_reading_slug ON reading_analytics(slug);
CREATE INDEX IF NOT EXISTS idx_reading_timestamp ON reading_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_reading_completed ON reading_analytics(reached_100);
```

5. Click **"Run Query"** or **"Execute"**
6. Verify tables were created: Run `SELECT * FROM views;`, `SELECT * FROM feedback;`, and `SELECT * FROM reading_analytics;`

### Option B: Run SQL via Vercel CLI

```bash
# Connect to your database
vercel postgres connect blog-analytics-db

# You'll be in psql shell, paste the SQL from above
# Or if you saved it to sql/schema.sql:
\i sql/schema.sql

# Exit with:
\q
```

### Option C: Use the Initialize API (Programmatic)

Create an initialization API route (temporary, for setup only):

**Create: `app/api/init-db/route.ts`**

```typescript
import { initializeDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

Then visit: `https://your-app.vercel.app/api/init-db`

**⚠️ Important:** Delete this route after initialization for security!

---

## 🧪 Step 4: Test Database Connection

### Test via API Routes

1. Visit your blog post page: `https://your-app.vercel.app/posts/your-slug`
2. The ViewTracker component will automatically track the view
3. Leave a rating using the feedback widget
4. Go to dashboard: `https://your-app.vercel.app/dashboard`
5. Login with your password
6. You should see the view and feedback data!

### Test via Vercel Dashboard

1. Go to **Storage** → **your database** → **Query**
2. Run:
   ```sql
   SELECT * FROM views;
   SELECT * FROM feedback;
   SELECT * FROM reading_analytics;
   ```
3. You should see your test data

---

## 🔐 Step 5: Set Dashboard Password

Don't forget to set your dashboard password as an environment variable!

1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Name:** `NEXT_PUBLIC_DASHBOARD_PASSWORD`
   - **Value:** Your secure password (change from default!)
   - **Environments:** Production, Preview, Development
3. Click **"Save"**
4. **Redeploy** your application for changes to take effect

---

## 📦 Step 6: Deploy & Verify

### Deploy Your Changes

```bash
# Commit all changes
git add .
git commit -m "Migrate to Vercel Postgres"
git push origin main
```

Vercel will automatically deploy your changes!

### Verification Checklist

- ✅ Database created in Vercel
- ✅ Tables initialized (views, feedback & reading_analytics)
- ✅ Environment variables present (auto-injected)
- ✅ Dashboard password set
- ✅ View tracking works on blog posts
- ✅ Feedback widget saves ratings
- ✅ Reading behavior tracking works
- ✅ Dashboard displays analytics

---

## 🔧 Local Development Setup (Optional)

To test locally with Postgres:

### Option 1: Use Vercel Development Connection

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# This creates .env.local with your Vercel Postgres credentials
# Now run your dev server
bun dev
```

### Option 2: Use Local Postgres

1. Install PostgreSQL locally
2. Create a local database:
   ```bash
   createdb blog_analytics_dev
   ```
3. Update `.env.local`:
   ```bash
   POSTGRES_URL="postgresql://username:password@localhost:5432/blog_analytics_dev"
   ```
4. Run schema from `sql/schema.sql`
5. Run dev server: `bun dev`

---

## 📊 Database Schema Reference

### Views Table
```sql
Column       | Type                        | Description
-------------|-----------------------------|---------------------------
id           | TEXT PRIMARY KEY            | Unique view identifier
slug         | TEXT NOT NULL               | Blog post slug
timestamp    | TIMESTAMP WITH TIME ZONE    | When view occurred
session_id   | TEXT NOT NULL               | User session ID
user_agent   | TEXT                        | Browser user agent
```

### Feedback Table
```sql
Column       | Type                        | Description
-------------|-----------------------------|---------------------------
id           | TEXT PRIMARY KEY            | Unique feedback identifier
slug         | TEXT NOT NULL               | Blog post slug
rating       | INTEGER NOT NULL (1-5)      | User rating (1-5 stars)
timestamp    | TIMESTAMP WITH TIME ZONE    | When rating was given
session_id   | TEXT NOT NULL               | User session ID
```

### Reading Analytics Table
```sql
Column              | Type                        | Description
--------------------|-----------------------------|---------------------------
id                  | TEXT PRIMARY KEY            | Unique analytics identifier
slug                | TEXT NOT NULL               | Blog post slug
session_id          | TEXT NOT NULL               | User session ID
timestamp           | TIMESTAMP WITH TIME ZONE    | When data was recorded
max_scroll_depth    | INTEGER NOT NULL            | Highest scroll % (0-100)
reached_25          | BOOLEAN                     | Did reader reach 25%?
reached_50          | BOOLEAN                     | Did reader reach 50%?
reached_75          | BOOLEAN                     | Did reader reach 75%?
reached_100         | BOOLEAN                     | Did reader complete (100%)?
time_on_page        | INTEGER NOT NULL            | Seconds spent on page
exit_scroll_position| INTEGER NOT NULL            | % position when leaving
user_agent          | TEXT                        | Browser user agent
```

---

## 🔍 Useful SQL Queries

### Check Total Views
```sql
SELECT COUNT(*) as total_views FROM views;
```

### Check Total Feedback
```sql
SELECT COUNT(*) as total_feedback FROM feedback;
```

### Get Views by Post
```sql
SELECT slug, COUNT(*) as view_count
FROM views
GROUP BY slug
ORDER BY view_count DESC;
```

### Get Average Rating by Post
```sql
SELECT slug, AVG(rating)::NUMERIC(10,2) as avg_rating, COUNT(*) as rating_count
FROM feedback
GROUP BY slug
ORDER BY avg_rating DESC;
```

### Get Recent Activity (Last 7 Days)
```sql
SELECT
  DATE(timestamp) as date,
  COUNT(*) as count
FROM views
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

### Check Total Reading Analytics
```sql
SELECT COUNT(*) as total_reading_sessions FROM reading_analytics;
```

### Get Completion Rate by Post
```sql
SELECT
  slug,
  COUNT(*) as total_reads,
  SUM(CASE WHEN reached_100 = true THEN 1 ELSE 0 END) as completed,
  ROUND(100.0 * SUM(CASE WHEN reached_100 = true THEN 1 ELSE 0 END) / COUNT(*), 2) as completion_rate
FROM reading_analytics
GROUP BY slug
ORDER BY completion_rate DESC;
```

### Get Average Time on Page by Post
```sql
SELECT
  slug,
  COUNT(*) as sessions,
  ROUND(AVG(time_on_page), 2) as avg_seconds,
  ROUND(AVG(time_on_page) / 60, 2) as avg_minutes
FROM reading_analytics
GROUP BY slug
ORDER BY avg_seconds DESC;
```

### Get Average Scroll Depth by Post
```sql
SELECT
  slug,
  ROUND(AVG(max_scroll_depth), 2) as avg_scroll_depth,
  COUNT(*) as sessions
FROM reading_analytics
GROUP BY slug
ORDER BY avg_scroll_depth DESC;
```

### Get Scroll Milestone Statistics
```sql
SELECT
  slug,
  COUNT(*) as total_sessions,
  SUM(CASE WHEN reached_25 THEN 1 ELSE 0 END) as reached_25_count,
  SUM(CASE WHEN reached_50 THEN 1 ELSE 0 END) as reached_50_count,
  SUM(CASE WHEN reached_75 THEN 1 ELSE 0 END) as reached_75_count,
  SUM(CASE WHEN reached_100 THEN 1 ELSE 0 END) as reached_100_count
FROM reading_analytics
GROUP BY slug;
```

### Get Reading Analytics for Specific Post
```sql
SELECT
  session_id,
  timestamp,
  max_scroll_depth,
  time_on_page,
  reached_100
FROM reading_analytics
WHERE slug = 'your-post-slug'
ORDER BY timestamp DESC
LIMIT 20;
```

---

## ⚠️ Troubleshooting

### Issue: "No database connection"

**Solution:**
1. Verify database is created in Vercel dashboard
2. Check environment variables are present in project settings
3. Redeploy the application

### Issue: "Table does not exist"

**Solution:**
1. Run the SQL schema from Step 3
2. Verify tables exist: `SELECT * FROM views;`

### Issue: "Permission denied"

**Solution:**
- Vercel automatically grants correct permissions
- If using local Postgres, ensure your user has CREATE/INSERT/SELECT permissions

### Issue: "Cannot connect to database locally"

**Solution:**
```bash
# Pull Vercel env vars
vercel env pull .env.local

# Or use local Postgres with updated .env.local
```

---

## 💰 Pricing & Limits

### Vercel Postgres Free Tier
- **Storage:** 256 MB
- **Compute:** 60 hours/month
- **Rows:** ~100,000 (estimated, depends on data)
- **Perfect for:** Personal blogs, small projects

### When to Upgrade?
- If you exceed 60 compute hours/month
- If you need more than 256 MB storage
- Pro plan: $20/month includes 512 MB storage & 100 compute hours

### Monitoring Usage
1. Go to **Storage** → your database
2. View **Usage** tab
3. Track storage, compute, and queries

---

## 📚 Additional Resources

- **Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres
- **SDK Reference:** https://vercel.com/docs/storage/vercel-postgres/sdk
- **Quickstart:** https://vercel.com/docs/storage/vercel-postgres/quickstart

---

## 🎉 You're Done!

Your blog now has a production-ready, serverless analytics system powered by Vercel Postgres!

### What's Working Now:
✅ Page view tracking
✅ User feedback/ratings
✅ Reading behavior analytics (scroll depth, time, completion)
✅ Analytics dashboard with advanced metrics
✅ Persistent data storage
✅ Serverless architecture

### Next Steps:
1. Deploy to Vercel
2. Initialize database tables
3. Test analytics tracking
4. Monitor your blog's performance!

**Questions?** Check the troubleshooting section or Vercel's documentation.
