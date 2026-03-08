import { useState, useRef, useCallback, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { useTheme } from '../hooks/useTheme';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';
import pageFlipSound from '../assets/freesound_community-small-page-103398.mp3';

/* ───────────── project data ───────────── */
const PROJECTS = [
  {
    title: 'Finder',
    subtitle: 'Product Availability & Shop Status App',
    description:
      'Implemented OTP-based seller login & dashboard. Built product search with live shop open/close status using Node.js, Express, and Supabase.',
    tags: ['Node.js', 'Express', 'Supabase', 'OTP Auth', 'REST API'],
    liveUrl: 'https://finder-xjof.onrender.com',
    icon: 'fa-solid fa-magnifying-glass',
    accent: 'emerald',
    status: 'live',
  },
  {
    title: 'Resume Filter',
    subtitle: 'Prototype — Resume Screening System',
    description:
      'Developing a resume screening system to filter candidates by skills and criteria. Streamlines the hiring process with intelligent matching.',
    tags: ['Node.js', 'Express', 'Filtering', 'Full-Stack'],
    liveUrl: 'https://jeevanhackthon.onrender.com',
    icon: 'fa-solid fa-file-lines',
    accent: 'cyan',
    status: 'prototype',
  },
  {
    title: 'Screen Tracker',
    subtitle: 'Android Screen Time & Habit Tracker',
    description:
      'Built an Android app to track screen time of selected apps, set usage rules, and generate streaks when users follow their limits.',
    tags: ['Android', 'Java', 'Screen Time', 'Habit Tracking'],
    repoUrl: 'https://github.com/Nikhi-137/Screen-Tracker',
    icon: 'fa-solid fa-mobile-screen',
    accent: 'purple',
    status: 'open-source',
  },
];

/* ───── dark-mode accents (default) ───── */
const ACCENT_DARK = {
  emerald: {
    iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-400',
    tagBg: 'bg-emerald-500/8 text-emerald-400/80 border-emerald-500/15',
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    glow: 'bg-emerald-500/6',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10', iconText: 'text-cyan-400',
    tagBg: 'bg-cyan-500/8 text-cyan-400/80 border-cyan-500/15',
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    glow: 'bg-cyan-500/6',
  },
  purple: {
    iconBg: 'bg-purple-500/10', iconText: 'text-purple-400',
    tagBg: 'bg-purple-500/8 text-purple-400/80 border-purple-500/15',
    gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
    glow: 'bg-purple-500/6',
  },
};

/* ───── light-mode accents — deeper shades for white pages ───── */
const ACCENT_LIGHT = {
  emerald: {
    iconBg: 'bg-emerald-600/15', iconText: 'text-emerald-700',
    tagBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    gradient: 'from-emerald-500/15 via-emerald-400/5 to-transparent',
    glow: 'bg-emerald-400/10',
  },
  cyan: {
    iconBg: 'bg-cyan-600/15', iconText: 'text-cyan-700',
    tagBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    gradient: 'from-cyan-500/15 via-cyan-400/5 to-transparent',
    glow: 'bg-cyan-400/10',
  },
  purple: {
    iconBg: 'bg-purple-600/15', iconText: 'text-purple-700',
    tagBg: 'bg-purple-100 text-purple-700 border-purple-200',
    gradient: 'from-purple-500/15 via-purple-400/5 to-transparent',
    glow: 'bg-purple-400/10',
  },
};

/* ───── status badges ───── */
const STATUS_DARK = {
  live:          { label: 'Live',        dotCls: 'bg-emerald-400 animate-pulse', cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  prototype:     { label: 'Prototype',   dotCls: 'bg-amber-400',                cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  'open-source': { label: 'Open Source', dotCls: 'bg-violet-400',               cls: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
};
const STATUS_LIGHT = {
  live:          { label: 'Live',        dotCls: 'bg-emerald-500 animate-pulse', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  prototype:     { label: 'Prototype',   dotCls: 'bg-amber-500',                cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  'open-source': { label: 'Open Source', dotCls: 'bg-violet-500',               cls: 'bg-violet-100 text-violet-700 border-violet-200' },
};

/* ───────────── real page-turn sound (MP3) ───────────── */
// Preload the audio so it's cached and plays instantly on click
const preloadedFlip = new Audio(pageFlipSound);
preloadedFlip.preload = 'auto';
preloadedFlip.load();

function playPageFlip() {
  try {
    // Clone the preloaded audio — allows overlapping plays and instant start
    const audio = preloadedFlip.cloneNode();
    audio.volume = 0.5;
    audio.play();
  } catch { /* silent */ }
}

/* ───────────── page content ───────────── */
function PageContent({ project, index, total, theme }) {
  const ACCENT = theme === 'light' ? ACCENT_LIGHT : ACCENT_DARK;
  const STATUS = theme === 'light' ? STATUS_LIGHT : STATUS_DARK;
  const a = ACCENT[project.accent] || ACCENT.emerald;
  const s = STATUS[project.status] || STATUS.live;

  return (
    <div className="relative h-full flex flex-col p-7 sm:p-10 overflow-hidden select-none">
      {/* Top gradient wash */}
      <div className={`absolute top-0 left-0 right-0 h-44 bg-gradient-to-b ${a.gradient} pointer-events-none`} />
      {/* Corner glow orb */}
      <div className={`absolute -top-20 -right-20 w-60 h-60 ${a.glow} rounded-full opacity-40 pointer-events-none`} />
      {/* Large watermark page number */}
      <span className="absolute -bottom-6 -right-3 text-[160px] sm:text-[200px] font-black leading-none select-none pointer-events-none opacity-[0.025] text-heading">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${a.iconBg} flex items-center justify-center`}>
              <i className={`${project.icon} text-xl sm:text-2xl ${a.iconText}`} />
            </div>
            {/* Status badge */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide ${s.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dotCls}`} />
              {s.label}
            </div>
          </div>
          <span className="font-mono text-xs text-dim tracking-wider">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-heading mb-1 leading-tight">
          {project.title}
        </h3>
        <p className={`text-sm font-semibold ${a.iconText} mb-4`}>{project.subtitle}</p>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dim/15 to-transparent" />
        </div>

        <p className="text-[0.95rem] text-muted leading-relaxed mb-6 max-w-lg">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span key={tag} className={`px-3 py-1 text-xs font-medium rounded-lg border ${a.tagBg}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-dim border border-accent/20
                          text-accent text-sm font-semibold rounded-full transition-all duration-300
                          hover:bg-accent/15 hover:border-accent/40 hover:-translate-y-0.5
                          hover:shadow-[0_0_20px_var(--color-accent-dim)]">
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
              Live Demo
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-dim border border-accent/20
                          text-accent text-sm font-semibold rounded-full transition-all duration-300
                          hover:bg-accent/15 hover:border-accent/40 hover:-translate-y-0.5
                          hover:shadow-[0_0_20px_var(--color-accent-dim)]">
              <i className="fa-brands fa-github text-sm" />
              Source Code
            </a>
          )}
        </div>
      </div>

      {/* Spine shadow — left edge binding */}
      <div className="absolute top-0 left-0 bottom-0 w-10
                      bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />
    </div>
  );
}

/* ───────────── section background ───────────── */
function GeometricBackground({ isLight }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let time = 0;

    const shapes = [];
    const SHAPE_COUNT = 25;
    const particles = [];
    const PARTICLE_COUNT = 40;

    const colors = isLight
      ? {
          shapes: ['rgba(139, 92, 246, 0.15)', 'rgba(99, 102, 241, 0.12)', 'rgba(236, 72, 153, 0.1)'],
          shapeStroke: 'rgba(139, 92, 246, 0.2)',
          particle: ['rgba(139, 92, 246, 0.7)', 'rgba(99, 102, 241, 0.7)', 'rgba(236, 72, 153, 0.6)'],
          connection: 'rgba(139, 92, 246, 0.06)',
          mouseOrb: 'rgba(139, 92, 246, 0.2)',
        }
      : {
          shapes: ['rgba(139, 92, 246, 0.08)', 'rgba(99, 102, 241, 0.06)', 'rgba(236, 72, 153, 0.05)'],
          shapeStroke: 'rgba(139, 92, 246, 0.12)',
          particle: ['rgba(139, 92, 246, 0.9)', 'rgba(99, 102, 241, 0.9)', 'rgba(236, 72, 153, 0.8)'],
          connection: 'rgba(139, 92, 246, 0.04)',
          mouseOrb: 'rgba(139, 92, 246, 0.25)',
        };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const initShapes = () => {
      shapes.length = 0;
      for (let i = 0; i < SHAPE_COUNT; i++) {
        const type = Math.floor(Math.random() * 4); // 0: circle, 1: triangle, 2: square, 3: hexagon
        shapes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 30 + Math.random() * 60,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.008,
          color: colors.shapes[Math.floor(Math.random() * colors.shapes.length)],
          opacity: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: 1.5 + Math.random() * 2,
          color: colors.particle[Math.floor(Math.random() * colors.particle.length)],
          opacity: 0.4 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawShape = (shape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);

      const pulse = 1 + Math.sin(shape.phase) * 0.1;
      const size = shape.size * pulse;

      ctx.fillStyle = shape.color;
      ctx.strokeStyle = colors.shapeStroke;
      ctx.lineWidth = 1;

      ctx.beginPath();
      switch (shape.type) {
        case 0: // Circle
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          break;
        case 1: // Triangle
          const h = size * 0.866;
          ctx.moveTo(0, -h / 2);
          ctx.lineTo(-size / 2, h / 2);
          ctx.lineTo(size / 2, h / 2);
          ctx.closePath();
          break;
        case 2: // Square
          ctx.rect(-size / 2, -size / 2, size, size);
          break;
        case 3: // Hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const px = Math.cos(angle) * size / 2;
            const py = Math.sin(angle) * size / 2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          break;
      }

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawShapes = () => {
      const mouse = mouseRef.current;
      
      shapes.forEach((s) => {
        // Mouse interaction - gentle push
        if (mouse.smoothX > 0) {
          const dx = s.x - mouse.smoothX;
          const dy = s.y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150 * 0.005;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
        }

        s.vx *= 0.99;
        s.vy *= 0.99;
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.phase += 0.015;

        // Wrap
        if (s.x < -s.size) s.x = width + s.size;
        if (s.x > width + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = height + s.size;
        if (s.y > height + s.size) s.y = -s.size;

        drawShape(s);
      });
    };

    const drawParticles = () => {
      const mouse = mouseRef.current;

      // Draw connections first
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.connection.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        if (mouse.smoothX > 0) {
          const dx = p.x - mouse.smoothX;
          const dy = p.y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 0.01;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.03;

        // Wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const pulse = 1 + Math.sin(p.phase) * 0.3;
        const size = p.size * pulse;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 4);
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.6})`));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };

    const drawMouseOrb = () => {
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.08;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.08;

      if (mouse.smoothX > 0) {
        const gradient = ctx.createRadialGradient(mouse.smoothX, mouse.smoothY, 0, mouse.smoothX, mouse.smoothY, 70);
        gradient.addColorStop(0, colors.mouseOrb);
        gradient.addColorStop(0.5, colors.mouseOrb.replace(/[\d.]+\)$/, '0.08)'));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mouse.smoothX, mouse.smoothY, 70, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);
      drawShapes();
      drawParticles();
      drawMouseOrb();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    resize();
    initShapes();
    initParticles();
    animate();

    window.addEventListener('resize', () => { resize(); initShapes(); initParticles(); });
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}

/* ───────────── main section ───────────── */
export default function Projects() {
  const { theme } = useTheme();
  const total = PROJECTS.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(null);   // page index being flipped
  const [flipDir, setFlipDir] = useState(null);      // 'next' | 'prev'
  const busy = useRef(false);
  const sectionRef = useRef(null);
  useGSAPScrollReveal(sectionRef);

  // Touch/swipe
  const touchX = useRef(null);
  const touchY = useRef(null);
  // Mouse drag
  const dragging = useRef(false);
  const dragX = useRef(0);

  /* ── flip helpers ── */
  const goNext = useCallback(() => {
    if (busy.current || currentPage >= total - 1) return;
    busy.current = true;
    playPageFlip();
    setFlipDir('next');
    setFlipping(currentPage);
    setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setFlipping(null);
      setFlipDir(null);
      busy.current = false;
    }, 700);
  }, [currentPage, total]);

  const goPrev = useCallback(() => {
    if (busy.current || currentPage <= 0) return;
    busy.current = true;
    playPageFlip();
    setFlipDir('prev');
    setFlipping(currentPage - 1);
    setTimeout(() => {
      setCurrentPage((p) => p - 1);
      setFlipping(null);
      setFlipDir(null);
      busy.current = false;
    }, 700);
  }, [currentPage]);

  /* jump to any page index (flips one step at a time visually) */
  const goTo = useCallback((target) => {
    if (busy.current || target === currentPage || target < 0 || target >= total) return;
    if (target > currentPage) goNext();
    else goPrev();
  }, [currentPage, total, goNext, goPrev]);

  /* ── keyboard ── */
  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [goNext, goPrev]);

  /* ── touch ── */
  const onTouchStart = useCallback((e) => {
    touchX.current = e.touches[0].clientX;
    touchY.current = e.touches[0].clientY;
  }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const dy = e.changedTouches[0].clientY - touchY.current;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      dx < 0 ? goNext() : goPrev();
    }
    touchX.current = null;
  }, [goNext, goPrev]);

  /* ── mouse drag ── */
  const onMouseDown = useCallback((e) => {
    if (e.target.closest('a, button')) return;
    dragging.current = true;
    dragX.current = e.clientX;
  }, []);
  const onMouseUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - dragX.current;
    if (Math.abs(dx) > 60) {
      dx < 0 ? goNext() : goPrev();
    }
  }, [goNext, goPrev]);

  return (
    <section id="projects" ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      <GeometricBackground isLight={theme === 'light'} />
      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <SectionHeader number="03" title="Projects" />

        <div className="gsap-card book-perspective mx-auto max-w-2xl relative">
            {/* Accent glow reflection — static layers with opacity toggle */}
            <div className="absolute -bottom-6 left-[15%] right-[15%] h-16 pointer-events-none">
              {PROJECTS.map((p, i) => (
                <div key={p.accent} className={`absolute inset-0 rounded-full transition-opacity duration-700 ${
                  i === currentPage ? 'opacity-100' : 'opacity-0'
                } ${p.accent === 'emerald' ? 'bg-emerald-500/12' : p.accent === 'cyan' ? 'bg-cyan-500/12' : 'bg-purple-500/12'}`} />
              ))}
            </div>

            {/* The 3D book */}
            <div
              className="book-container relative w-full"
              style={{ aspectRatio: '4 / 3' }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseLeave={() => { dragging.current = false; }}
            >
              {/* Stacked page edges for depth */}
              <div className="book-edge book-edge-1" />
              <div className="book-edge book-edge-2" />
              <div className="book-edge book-edge-3" />

              {/* Book spine on left */}
              <div className="book-spine" />

              {/* Pages */}
              {PROJECTS.map((project, i) => {
                const isFlipping = flipping === i;
                const isFlipNext = isFlipping && flipDir === 'next';
                const isFlipPrev = isFlipping && flipDir === 'prev';
                const isCurrent  = i === currentPage;
                const isFlipped  = i < currentPage;

                let cls = 'book-page';
                if (isFlipNext) cls += ' book-page-flip-next';
                if (isFlipPrev) cls += ' book-page-flip-prev';
                if (isFlipped && !isFlipPrev) cls += ' book-page-flipped';

                return (
                  <div
                    key={project.title}
                    className={cls}
                    style={{ zIndex: isFlipping ? 20 : isCurrent ? 10 : total - i }}
                  >
                    {/* Front face */}
                    <div className="book-face book-front">
                      <PageContent project={project} index={i} total={total} theme={theme} />
                    </div>
                    {/* Back face */}
                    <div className="book-face book-back">
                      <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                        {/* Large watermark icon */}
                        <i className={`${project.icon} absolute text-[120px] text-heading opacity-[0.03]`} />
                        {/* Decorative rings */}
                        <div className="absolute top-8 right-8 w-24 h-24 rounded-full border border-border/20" />
                        <div className="absolute bottom-12 left-10 w-16 h-16 rounded-full border border-border/10" />
                        <div className="text-center relative z-10">
                          <i className={`${project.icon} text-3xl text-dim/25 mb-3 block`} />
                          <p className="font-mono text-dim/35 text-[11px] tracking-[0.2em] uppercase">
                            {project.title}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Page shadow during flip */}
                    {isFlipping && <div className="book-page-shadow" />}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={goPrev}
                disabled={currentPage === 0}
                aria-label="Previous project"
                className="group/btn flex items-center gap-2 px-5 py-2.5
                           bg-card border border-border rounded-full text-sm font-semibold
                           transition-all duration-300
                           enabled:hover:border-accent/40 enabled:hover:text-accent
                           enabled:hover:shadow-[0_0_20px_var(--color-accent-dim)]
                           enabled:hover:-translate-y-0.5
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-chevron-left text-xs transition-transform duration-300
                              group-hover/btn:enabled:-translate-x-0.5" />
                <span className="text-muted group-hover/btn:enabled:text-accent transition-colors">Previous</span>
              </button>

              {/* Page indicators */}
              <div className="flex items-center gap-2.5">
                {PROJECTS.map((_, i) => (
                  <button key={i}
                    aria-label={`Go to project ${i + 1}`}
                    onClick={() => { if (i !== currentPage) goTo(i); }}
                    className={`block rounded-full transition-all duration-400 border-0 p-0
                      ${i === currentPage
                        ? 'w-8 h-2.5 bg-accent shadow-[0_0_12px_var(--color-accent-glow)]'
                        : 'w-2.5 h-2.5 bg-dim/25 hover:bg-dim/50 cursor-pointer'
                      }`} />
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={currentPage === total - 1}
                aria-label="Next project"
                className="group/btn flex items-center gap-2 px-5 py-2.5
                           bg-card border border-border rounded-full text-sm font-semibold
                           transition-all duration-300
                           enabled:hover:border-accent/40 enabled:hover:text-accent
                           enabled:hover:shadow-[0_0_20px_var(--color-accent-dim)]
                           enabled:hover:-translate-y-0.5
                           disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-muted group-hover/btn:enabled:text-accent transition-colors">Next</span>
                <i className="fa-solid fa-chevron-right text-xs transition-transform duration-300
                              group-hover/btn:enabled:translate-x-0.5" />
              </button>
            </div>

            {/* Hints */}
            <p className="text-center text-dim/40 text-xs mt-3 hidden md:block">
              Use <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] mx-0.5">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-[10px] mx-0.5">→</kbd>
              arrow keys &nbsp;·&nbsp; Drag or swipe to flip
            </p>
            <p className="text-center text-dim/40 text-xs mt-3 md:hidden">
              Swipe left or right to flip pages
            </p>
        </div>
      </div>
    </section>
  );
}
