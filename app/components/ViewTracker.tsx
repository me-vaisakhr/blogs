'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Track view on mount
    const trackView = async () => {
      // Generate or retrieve session ID from localStorage
      let sessionId = '';
      if (typeof window !== 'undefined') {
        sessionId = localStorage.getItem('sessionId') || '';
        if (!sessionId) {
          sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('sessionId', sessionId);
        }
      }

      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, sessionId }),
        });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [slug]);

  // This component doesn't render anything
  return null;
}
