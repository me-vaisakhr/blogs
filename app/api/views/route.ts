import { NextRequest, NextResponse } from 'next/server';
import { getAllViews, insertView, checkDuplicateView } from '@/lib/db';

export interface ViewEntry {
  id: string;
  slug: string;
  timestamp: string;
  sessionId?: string;
  userAgent?: string;
}

// GET - Retrieve all views
export async function GET() {
  try {
    const views = await getAllViews();

    // Transform to match the expected format
    const transformedViews = views.map(view => ({
      id: view.id,
      slug: view.slug,
      timestamp: view.timestamp,
      sessionId: view.session_id,
      userAgent: view.user_agent
    }));

    return NextResponse.json(transformedViews);
  } catch (error) {
    console.error('Error reading views:', error);
    return NextResponse.json({ error: 'Failed to read views' }, { status: 500 });
  }
}

// POST - Track new view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, sessionId } = body;

    // Validate input
    if (!slug) {
      return NextResponse.json(
        { error: 'Invalid view data' },
        { status: 400 }
      );
    }

    // Check if this session already viewed this post recently (within 30 minutes)
    // This prevents inflating view counts when refreshing
    const isDuplicate = await checkDuplicateView(sessionId, slug, 30);

    if (isDuplicate) {
      // Don't count as a new view
      return NextResponse.json({ success: true, counted: false });
    }

    // Get user agent
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Create new view entry
    const newView = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug,
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      user_agent: userAgent,
    };

    // Save to database
    await insertView(newView);

    return NextResponse.json({
      success: true,
      counted: true,
      view: {
        id: newView.id,
        slug: newView.slug,
        timestamp: newView.timestamp,
        sessionId: newView.session_id,
        userAgent: newView.user_agent
      }
    });
  } catch (error) {
    console.error('Error saving view:', error);
    return NextResponse.json(
      { error: 'Failed to save view' },
      { status: 500 }
    );
  }
}
