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
  const a = ACCENT[project.accent] || ACCENT.emerald;

  return (
    <div className="relative h-full flex flex-col p-7 sm:p-10 overflow-hidden select-none">
      {/* Top gradient wash */}
      <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${a.gradient} pointer-events-none`} />
      {/* Corner glow orb */}
      <div className={`absolute -top-20 -right-20 w-60 h-60 ${a.glow} rounded-full blur-3xl pointer-events-none`} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl ${a.iconBg} flex items-center justify-center`}>
            <i className={`${project.icon} text-2xl ${a.iconText}`} />
          </div>
          <span className="font-mono text-xs text-dim tracking-wider">
            PROJECT {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-heading mb-1 leading-tight">
          {project.title}
        </h3>
        <p className={`text-sm font-semibold ${a.iconText} mb-5`}>{project.subtitle}</p>

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
    setFlipDir('next');
    setFlipping(currentPage);
    setTimeout(() => {
      setCurrentPage((p) => p + 1);
      setFlipping(null);
      setFlipDir(null);
      busy.current = false;
    }, 1000);
  }, [currentPage, total]);

  const goPrev = useCallback(() => {
    if (busy.current || currentPage <= 0) return;
    busy.current = true;
    setFlipDir('prev');
    setFlipping(currentPage - 1);
    setTimeout(() => {
      setCurrentPage((p) => p - 1);
      setFlipping(null);
      setFlipDir(null);
      busy.current = false;
    }, 1000);
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
    <section id="projects" ref={sectionRef} className="relative py-16 md:py-24">
      {/* Subtle section tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeader number="03" title="Projects" />

        <div className="gsap-card book-perspective mx-auto max-w-2xl">
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
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                          <i className="fa-solid fa-book-open text-2xl text-dim/20 mb-2" />
                          <p className="font-mono text-dim/30 text-xs tracking-widest">• • •</p>
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
                onClick={() => { playPageFlip(); goPrev(); }}
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
                    onClick={() => { if (i !== currentPage) { playPageFlip(); goTo(i); } }}
                    className={`block rounded-full transition-all duration-400 border-0 p-0
                      ${i === currentPage
                        ? 'w-8 h-2.5 bg-accent shadow-[0_0_12px_var(--color-accent-glow)]'
                        : 'w-2.5 h-2.5 bg-dim/25 hover:bg-dim/50 cursor-pointer'
                      }`} />
                ))}
              </div>

              <button
                onClick={() => { playPageFlip(); goNext(); }}
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
