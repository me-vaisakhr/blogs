import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/markdown';
import {
  getViewsBySlug,
  getFeedbackBySlug,
  getReadingAnalyticsBySlug
} from '@/lib/db';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Get post metadata
    const post = getPostBySlug(slug);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Fetch all data for this post
    const [views, feedback, readingAnalytics] = await Promise.all([
      getViewsBySlug(slug),
      getFeedbackBySlug(slug),
      getReadingAnalyticsBySlug(slug),
    ]);

    // Calculate metrics
    const totalViews = views.length;
    const totalReadings = readingAnalytics.length;
    const totalRatings = feedback.length;

    // Scroll depth metrics
    const scrollDepthDistribution = {
      reached25: readingAnalytics.filter(r => r.reached_25).length,
      reached50: readingAnalytics.filter(r => r.reached_50).length,
      reached75: readingAnalytics.filter(r => r.reached_75).length,
      reached100: readingAnalytics.filter(r => r.reached_100).length,
    };

    const completionRate = totalReadings > 0
      ? (scrollDepthDistribution.reached100 / totalReadings) * 100
      : 0;

    // Average scroll depth
    const avgScrollDepth = totalReadings > 0
      ? readingAnalytics.reduce((sum, r) => sum + r.max_scroll_depth, 0) / totalReadings
      : 0;

    // Average time on page
    const avgTime = totalReadings > 0
      ? readingAnalytics.reduce((sum, r) => sum + r.time_on_page, 0) / totalReadings
      : 0;

    // Time distribution (buckets: <30s, 30s-1m, 1-2m, 2-3m, 3-5m, >5m)
    const timeDistribution = {
      under30: readingAnalytics.filter(r => r.time_on_page < 30).length,
      '30to60': readingAnalytics.filter(r => r.time_on_page >= 30 && r.time_on_page < 60).length,
      '60to120': readingAnalytics.filter(r => r.time_on_page >= 60 && r.time_on_page < 120).length,
      '120to180': readingAnalytics.filter(r => r.time_on_page >= 120 && r.time_on_page < 180).length,
      '180to300': readingAnalytics.filter(r => r.time_on_page >= 180 && r.time_on_page < 300).length,
      over300: readingAnalytics.filter(r => r.time_on_page >= 300).length,
    };

    // Drop-off curve (exit positions grouped by 10% buckets)
    const dropOffCurve = Array.from({ length: 10 }, (_, i) => {
      const start = i * 10;
      const end = start + 10;
      const count = readingAnalytics.filter(
        r => r.exit_scroll_position >= start && r.exit_scroll_position < end
      ).length;
      return { position: `${start}-${end}%`, count };
    });

    // Rating distribution
    const ratingDistribution = {
      1: feedback.filter(f => f.rating === 1).length,
      2: feedback.filter(f => f.rating === 2).length,
      3: feedback.filter(f => f.rating === 3).length,
      4: feedback.filter(f => f.rating === 4).length,
      5: feedback.filter(f => f.rating === 5).length,
    };

    const averageRating = totalRatings > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalRatings
      : 0;

    // Engagement rate
    const engagementRate = totalViews > 0
      ? (totalRatings / totalViews) * 100
      : 0;

    // Trends over last 30 days (group by date)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReadings = readingAnalytics.filter(
      r => new Date(r.timestamp) >= thirtyDaysAgo
    );

    const trendMap = new Map<string, { views: number; completions: number }>();
    recentReadings.forEach(r => {
      const date = new Date(r.timestamp).toISOString().split('T')[0] || '';
      if (!date) return;
      const existing = trendMap.get(date) || { views: 0, completions: 0 };
      trendMap.set(date, {
        views: existing.views + 1,
        completions: existing.completions + (r.reached_100 ? 1 : 0),
      });
    });

    const trends = Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        completionRate: data.views > 0 ? (data.completions / data.views) * 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      post: {
        slug: post.slug,
        title: post.title,
        category: post.category,
        publishedAt: post.publishedAt,
      },
      overview: {
        totalViews,
        totalReadings,
        totalRatings,
        completionRate: Math.round(completionRate * 10) / 10,
        avgScrollDepth: Math.round(avgScrollDepth),
        avgTime: Math.round(avgTime),
        averageRating: Math.round(averageRating * 10) / 10,
        engagementRate: Math.round(engagementRate * 10) / 10,
      },
      scrollDepthDistribution,
      timeDistribution,
      dropOffCurve,
      ratingDistribution,
      trends,
    });
  } catch (error) {
    console.error('Error generating post analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
