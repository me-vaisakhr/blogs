import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to my Journey!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Thoughts, learnings, and experiences from my journey in software development
        </p>
      </div>

      <div className={posts.length === 1 ? "max-w-2xl mx-auto" : posts.length === 2 ? "grid md:grid-cols-2 gap-6" : "masonry-grid"}>
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-dark-card rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">No blog posts found yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`block bg-white dark:bg-dark-card rounded-lg shadow hover:shadow-lg transition-all p-6 hover:scale-105 ${posts.length > 2 ? 'masonry-item' : ''}`}
            >
              <article>
                {post.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                )}

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
          ))
        )}
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
