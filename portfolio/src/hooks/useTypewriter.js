import { useEffect, useState, useRef } from 'react';

export function useTypewriter(text, {
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseAfter = 2000,
  pauseBefore = 600,
} = {}) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const deletingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    function tick() {
      if (!deletingRef.current) {
        // Typing forward
        indexRef.current++;
        setDisplayed(text.substring(0, indexRef.current));
        if (indexRef.current > text.length) {
          deletingRef.current = true;
          timerRef.current = setTimeout(tick, pauseAfter);
          return;
        }
        timerRef.current = setTimeout(tick, typingSpeed);
      } else {
        // Deleting backward
        indexRef.current--;
        setDisplayed(text.substring(0, indexRef.current));
        if (indexRef.current < 0) {
          deletingRef.current = false;
          indexRef.current = 0;
          setDisplayed('');
          timerRef.current = setTimeout(tick, pauseBefore);
          return;
        }
        timerRef.current = setTimeout(tick, deletingSpeed);
      }
    }

    timerRef.current = setTimeout(tick, 600);
    return () => clearTimeout(timerRef.current);
  }, [text, typingSpeed, deletingSpeed, pauseAfter, pauseBefore]);

  return displayed;
}
