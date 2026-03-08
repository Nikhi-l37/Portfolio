import {
  Brain, Users, GitBranch,
  Download, ExternalLink, Sparkles,
} from 'lucide-react';
import SectionHeader from './SectionHeader';
import { fireCenterConfetti } from '../utils/confetti';
import { useTheme } from '../hooks/useTheme';
import { useRef, useEffect } from 'react';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';

/* ===== Flowing DNA Helix Background ===== */
function FlowingBackground({ isLight }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let time = 0;

    // Flowing particles
    const particles = [];
    const PARTICLE_COUNT = 60;

    // DNA strands
    const strands = [];
    const STRAND_COUNT = 3;

    // Floating orbs
    const orbs = [];
    const ORB_COUNT = 5;

    const colors = isLight
      ? {
          particle: ['rgba(16, 185, 129, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(99, 102, 241, 0.7)'],
          strand: 'rgba(16, 185, 129, 0.15)',
          orb: ['rgba(16, 185, 129, 0.12)', 'rgba(6, 182, 212, 0.1)', 'rgba(99, 102, 241, 0.08)'],
          connection: 'rgba(16, 185, 129, 0.06)',
          mouseOrb: 'rgba(16, 185, 129, 0.25)',
        }
      : {
          particle: ['rgba(52, 211, 153, 0.9)', 'rgba(34, 211, 238, 0.9)', 'rgba(139, 92, 246, 0.8)'],
          strand: 'rgba(52, 211, 153, 0.1)',
          orb: ['rgba(52, 211, 153, 0.08)', 'rgba(34, 211, 238, 0.06)', 'rgba(139, 92, 246, 0.05)'],
          connection: 'rgba(52, 211, 153, 0.05)',
          mouseOrb: 'rgba(52, 211, 153, 0.3)',
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

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 1.5 + Math.random() * 2.5,
          baseSize: 0,
          opacity: 0.3 + Math.random() * 0.7,
          opacitySpeed: 0.005 + Math.random() * 0.01,
          opacityDir: 1,
          color: colors.particle[Math.floor(Math.random() * colors.particle.length)],
          phase: Math.random() * Math.PI * 2,
        });
        particles[particles.length - 1].baseSize = particles[particles.length - 1].size;
      }
    };

    const initStrands = () => {
      strands.length = 0;
      for (let i = 0; i < STRAND_COUNT; i++) {
        strands.push({
          x: width * (0.2 + i * 0.3),
          amplitude: 80 + Math.random() * 60,
          frequency: 0.003 + Math.random() * 0.002,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.01,
        });
      }
    };

    const initOrbs = () => {
      orbs.length = 0;
      for (let i = 0; i < ORB_COUNT; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: Math.random() * width,
          targetY: Math.random() * height,
          size: 80 + Math.random() * 120,
          color: colors.orb[i % colors.orb.length],
          speed: 0.002 + Math.random() * 0.003,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawOrbs = () => {
      orbs.forEach((orb) => {
        orb.x += (orb.targetX - orb.x) * orb.speed;
        orb.y += (orb.targetY - orb.y) * orb.speed;
        if (Math.random() < 0.002) {
          orb.targetX = Math.random() * width;
          orb.targetY = Math.random() * height;
        }
        orb.phase += 0.01;
        const pulseSize = orb.size * (1 + Math.sin(orb.phase) * 0.2);

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulseSize);
        gradient.addColorStop(0, orb.color.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, '0.1)'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    const drawStrands = () => {
      strands.forEach((strand) => {
        strand.phase += strand.speed;
        
        ctx.beginPath();
        ctx.strokeStyle = colors.strand;
        ctx.lineWidth = 2;
        
        for (let y = 0; y < height; y += 5) {
          const x = strand.x + Math.sin(y * strand.frequency + strand.phase) * strand.amplitude;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Second helix strand (offset)
        ctx.beginPath();
        for (let y = 0; y < height; y += 5) {
          const x = strand.x + Math.sin(y * strand.frequency + strand.phase + Math.PI) * strand.amplitude;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Cross bars
        for (let y = 0; y < height; y += 40) {
          const x1 = strand.x + Math.sin(y * strand.frequency + strand.phase) * strand.amplitude;
          const x2 = strand.x + Math.sin(y * strand.frequency + strand.phase + Math.PI) * strand.amplitude;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = colors.strand.replace(/[\d.]+\)$/, '0.08)');
          ctx.stroke();
        }
      });
    };

    const drawConnections = () => {
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.4 * Math.min(particles[i].opacity, particles[j].opacity);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.connection.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        if (mouse.smoothX > 0) {
          const dx = particles[i].x - mouse.smoothX;
          const dy = particles[i].y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.smoothX, mouse.smoothY);
            ctx.strokeStyle = colors.mouseOrb.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }
    };

    const drawParticles = () => {
      const mouse = mouseRef.current;
      particles.forEach((p) => {
        if (mouse.smoothX > 0) {
          const dx = p.x - mouse.smoothX;
          const dy = p.y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 0.01;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;
        p.size = p.baseSize * (1 + Math.sin(p.phase) * 0.25);
        p.opacity += p.opacitySpeed * p.opacityDir;
        if (p.opacity >= 1 || p.opacity <= 0.2) p.opacityDir *= -1;

        // Wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.opacity})`));
        gradient.addColorStop(0.5, p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.4})`));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fill();
      });
    };

    const drawMouseOrb = () => {
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.08;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.08;

      if (mouse.smoothX > 0) {
        const gradient = ctx.createRadialGradient(mouse.smoothX, mouse.smoothY, 0, mouse.smoothX, mouse.smoothY, 80);
        gradient.addColorStop(0, colors.mouseOrb.replace(/[\d.]+\)$/, '0.25)'));
        gradient.addColorStop(0.5, colors.mouseOrb.replace(/[\d.]+\)$/, '0.08)'));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mouse.smoothX, mouse.smoothY, 80, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);
      drawOrbs();
      drawStrands();
      drawConnections();
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
    initParticles();
    initStrands();
    initOrbs();
    animate();

    window.addEventListener('resize', () => { resize(); initStrands(); });
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

/* ===== theme-aware accent helpers ===== */
const GLOW_DARK = {
  emerald: 'hover:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_40px_rgba(16,185,129,0.12)] hover:border-emerald-500/30',
  cyan:    'hover:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_40px_rgba(0,212,255,0.12)]   hover:border-cyan-400/30',
  purple:  'hover:shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_40px_rgba(124,58,237,0.12)]  hover:border-purple-500/30',
};
const GLOW_LIGHT = {
  emerald: 'hover:shadow-[0_12px_35px_rgba(0,0,0,0.08),0_0_30px_rgba(16,185,129,0.1)] hover:border-emerald-500/40',
  cyan:    'hover:shadow-[0_12px_35px_rgba(0,0,0,0.08),0_0_30px_rgba(6,182,212,0.1)]   hover:border-cyan-500/40',
  purple:  'hover:shadow-[0_12px_35px_rgba(0,0,0,0.08),0_0_30px_rgba(124,58,237,0.1)]  hover:border-purple-500/40',
};

const A_DARK = {
  text:     'text-emerald-400',
  textAlt:  'text-cyan-400',
  bg:       'bg-emerald-500/10',
  bgAlt:    'bg-cyan-500/10',
  border:   'border-emerald-500/20',
  borderAlt:'border-cyan-500/10',
  tagBg:    'bg-emerald-500/8 text-emerald-400/80 border-emerald-500/10',
  tagAltBg: 'bg-cyan-500/8 text-cyan-400/80 border-cyan-500/10',
  linkHover:'hover:text-emerald-300',
  linkDeco: 'decoration-emerald-400/30',
  orbBg:    'bg-emerald-500/8',
  orbAlt:   'bg-cyan-500/5',
  orbEm:    'bg-emerald-500/5',
  resumeBorder:'border-emerald-500/25',
  resumeText:  'text-emerald-400',
  resumeHover: 'hover:bg-emerald-500/10 hover:border-emerald-400/50',
  gradFrom: 'from-emerald-500/5',
  gradTo:   'to-cyan-500/5',
  sparkle:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};
const A_LIGHT = {
  text:     'text-emerald-700',
  textAlt:  'text-cyan-700',
  bg:       'bg-emerald-600/12',
  bgAlt:    'bg-cyan-600/12',
  border:   'border-emerald-300',
  borderAlt:'border-cyan-300',
  tagBg:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  tagAltBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  linkHover:'hover:text-emerald-500',
  linkDeco: 'decoration-emerald-600/30',
  orbBg:    'bg-emerald-400/10',
  orbAlt:   'bg-cyan-400/8',
  orbEm:    'bg-emerald-400/8',
  resumeBorder:'border-emerald-400/35',
  resumeText:  'text-emerald-700',
  resumeHover: 'hover:bg-emerald-500/8 hover:border-emerald-500/50',
  gradFrom: 'from-emerald-500/8',
  gradTo:   'to-cyan-500/8',
  sparkle:  'bg-emerald-100 text-emerald-700 border-emerald-300',
};

/* ===== reusable Bento Card ===== */
function BentoCard({ children, className = '', glow = 'emerald', isLight }) {
  const glows = isLight ? GLOW_LIGHT : GLOW_DARK;

  return (
    <div
      className={`gsap-card group relative overflow-hidden bg-card/80 border border-border
                  rounded-[16px] p-5 md:p-6 transition-[transform,box-shadow,border-color,background-color] duration-400 ease-out
                  backface-hidden hover:bg-card-hover
                  ${glows[glow]} ${className}`}
    >
      {children}
    </div>
  );
}

/* ===== About Section ===== */
export default function About() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const a = isLight ? A_LIGHT : A_DARK;
  const sectionRef = useRef(null);
  useGSAPScrollReveal(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background */}
      <FlowingBackground isLight={isLight} />
      {/* Subtle section tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.015] to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        {/* Section header */}
        <SectionHeader number="01" title="About Me" />

        {/* ===== Bento Grid — 3 col, 24px gap ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ─── ROW 1 — Hero Card (full width) ─── */}
          <BentoCard className="md:col-span-3 flex flex-col justify-center" glow="emerald" isLight={isLight}>
            <div className={`absolute -top-20 -left-20 w-60 h-60 ${a.orbBg} rounded-full opacity-30 pointer-events-none`} />

            <div className="relative z-10">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${a.bg} ${a.text}
                                 text-xs font-semibold rounded-full border ${a.border}`}>
                  <Sparkles className="w-3 h-3" /> Full-Stack Developer
                </span>
                <span className="px-3 py-1 bg-accent-dim text-accent text-xs font-semibold rounded-full border border-accent/20">
                  Open to Work
                </span>
              </div>

              <h3 className="text-3xl lg:text-4xl font-extrabold text-heading mb-5 leading-tight">
                Hi, I'm{' '}
                <span className={`bg-gradient-to-r ${isLight ? 'from-emerald-600 to-cyan-600' : 'from-emerald-400 to-cyan-400'} bg-clip-text text-transparent`}>
                  Nikhil
                </span>
              </h3>

              <p className="gsap-split-text text-muted text-[0.95rem] leading-relaxed mb-3">
                I'm a <span className="text-heading font-medium">backend-focused developer</span> with strong knowledge in building server-side applications, APIs, and working with databases.
              </p>
              <p className="gsap-split-text text-muted text-sm leading-relaxed mb-3">
                While my strength lies in backend development, I also understand frontend fundamentals and create clean, responsive interfaces using modern <span className={`${a.text} font-medium`}>AI-assisted tools</span>.
              </p>
              <p className="gsap-split-text text-muted text-sm leading-relaxed">
                I enjoy solving real-world problems and continuously improving my technical skills.
              </p>
            </div>
          </BentoCard>

          {/* ─── ROW 2 — Problem Solving & DSA (col 1-2, wide) ─── */}
          <BentoCard className="md:col-span-2 flex flex-col justify-center" glow="emerald" isLight={isLight}>
            <div className={`absolute -bottom-16 -right-16 w-48 h-48 ${a.orbEm} rounded-full opacity-30 pointer-events-none`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>
                  <Brain className={`w-5 h-5 ${a.text}`} />
                </div>
                <h4 className="text-lg font-bold text-heading">Problem Solving & DSA</h4>
              </div>

              <p className="gsap-split-text text-muted text-sm leading-relaxed mb-2">
                Actively solving data structures and algorithms problems on platforms like{' '}
                <a href="https://leetcode.com/u/NikhilReddy3446/" target="_blank" rel="noopener noreferrer"
                   className={`${a.text} ${a.linkHover} transition-colors font-medium underline ${a.linkDeco} underline-offset-2`}>
                  LeetCode
                </a>{' '}
                and{' '}
                <a href="https://www.geeksforgeeks.org/profile/snikhilre097c" target="_blank" rel="noopener noreferrer"
                   className={`${a.text} ${a.linkHover} transition-colors font-medium underline ${a.linkDeco} underline-offset-2`}>
                  GeeksforGeeks
                </a>.
              </p>
              <p className="gsap-split-text text-muted text-sm leading-relaxed mb-4">
                Strong understanding of problem-solving patterns, logical thinking, and writing optimized solutions.
                Regular practice strengthens my core computer science fundamentals and analytical skills.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Data Structures', 'Algorithms', 'Logical Thinking', 'Optimization', 'Competitive Coding'].map(tag => (
                  <span key={tag}
                    className={`gsap-tag px-2.5 py-1 text-xs font-medium rounded-lg border ${a.tagBg}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ─── ROW 2 — GitHub & Workflow (col 3, square) ─── */}
          <BentoCard className="flex flex-col justify-center" glow="cyan" isLight={isLight}>
            <div className={`absolute -top-12 -left-12 w-40 h-40 ${a.orbAlt} rounded-full opacity-30 pointer-events-none`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${a.bgAlt} flex items-center justify-center`}>
                  <GitBranch className={`w-5 h-5 ${a.textAlt}`} />
                </div>
                <h4 className="text-lg font-bold text-heading">GitHub & Workflow</h4>
              </div>

              <p className="gsap-split-text text-muted text-sm leading-relaxed mb-2">
                Experienced in using GitHub for version control, collaboration, and project management.
              </p>
              <p className="gsap-split-text text-muted text-sm leading-relaxed mb-4">
                Comfortable with branching strategies, pull requests, code reviews, and maintaining clean
                repository structures.
              </p>

              <div className="flex flex-wrap gap-2">
                {['Git & GitHub', 'Version Control', 'Clean Code', 'Collaboration', 'Project Management'].map(tag => (
                  <span key={tag}
                    className={`gsap-tag px-2.5 py-1 text-xs font-medium rounded-lg border ${a.tagAltBg}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* ─── ROW 3 — Leadership (col 1, tall/square) ─── */}
          <BentoCard className="group/lead flex flex-col justify-center" glow="emerald" isLight={isLight}>
            <div className={`absolute -top-12 -right-12 w-36 h-36 ${a.orbEm} rounded-full opacity-30 pointer-events-none`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center
                                transition-colors duration-300 group-hover/lead:bg-emerald-500/20`}>
                  <Users className={`w-5 h-5 ${a.text}`} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-heading leading-tight">Community Leadership</h4>
                  <span className={`text-[11px] ${isLight ? 'text-emerald-600/80' : 'text-emerald-400/70'} font-semibold uppercase tracking-wider`}>Lead @ Vedic Vox</span>
                </div>
              </div>

              <p className="gsap-split-text text-muted text-sm leading-relaxed mb-4">
                Spearheading a student-led club focused on discussing and building
                innovative solutions to real-world problems.
              </p>

              <div className="flex items-center gap-2 opacity-0 translate-y-2
                              transition-[opacity,transform] duration-400 ease-out
                              group-hover/lead:opacity-100 group-hover/lead:translate-y-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1
                                 ${a.sparkle} text-xs font-semibold rounded-full border`}>
                  <Sparkles className="w-3 h-3" /> Let's Collaborate
                </span>
              </div>
            </div>
          </BentoCard>

          {/* ─── ROW 3 — Resume CTA (col 2-3, wide) ─── */}
          <BentoCard
            className={`md:col-span-2 flex flex-col justify-center items-center text-center
                       bg-gradient-to-br ${a.gradFrom} via-transparent ${a.gradTo}`}
            glow="emerald" isLight={isLight}
          >
            <div className={`w-14 h-14 rounded-2xl ${a.bg} flex items-center justify-center mb-4`}>
              <Download className={`resume-arrow w-7 h-7 ${a.text}`} />
            </div>
            <h4 className="text-base font-bold text-heading mb-1">Want to know more?</h4>
            <p className="text-xs text-muted mb-5">Grab a copy of my resume</p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={fireCenterConfetti}
              className={`resume-btn group/btn inline-flex items-center gap-2 px-6 py-2.5
                         bg-accent-dim
                         border ${a.resumeBorder} ${a.resumeText} text-sm font-semibold rounded-full
                         transition-[background-color,border-color,color] duration-300
                         ${a.resumeHover}
                         active:scale-95`}
            >
              Download Resume
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
