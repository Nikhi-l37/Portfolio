import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Custom cursor follower — a dot + ring that smoothly tracks the mouse.
 * The ring expands on hovering interactive elements.
 * Hidden on mobile / touch devices via CSS.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // GSAP quickTo for buttery smooth following
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

    const onMove = (e) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    // Grow ring when hovering interactive elements
    const onEnter = () => {
      gsap.to(ring, { scale: 2, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.5, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    // Hide cursor when mouse leaves window
    const onOut = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };
    const onOver = () => {
      gsap.to(dot, { opacity: 1, duration: 0.2 });
      gsap.to(ring, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onOut);
    document.addEventListener('mouseenter', onOver);

    // Attach hover listeners to interactive elements
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, .magnetic');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Also handle dynamically added elements via MutationObserver
    const mo = new MutationObserver(() => {
      const newInteractives = document.querySelectorAll('a, button, [role="button"], input, textarea, .magnetic');
      newInteractives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onOut);
      document.removeEventListener('mouseenter', onOver);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      mo.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot — small center point */}
      <div
        ref={dotRef}
        className="custom-cursor-dot pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          mixBlendMode: 'difference',
        }}
      />
      {/* Ring — outer circle */}
      <div
        ref={ringRef}
        className="custom-cursor-ring pointer-events-none fixed top-0 left-0 z-[9998] hidden md:block"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: '50%',
          border: '1.5px solid var(--color-accent)',
          opacity: 0.6,
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
