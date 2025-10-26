'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';

// Import language definitions
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml'; // For JSX/HTML

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('jsx', javascript); // Use JS for JSX
hljs.registerLanguage('tsx', typescript); // Use TS for TSX
hljs.registerLanguage('react', javascript); // Alias for React
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);

interface CodeBlockProps {
  children: string;
  className?: string;
}

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  jsx: 'React JSX',
  tsx: 'React TSX',
  react: 'React',
  json: 'JSON',
  bash: 'Bash',
  shell: 'Shell',
  css: 'CSS',
  html: 'HTML',
  xml: 'XML',
};

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Remove existing highlighting
      delete codeRef.current.dataset.highlighted;

      // Apply new highlighting
      hljs.highlightElement(codeRef.current);
    }
  }, [children, className]);

  // Extract language from className (format: language-javascript)
  const language = className?.replace('language-', '') || 'plaintext';
  const displayLanguage = languageLabels[language] || language.toUpperCase();

  return (
    <div className="relative">
      {language !== 'plaintext' && (
        <div className="absolute top-2 right-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {displayLanguage}
        </div>
      )}
      <code ref={codeRef} className={className || `language-${language}`}>
        {children}
      </code>
    </div>
  );
}
