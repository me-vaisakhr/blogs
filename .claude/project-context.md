# Journey Blog - Project Context

> This document provides comprehensive context about the "Journey" blog project for AI assistants. Last updated: 2025-10-25

## Project Overview

A modern, developer-focused blog platform built with Next.js 16, featuring markdown-based content management, dark mode support, and syntax-highlighted code blocks. Designed for technical content creators who want a simple, file-based CMS with a sophisticated reading experience.

---

## Technology Stack

### Core Framework
- **Next.js 16.0.0** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Full type safety throughout

### Styling
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - Vendor prefixing
- **Dark Mode**: Class-based (`darkMode: 'class'` in tailwind.config.ts)

### Markdown & Content Processing
- **react-markdown 10.1.0** - Markdown to React components
- **gray-matter 4.0.3** - YAML frontmatter parser
- **remark-gfm 4.0.1** - GitHub Flavored Markdown
- **rehype-raw 7.0.0** - Parse raw HTML in markdown
- **reading-time 1.5.0** - Reading time calculation

### Code Highlighting
- **highlight.js 11.11.1** - Syntax highlighting with VS2015 theme
- Supports: JavaScript, TypeScript, JSX, TSX, JSON, Bash, CSS, HTML

### Theme Management
- **next-themes 0.4.6** - Dark/light mode with system detection and localStorage persistence

### Build Tools
- **Bun** - JavaScript runtime (all scripts use `bun --bun`)
- **ESLint 9.38.0** + eslint-config-next 16.0.0

---

## Project Structure

```
/Users/vaisakhrkrishnan/Documents/personal/blogs/
├── app/                                    # Next.js App Router
│   ├── blog/[slug]/page.tsx               # Dynamic blog post pages
│   ├── category/[category]/page.tsx       # Category filtering
│   ├── components/
│   │   ├── CodeBlock.tsx                  # Syntax highlighting component
│   │   ├── ThemeProvider.tsx              # next-themes wrapper
│   │   ├── ThemeToggle.tsx                # Sun/moon theme toggle button
│   │   ├── ReadingProgress.tsx            # Scroll progress bar
│   │   ├── Breadcrumbs.tsx                # Navigation breadcrumbs
│   │   └── Footer.tsx                     # Site footer with social links
│   ├── privacy/page.tsx                   # Privacy policy
│   ├── terms/page.tsx                     # Terms of use
│   ├── page.tsx                           # Home page (blog listing)
│   ├── layout.tsx                         # Root layout with theme provider
│   └── globals.css                        # Global styles & markdown prose
├── lib/
│   └── markdown.ts                        # Blog post utilities & file reader
├── posts/                                 # Markdown blog posts directory
│   └── react-component-composition.md     # Sample post
├── .claude/                               # Claude-specific context
│   └── project-context.md                 # This file
├── Configuration files:
│   ├── next.config.ts                     # Next.js config (CSS path alias)
│   ├── tailwind.config.ts                 # Tailwind with dark theme colors
│   ├── tsconfig.json                      # TypeScript config
│   ├── postcss.config.mjs                 # PostCSS config
│   ├── .eslintrc.json                     # ESLint rules
│   └── package.json                       # Dependencies & scripts
└── README.md                              # User-facing documentation
```

---

## Component Architecture

### Location: `app/components/`

#### 1. **CodeBlock.tsx** (`app/components/CodeBlock.tsx`)
- **Purpose**: Custom syntax highlighting for markdown code blocks
- **Key Features**:
  - Registers 8+ languages (js, ts, jsx, tsx, json, bash, css, html)
  - Displays language label in top-left corner
  - Uses highlight.js with hljs.highlightAuto()
  - Dark background (#1e1e1e) with rounded corners
- **Props**: `{ language?: string; children: string }`
- **Client Component**: Yes (`'use client'`)

#### 2. **ThemeProvider.tsx** (`app/components/ThemeProvider.tsx`)
- **Purpose**: Wraps app with next-themes ThemeProvider
- **Configuration**:
  - `attribute="class"` - Uses CSS class for dark mode
  - `defaultTheme="system"` - Respects system preference
  - `enableSystem={true}` - System detection enabled
- **Client Component**: Yes

#### 3. **ThemeToggle.tsx** (`app/components/ThemeToggle.tsx`)
- **Purpose**: Theme toggle button (sun/moon icons)
- **Key Features**:
  - SVG icons (sun for light, moon for dark)
  - Mounted state check to prevent hydration mismatch
  - Returns null until mounted to avoid server/client mismatch
- **Client Component**: Yes

#### 4. **ReadingProgress.tsx** (`app/components/ReadingProgress.tsx`)
- **Purpose**: Fixed scroll progress indicator at top of page
- **Key Features**:
  - Fixed position at top (z-50)
  - Gradient: blue → purple → pink
  - Uses `requestAnimationFrame` for performance
  - Width updates based on scroll percentage
- **Client Component**: Yes

#### 5. **Breadcrumbs.tsx** (`app/components/Breadcrumbs.tsx`)
- **Purpose**: Navigation breadcrumb trail
- **Key Features**:
  - Generates links from pathname segments
  - Current page is bold and non-interactive
  - Arrow separator between links
  - Capitalizes segment names
- **Props**: None (uses `usePathname()`)
- **Client Component**: Yes

#### 6. **Footer.tsx** (`app/components/Footer.tsx`)
- **Purpose**: Site footer with brand, links, and social media
- **Structure**:
  - 3-column layout (brand, quick links, social)
  - Brand section: "Journey" title + tagline
  - Quick links: Privacy, Terms, Contact
  - Social links: GitHub, X/Twitter, Bluesky, CodePen, LinkedIn
- **Client Component**: No (server component)

---

## Pages & Routes

### Route Mapping

| Route | File | Purpose | Static Generation |
|-------|------|---------|-------------------|
| `/` | `app/page.tsx` | Home page with masonry blog list | Yes |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Individual blog post | Yes (`generateStaticParams`) |
| `/category/[category]` | `app/category/[category]/page.tsx` | Category-filtered list | Yes (`generateStaticParams`) |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy | Yes |
| `/terms` | `app/terms/page.tsx` | Terms of use | Yes |

### Dynamic Route Details

**`/blog/[slug]`** (`app/blog/[slug]/page.tsx`):
- Fetches post via `getPostBySlug(slug)`
- Returns 404 if post not found
- Includes: ReadingProgress, Breadcrumbs, markdown rendering, tags, date
- Uses `generateMetadata()` for SEO
- Uses `generateStaticParams()` to pre-render all posts

**`/category/[category]`** (`app/category/[category]/page.tsx`):
- Filters posts by category
- Uses same masonry layout as home page
- Pre-generates all category pages

---

## Content Management System

### File: `lib/markdown.ts`

#### BlogPost Interface
```typescript
interface BlogPost {
  slug: string;              // Filename without .md
  title: string;             // From frontmatter or first # heading
  date?: string;             // ISO date string
  category?: string;         // Single category string
  description?: string;      // Brief description
  tags?: string[];           // Array of tag strings
  content: string;           // Raw markdown content
  readingTime: string;       // "X min read" format
}
```

#### Key Functions

**`getAllPosts(): BlogPost[]`**
- Reads all `.md` files from `posts/` directory
- Ignores `README.md`
- Parses YAML frontmatter with gray-matter
- Calculates reading time
- Sorts by date (newest first)
- Fallback: Extracts title from first `# Heading` if no frontmatter

**`getPostBySlug(slug: string): BlogPost | null`**
- Reads single post by filename (without .md)
- Returns null if not found
- Same parsing as getAllPosts()

### Blog Post Structure

#### Frontmatter (YAML) - Optional
```yaml
---
title: "Your Post Title"
date: "2024-10-24"
category: "React"
description: "Brief description for SEO and preview"
tags: ["react", "typescript", "components"]
---
```

#### Special Embed Syntax
Posts support `{% embed URL %}` syntax for embedding content:
```markdown
{% embed https://codesandbox.io/embed/abc123 %}
```
- Automatically converts to iframe
- Special handling for CodeSandbox with proper sandbox attributes
- Rendered in `app/globals.css` with `.embed-container` styles

### Adding New Posts

1. Create `posts/your-post-slug.md`
2. Add frontmatter (optional)
3. Write markdown content
4. Post automatically appears on home page
5. Category page auto-generated if new category used

---

## Styling System

### Tailwind Configuration (`tailwind.config.ts`)

**Custom Dark Theme Colors:**
```javascript
colors: {
  'dark-bg': '#1a1a1a',      // Main background
  'dark-card': '#2d2d2d',    // Card backgrounds
  'dark-border': '#404040',  // Borders
}
```

**Dark Mode:** Class-based (`darkMode: 'class'`)

### Global Styles (`app/globals.css`)

**Custom CSS Classes:**
- `.prose` - Markdown typography (h1-h6, p, a, ul, ol, blockquote)
- `.prose code` - Inline code with pink highlight
- `.prose pre` - Code blocks with dark background
- `.prose blockquote` - Left blue border accent
- `.prose img` - Rounded corners with shadow
- `.masonry` - Multi-column layout (1→2→3 columns)
- `.embed-container` - Full-width iframe container (500px min height)

**Responsive Breakpoints:**
- Mobile: 1 column
- Tablet (768px+): 2 columns
- Desktop (1024px+): 3 columns

---

## Key Features

### 1. Blog Display
- Masonry grid layout (responsive columns)
- Post cards show: title, reading time ☕, date, description, tags, category badge
- Hover effects: scale(1.02) and shadow animations
- Gradient heading: blue → purple → pink

### 2. Reading Experience
- Scroll progress bar (gradient, fixed top)
- Breadcrumb navigation
- Clean typography (line-height: 1.75)
- Syntax highlighting for code blocks
- Language labels on code blocks
- Responsive design (mobile/tablet/desktop)

### 3. Theme System
- Dark/light mode toggle
- System preference detection
- localStorage persistence
- All components support both themes
- Smooth transitions

### 4. Navigation
- Home page with all posts
- Category filtering (`/category/react`, etc.)
- Individual post pages (`/blog/slug`)
- Breadcrumbs showing current location
- Footer with quick links and social media

### 5. Content Features
- Markdown with GFM support
- YAML frontmatter (optional)
- Auto-extracted titles from headings
- Reading time calculation
- Tag system for organization
- Category system for filtering
- CodeSandbox embed support

### 6. SEO & Performance
- Dynamic `generateMetadata()` per page
- Static generation with `generateStaticParams()`
- Optimized images with next/image
- Type-safe throughout

---

## Development Conventions

### File Naming
- Components: PascalCase (e.g., `CodeBlock.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Utilities: camelCase (e.g., `markdown.ts`)

### Component Patterns
- Interactive components: `'use client'` directive
- Server components by default
- TypeScript interfaces for all props
- Proper hydration handling (mounted state checks)

### Styling Patterns
- Tailwind utility classes preferred
- Custom CSS only for complex layouts (masonry, prose)
- Dark mode: `dark:` prefix for all theme-specific styles
- Responsive: Mobile-first approach

### Git Workflow
- Main branch: `main`
- Current status: Uncommitted changes to README.md
- Recent commits focused on blog composition post

---

## Current State

### Content
- **1 Blog Post**: `react-component-composition.md` (React component patterns)
- **Categories**: React
- **Tags**: react, components, architecture, typescript, frontend

### Uncommitted Changes
- Modified: `README.md`
- Deleted: `react-component-composition.md` (staged)
- Untracked: Multiple new files (Next.js project files)

### Sample Post
`posts/react-component-composition.md`:
- ~440 lines
- Demonstrates component composition patterns
- Includes working CodeSandbox embed
- Shows complexity levels 1-5 with solutions

---

## Known Patterns & Quirks

### 1. Embed Processing
- Custom embed syntax: `{% embed URL %}`
- Processed in markdown rendering
- Converts to iframe with sandbox attributes
- CodeSandbox has special handling

### 2. Title Extraction
- Priority: Frontmatter `title` field
- Fallback: First `# Heading` in markdown
- Used for metadata and display

### 3. Hydration Safety
- Theme toggle checks `mounted` state
- Returns null on server to prevent mismatch
- All client components properly marked

### 4. Reading Time
- Uses `reading-time` package
- Calculates words per minute
- Displays with ☕ emoji

### 5. Category Pages
- Auto-generated from post categories
- Uses `generateStaticParams()`
- No manual route configuration needed

---

## Extension Points

### Adding New Features

**New Component:**
1. Create in `app/components/`
2. Add `'use client'` if interactive
3. Define TypeScript interface for props
4. Support dark mode with `dark:` classes

**New Page:**
1. Create in `app/[name]/page.tsx`
2. Export default component
3. Add `generateMetadata()` for SEO
4. Update Footer links if needed

**New Content Type:**
1. Extend `BlogPost` interface in `lib/markdown.ts`
2. Update frontmatter parsing
3. Modify display components

**New Embed Type:**
1. Add regex pattern in markdown processing
2. Define iframe sandbox attributes
3. Style in `app/globals.css`

---

## External Links & Resources

### Social Media (from Footer.tsx)
- GitHub: https://github.com/vaisakh
- X/Twitter: https://x.com/vaisakh_rk
- Bluesky: https://bsky.app/profile/vaisakh.bsky.social
- CodePen: https://codepen.io/vaisakh
- LinkedIn: https://linkedin.com/in/vaisakh-rk

### Documentation
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- react-markdown: https://github.com/remarkjs/react-markdown

---

## Common Tasks

### Add a Blog Post
```bash
# Create new file in posts/
touch posts/my-new-post.md

# Add frontmatter and content
# Post automatically appears on home page
# Build will regenerate static pages
```

### Change Theme Colors
Edit `tailwind.config.ts` → `extend.colors`

### Add New Component
```bash
# Create component file
touch app/components/NewComponent.tsx

# Import in page/layout where needed
```

### Update Footer Links
Edit `app/components/Footer.tsx`

---

## Performance Considerations

- **Static Generation**: All pages pre-rendered at build time
- **Code Splitting**: Automatic per-page code splitting
- **Image Optimization**: Use next/image for images
- **Reading Progress**: Uses requestAnimationFrame for smooth updates
- **Highlight.js**: Loaded per code block, not globally

---

## Future Enhancement Ideas

- Search functionality
- RSS feed generation
- Table of contents for long posts
- Related posts suggestions
- Comments system integration
- Analytics integration
- Sitemap generation
- OG image generation per post

---

*This context file should be updated when significant architectural changes are made to the project.*
