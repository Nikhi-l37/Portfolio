import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
const CATEGORIES = [
  {
    key: 'frontend',
    label: 'Frontend',
    accent: '#00d4ff',
    skills: [
      { name: 'HTML5', level: 90 },
      { name: 'CSS3', level: 85 },
      { name: 'JavaScript', level: 80 },
    ],
  },
  {
    key: 'backend',
    label: 'Backend',
    accent: '#7c3aed',
    skills: [
      { name: 'Java', level: 85 },
      { name: 'Node.js', level: 80 },
      { name: 'Express.js', level: 78 },
      { name: 'REST APIs', level: 85 },
      { name: 'CRUD', level: 82 },
    ],
  },
  {
    key: 'database',
    label: 'Database',
    accent: '#10b981',
    skills: [
      { name: 'Supabase', level: 75 },
      { name: 'MongoDB Atlas', level: 78 },
      { name: 'SQL', level: 72 },
    ],
  },
  {
    key: 'tools',
    label: 'Tools & Platforms',
    accent: '#f97316',
    skills: [
      { name: 'GitHub', level: 88 },
      { name: 'Postman', level: 82 },
      { name: 'Figma', level: 70 },
      { name: 'Render', level: 72 },
      { name: 'Antigravity', level: 68 },
      { name: 'Canva', level: 75 },
      { name: 'Vercel', level: 78 },
    ],
  },
  {
    key: 'concepts',
    label: 'Concepts',
    accent: '#eab308',
    skills: [
      { name: 'OOPs', level: 88 },
      { name: 'SMTP', level: 72 },
      { name: 'Nodemailer', level: 74 },
      { name: 'HTTPS', level: 76 },
      { name: 'Promises', level: 80 },
      { name: 'Async/Await', level: 82 },
    ],
  },
  {
    key: 'certs',
    label: 'Certifications',
    accent: '#ec4899',
    skills: [
      { name: 'UiPath AI Associate', level: 100 },
      { name: 'CodeChef 500', level: 100 },
    ],
  },
];

/* ── Tab button ── */
function Tab({ cat, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap
        ${active
          ? 'text-heading bg-card border border-border-hover shadow-lg'
          : 'text-muted hover:text-heading hover:bg-card/50 border border-transparent'
        }`}
      style={active ? { boxShadow: `0 0 20px ${cat.accent}22, 0 4px 12px rgba(0,0,0,0.3)` } : {}}
    >
      {active && (
        <span
          className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full"
          style={{ background: cat.accent }}
        />
      )}
      <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
        style={{ background: cat.accent, opacity: active ? 1 : 0.4 }} />
      {cat.label}
    </button>
  );
}

/* ── Skill bar ── */
function SkillBar({ name, level, accent, index }) {
  const barRef = useRef(null);
  const numRef = useRef(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    const num = numRef.current;
    if (!bar || !num) return;

    // Reset then animate
    gsap.set(bar, { width: '0%' });
    gsap.set(num, { innerText: '0' });

    const tl = gsap.timeline({ delay: index * 0.08 });

    tl.to(bar, {
      width: `${level}%`,
      duration: 1,
      ease: 'power3.out',
    })
    .to(num, {
      innerText: level,
      duration: 1,
      ease: 'power3.out',
      snap: { innerText: 1 },
    }, 0);

    return () => tl.kill();
  }, [level, index]);

  return (
    <div className="group flex items-center gap-4 py-3 px-4 rounded-xl
      hover:bg-white/[0.02] transition-colors duration-200">
      {/* Skill name */}
      <span className="text-sm font-medium text-heading w-32 shrink-0 truncate
        group-hover:text-accent transition-colors duration-200">
        {name}
      </span>

      {/* Track */}
      <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden relative">
        {/* Subtle track lines */}
        <div className="absolute inset-0 flex justify-between px-[1px]">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-white/[0.03]" />
          ))}
        </div>
        {/* Fill */}
        <div
          ref={barRef}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${accent}88, ${accent})`,
            boxShadow: `0 0 12px ${accent}44`,
            width: '0%',
          }}
        >
          {/* Shine sweep */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent
            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </div>
      </div>

      {/* Percentage */}
      <span className="text-xs font-mono text-muted w-8 text-right tabular-nums">
        <span ref={numRef}>0</span>%
      </span>
    </div>
  );
}

/* ── Main Section ── */
export default function Skills() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeCat = CATEGORIES[activeIdx];

  useGSAPScrollReveal(sectionRef);

  return (
    <section id="skills" ref={sectionRef} className="py-16 md:py-24">
      <div className="max-w-[900px] mx-auto px-6">
        <SectionHeader number="04" title="Skills & Expertise" />

        {/* ── Terminal-style container ── */}
        <div className="gsap-skill rounded-2xl border border-border bg-card/60 backdrop-blur-sm
          overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3)]">

          {/* Title bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-primary/80 border-b border-border">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs font-mono text-dim">~/nikhil/skills</span>
            <span className="ml-auto text-xs font-mono text-dim">
              {CATEGORIES.reduce((n, c) => n + c.skills.length, 0)} skills
            </span>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border
            overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat, i) => (
              <Tab key={cat.key} cat={cat} active={i === activeIdx}
                onClick={() => setActiveIdx(i)} />
            ))}
          </div>

          {/* Content area */}
          <div className="px-2 py-4 md:px-4 min-h-[280px]">
            {/* Category header inside content */}
            <div className="flex items-center gap-3 px-4 mb-4">
              <div className="w-3 h-3 rounded-sm"
                style={{ background: activeCat.accent }} />
              <h3 className="text-lg font-bold text-heading">{activeCat.label}</h3>
              <span className="text-xs text-dim font-mono ml-auto">
                {activeCat.skills.length} item{activeCat.skills.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Skill bars */}
            <div className="space-y-0.5">
              {activeCat.skills.map((skill, i) => (
                <SkillBar
                  key={`${activeCat.key}-${skill.name}`}
                  name={skill.name}
                  level={skill.level}
                  accent={activeCat.accent}
                  index={i}
                />
              ))}
            </div>

            {/* Average indicator */}
            <div className="mt-5 pt-4 px-4 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-dim font-mono">avg. proficiency</span>
              <span className="text-sm font-bold font-mono"
                style={{ color: activeCat.accent }}>
                {Math.round(activeCat.skills.reduce((s, sk) => s + sk.level, 0) / activeCat.skills.length)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
