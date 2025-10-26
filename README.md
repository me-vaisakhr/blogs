# Blog Previewer 📝

A clean, modern blog previewer built with Next.js, TypeScript, Tailwind CSS, and Bun.

## Features ✨

- 📖 Markdown rendering with syntax highlighting
- ⏱️ Reading time calculation
- 🎨 Clean, responsive design with Tailwind CSS
- 🚀 Fast development with Bun
- 📱 Mobile-friendly
- 🔍 SEO-friendly with metadata

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Bun** - Fast JavaScript runtime
- **react-markdown** - Markdown rendering
- **gray-matter** - Frontmatter parsing
- **rehype-highlight** - Code syntax highlighting
- **reading-time** - Reading time estimation

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

## Project Structure

```
blogs/
├── app/
│   ├── blog/[slug]/
│   │   └── page.tsx      # Individual blog post page
│   ├── components/
│   │   └── CodeBlock.tsx # Custom code highlighting
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (blog list)
├── lib/
│   └── markdown.ts       # Markdown utilities
├── posts/                # Your blog posts go here
│   └── *.md              # Markdown files
├── package.json
└── README.md
```

## Adding Blog Posts

Blog posts are read from the `posts/` directory. The previewer looks for all `.md` files except `README.md`.

### Frontmatter (Optional)

Add frontmatter to your markdown files for better metadata:

\`\`\`markdown
---
title: "Your Blog Post Title"
date: "2024-01-15"
description: "A brief description of your post"
tags: ["react", "typescript", "nextjs"]
---

# Your Blog Post Title

Your content here...
\`\`\`

### Without Frontmatter

If you don't add frontmatter, the previewer will:
- Extract the title from the first `# Heading` in your markdown
- Use the filename as the slug
- Calculate reading time automatically

## Features in Detail

### Code Syntax Highlighting

Code blocks are automatically highlighted with GitHub Dark theme.

### Reading Time

Reading time is calculated automatically for each post and displayed with a ☕ emoji.

### Responsive Design

The blog is fully responsive and works great on mobile, tablet, and desktop.

## Development with Bun

This project is optimized for Bun. All scripts use `bun --bun` to ensure Bun's native runtime is used for maximum performance.

## License

MIT
