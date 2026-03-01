import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Icons — lightweight inline SVGs
   ───────────────────────────────────────────── */
const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconServer = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);
const IconDatabase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);
const IconWrench = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconBrain = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9.5 2A5.5 5.5 0 0 0 4 7.5c0 1.58.7 3 1.8 4A4.5 4.5 0 0 0 4 15.5 4.5 4.5 0 0 0 8.5 20h.5v2h6v-2h.5a4.5 4.5 0 0 0 4.5-4.5c0-1.58-.7-3-1.8-4A5.5 5.5 0 0 0 14.5 2h-5z" />
  </svg>
);
const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

/* ─────────────────────────────────────────────
   Skill Category Data
   ───────────────────────────────────────────── */
const CATEGORIES = [
  {
    key: 'frontend',
    label: 'Frontend',
    icon: IconCode,
    accent: '#22d3ee',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS'],
  },
  {
    key: 'backend',
    label: 'Backend',
    icon: IconServer,
    accent: '#a78bfa',
    skills: ['Java', 'Node.js', 'Express.js', 'REST APIs', 'CRUD Operations'],
  },
  {
    key: 'database',
    label: 'Database',
    icon: IconDatabase,
    accent: '#34d399',
    skills: ['Supabase', 'MongoDB Atlas', 'SQL'],
  },
  {
    key: 'tools',
    label: 'Tools & Platforms',
    icon: IconWrench,
    accent: '#fb923c',
    skills: ['GitHub', 'Postman', 'Figma', 'Render', 'Vercel', 'Canva'],
  },
  {
    key: 'concepts',
    label: 'Core Concepts',
    icon: IconBrain,
    accent: '#facc15',
    skills: ['OOPs', 'SMTP', 'Nodemailer', 'HTTPS', 'Promises', 'Async/Await'],
  },
  {
    key: 'certs',
    label: 'Certifications',
    icon: IconAward,
    accent: '#f472b6',
    skills: ['UiPath AI Associate', 'CodeChef 500+'],
  },
];

/* ─────────────────────────────────────────────
   Pill-shaped Skill Tag
   ───────────────────────────────────────────── */
function SkillPill({ name, accent }) {
  return (
    <span
      className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold
                 tracking-wide transition-all duration-300 hover:scale-105
                 hover:brightness-125 cursor-default select-none"
      style={{
        color: accent,
        background: `${accent}12`,
        border: `1px solid ${accent}25`,
      }}
    >
      {name}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Bento Card
   ───────────────────────────────────────────── */
function BentoCard({ category }) {
  const { label, icon: Icon, accent, skills } = category;

  return (
    <div
      className="gsap-card group relative rounded-2xl h-full
                 border border-border bg-card/80 backdrop-blur-sm
                 p-7 md:p-8 transition-all duration-500 ease-out
                 hover:scale-[1.02] hover:border-border-hover
                 overflow-hidden"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.25)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          `0 4px 40px ${accent}15, 0 0 60px ${accent}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.25)';
      }}
    >
      {/* Corner accent glow (hover-only) */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0
                   group-hover:opacity-100 transition-opacity duration-700
                   blur-3xl pointer-events-none"
        style={{ background: accent }}
      />

      {/* Header row */}
      <div className="relative flex items-center gap-3 mb-5">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl
                     transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${accent}15`, color: accent }}
        >
          <Icon />
        </div>
        <h3 className="text-base font-bold tracking-tight text-heading">
          {label}
        </h3>
        <span
          className="ml-auto text-[11px] font-mono opacity-35
                     group-hover:opacity-70 transition-opacity duration-300"
          style={{ color: accent }}
        >
          {String(skills.length).padStart(2, '0')}
        </span>
      </div>

      {/* Skill pills */}
      <div className="relative flex flex-wrap gap-2.5">
        {skills.map((s) => (
          <SkillPill key={s} name={s} accent={accent} />
        ))}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0
                   group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats / Summary micro-card
   ───────────────────────────────────────────── */
function StatsCard() {
  const total = CATEGORIES.reduce((n, c) => n + c.skills.length, 0);

  return (
    <div
      className="gsap-card group relative rounded-2xl h-full
                 border border-border bg-card/80 backdrop-blur-sm
                 p-7 md:p-8 transition-all duration-500 ease-out
                 hover:scale-[1.02] hover:border-border-hover
                 flex flex-col items-center justify-center text-center
                 overflow-hidden"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.25)' }}
    >
      {/* Gradient ring */}
      <div className="relative mb-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center
                     border-2 border-dashed border-border
                     group-hover:border-cyan-400/30 transition-colors duration-500"
          style={{
            background:
              'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
          }}
        >
          <span className="text-2xl font-black font-mono text-cyan-400">
            {total}
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-heading/80">Total Skills</p>
      <p className="text-xs text-muted mt-1">{CATEGORIES.length} categories</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GSAP – staggered reveal for bento cards
   ───────────────────────────────────────────── */
function useBentoAnimations(gridRef) {
  useLayoutEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.gsap-card');
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { y: 60, opacity: 0, scale: 0.95 });

      ScrollTrigger.batch(cards, {
        start: 'top 88%',
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            overwrite: true,
          }),
        once: true,
      });
    }, gridRef);

    return () => ctx.revert();
  }, [gridRef]);
}

/* ─────────────────────────────────────────────
   Main — Bento Grid Skills Section
   ───────────────────────────────────────────── */
export default function Skills() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useGSAPScrollReveal(sectionRef);
  useBentoAnimations(gridRef);

  return (
    <section id="skills" ref={sectionRef} className="relative py-16 md:py-24">
      {/* Subtle section tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.015] to-transparent pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionHeader number="04" title="Skills & Expertise" />

        {/* ── Asymmetrical Bento Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {/* Row 1 — Frontend (1 col) · Backend (1 col) · Stats (1 col) */}
          <div className="lg:col-span-1">
            <BentoCard category={CATEGORIES[0]} />
          </div>
          <div className="lg:col-span-1">
            <BentoCard category={CATEGORIES[1]} />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <StatsCard />
          </div>

          {/* Row 2 — Database (1 col) · Tools & Platforms (2 cols wide) */}
          <div className="lg:col-span-1">
            <BentoCard category={CATEGORIES[2]} />
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            <BentoCard category={CATEGORIES[3]} />
          </div>

          {/* Row 3 — Core Concepts (2 cols wide) · Certifications (1 col) */}
          <div className="md:col-span-1 lg:col-span-2">
            <BentoCard category={CATEGORIES[4]} />
          </div>
          <div className="lg:col-span-1">
            <BentoCard category={CATEGORIES[5]} />
          </div>
        </div>
      </div>
    </section>
  );
}
