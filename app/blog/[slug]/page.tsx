import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getAllPosts, getPostBySlug } from '@/lib/markdown';
import CodeBlock from '@/app/components/CodeBlock';
import { ReadingProgress } from '@/app/components/ReadingProgress';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PostFeedback } from '@/app/components/PostFeedback';
import { ViewTracker } from '@/app/components/ViewTracker';
import ReadingTracker from '@/app/components/ReadingTracker';
import 'highlight.js/styles/vs2015.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description || `Read ${post.title}`,
  };
}

// Function to process embed tags
function processEmbeds(content: string): string {
  // Convert {% embed URL %} to iframe
  return content.replace(
    /\{%\s*embed\s+(https?:\/\/[^\s]+)\s*%\}/g,
    (match, url) => {
      // Handle CodeSandbox embeds
      if (url.includes('codesandbox.io')) {
        return `\n\n<div class="embed-container"><iframe src="${url}" title="CodeSandbox Embed" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"></iframe></div>\n\n`;
      }
      // Generic iframe for other URLs
      return `\n\n<div class="embed-container"><iframe src="${url}" title="Embedded Content"></iframe></div>\n\n`;
    }
  );
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Process embeds in content
  const processedContent = processEmbeds(post.content);

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...(post.category ? [{ label: post.category, href: `/category/${post.category.toLowerCase()}` }] : []),
    { label: post.title },
  ];

  return (
    <>
      <ViewTracker slug={slug} />
      <ReadingTracker slug={slug} />
      <ReadingProgress />
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />

      <article className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-8 md:p-12">
        <header className="mb-8 border-b border-gray-200 dark:border-dark-border pb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>☕ {post.readingTime}</span>
            {post.date && (
              <>
                <span>•</span>
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                // Check if it's inline code (not in a pre block)
                const isInline = inline || !className;

                if (isInline) {
                  // Inline code - just return a simple code element
                  return (
                    <code {...props}>
                      {children}
                    </code>
                  );
                }

                // Block code - use our custom highlighter
                return (
                  <CodeBlock className={className}>
                    {String(children).replace(/\n$/, '')}
                  </CodeBlock>
                );
              },
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>

        {/* Cross-post links */}
        {post.crossPosts && post.crossPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">Share your thoughts on:</span>
              {post.crossPosts.map((crossPost, index) => (
                <a
                  key={index}
                  href={crossPost.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-4 py-1.5 bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-full text-sm font-light hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-all duration-300 ease-in-out"
                >
                  <span className="inline-flex items-center gap-0 group-hover:gap-1 transition-all duration-300">
                    {crossPost.platform}
                    <svg className="w-0 h-3 opacity-0 scale-0 group-hover:w-3 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Post Feedback */}
        <PostFeedback slug={post.slug} />
      </article>
      </div>
    </>
  );
}
