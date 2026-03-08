import { useState, useEffect, useRef } from 'react';

/**
 * Wave Typewriter Effect Hook
 * Letters appear one-by-one from left to right,
 * then disappear one-by-one from right to left, in a loop.
 */
export function useWaveTypewriter(text, options = {}) {
  const {
    typeSpeed = 80,        // ms per character when revealing
    deleteSpeed = 50,      // ms per character when hiding
    pauseAfterType = 1500, // pause after full reveal before deleting
    pauseAfterDelete = 800, // pause after full delete before restarting
    startDelay = 500,      // initial delay before starting
  } = options;

  const [displayedChars, setDisplayedChars] = useState(0);
  const [phase, setPhase] = useState('waiting'); // waiting | typing | paused | deleting | pausedEmpty
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Start after initial delay
    timeoutRef.current = setTimeout(() => {
      setPhase('typing');
    }, startDelay);

    return () => clearTimeout(timeoutRef.current);
  }, [startDelay]);

  useEffect(() => {
    if (phase === 'waiting') return;

    const totalChars = text.length;

    if (phase === 'typing') {
      if (displayedChars < totalChars) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedChars((c) => c + 1);
        }, typeSpeed);
      } else {
        // Finished typing, pause
        timeoutRef.current = setTimeout(() => {
          setPhase('deleting');
        }, pauseAfterType);
      }
    } else if (phase === 'deleting') {
      if (displayedChars > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedChars((c) => c - 1);
        }, deleteSpeed);
      } else {
        // Finished deleting, pause then restart
        timeoutRef.current = setTimeout(() => {
          setPhase('typing');
        }, pauseAfterDelete);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [phase, displayedChars, text, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  // Return the visible portion of text
  return text.slice(0, displayedChars);
}
