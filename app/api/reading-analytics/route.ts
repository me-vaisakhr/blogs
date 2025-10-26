import { NextRequest, NextResponse } from 'next/server';
import { insertReadingAnalytics, getAllReadingAnalytics } from '@/lib/db';

// GET - Retrieve all reading analytics
export async function GET() {
  try {
    const analytics = await getAllReadingAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error reading analytics:', error);
    return NextResponse.json({ error: 'Failed to read analytics' }, { status: 500 });
  }
}

// POST - Save new reading analytics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      sessionId,
      maxScrollDepth,
      reached25,
      reached50,
      reached75,
      reached100,
      timeOnPage,
      exitScrollPosition,
    } = body;

    // Validate input
    if (!slug || typeof maxScrollDepth !== 'number' || typeof timeOnPage !== 'number') {
      return NextResponse.json(
        { error: 'Invalid analytics data' },
        { status: 400 }
      );
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Create new reading analytics entry
    const newAnalytics = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      max_scroll_depth: maxScrollDepth,
      reached_25: reached25 || false,
      reached_50: reached50 || false,
      reached_75: reached75 || false,
      reached_100: reached100 || false,
      time_on_page: timeOnPage,
      exit_scroll_position: exitScrollPosition,
      user_agent: userAgent,
    };

    // Save to database
    await insertReadingAnalytics(newAnalytics);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving reading analytics:', error);
    return NextResponse.json(
      { error: 'Failed to save analytics' },
      { status: 500 }
    );
  }
}
