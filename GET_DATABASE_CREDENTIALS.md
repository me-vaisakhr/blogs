# How to Get Your Postgres Database Credentials

You have two options to get your database credentials:

## Option 1: Install Vercel CLI & Pull Credentials (Easiest)

### Step 1: Install Vercel CLI

```bash
bun add -g vercel
# or
npm i -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

This will open your browser for authentication.

### Step 3: Link Your Project

```bash
# In your project directory
vercel link
```

Select your existing project: `me-vaisakhr/blogs`

### Step 4: Create Postgres Database

```bash
vercel postgres create blog-analytics-db
```

This will create the database and show you the credentials.

### Step 5: Pull Environment Variables

```bash
vercel env pull .env.local
```

This automatically downloads ALL environment variables (including Postgres credentials) to `.env.local`!

**Done!** Your `.env.local` now has all the Postgres connection strings.

---

## Option 2: Via Vercel Dashboard (Manual)

### Step 1: Create Database

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Name it: `blog-analytics-db`
7. Click **Create**

### Step 2: Get Connection Strings

After creating the database:

1. Click on your database name
2. Go to **Settings** or **Connection** tab
3. You'll see all the connection strings:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### Step 3: Copy to .env.local

Copy each value and paste into your `.env.local` file.

**Important:** These are automatically injected in production, but you need them locally for development.

---

## Option 3: Use Local Postgres for Development

If you want to develop locally without Vercel:

### Install PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Local Database

```bash
# Create database
createdb blog_analytics_dev

# Or via psql
psql postgres
CREATE DATABASE blog_analytics_dev;
\q
```

### Update .env.local

```bash
POSTGRES_URL="postgresql://localhost:5432/blog_analytics_dev"
```

### Initialize Tables

```bash
# Connect to your database
psql blog_analytics_dev

# In psql, run the schema
\i sql/schema.sql

# Or paste the contents of sql/schema.sql

# Exit
\q
```

---

## Which Option Should You Choose?

- **Development + Production:** Use Option 1 (Vercel CLI)
- **Production Only:** Use Option 2 (Dashboard)
- **Local Development Only:** Use Option 3 (Local Postgres)

## ⚠️ Important Notes

1. **Never commit `.env.local` to git** (already in .gitignore)
2. **In Vercel production:** Environment variables are auto-injected, you don't need to set them manually
3. **For local dev:** You need `.env.local` with real values

---

## Need the credentials right now?

Follow **Option 1** - it's the fastest:

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Link project
vercel link

# Pull all env vars (including Postgres)
vercel env pull .env.local
```

**Done in 2 minutes!**
