import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Premium preloader — shows a logo + progress bar,
 * then curtain-reveals the site with a GSAP animation.
 */
export default function Preloader({ onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const barRef = useRef(null);
  const barFillRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const bar = barRef.current;
    const barFill = barFillRef.current;
    if (!overlay || !logo || !bar || !barFill) {
      // Safety — if refs aren't ready, just complete immediately
      onComplete();
      return;
    }

    // Logo entrance
    gsap.fromTo(logo,
      { opacity: 0, scale: 0.5, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
    );

    // Progress bar fill → then curtain exit
    const tl = gsap.timeline({
      onComplete: () => {
        // Curtain reveal
        gsap.timeline({ onComplete })
          .to(logo, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in' })
          .to(bar, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '<')
          .to(overlay, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, 0.2);
      },
    });

    tl.to(
      { val: 0 },
      {
        val: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: function () {
          const v = Math.round(this.targets()[0].val);
          setProgress(v);
          barFill.style.width = `${v}%`;
        },
      }
    );

    // Safety timeout — if something goes wrong, reveal the site anyway
    const safety = setTimeout(onComplete, 4000);

    return () => {
      tl.kill();
      clearTimeout(safety);
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#020a1a]"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020a1a] via-[#07112b] to-[#030712]" />

      {/* Logo */}
      <div ref={logoRef} className="relative z-10 mb-8">
        <span className="font-mono text-3xl md:text-4xl font-bold tracking-tight">
          <span className="text-cyan-400">&lt;</span>
          <span className="text-white">NR</span>
          <span className="text-cyan-400"> /&gt;</span>
        </span>
      </div>

      {/* Progress bar */}
      <div ref={barRef} className="relative z-10 w-48 flex flex-col items-center gap-3">
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={barFillRef}
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
            style={{ width: '0%' }}
          />
        </div>
        <span className="font-mono text-xs text-white/40 tracking-widest">
          {progress}%
        </span>
      </div>
    </div>
  );
}
