import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter effect for placeholder text.
 * Cycles through an array of phrases, typing & deleting one letter at a time.
 * @param {string[]} phrases  – phrases to cycle through
 * @param {boolean}  active   – whether the animation should run
 * @param {object}   options  – speed tunables
 */
export function useTypewriterPlaceholder(
  phrases,
  active,
  { typingSpeed = 80, deletingSpeed = 50, pauseDelay = 2000 } = {},
) {
  const [text, setText] = useState('');
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!active || !phrases.length) {
      setText('');
      return;
    }

    // Reset indices when animation (re)starts
    phraseIdx.current = 0;
    charIdx.current = 0;
    deleting.current = false;
    setText('');

    const tick = () => {
      const phrase = phrases[phraseIdx.current];

      if (!deleting.current) {
        charIdx.current++;
        setText(phrase.slice(0, charIdx.current));

        if (charIdx.current === phrase.length) {
          // Finished typing — pause, then delete
          timer.current = setTimeout(() => {
            deleting.current = true;
            tick();
          }, pauseDelay);
          return;
        }
        timer.current = setTimeout(tick, typingSpeed);
      } else {
        charIdx.current--;
        setText(phrase.slice(0, charIdx.current));

        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
          timer.current = setTimeout(tick, 500);
          return;
        }
        timer.current = setTimeout(tick, deletingSpeed);
      }
    };

    timer.current = setTimeout(tick, 500);
    return () => clearTimeout(timer.current);
  }, [active, phrases, typingSpeed, deletingSpeed, pauseDelay]);

  return text;
}
