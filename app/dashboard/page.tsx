'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, Title, Text, Grid, Metric, BarChart, DonutChart, AreaChart, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, Select, SelectItem } from '@tremor/react';

interface PostAnalytics {
  slug: string;
  title: string;
  totalViews: number;
  totalRatings: number;
  averageRating: number;
  engagementRate: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  category?: string;
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

interface AnalyticsData {
  overallStats: OverallStats;
  postAnalytics: PostAnalytics[];
  trends: RatingTrend[];
  overallDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

const EMOJI_MAP: { [key: number]: string } = {
  1: '😞',
  2: '😐',
  3: '🙂',
  4: '😊',
  5: '🤩',
};

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('most-views');

  // Sort posts based on selected sort option - must be before any conditional returns
  const sortedPosts = useMemo(() => {
    if (!analytics) return [];
    const posts = [...analytics.postAnalytics];
    switch (sortBy) {
      case 'most-views':
        return posts.sort((a, b) => b.totalViews - a.totalViews);
      case 'least-views':
        return posts.sort((a, b) => a.totalViews - b.totalViews);
      case 'most-rated':
        return posts.sort((a, b) => b.totalRatings - a.totalRatings);
      case 'least-rated':
        return posts.sort((a, b) => a.totalRatings - b.totalRatings);
      default:
        return posts;
    }
  }, [analytics, sortBy]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('dashboardAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - you should set DASHBOARD_PASSWORD in .env.local
    const correctPassword = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || 'admin123';

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dashboardAuth', 'true');
      fetchAnalytics();
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dashboardAuth');
    setPassword('');
  };

  // Login page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <Card className="max-w-md w-full border-purple-500 dark:border-purple-600 border rounded">
          <Title className="text-center mb-6 dark:text-gray-100">Dashboard Login</Title>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-purple-500 dark:border-purple-600 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="Enter dashboard password"
              />
            </div>
            {error && (
              <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Login
            </button>
          </form>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text>Loading analytics...</Text>
      </div>
    );
  }

  if (!analytics) return null;

  // Prepare chart data
  const distributionChartData = Object.entries(analytics.overallDistribution).map(([rating, count]) => ({
    rating: `${EMOJI_MAP[parseInt(rating)]} ${rating} star`,
    count,
  }));

  const postChartData = analytics.postAnalytics.slice(0, 10).map(post => ({
    post: post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title,
    'Total Ratings': post.totalRatings,
    'Avg Rating': post.averageRating,
  }));

  const trendChartData = analytics.trends.map(trend => ({
    Date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Feedback Count': trend.count,
    'Avg Rating': trend.averageRating,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title className="text-3xl font-bold">Analytics Dashboard</Title>
            <Text>Insights into your blog post performance</Text>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <Grid numItemsMd={2} numItemsLg={4} className="gap-6 mb-8">
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Total Views</Text>
            <Metric>{analytics.overallStats.totalViews}</Metric>
          </Card>
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Total Feedback</Text>
            <Metric>{analytics.overallStats.totalFeedback}</Metric>
          </Card>
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Average Rating</Text>
            <Metric>
              {analytics.overallStats.averageRating.toFixed(1)} {EMOJI_MAP[Math.round(analytics.overallStats.averageRating)]}
            </Metric>
          </Card>
          <Card className="border-purple-500 dark:border-purple-600 border rounded">
            <Text>Engagement Rate</Text>
            <Metric>{analytics.overallStats.overallEngagementRate.toFixed(1)}%</Metric>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid numItemsLg={2} className="gap-6 mb-8">
          <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">Rating Distribution</Title>
            <DonutChart
              className="mt-6 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={distributionChartData}
              category="count"
              index="rating"
              colors={['rose', 'amber', 'yellow', 'emerald', 'violet']}
              showLabel={true}
              showAnimation={true}
              showTooltip={true}
            />
          </Card>

          <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">Top Posts by Engagement</Title>
            <BarChart
              className="mt-6 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={postChartData}
              index="post"
              categories={['Total Ratings']}
              colors={['violet']}
              yAxisWidth={40}
              showLegend={false}
              showAnimation={true}
              showTooltip={true}
            />
          </Card>
        </Grid>

        {/* Trends */}
        {trendChartData.length > 0 && (
          <Card className="mb-8 dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
            <Title className="dark:text-gray-100">Feedback Trends (Last 30 Days)</Title>
            <AreaChart
              className="mt-6 h-72 [&_text]:!fill-gray-700 dark:[&_text]:!fill-gray-300"
              data={trendChartData}
              index="Date"
              categories={['Feedback Count', 'Avg Rating']}
              colors={['violet', 'blue']}
              yAxisWidth={40}
              showAnimation={true}
              showTooltip={true}
            />
          </Card>
        )}

        {/* Posts Table */}
        <Card className="dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded">
          <div className="flex items-center justify-between mb-4">
            <Title className="dark:text-gray-100">Post Performance Details</Title>
            <div className="w-48">
              <Text className="text-xs mb-1 dark:text-gray-400">Sort by:</Text>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                className="bg-white dark:bg-dark-card border-purple-500 dark:border-purple-600 border rounded"
              >
                <SelectItem value="most-views">Most Views</SelectItem>
                <SelectItem value="least-views">Least Views</SelectItem>
                <SelectItem value="most-rated">Most Rated</SelectItem>
                <SelectItem value="least-rated">Least Rated</SelectItem>
              </Select>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            <Table className="border-collapse">
              <TableHead>
                <TableRow className="border-b-2 border-purple-500 dark:border-purple-600">
                  <TableHeaderCell className="dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 first:rounded-tl-lg">Post Title</TableHeaderCell>
                  <TableHeaderCell className="dark:text-gray-300 text-right border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">Views</TableHeaderCell>
                  <TableHeaderCell className="dark:text-gray-300 text-right border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">Completion</TableHeaderCell>
                  <TableHeaderCell className="dark:text-gray-300 text-right border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">Ratings</TableHeaderCell>
                  <TableHeaderCell className="dark:text-gray-300 text-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 last:rounded-tr-lg">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPosts.map((post, index) => {
                  const isLastRow = index === sortedPosts.length - 1;
                  return (
                    <TableRow
                      key={post.slug}
                      className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}
                    >
                      <TableCell className={`dark:text-gray-200 border border-gray-200 dark:border-gray-700 ${isLastRow ? 'rounded-bl-lg' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="block max-w-md truncate" title={post.title}>
                            {post.title}
                          </span>
                          {post.category && (
                            <Badge color="blue" size="xs">{post.category}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-right border border-gray-200 dark:border-gray-700">
                        <span className="font-medium">{post.totalViews}</span>
                      </TableCell>
                      <TableCell className="text-right border border-gray-200 dark:border-gray-700">
                        {post.completionRate > 0 ? (
                          <Badge size="xs" color={post.completionRate > 30 ? 'emerald' : post.completionRate > 15 ? 'yellow' : 'gray'}>
                            {post.completionRate.toFixed(0)}%
                          </Badge>
                        ) : (
                          <Text className="dark:text-gray-500">-</Text>
                        )}
                      </TableCell>
                      <TableCell className="text-right border border-gray-200 dark:border-gray-700">
                        {post.totalRatings > 0 ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm dark:text-gray-300">{post.totalRatings}</span>
                            <span className="text-sm">
                              {post.averageRating.toFixed(1)} {EMOJI_MAP[Math.round(post.averageRating)]}
                            </span>
                          </div>
                        ) : (
                          <Text className="dark:text-gray-500">-</Text>
                        )}
                      </TableCell>
                      <TableCell className={`text-center border border-gray-200 dark:border-gray-700 ${isLastRow ? 'rounded-br-lg' : ''}`}>
                        <a
                          href={`/dashboard/posts/${post.slug}`}
                          className="inline-block px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                        >
                          View Details
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
