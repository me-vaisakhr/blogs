'use client';

import { useEffect, useRef, useState } from 'react';

interface ReadingTrackerProps {
  slug: string;
}

export default function ReadingTracker({ slug }: ReadingTrackerProps) {
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    const stored = localStorage.getItem('sessionId');
    if (stored) return stored;
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', newId);
    return newId;
  });

  const startTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const milestones = useRef({
    reached25: false,
    reached50: false,
    reached75: false,
    reached100: false,
  });
  const dataSent = useRef(false);

  // Calculate scroll depth percentage
  const calculateScrollDepth = (): number => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const trackHeight = documentHeight - windowHeight;

    if (trackHeight <= 0) return 100;

    const depth = Math.round((scrollTop / trackHeight) * 100);

    // Cap at 100% and handle edge cases
    // If user is within 50px of the bottom, consider it 100%
    if (scrollTop + windowHeight >= documentHeight - 50) {
      return 100;
    }

    return Math.min(depth, 100);
  };

  // Update scroll depth and milestones
  const updateScrollTracking = () => {
    const currentDepth = calculateScrollDepth();

    // Update max depth
    if (currentDepth > maxScrollDepth.current) {
      maxScrollDepth.current = currentDepth;
    }

    // Update milestones
    if (currentDepth >= 25) milestones.current.reached25 = true;
    if (currentDepth >= 50) milestones.current.reached50 = true;
    if (currentDepth >= 75) milestones.current.reached75 = true;
    if (currentDepth >= 100) milestones.current.reached100 = true;
  };

  // Send analytics data to server
  const sendAnalytics = async () => {
    if (dataSent.current) return;
    dataSent.current = true;

    const timeOnPage = Math.round((Date.now() - startTime.current) / 1000); // seconds
    const exitScrollPosition = calculateScrollDepth();

    const data = {
      slug,
      sessionId,
      maxScrollDepth: maxScrollDepth.current,
      reached25: milestones.current.reached25,
      reached50: milestones.current.reached50,
      reached75: milestones.current.reached75,
      reached100: milestones.current.reached100,
      timeOnPage,
      exitScrollPosition,
    };

    console.log('📊 Sending reading analytics:', data);

    try {
      // Use sendBeacon for more reliable sending on page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon('/api/reading-analytics', blob);
      } else {
        // Fallback to fetch
        await fetch('/api/reading-analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true,
        });
      }
    } catch (error) {
      console.error('Failed to send reading analytics:', error);
    }
  };

  useEffect(() => {
    // Track scroll events
    const handleScroll = () => {
      updateScrollTracking();
    };

    // Track page exit (visibility change or beforeunload)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendAnalytics();
      }
    };

    const handleBeforeUnload = () => {
      sendAnalytics();
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Initial scroll check
    updateScrollTracking();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slug, sessionId]);

  // This component doesn't render anything
  return null;
}
