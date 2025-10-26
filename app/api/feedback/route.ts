import { NextRequest, NextResponse } from 'next/server';
import { getAllFeedback, insertFeedback } from '@/lib/db';

export interface FeedbackEntry {
  id: string;
  slug: string;
  rating: number;
  timestamp: string;
  sessionId?: string;
}

// GET - Retrieve all feedback
export async function GET() {
  try {
    const feedback = await getAllFeedback();

    // Transform to match the expected format
    const transformedFeedback = feedback.map(item => ({
      id: item.id,
      slug: item.slug,
      rating: item.rating,
      timestamp: item.timestamp,
      sessionId: item.session_id
    }));

    return NextResponse.json(transformedFeedback);
  } catch (error) {
    console.error('Error reading feedback:', error);
    return NextResponse.json({ error: 'Failed to read feedback' }, { status: 500 });
  }
}

// POST - Save new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, rating, sessionId } = body;

    // Validate input
    if (!slug || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid feedback data' },
        { status: 400 }
      );
    }

    // Create new feedback entry
    const newFeedback = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug,
      rating,
      timestamp: new Date().toISOString(),
      session_id: sessionId,
    };

    // Save to database
    await insertFeedback(newFeedback);

    return NextResponse.json({
      success: true,
      feedback: {
        id: newFeedback.id,
        slug: newFeedback.slug,
        rating: newFeedback.rating,
        timestamp: newFeedback.timestamp,
        sessionId: newFeedback.session_id
      }
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}
