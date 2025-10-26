// Database utilities with support for both local and Vercel Postgres

export interface View {
  id: string;
  slug: string;
  timestamp: string;
  session_id: string;
  user_agent?: string;
}

export interface Feedback {
  id: string;
  slug: string;
  rating: number;
  timestamp: string;
  session_id: string;
}

export interface ReadingAnalytics {
  id: string;
  slug: string;
  session_id: string;
  timestamp: string;
  max_scroll_depth: number;
  reached_25: boolean;
  reached_50: boolean;
  reached_75: boolean;
  reached_100: boolean;
  time_on_page: number;
  exit_scroll_position: number;
  user_agent?: string;
}

// Detect if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// Initialize the appropriate SQL client
let sql: any;

if (isVercel) {
  // Use @vercel/postgres in production (Vercel environment)
  const { sql: vercelSql } = require('@vercel/postgres');
  sql = vercelSql;
} else {
  // Use postgres.js for local development
  const postgres = require('postgres');
  const connectionString = process.env.POSTGRES_URL || '';
  sql = postgres(connectionString, {
    max: 10, // Connection pool size
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

/**
 * Get all views from the database
 */
export async function getAllViews(): Promise<View[]> {
  try {
    const result = await sql`
      SELECT id, slug, timestamp, session_id, user_agent
      FROM views
      ORDER BY timestamp DESC
    `;
    return isVercel ? result.rows : result;
  } catch (error) {
    console.error('Error fetching views:', error);
    return [];
  }
}

/**
 * Get all feedback from the database
 */
export async function getAllFeedback(): Promise<Feedback[]> {
  try {
    const result = await sql`
      SELECT id, slug, rating, timestamp, session_id
      FROM feedback
      ORDER BY timestamp DESC
    `;
    return isVercel ? result.rows : result;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }
}

/**
 * Insert a new view record
 */
export async function insertView(view: View): Promise<void> {
  try {
    await sql`
      INSERT INTO views (id, slug, timestamp, session_id, user_agent)
      VALUES (${view.id}, ${view.slug}, ${view.timestamp}, ${view.session_id}, ${view.user_agent || null})
    `;
  } catch (error) {
    console.error('Error inserting view:', error);
    throw error;
  }
}

/**
 * Insert a new feedback record
 */
export async function insertFeedback(feedback: Feedback): Promise<void> {
  try {
    await sql`
      INSERT INTO feedback (id, slug, rating, timestamp, session_id)
      VALUES (${feedback.id}, ${feedback.slug}, ${feedback.rating}, ${feedback.timestamp}, ${feedback.session_id})
    `;
  } catch (error) {
    console.error('Error inserting feedback:', error);
    throw error;
  }
}

/**
 * Check if a view exists for a given session and slug within a time window
 */
export async function checkDuplicateView(
  sessionId: string,
  slug: string,
  windowMinutes: number = 30
): Promise<boolean> {
  try {
    // Calculate the cutoff time in JavaScript to avoid INTERVAL interpolation issues
    const cutoffTime = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

    const result = await sql`
      SELECT COUNT(*) as count
      FROM views
      WHERE session_id = ${sessionId}
        AND slug = ${slug}
        AND timestamp > ${cutoffTime}
    `;
    const rows = isVercel ? result.rows : result;
    return (rows[0]?.count || 0) > 0;
  } catch (error) {
    console.error('Error checking duplicate view:', error);
    return false;
  }
}

/**
 * Get views for a specific slug
 */
export async function getViewsBySlug(slug: string): Promise<View[]> {
  try {
    const result = await sql`
      SELECT id, slug, timestamp, session_id, user_agent
      FROM views
      WHERE slug = ${slug}
      ORDER BY timestamp DESC
    `;
    return isVercel ? result.rows : result;
  } catch (error) {
    console.error('Error fetching views by slug:', error);
    return [];
  }
}

/**
 * Get feedback for a specific slug
 */
export async function getFeedbackBySlug(slug: string): Promise<Feedback[]> {
  try {
    const result = await sql`
      SELECT id, slug, rating, timestamp, session_id
      FROM feedback
      WHERE slug = ${slug}
      ORDER BY timestamp DESC
    `;
    return isVercel ? result.rows : result;
  } catch (error) {
    console.error('Error fetching feedback by slug:', error);
    return [];
  }
}

/**
 * Initialize database tables (run this once during setup)
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // Create views table
    await sql`
      CREATE TABLE IF NOT EXISTS views (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        session_id TEXT NOT NULL,
        user_agent TEXT
      )
    `;

    // Create indexes for views
    await sql`CREATE INDEX IF NOT EXISTS idx_views_slug ON views(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_views_timestamp ON views(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_views_session_slug ON views(session_id, slug)`;

    // Create feedback table
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        session_id TEXT NOT NULL
      )
    `;

    // Create indexes for feedback
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_slug ON feedback(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_feedback_session_slug ON feedback(session_id, slug)`;

    // Create reading_analytics table
    await sql`
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
      )
    `;

    // Create indexes for reading_analytics
    await sql`CREATE INDEX IF NOT EXISTS idx_reading_slug ON reading_analytics(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reading_timestamp ON reading_analytics(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reading_completed ON reading_analytics(reached_100)`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

/**
 * Get all reading analytics from the database
 */
export async function getAllReadingAnalytics(): Promise<ReadingAnalytics[]> {
  try {
    const result = await sql`
      SELECT id, slug, session_id, timestamp, max_scroll_depth,
             reached_25, reached_50, reached_75, reached_100,
             time_on_page, exit_scroll_position, user_agent
      FROM reading_analytics
      ORDER BY timestamp DESC
    `;
    return isVercel ? result.rows : result;
  } catch (error) {
    console.error('Error fetching reading analytics:', error);
    return [];
  }
}

/**
 * Get reading analytics for a specific slug
 */
export async function getReadingAnalyticsBySlug(slug: string): Promise<ReadingAnalytics[]> {
  try {
    const result = await sql`
      SELECT id, slug, session_id, timestamp, max_scroll_depth,
             reached_25, reached_50, reached_75, reached_100,
             time_on_page, exit_scroll_position, user_agent
      FROM reading_analytics
      WHERE slug = ${slug}
      ORDER BY timestamp DESC
    `;
    return isVercel ? result.rows : result;
  } catch (error) {
    console.error('Error fetching reading analytics by slug:', error);
    return [];
  }
}

/**
 * Insert a new reading analytics record
 */
export async function insertReadingAnalytics(data: ReadingAnalytics): Promise<void> {
  try {
    await sql`
      INSERT INTO reading_analytics (
        id, slug, session_id, timestamp,
        max_scroll_depth, reached_25, reached_50, reached_75, reached_100,
        time_on_page, exit_scroll_position, user_agent
      )
      VALUES (
        ${data.id}, ${data.slug}, ${data.session_id}, ${data.timestamp},
        ${data.max_scroll_depth}, ${data.reached_25}, ${data.reached_50},
        ${data.reached_75}, ${data.reached_100},
        ${data.time_on_page}, ${data.exit_scroll_position}, ${data.user_agent || null}
      )
    `;
  } catch (error) {
    console.error('Error inserting reading analytics:', error);
    throw error;
  }
}
