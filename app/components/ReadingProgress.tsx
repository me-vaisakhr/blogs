'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(scrollProgress);
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', requestUpdate);
  }, []);

  return (
    <div className="fixed top-16 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-40">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
