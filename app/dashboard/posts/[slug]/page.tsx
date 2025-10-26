'use client';

import { useState, useEffect, use } from 'react';
import { Card, Title, Text, Grid, Metric, BarChart, DonutChart, AreaChart, Badge } from '@tremor/react';
import Link from 'next/link';

interface PostAnalyticsData {
  post: {
    slug: string;
    title: string;
    category?: string;
    publishedAt: string;
  };
  overview: {
    totalViews: number;
    totalReadings: number;
    totalRatings: number;
    completionRate: number;
    avgScrollDepth: number;
    avgTime: number;
    averageRating: number;
    engagementRate: number;
  };
  scrollDepthDistribution: {
    reached25: number;
    reached50: number;
    reached75: number;
    reached100: number;
  };
  timeDistribution: {
    under30: number;
    '30to60': number;
    '60to120': number;
    '120to180': number;
    '180to300': number;
    over300: number;
  };
  dropOffCurve: Array<{position: string, count: number}>;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  trends: Array<{date: string, views: number, completionRate: number}>;
}

const EMOJI_MAP: { [key: number]: string } = {
  1: '😞',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '🤩',
};

export default function PostAnalyticsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [analytics, setAnalytics] = useState<PostAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics/${resolvedParams.slug}`);
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Text>Loading analytics...</Text>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Card className="max-w-md">
          <Text className="text-red-600 dark:text-red-400">{error || 'Post not found'}</Text>
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 mt-4 block">
            ← Back to Dashboard
          </Link>
        </Card>
      </div>
    );
  }

  // Prepare chart data
  const scrollFunnelData = [
    { milestone: '100% Started', count: analytics.overview.totalReadings },
    { milestone: '75% @ 25%', count: analytics.scrollDepthDistribution.reached25 },
    { milestone: '50% @ 50%', count: analytics.scrollDepthDistribution.reached50 },
    { milestone: '25% @ 75%', count: analytics.scrollDepthDistribution.reached75 },
    { milestone: '0% @ 100%', count: analytics.scrollDepthDistribution.reached100 },
  ];

  const timeDistData = [
    { bucket: '<30s', count: analytics.timeDistribution.under30 },
    { bucket: '30s-1m', count: analytics.timeDistribution['30to60'] },
    { bucket: '1-2m', count: analytics.timeDistribution['60to120'] },
    { bucket: '2-3m', count: analytics.timeDistribution['120to180'] },
    { bucket: '3-5m', count: analytics.timeDistribution['180to300'] },
    { bucket: '>5m', count: analytics.timeDistribution.over300 },
  ];

  const ratingDistData = Object.entries(analytics.ratingDistribution).map(([rating, count]) => ({
    rating: `${EMOJI_MAP[parseInt(rating)]} ${rating} star`,
    count,
  }));

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Title className="text-3xl font-bold">{analytics.post.title}</Title>
            {analytics.post.category && (
              <Badge color="blue">{analytics.post.category}</Badge>
            )}
          </div>
          <Text className="text-gray-600 dark:text-gray-400 mt-2">
            Published: {new Date(analytics.post.publishedAt).toLocaleDateString()}
          </Text>
        </div>

        {/* Overview Stats */}
        <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mb-8">
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Total Views</Text>
            <Metric>{analytics.overview.totalViews}</Metric>
          </Card>
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Completion Rate</Text>
            <Metric>{analytics.overview.completionRate}%</Metric>
            <Text className="text-xs text-gray-500 mt-1">
              {analytics.scrollDepthDistribution.reached100} of {analytics.overview.totalReadings} finished
            </Text>
          </Card>
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Avg Time on Page</Text>
            <Metric>{formatTime(analytics.overview.avgTime)}</Metric>
          </Card>
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Avg Scroll Depth</Text>
            <Metric>{analytics.overview.avgScrollDepth}%</Metric>
          </Card>
        </Grid>

        {/* Charts Row 1 */}
        <Grid numItemsLg={2} className="gap-6 mb-8">
          <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">📊 Scroll Depth Funnel</Title>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How far readers scroll through your post
            </Text>
            <BarChart
              className="mt-6 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={scrollFunnelData}
              index="milestone"
              categories={['count']}
              colors={['violet']}
              yAxisWidth={40}
              showLegend={false}
              showAnimation={true}
              layout="horizontal"
            />
          </Card>

          <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">⏱️ Time Distribution</Title>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              How long readers spend on this post
            </Text>
            <BarChart
              className="mt-6 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={timeDistData}
              index="bucket"
              categories={['count']}
              colors={['blue']}
              yAxisWidth={40}
              showLegend={false}
              showAnimation={true}
            />
          </Card>
        </Grid>

        {/* Charts Row 2 */}
        <Grid numItemsLg={2} className="gap-6 mb-8">
          <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">📉 Drop-Off Curve</Title>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Where readers exit the post
            </Text>
            <AreaChart
              className="mt-6 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={analytics.dropOffCurve}
              index="position"
              categories={['count']}
              colors={['rose']}
              yAxisWidth={40}
              showLegend={false}
              showAnimation={true}
            />
          </Card>

          <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">💬 Rating Distribution</Title>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Feedback from {analytics.overview.totalRatings} readers
            </Text>
            <DonutChart
              className="mt-6 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={ratingDistData}
              category="count"
              index="rating"
              colors={['rose', 'amber', 'yellow', 'emerald', 'violet']}
              showLabel={true}
              showAnimation={true}
            />
            <div className="text-center mt-4">
              <Text className="text-lg font-bold">
                {analytics.overview.averageRating.toFixed(1)} ⭐
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Average Rating
              </Text>
            </div>
          </Card>
        </Grid>

        {/* Trends */}
        {analytics.trends.length > 0 && (
          <Card className="mb-8 dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">📈 Trends (Last 30 Days)</Title>
            <AreaChart
              className="mt-6 h-72 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={analytics.trends.map(t => ({
                Date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Views: t.views,
                'Completion Rate': t.completionRate,
              }))}
              index="Date"
              categories={['Views', 'Completion Rate']}
              colors={['violet', 'emerald']}
              yAxisWidth={40}
              showAnimation={true}
            />
          </Card>
        )}

        {/* Summary Stats */}
        <Grid numItemsMd={2} className="gap-6">
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Title className="text-lg mb-4">📌 Key Insights</Title>
            <div className="space-y-3">
              <div>
                <Text className="font-semibold">Engagement Rate</Text>
                <Text className="text-2xl">{analytics.overview.engagementRate}%</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.overview.totalRatings} of {analytics.overview.totalViews} visitors left feedback
                </Text>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <Text className="font-semibold">Reading Completion</Text>
                <Text className="text-2xl">{analytics.overview.completionRate}%</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {analytics.scrollDepthDistribution.reached100} readers finished the article
                </Text>
              </div>
            </div>
          </Card>

          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Title className="text-lg mb-4">🎯 Performance Indicators</Title>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text>25% Milestone</Text>
                <Badge color="blue">
                  {analytics.overview.totalReadings > 0
                    ? Math.round((analytics.scrollDepthDistribution.reached25 / analytics.overview.totalReadings) * 100)
                    : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Text>50% Milestone</Text>
                <Badge color="yellow">
                  {analytics.overview.totalReadings > 0
                    ? Math.round((analytics.scrollDepthDistribution.reached50 / analytics.overview.totalReadings) * 100)
                    : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Text>75% Milestone</Text>
                <Badge color="orange">
                  {analytics.overview.totalReadings > 0
                    ? Math.round((analytics.scrollDepthDistribution.reached75 / analytics.overview.totalReadings) * 100)
                    : 0}%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Text>Completed (100%)</Text>
                <Badge color="emerald">
                  {analytics.overview.completionRate}%
                </Badge>
              </div>
            </div>
          </Card>
        </Grid>
      </div>
    </div>
  );
}
