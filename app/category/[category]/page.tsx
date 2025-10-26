import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts } from '@/lib/markdown';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map(post => post.category).filter(Boolean))];

  return categories.map((category) => ({
    category: category!.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${categoryName} Posts`,
    description: `Browse all posts in the ${categoryName} category`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const allPosts = getAllPosts();

  // Filter posts by category (case-insensitive)
  const categoryPosts = allPosts.filter(
    post => post.category?.toLowerCase() === category.toLowerCase()
  );

  if (categoryPosts.length === 0) {
    notFound();
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categoryName },
  ];

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          My Posts On {categoryName} ✨
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {categoryPosts.length} {categoryPosts.length === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>

      <div className="grid gap-6">
        {categoryPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white dark:bg-dark-card rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <article>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {post.title}
              </h2>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>☕ {post.readingTime}</span>
                {post.date && (
                  <>
                    <span>•</span>
                    <span>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </>
                )}
              </div>

              {post.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-3">{post.description}</p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>

      <div className="text-center pt-12 pb-8 border-t border-gray-200 dark:border-dark-border" style={{ marginTop: '5rem' }}>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          "The journey of a thousand miles begins with a single step, but the best journeys never truly end."
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
          More stories coming soon...
        </p>
      </div>
    </div>
  );
}
