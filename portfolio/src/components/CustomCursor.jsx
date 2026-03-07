import { useEffect, useRef } from 'react';

/**
 * Custom cursor follower — lightweight single-RAF loop.
 * No mixBlendMode (extremely expensive compositor work).
 * No GSAP quickTo (4 tween engines per mousemove).
 * Uses raw CSS transforms for minimal overhead.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = 0, my = 0;         // actual mouse position
    let rx = 0, ry = 0;         // ring interpolated
    let hovering = false;
    let visible = false;
    let rafId = null;

    // RAF loop — only the ring lerps; dot is updated instantly in onMove
    const tick = () => {
      rx += (mx - rx) * 0.12;  // ring follows slow
      ry += (my - ry) * 0.12;

      ring.style.transform = `translate3d(${rx}px,${ry}px,0)${hovering ? ' scale(2)' : ''}`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      // Dot snaps instantly to the real cursor position — no lerp
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '0.6';
      }
    };

    const onEnter = () => { hovering = true; dot.style.opacity = '0.5'; };
    const onLeave = () => { hovering = false; dot.style.opacity = '1'; };

    const onOut = () => { visible = false; dot.style.opacity = '0'; ring.style.opacity = '0'; };
    const onOver = () => { visible = true; dot.style.opacity = '1'; ring.style.opacity = '0.6'; };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onOut);
    document.addEventListener('mouseenter', onOver);

    // Attach hover listeners to interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, .magnetic');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Debounced MutationObserver for dynamically added elements
    let moTimer = null;
    const mo = new MutationObserver(() => {
      clearTimeout(moTimer);
      moTimer = setTimeout(() => {
        const els = document.querySelectorAll('a, button, [role="button"], input, textarea, .magnetic');
        els.forEach((el) => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
      }, 1000);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onOut);
      document.removeEventListener('mouseenter', onOver);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      clearTimeout(moTimer);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          opacity: 0,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: '50%',
          border: '1.5px solid var(--color-accent)',
          opacity: 0,
          willChange: 'transform',
          transition: 'transform 0.15s ease-out',
        }}
      />
    </>
  );
}
