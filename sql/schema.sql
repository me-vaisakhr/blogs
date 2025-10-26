-- Database schema for blog analytics

-- Table: views
-- Stores page view tracking data
CREATE TABLE IF NOT EXISTS views (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_id TEXT NOT NULL,
  user_agent TEXT
);

-- Index for faster slug queries
CREATE INDEX IF NOT EXISTS idx_views_slug ON views(slug);
CREATE INDEX IF NOT EXISTS idx_views_timestamp ON views(timestamp);
CREATE INDEX IF NOT EXISTS idx_views_session_slug ON views(session_id, slug);

-- Table: feedback
-- Stores user ratings/feedback for posts
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_id TEXT NOT NULL
);

-- Index for faster slug queries
CREATE INDEX IF NOT EXISTS idx_feedback_slug ON feedback(slug);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX IF NOT EXISTS idx_feedback_session_slug ON feedback(session_id, slug);

-- Table: reading_analytics
-- Stores reading behavior data (scroll depth, time, completion)
CREATE TABLE IF NOT EXISTS reading_analytics (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  session_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Scroll depth tracking
  max_scroll_depth INTEGER NOT NULL,  -- Highest % reached (0-100)
  reached_25 BOOLEAN DEFAULT FALSE,
  reached_50 BOOLEAN DEFAULT FALSE,
  reached_75 BOOLEAN DEFAULT FALSE,
  reached_100 BOOLEAN DEFAULT FALSE,  -- Completed article

  -- Time tracking
  time_on_page INTEGER NOT NULL,      -- Seconds spent on page

  -- Exit tracking
  exit_scroll_position INTEGER NOT NULL,  -- % position when leaving (0-100)

  -- User agent for analytics
  user_agent TEXT
);

-- Indexes for reading_analytics
CREATE INDEX IF NOT EXISTS idx_reading_slug ON reading_analytics(slug);
CREATE INDEX IF NOT EXISTS idx_reading_timestamp ON reading_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_reading_completed ON reading_analytics(reached_100);
