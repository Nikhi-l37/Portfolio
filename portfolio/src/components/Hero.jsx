import { useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import Button from './Button';
import profileImg from '../assets/Nikhil.jpg';
import { useTheme } from '../hooks/useTheme';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ===== Bouncing Letters Background - NIKHIL ===== */
function BouncingLettersBackground({ mouseRef }) {
  const canvasRef = useRef(null);
  const lettersRef = useRef(null);
  const phaseRef = useRef('aligned'); // 'aligned' | 'blasting' | 'bouncing'
  const blastTimeRef = useRef(null);
  const shockwaveRef = useRef({ active: false, radius: 0, alpha: 0 });
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    // Pre-computed color arrays (avoid string replace every frame)
    const COLOR_RGB = [
      [34, 211, 238],
      [167, 139, 250],
      [129, 140, 248],
      [96, 165, 250],
      [192, 132, 252],
      [45, 212, 191],
    ];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const CHARS = ['N', 'I', 'K', 'H', 'I', 'L'];

    // Helper: rgba string from pre-computed RGB array
    const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    // Create letters in aligned formation (centered, spelling NIKHIL)
    const createLetters = () => {
      const baseSize = Math.min(w, h) * 0.13;
      const spacing = baseSize * 0.78;
      const totalWidth = (CHARS.length - 1) * spacing;
      const startX = (w - totalWidth) / 2;
      const centerY = h * 0.46;

      return CHARS.map((char, i) => {
        const size = baseSize + Math.random() * 15;
        return {
          char,
          x: startX + i * spacing,
          y: centerY,
          homeX: startX + i * spacing,
          homeY: centerY,
          vx: 0,
          vy: 0,
          size,
          rotation: 0,
          rotSpeed: 0,
          rgb: COLOR_RGB[i % COLOR_RGB.length],
          fillAlpha: 0.15 + Math.random() * 0.06,
          strokeAlpha: 0.25 + Math.random() * 0.10,
          bounceFlash: 0,
          breathOffset: Math.random() * Math.PI * 2,
        };
      });
    };
    lettersRef.current = createLetters();

    let rafId;
    const startTime = performance.now();
    const BLAST_DELAY = 5000;
    const BLAST_DURATION = 600;
    const BOUNCE_SPEED = 1.15;
    const MAX_SPEED = 5;
    const FRICTION = 0.999;
    const MOUSE_RADIUS = 180;
    const MOUSE_FORCE = 0.12;

    const animate = (now) => {
      ctx.clearRect(0, 0, w, h);
      const elapsed = now - startTime;
      const phase = phaseRef.current;

      // Phase transition: aligned -> blasting
      if (phase === 'aligned' && elapsed >= BLAST_DELAY) {
        phaseRef.current = 'blasting';
        blastTimeRef.current = now;

        const cx = w / 2;
        const cy = h * 0.46;
        lettersRef.current.forEach((L) => {
          const dx = L.x - cx;
          const dy = L.y - cy;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 40);
          const blastForce = 8 + Math.random() * 6;
          L.vx = (dx / dist) * blastForce + (Math.random() - 0.5) * 5;
          L.vy = (dy / dist) * blastForce + (Math.random() - 0.5) * 5;
          L.rotSpeed = (Math.random() - 0.5) * 0.04;
          L.fillAlpha = 0.09 + Math.random() * 0.05;
          L.strokeAlpha = 0.14 + Math.random() * 0.06;
          L.bounceFlash = 1;
          L.size = L.size * 1.25; // grow on blast
        });

        shockwaveRef.current = { active: true, radius: 0, alpha: 0.6 };
      }

      // Phase transition: blasting -> bouncing
      if (phase === 'blasting' && blastTimeRef.current && now - blastTimeRef.current > BLAST_DURATION) {
        phaseRef.current = 'bouncing';
      }

      const currentPhase = phaseRef.current;

      lettersRef.current.forEach((L) => {
        if (currentPhase === 'aligned') {
          // Gentle breathing float around home position
          const breathX = Math.sin(elapsed * 0.001 + L.breathOffset) * 8;
          const breathY = Math.cos(elapsed * 0.0013 + L.breathOffset * 1.3) * 6;
          L.x = L.homeX + breathX;
          L.y = L.homeY + breathY;
          L.rotation = Math.sin(elapsed * 0.0008 + L.breathOffset) * 0.04;
        } else {
          // Physics-based movement (blasting + bouncing)

          // Mouse repulsion only in bouncing phase
          if (currentPhase === 'bouncing') {
            const mdx = L.x - mouseRef.current.x;
            const mdy = L.y - mouseRef.current.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < MOUSE_RADIUS && mdist > 1) {
              const force = ((MOUSE_RADIUS - mdist) / MOUSE_RADIUS) * MOUSE_FORCE;
              L.vx += (mdx / mdist) * force;
              L.vy += (mdy / mdist) * force;
            }
          }

          L.x += L.vx;
          L.y += L.vy;
          L.rotation += L.rotSpeed;
          L.vx *= FRICTION;
          L.vy *= FRICTION;

          // Wall bounce
          const pad = L.size * 0.4;
          let bounced = false;
          if (L.x < pad) { L.x = pad; L.vx = Math.abs(L.vx) * BOUNCE_SPEED; bounced = true; }
          if (L.x > w - pad) { L.x = w - pad; L.vx = -Math.abs(L.vx) * BOUNCE_SPEED; bounced = true; }
          if (L.y < pad) { L.y = pad; L.vy = Math.abs(L.vy) * BOUNCE_SPEED; bounced = true; }
          if (L.y > h - pad) { L.y = h - pad; L.vy = -Math.abs(L.vy) * BOUNCE_SPEED; bounced = true; }

          if (bounced) {
            L.bounceFlash = 1;
            L.rotSpeed = (Math.random() - 0.5) * 0.01;
          }

          // Speed cap
          const spd = Math.sqrt(L.vx * L.vx + L.vy * L.vy);
          if (spd > MAX_SPEED) {
            L.vx = (L.vx / spd) * MAX_SPEED;
            L.vy = (L.vy / spd) * MAX_SPEED;
          }
          // Ensure minimum speed in bouncing phase
          if (currentPhase === 'bouncing' && spd < 0.5) {
            const a = Math.random() * Math.PI * 2;
            L.vx = Math.cos(a) * 0.8;
            L.vy = Math.sin(a) * 0.8;
          }
        }

        // Decay bounce flash
        L.bounceFlash *= 0.92;
      });

      // --- Letter-to-letter collision detection ---
      if (currentPhase !== 'aligned') {
        const letters = lettersRef.current;
        for (let i = 0; i < letters.length; i++) {
          for (let j = i + 1; j < letters.length; j++) {
            const A = letters[i];
            const B = letters[j];
            const dx = B.x - A.x;
            const dy = B.y - A.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = (A.size + B.size) * 0.38;

            if (dist < minDist && dist > 0.1) {
              // Normal vector
              const nx = dx / dist;
              const ny = dy / dist;

              // Separate letters so they don't overlap
              const overlap = (minDist - dist) / 2;
              A.x -= nx * overlap;
              A.y -= ny * overlap;
              B.x += nx * overlap;
              B.y += ny * overlap;

              // Elastic velocity swap along collision normal
              const dvx = A.vx - B.vx;
              const dvy = A.vy - B.vy;
              const dot = dvx * nx + dvy * ny;

              if (dot > 0) {
                A.vx -= dot * nx * 0.8;
                A.vy -= dot * ny * 0.8;
                B.vx += dot * nx * 0.8;
                B.vy += dot * ny * 0.8;
              }

              // Flash both letters
              A.bounceFlash = Math.max(A.bounceFlash, 0.8);
              B.bounceFlash = Math.max(B.bounceFlash, 0.8);
              A.rotSpeed = (Math.random() - 0.5) * 0.015;
              B.rotSpeed = (Math.random() - 0.5) * 0.015;

              // Spawn collision sparks (limited for perf)
              const midX = (A.x + B.x) / 2;
              const midY = (A.y + B.y) / 2;
              const sparkRgb = Math.random() > 0.5 ? A.rgb : B.rgb;
              for (let s = 0; s < 3; s++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 2.5;
                sparksRef.current.push({
                  x: midX,
                  y: midY,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  life: 1,
                  decay: 0.03 + Math.random() * 0.02,
                  size: 2 + Math.random() * 2,
                  rgb: sparkRgb,
                });
              }
            }
          }
        }
      }

      // --- Update & draw collision sparks (no shadowBlur for perf) ---
      sparksRef.current = sparksRef.current.filter((sp) => sp.life > 0.02);
      for (let si = 0; si < sparksRef.current.length; si++) {
        const sp = sparksRef.current[si];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.life -= sp.decay;

        const r = sp.size * sp.life;
        if (r > 0.1) {
          ctx.globalAlpha = sp.life * 0.9;
          ctx.fillStyle = rgba(sp.rgb, 0.95);
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // --- Draw letters (subtle background — low alpha, no heavy glow) ---
      for (let li = 0; li < lettersRef.current.length; li++) {
        const L = lettersRef.current[li];
        const flashBoost = L.bounceFlash * 0.1;
        const fAlpha = Math.min(L.fillAlpha + flashBoost, 0.18);
        const sAlpha = Math.min(L.strokeAlpha + flashBoost, 0.22);
        const isBouncing = currentPhase === 'bouncing' || currentPhase === 'blasting';

        ctx.save();
        ctx.translate(L.x, L.y);
        ctx.rotate(L.rotation);
        ctx.font = `800 ${L.size}px 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Soft outer glow pass
        if (isBouncing) {
          ctx.strokeStyle = rgba(L.rgb, fAlpha * 0.2);
          ctx.lineWidth = 8;
          ctx.strokeText(L.char, 0, 0);
        }

        // Fill
        ctx.fillStyle = rgba(L.rgb, fAlpha);
        ctx.fillText(L.char, 0, 0);

        // Crisp stroke
        ctx.strokeStyle = rgba(L.rgb, sAlpha);
        ctx.lineWidth = isBouncing ? 2 : 1.5;
        ctx.strokeText(L.char, 0, 0);

        ctx.restore();
      }

      // Draw shockwave ring (no ctx.filter for perf)
      const sw = shockwaveRef.current;
      if (sw.active) {
        sw.radius += 14;
        sw.alpha *= 0.93;
        if (sw.alpha < 0.01) {
          sw.active = false;
        } else {
          const cx = w / 2;
          const cy = h * 0.46;

          ctx.save();
          // Outer ring
          ctx.beginPath();
          ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(129,140,248,${sw.alpha})`;
          ctx.lineWidth = 3;
          ctx.stroke();

          // Inner glow ring (thicker, lower alpha — cheap glow)
          ctx.beginPath();
          ctx.arc(cx, cy, sw.radius * 0.92, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(167,139,250,${sw.alpha * 0.25})`;
          ctx.lineWidth = 12;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Center flash during blast
      if (currentPhase === 'blasting' && blastTimeRef.current) {
        const blastElapsed = now - blastTimeRef.current;
        const flashAlpha = Math.max(0, 0.35 * (1 - blastElapsed / BLAST_DURATION));
        if (flashAlpha > 0.01) {
          const cx = w / 2;
          const cy = h * 0.46;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 250);
          grad.addColorStop(0, `rgba(200,210,255,${flashAlpha})`);
          grad.addColorStop(0.4, `rgba(129,140,248,${flashAlpha * 0.4})`);
          grad.addColorStop(1, 'rgba(200,200,255,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      const oldW = w;
      const oldH = h;
      resize();

      if (phaseRef.current === 'aligned') {
        // Recalculate home positions
        const baseSize = Math.min(w, h) * 0.13;
        const spacing = baseSize * 0.78;
        const totalWidth = (CHARS.length - 1) * spacing;
        const startX = (w - totalWidth) / 2;
        const centerY = h * 0.46;
        lettersRef.current.forEach((L, i) => {
          L.homeX = startX + i * spacing;
          L.homeY = centerY;
          L.x = L.homeX;
          L.y = L.homeY;
          L.size = baseSize + Math.random() * 15;
          L.rgb = COLOR_RGB[i % COLOR_RGB.length];
        });
      } else {
        lettersRef.current.forEach((L) => {
          L.x = (L.x / oldW) * w;
          L.y = (L.y / oldH) * h;
        });
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep navy-to-black base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020a1a] via-[#07112b] to-[#030712]" />

        {/* Subtle center glow so text area stays readable */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '70%', height: '55%', left: '15%', top: '22%',
            background: 'radial-gradient(ellipse at center, rgba(30,58,138,0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_45%,transparent_50%,rgba(2,10,26,0.5)_100%)]" />
      </div>

      {/* Canvas at section-level so z-index competes with z-10 content */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[5] pointer-events-none" />
    </>
  );
}

/* ===== Profile Photo Component ===== */
function ProfilePhoto({ isLight }) {
  return (
    <div className="photo-card relative group cursor-pointer">
      {/* Glow backdrop */}
      <div className={`absolute -inset-6 rounded-full bg-gradient-to-br ${isLight ? 'from-emerald-400/10 to-cyan-400/10' : 'from-emerald-500/15 to-cyan-500/15'}
                      blur-2xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-700 pointer-events-none`} />

      {/* Photo circle */}
      <div className={`relative w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden
                      ring-2 ${isLight ? 'ring-emerald-400/40' : 'ring-emerald-500/30'} ring-offset-4 ring-offset-background
                      transition-all duration-700 ease-out
                      ${isLight ? 'group-hover:ring-emerald-500/60 group-hover:shadow-[0_0_60px_rgba(16,185,129,0.15)]' : 'group-hover:ring-emerald-400/50 group-hover:shadow-[0_0_80px_rgba(16,185,129,0.2)]'}
                      group-hover:scale-[1.02]`}>
        <img
          src={profileImg}
          alt="Sivada Nikhil Reddy"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-top
                     grayscale-[15%] contrast-[1.05] brightness-[0.95]
                     transition-all duration-700 ease-out
                     group-hover:grayscale-0 group-hover:contrast-[1.1] group-hover:brightness-100
                     group-hover:scale-[1.05]"
        />
        {/* Shine sweep overlay */}
        <div className="shine rounded-full" />
      </div>

      {/* Outer ring - breathing */}
      <div className={`absolute -inset-4 rounded-full border ${isLight ? 'border-emerald-400/20' : 'border-emerald-500/15'} pointer-events-none
                      transition-all duration-700
                      ${isLight ? 'group-hover:border-emerald-500/40' : 'group-hover:border-emerald-400/30'}
                      animate-[pulse_3s_ease-in-out_infinite]`} />
    </div>
  );
}

/* ===== Social Links Component ===== */
function SocialLinks({ isLight }) {
  const links = [
    { icon: Github, href: 'https://github.com/NikhilReddy3446', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/nikhilreddy3446', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:snikhilreddy097@gmail.com', label: 'Email' },
  ];

  return (
    <div className="flex items-center gap-4">
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={`group relative p-3 rounded-full border transition-all duration-300
                     ${isLight
                       ? 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50'
                       : 'border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10'}
                     hover:scale-110 hover:-translate-y-1`}
        >
          <Icon className={`w-5 h-5 transition-colors duration-300
                           ${isLight ? 'text-slate-600 group-hover:text-emerald-600' : 'text-white/60 group-hover:text-emerald-400'}`} />
          <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl
                          ${isLight ? 'bg-emerald-400/20' : 'bg-emerald-500/30'}`} />
        </a>
      ))}
    </div>
  );
}

export default function Hero() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const profileRef = useRef(null);
  const greetingRef = useRef(null);
  const nameRef = useRef(null);
  const desc1Ref = useRef(null);
  const desc2Ref = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  // Use refs for mouse position — avoids re-rendering Hero on every mousemove
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    // Store pixel coordinates directly for canvas use
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const typedName = useTypewriter('Sivada Nikhil Reddy.', {
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseAfter: 2000,
    pauseBefore: 600,
  });

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline for entrance animations
      const tl = gsap.timeline({
        defaults: { 
          ease: 'power3.out',
          duration: 1 
        }
      });

      // Set initial states
      gsap.set([nameRef.current, ctaRef.current], {
        opacity: 0,
        y: 60,
      });
      gsap.set(profileRef.current, {
        opacity: 0,
        scale: 0.8,
        x: 50,
      });
      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
      });

      // --- SplitText for all text elements (except name) ---
      const splitGreeting = SplitText.create(greetingRef.current, { type: 'chars', mask: 'overflow' });
      const split1 = SplitText.create(desc1Ref.current, { type: 'words', mask: 'overflow' });
      const split2 = SplitText.create(desc2Ref.current, { type: 'words', mask: 'overflow' });

      // Set initial state - hidden below with 3D rotation
      gsap.set(splitGreeting.chars, { y: '100%', opacity: 0 });
      gsap.set(split1.words, { y: '100%', opacity: 0, rotateX: -80 });
      gsap.set(split2.words, { y: '100%', opacity: 0, rotateX: -80 });

      // Staggered entrance animation timeline
      // Greeting - character by character
      tl.to(splitGreeting.chars, {
        y: '0%',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.03,
      }, 0.3)
      .to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
      }, 0.5)
      .to(profileRef.current, {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      }, 0.4)
      // SplitText word-by-word roll for paragraph 1
      .to(split1.words, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.03,
      }, 0.8)
      // SplitText word-by-word roll for paragraph 2
      .to(split2.words, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.03,
      }, 1.4)
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 2.0)
      .to(scrollIndicatorRef.current, {
        opacity: 0.4,
        y: 0,
        duration: 0.6,
      }, 2.3);

      // Scroll-triggered parallax for content
      gsap.to(contentRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Profile photo subtle float on scroll
      gsap.to(profileRef.current, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });

      // Fade out scroll indicator when scrolling starts
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: -10,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '10% top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-70px)] md:min-h-screen flex items-center pt-[80px] md:pt-[120px] pb-10 md:pb-20 overflow-hidden"
    >
      {/* ===== Bouncing Letters Background ===== */}
      <BouncingLettersBackground mouseRef={mouseRef} />

      {/* ===== Profile Photo - Top Right ===== */}
      <div ref={profileRef} className="absolute top-24 md:top-32 right-6 md:right-16 lg:right-24 z-20">
        <ProfilePhoto isLight={isLight} />
      </div>

      {/* ===== Main Content ===== */}
      <div ref={contentRef} className="relative z-10 max-w-[1100px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left pt-8 md:pt-0">
            <div className="overflow-hidden" style={{ perspective: '600px' }}>
              <p ref={greetingRef} className="font-mono text-base text-cyan-400 mb-5 tracking-wider">Hi, my name is</p>
            </div>

            <div ref={nameRef}>
              <h1 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[1.1] mb-4 tracking-tighter relative whitespace-nowrap">
                <span className="inline relative">
                  <span className="invisible font-inherit pointer-events-none" aria-hidden="true">
                    Sivada Nikhil Reddy.
                  </span>
                  <span className="absolute left-0 top-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {typedName}
                  </span>
                  <span className="inline-block w-[3px] h-[0.85em] ml-0.5 bg-accent rounded-sm align-baseline relative top-[0.08em] animate-[blink-caret_0.75s_step-end_infinite]" />
                </span>
              </h1>
            </div>

            <div className="overflow-hidden" style={{ perspective: '600px' }}>
              <p ref={desc1Ref} className="text-[0.95rem] md:text-[1.05rem] text-slate-300 max-w-[540px] mx-auto lg:mx-0 mb-4 leading-relaxed">
                Full-Stack Developer focused on building{' '}
                <strong className="text-cyan-400 font-semibold">scalable backend systems</strong> and{' '}
                <strong className="text-cyan-400 font-semibold">clean, responsive web applications</strong>.
              </p>
            </div>

            <div className="overflow-hidden" style={{ perspective: '600px' }}>
              <p ref={desc2Ref} className="text-[0.9rem] md:text-[1rem] text-slate-400 max-w-[540px] mx-auto lg:mx-0 mb-5 md:mb-10 leading-relaxed">
                Strong in backend development with hands-on experience in{' '}
                <strong className="text-purple-400 font-medium">APIs</strong>,{' '}
                <strong className="text-purple-400 font-medium">databases</strong>, and{' '}
                <strong className="text-purple-400 font-medium">server-side logic</strong>.
                I also create modern, beautiful user interfaces using AI-assisted tools.
              </p>
            </div>

            <div ref={ctaRef}>
              <div className="flex flex-col items-center lg:items-start gap-6">
                <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
                  <Button href="#projects" withBurst>
                    <span>View My Work</span>
                    <i className="fa-solid fa-arrow-down" />
                  </Button>
                  <Button href="#contact" variant="outline">
                    <span>Get In Touch</span>
                    <i className="fa-solid fa-arrow-right" />
                  </Button>
                </div>
                
                <SocialLinks isLight={isLight} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ===== Scroll Indicator ===== */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#about"
          className={`flex flex-col items-center gap-2 
                     transition-opacity duration-300 hover:opacity-100
                     ${isLight ? 'opacity-100' : 'opacity-100'}`}
        >
          <span className={`text-xs font-medium tracking-wider uppercase
                           ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
            Scroll
          </span>
          <div className={`relative w-6 h-10 rounded-full border-2 flex justify-center
                          ${isLight ? 'border-slate-400' : 'border-white/30'}`}>
            <div className={`absolute top-2 w-1.5 h-1.5 rounded-full animate-[scrollBounce_2s_ease-in-out_infinite]
                            ${isLight ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
          </div>
          <ChevronDown className={`w-4 h-4 animate-bounce ${isLight ? 'text-slate-400' : 'text-white/40'}`} />
        </a>
      </div>
    </section>
  );
}
