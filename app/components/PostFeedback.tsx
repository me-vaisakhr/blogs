'use client';

import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';

interface PostFeedbackProps {
  slug: string;
}

const EMOJI_RATINGS = [
  { emoji: '😞', label: 'Poor', value: 1, color: '#ef4444' },
  { emoji: '😐', label: 'Below Average', value: 2, color: '#f59e0b' },
  { emoji: '🙂', label: 'Good', value: 3, color: '#eab308' },
  { emoji: '😊', label: 'Great', value: 4, color: '#22c55e' },
  { emoji: '🤩', label: 'Amazing', value: 5, color: '#8b5cf6' },
];

export function PostFeedback({ slug }: PostFeedbackProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [clickedRating, setClickedRating] = useState<number | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const triggerConfetti = (buttonIndex: number, rating: typeof EMOJI_RATINGS[0]) => {
    const button = buttonRefs.current[buttonIndex];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Different confetti intensity based on rating
    const particleCount = rating.value * 15; // More emojis for higher ratings

    // Create custom emoji confetti
    const scalar = 2;
    const emoji = confetti.shapeFromText({ text: rating.emoji, scalar });

    const defaults = {
      spread: 360,
      ticks: 200,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
      shapes: [emoji],
      scalar
    };

    confetti({
      ...defaults,
      particleCount,
      origin: { x, y }
    });

    // Add extra burst for high ratings
    if (rating.value >= 4) {
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: rating.value * 10,
          origin: { x, y }
        });
      }, 200);
    }
  };

  const handleRating = async (value: number, index: number) => {
    const rating = EMOJI_RATINGS.find(r => r.value === value);
    if (!rating) return;

    setClickedRating(value);
    triggerConfetti(index, rating);

    // Generate or retrieve session ID from localStorage
    let sessionId = '';
    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem('sessionId') || '';
      if (!sessionId) {
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('sessionId', sessionId);
      }
    }

    // Send feedback to API
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, rating: value, sessionId }),
      });
    } catch (error) {
      console.error('Failed to save feedback:', error);
    }

    // Delay to show animation before showing thank you message
    setTimeout(() => {
      setSelectedRating(value);
    }, 800);
  };

  const selectedEmoji = EMOJI_RATINGS.find(r => r.value === selectedRating);

  if (selectedRating) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border">
        <div className="text-center py-6 animate-fade-in">
          <div className="text-6xl mb-3 animate-bounce-once">
            {selectedEmoji?.emoji}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
            Thanks for your feedback!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-light">
          How did you find this post?
        </p>
        <div className="flex justify-center gap-4 pb-10">
          {EMOJI_RATINGS.map((rating, index) => (
            <button
              key={rating.value}
              ref={el => buttonRefs.current[index] = el}
              onClick={() => handleRating(rating.value, index)}
              onMouseEnter={() => setHoveredRating(rating.value)}
              onMouseLeave={() => setHoveredRating(null)}
              className="group relative transition-all duration-300"
              aria-label={`Rate ${rating.label}`}
              disabled={clickedRating !== null}
            >
              <div
                className={`
                  relative transition-all duration-300 ease-out
                  ${hoveredRating === rating.value ? 'scale-150 -translate-y-2' : 'scale-100'}
                  ${clickedRating === rating.value ? 'scale-[2] -translate-y-4' : ''}
                `}
              >
                <span
                  className="text-3xl cursor-pointer block filter drop-shadow-md"
                  style={{
                    textShadow: hoveredRating === rating.value
                      ? `0 0 20px ${rating.color}40`
                      : 'none'
                  }}
                >
                  {rating.emoji}
                </span>
              </div>

              {/* Hover label */}
              <span
                className={`
                  absolute -bottom-8 left-1/2 -translate-x-1/2
                  text-xs font-medium whitespace-nowrap px-2 py-1 rounded
                  bg-gray-800 dark:bg-gray-700 text-white
                  transition-all duration-300 ease-out
                  ${hoveredRating === rating.value && clickedRating === null
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                  }
                `}
              >
                {rating.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
