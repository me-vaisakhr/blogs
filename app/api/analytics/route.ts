import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/markdown';
import { getAllFeedback, getAllViews, getAllReadingAnalytics } from '@/lib/db';

interface PostAnalytics {
  slug: string;
  title: string;
  totalViews: number;
  totalRatings: number;
  averageRating: number;
  engagementRate: number; // (ratings / views) * 100
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  category?: string;
  // New reading analytics metrics
  completionRate: number;
  avgScrollDepth: number;
  avgTime: number;
}

interface OverallStats {
  totalViews: number;
  totalFeedback: number;
  totalPosts: number;
  averageRating: number;
  postsWithFeedback: number;
  overallEngagementRate: number;
}

interface RatingTrend {
  date: string;
  count: number;
  averageRating: number;
}

export async function GET() {
  try {
    // Fetch data from database
    const feedback = await getAllFeedback();
    const views = await getAllViews();
    const readingAnalytics = await getAllReadingAnalytics();

    // Get all posts
    const posts = getAllPosts();

    // Calculate post-wise analytics
    const postAnalytics: PostAnalytics[] = posts.map(post => {
      const postFeedback = feedback.filter(f => f.slug === post.slug);
      const postViews = views.filter(v => v.slug === post.slug);
      const postReadings = readingAnalytics.filter(r => r.slug === post.slug);

      const ratingDistribution = {
        1: postFeedback.filter(f => f.rating === 1).length,
        2: postFeedback.filter(f => f.rating === 2).length,
        3: postFeedback.filter(f => f.rating === 3).length,
        4: postFeedback.filter(f => f.rating === 4).length,
        5: postFeedback.filter(f => f.rating === 5).length,
      };

      const totalViews = postViews.length;
      const totalRatings = postFeedback.length;
      const totalReadings = postReadings.length;
      const sumRatings = postFeedback.reduce((sum, f) => sum + f.rating, 0);
      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
      const engagementRate = totalViews > 0 ? (totalRatings / totalViews) * 100 : 0;

      // Calculate reading metrics
      const completedReadings = postReadings.filter(r => r.reached_100).length;
      const completionRate = totalReadings > 0 ? (completedReadings / totalReadings) * 100 : 0;
      const avgScrollDepth = totalReadings > 0
        ? postReadings.reduce((sum, r) => sum + r.max_scroll_depth, 0) / totalReadings
        : 0;
      const avgTime = totalReadings > 0
        ? postReadings.reduce((sum, r) => sum + r.time_on_page, 0) / totalReadings
        : 0;

      return {
        slug: post.slug,
        title: post.title,
        totalViews,
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        engagementRate: Math.round(engagementRate * 10) / 10,
        ratingDistribution,
        category: post.category,
        completionRate: Math.round(completionRate * 10) / 10,
        avgScrollDepth: Math.round(avgScrollDepth),
        avgTime: Math.round(avgTime),
      };
    });

    // Calculate overall stats
    const totalViews = views.length;
    const totalFeedback = feedback.length;
    const postsWithFeedback = postAnalytics.filter(p => p.totalRatings > 0).length;
    const averageRating = totalFeedback > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;
    const overallEngagementRate = totalViews > 0
      ? (totalFeedback / totalViews) * 100
      : 0;

    const overallStats: OverallStats = {
      totalViews,
      totalFeedback,
      totalPosts: posts.length,
      averageRating: Math.round(averageRating * 10) / 10,
      postsWithFeedback,
      overallEngagementRate: Math.round(overallEngagementRate * 10) / 10,
    };

    // Calculate rating trends (last 30 days, grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentFeedback = feedback.filter(
      f => new Date(f.timestamp) >= thirtyDaysAgo
    );

    // Group by date
    const trendMap = new Map<string, { count: number; sum: number }>();
    recentFeedback.forEach(f => {
      const date = new Date(f.timestamp).toISOString().split('T')[0] || '';
      if (!date) return;
      const existing = trendMap.get(date) || { count: 0, sum: 0 };
      trendMap.set(date, {
        count: existing.count + 1,
        sum: existing.sum + f.rating,
      });
    });

    const trends: RatingTrend[] = Array.from(trendMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        averageRating: Math.round((data.sum / data.count) * 10) / 10,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Overall rating distribution
    const overallDistribution = {
      1: feedback.filter(f => f.rating === 1).length,
      2: feedback.filter(f => f.rating === 2).length,
      3: feedback.filter(f => f.rating === 3).length,
      4: feedback.filter(f => f.rating === 4).length,
      5: feedback.filter(f => f.rating === 5).length,
    };

    return NextResponse.json({
      overallStats,
      postAnalytics: postAnalytics.sort((a, b) => b.totalRatings - a.totalRatings),
      trends,
      overallDistribution,
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
