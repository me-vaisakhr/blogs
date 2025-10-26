# Deployment Guide

This guide will help you deploy your Next.js blog to production.

## 🚀 Recommended: Vercel Deployment

Vercel is the best choice for Next.js applications (made by the Next.js team).

### Prerequisites

- GitHub account with your repository
- Vercel account (free): https://vercel.com/signup

---

## Step-by-Step: Deploy to Vercel

### Step 1: Push Your Code to GitHub

```bash
# Check git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Push to GitHub
git push origin main
```

### Step 2: Connect Vercel to Your GitHub Repository

1. Go to https://vercel.com and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository: `me-vaisakhr/blogs`
5. Click **"Import"**

### Step 3: Configure Your Project

Vercel will auto-detect Next.js. Configure these settings:

**Framework Preset:** Next.js (auto-detected)

**Build Command:** Leave as default
```bash
next build
```

**Output Directory:** Leave as default (`.next`)

**Install Command:**
```bash
bun install
```
*(or use npm/yarn if you prefer)*

### Step 4: Set Environment Variables

⚠️ **IMPORTANT:** Add your environment variables before deploying.

In the Vercel project settings:

1. Click **"Environment Variables"**
2. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_DASHBOARD_PASSWORD` | Your secure password | Production, Preview, Development |

**Recommended:** Change the password from the example for security!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://your-project.vercel.app`

### Step 6: Add Custom Domain (Optional)

1. Go to your project settings
2. Click **"Domains"**
3. Add your custom domain (e.g., `yourblog.com`)
4. Follow DNS configuration instructions

---

## ✅ Database Setup Required

Your blog uses **Vercel Postgres** for analytics data:
- Page view tracking
- User feedback/ratings
- Reading behavior analytics (scroll depth, time, completion)
- Dashboard analytics with advanced metrics

**After deploying to Vercel, you MUST set up the database.**

### Quick Setup Steps:

1. **Create Postgres database** in Vercel dashboard
2. **Run SQL schema** to create tables (views, feedback & reading_analytics)
3. **Environment variables** are auto-injected by Vercel
4. **Test your analytics** dashboard

📖 **See DATABASE_SETUP.md for complete step-by-step instructions**

---

## 📊 What's Using the Database?

Your application has been fully migrated to use Vercel Postgres:

✅ `/api/views` - Tracks page views
✅ `/api/feedback` - Saves user ratings
✅ `/api/reading-analytics` - Tracks reading behavior (scroll, time, completion)
✅ `/api/analytics` - Generates dashboard data and aggregates metrics
✅ All data persists permanently
✅ Serverless-friendly architecture

**Files created:**
- `lib/db.ts` - Database utility functions
- `sql/schema.sql` - Database schema
- API routes updated to use Postgres
- `@vercel/postgres` package installed

---

## Alternative: Netlify Deployment

### Step 1: Create netlify.toml

Add this file to your project root:

```toml
[build]
  command = "bun run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy to Netlify

1. Go to https://netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Set environment variables in **Site settings** → **Environment variables**
5. Click **"Deploy site"**

---

## Continuous Deployment

Both Vercel and Netlify automatically redeploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update blog post"
git push origin main

# Automatically triggers new deployment!
```

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_DASHBOARD_PASSWORD` | Password for /dashboard access | Yes |

**Security Note:**
- Use strong passwords for production
- Don't commit `.env.local` to git (already in .gitignore)
- Only commit `.env.local.example` with dummy values

---

## Testing Before Deployment

### 1. Test Production Build Locally

```bash
# Build for production
bun run build

# Start production server
bun start
```

### 2. Check for Errors

- Visit `http://localhost:3000`
- Test all pages
- Check dashboard at `http://localhost:3000/dashboard`
- Verify API routes work

### 3. Common Issues

**Build fails:** Check for TypeScript errors
```bash
bunx tsc --noEmit
```

**API routes fail:** Ensure data files exist or migrate to database

---

## Post-Deployment Checklist

- ✅ Site loads correctly
- ✅ All blog posts render properly
- ✅ Dashboard login works
- ✅ Analytics tracking works (if using database)
- ✅ Dark mode toggle works
- ✅ Feedback widget works
- ✅ Custom domain configured (if applicable)

---

## Monitoring & Analytics

### Vercel Analytics

Enable in your Vercel dashboard:
1. Go to **Analytics** tab
2. Click **"Enable"**
3. Get real-time performance insights

### Error Monitoring

Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Vercel Speed Insights** - Performance monitoring

---

## Updating Your Site

### Quick Updates
```bash
git add .
git commit -m "Your update message"
git push origin main
# Auto-deploys!
```

### Rollback if Needed
In Vercel:
1. Go to **Deployments**
2. Find a previous deployment
3. Click **"Promote to Production"**

---

## Cost Estimates

### Vercel (Hobby Plan - Free)
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ⚠️ Need paid plan for production team features

### Vercel Postgres (Free Tier)
- ✅ 256 MB storage
- ✅ 60 hours compute/month
- ⚠️ Upgrade if you exceed limits

**Monthly Cost Estimate:** $0 for hobby projects

---

## Need Help?

If you need assistance with:
- Migrating to Vercel Postgres
- Setting up custom domains
- Configuring CI/CD
- Performance optimization

Just ask! I can help implement any of these solutions.

---

## Quick Start Summary

1. **Push code to GitHub** ✅ (Already done: me-vaisakhr/blogs)
2. **Sign up for Vercel** → https://vercel.com
3. **Import your GitHub repo**
4. **Add environment variables**
5. **Deploy!**
6. **Migrate data storage** (for analytics to work)

Your blog will be live in under 5 minutes! 🚀
