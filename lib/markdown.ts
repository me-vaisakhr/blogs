import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface CrossPost {
  platform: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date?: string;
  category?: string;
  description?: string;
  tags?: string[];
  crossPosts?: CrossPost[];
  content: string;
  readingTime: string;
}

export function getAllPosts(): BlogPost[] {
  // Get all markdown files from posts directory
  const fileNames = fs.readdirSync(postsDirectory);
  const markdownFiles = fileNames.filter(fileName =>
    fileName.endsWith('.md') && fileName !== 'README.md'
  );

  const allPostsData = markdownFiles.map(fileName => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse frontmatter
    const { data, content } = matter(fileContents);

    // Calculate reading time
    const stats = readingTime(content);

    // Extract title from content if not in frontmatter
    let title = data.title || slug;
    if (!data.title) {
      // Try to get title from first h1 in content
      const match = content.match(/^#\s+(.+)$/m);
      if (match) {
        title = match[1];
      }
    }

    return {
      slug,
      title,
      date: data.date,
      category: data.category,
      description: data.description,
      tags: data.tags,
      crossPosts: data.crossPosts,
      content,
      readingTime: stats.text,
    };
  });

  // Sort posts by date if available
  return allPostsData.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    let title = data.title || slug;
    if (!data.title) {
      const match = content.match(/^#\s+(.+)$/m);
      if (match) {
        title = match[1];
      }
    }

    return {
      slug,
      title,
      date: data.date,
      category: data.category,
      description: data.description,
      tags: data.tags,
      crossPosts: data.crossPosts,
      content,
      readingTime: stats.text,
    };
  } catch (error) {
    return null;
  }
}
