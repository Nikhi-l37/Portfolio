import { useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import SectionHeader from './SectionHeader';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';
import { useTheme } from '../hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ===== Floating Shapes — Navy / Blue / Purple theme ===== */
function FloatingShapes({ isLight }) {
  const shapes = useMemo(() => [
    { id: 1, x: 5, y: 15, size: 80, color: 'blue', rotation: -15, depth: 0.6 },
    { id: 2, x: 92, y: 25, size: 70, color: 'purple', rotation: 20, depth: 0.7 },
    { id: 3, x: 8, y: 70, size: 60, color: 'indigo', rotation: 25, depth: 0.5 },
    { id: 4, x: 88, y: 65, size: 75, color: 'violet', rotation: -10, depth: 0.65 },
    { id: 5, x: 15, y: 45, size: 40, color: 'cyan', rotation: 30, depth: 0.4 },
    { id: 6, x: 85, y: 85, size: 55, color: 'navy', rotation: -20, depth: 0.55 },
    { id: 7, x: 50, y: 5, size: 45, color: 'deepblue', rotation: 15, depth: 0.35 },
    { id: 8, x: 95, y: 10, size: 25, color: 'lavender', rotation: 0, depth: 0.3, isCircle: true },
  ], []);

  const colorConfigs = {
    blue:     { gradient: isLight ? 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)', shadow: isLight ? 'rgba(59,130,246,0.2)' : 'rgba(59, 130, 246, 0.4)' },
    purple:   { gradient: isLight ? 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)', shadow: isLight ? 'rgba(139,92,246,0.2)' : 'rgba(139, 92, 246, 0.4)' },
    indigo:   { gradient: isLight ? 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #6366f1 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)', shadow: isLight ? 'rgba(99,102,241,0.2)' : 'rgba(99, 102, 241, 0.4)' },
    violet:   { gradient: isLight ? 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 50%, #a78bfa 100%)' : 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)', shadow: isLight ? 'rgba(167,139,250,0.2)' : 'rgba(167, 139, 250, 0.4)' },
    cyan:     { gradient: isLight ? 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 50%, #06b6d4 100%)' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)', shadow: isLight ? 'rgba(6,182,212,0.2)' : 'rgba(6, 182, 212, 0.4)' },
    navy:     { gradient: isLight ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3730a3 100%)', shadow: isLight ? 'rgba(30,58,138,0.2)' : 'rgba(30, 58, 138, 0.4)' },
    deepblue: { gradient: isLight ? 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)', shadow: isLight ? 'rgba(37,99,235,0.15)' : 'rgba(37, 99, 235, 0.4)' },
    lavender: { gradient: isLight ? 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 50%, #c084fc 100%)' : 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)', shadow: isLight ? 'rgba(196,181,253,0.2)' : 'rgba(196, 181, 253, 0.4)' },
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 edu-grid-bg" />
      {shapes.map((shape) => {
        const config = colorConfigs[shape.color];
        return (
          <div
            key={shape.id}
            className="edu-shape absolute"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: shape.size,
              height: shape.size,
              '--depth': shape.depth,
              '--rot': `${shape.rotation}deg`,
              background: config.gradient,
              borderRadius: shape.isCircle ? '50%' : '22%',
              opacity: isLight ? 0.18 + shape.depth * 0.12 : 0.25 + shape.depth * 0.15,
              boxShadow: `0 15px 30px -8px ${config.shadow}, inset 0 1px 1px ${isLight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
            }}
          />
        );
      })}
    </div>
  );
}

const EDUCATION = [
  {
    period: '2023 – 2027',
    degree: 'B.Tech in Computer Science',
    institution: 'Rajeev Gandhi Memorial College of Engineering and Technology (RGMCET)',
    description:
      'Currently pursuing 3rd year with a CGPA of 8.0. Strong foundation in core computer science subjects such as data structures, algorithms, databases, and computer networks.',
    icon: 'fa-solid fa-graduation-cap',
    current: true,
  },
  {
    period: '2021 – 2023',
    degree: 'Intermediate MPC',
    institution: 'VBR College',
    description:
      'Completed with an excellent score of 970, Maintained consistent academic performance and demonstrated dedication, discipline, and commitment toward long-term goals.',
    icon: 'fa-solid fa-book-open',
    current: false,
  },
  {
    period: '2020 – 2021',
    degree: 'Secondary School (SSC)',
    institution: 'Sri Chaitanya College',
    description:
      'Established a strong educational foundation and commitment to continuous growth.',
    icon: 'fa-solid fa-school',
    current: false,
  },
];

export default function Education() {
  const sectionRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const timelineLineRef = useRef(null);

  useGSAPScrollReveal(sectionRef);

  // Scroll-draw timeline line + staggered card reveals
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // --- Draw the vertical timeline line as user scrolls ---
      const line = timelineLineRef.current;
      if (line) {
        gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 0.6,
          },
        });
      }

      // --- Dots pulse in ---
      const dots = sectionRef.current.querySelectorAll('.edu-dot');
      dots.forEach((dot) => {
        gsap.set(dot, { scale: 0, opacity: 0 });
        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const rafPending = useRef(false);
  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current || rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      if (!sectionRef.current) { rafPending.current = false; return; }
      const rect = sectionRef.current.getBoundingClientRect();
      sectionRef.current.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width).toFixed(3));
      sectionRef.current.style.setProperty('--my', ((e.clientY - rect.top) / rect.height).toFixed(3));
      rafPending.current = false;
    });
  }, []);

  return (
    <section 
      id="education" 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Floating 3D Shapes Background */}
      <FloatingShapes isLight={isLight} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <SectionHeader number="02" title="Education" />

        {/* Timeline */}
        <div className="relative pl-8 md:pl-0 flex flex-col gap-10 md:gap-0">
          {/* Vertical line — left on mobile, center on desktop — draws in on scroll */}
          <div
            ref={timelineLineRef}
            className="absolute left-[11px] md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 bg-gradient-to-b from-accent via-accent-alt to-accent opacity-30"
          />

          {EDUCATION.map((item, i) => {
            const isRight = i % 2 === 0;

            return (
                <div key={item.degree} className={`gsap-timeline-item relative flex flex-col md:flex-row items-center md:mb-16 md:last:mb-0 ${isRight ? 'md:justify-end' : 'md:justify-start'}`}>

                  {/* Mobile dot — left side */}
                  <div className="edu-dot md:hidden absolute left-[-21px] top-6 z-10">
                    <div className={`w-3.5 h-3.5 rounded-full border-[2.5px]
                      ${item.current
                        ? 'bg-accent border-accent shadow-[0_0_10px_var(--color-accent-glow)]'
                        : 'bg-accent-alt border-accent-alt shadow-[0_0_10px_rgba(124,58,237,0.4)]'
                      }`} />
                  </div>

                  {/* Card — mobile: full width, desktop: 45% on alternating sides */}
                  <div className={`w-full md:w-[45%] ${isRight ? 'md:ml-auto md:pl-0' : 'md:mr-auto md:pr-0'} order-2 md:order-none`}>
                    <div className={`group relative border rounded-xl p-5 md:p-7
                                    transition-[box-shadow,border-color] duration-300 ease-out
                                    hover:border-border-hover
                                    ${isLight
                                      ? 'bg-white/90 border-slate-200 hover:shadow-[0_12px_36px_rgba(0,0,0,0.08),0_0_20px_var(--color-accent-dim)]'
                                      : 'bg-card border-border hover:shadow-[0_16px_40px_rgba(0,0,0,0.3),0_0_30px_var(--color-accent-dim)]'
                                    }`}>

                      {/* Top gradient bar on hover */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-alt rounded-t-xl scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />

                      {/* Period badge + icon */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-block text-xs font-semibold tracking-wider px-3.5 py-1.5 rounded-full
                          ${item.current
                            ? 'bg-accent text-primary'
                            : 'bg-accent-alt text-white'
                          }`}>
                          {item.period}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                          ${item.current
                            ? 'bg-accent text-primary'
                            : 'bg-accent-alt text-white'
                          }`}>
                          <i className={item.icon} />
                        </div>
                      </div>

                      {/* Degree */}
                      <h3 className="text-lg font-bold text-accent mb-1">{item.degree}</h3>

                      {/* Institution */}
                      <p className="text-sm font-semibold text-heading mb-3">{item.institution}</p>

                      {/* Description */}
                      <p className="text-[0.9rem] text-muted leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Center dot — desktop only */}
                  <div className="edu-dot hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-4 h-4 rounded-full border-[3px]
                      ${item.current
                        ? 'bg-accent border-accent shadow-[0_0_12px_var(--color-accent-glow)]'
                        : 'bg-accent-alt border-accent-alt shadow-[0_0_12px_rgba(124,58,237,0.4)]'
                      }`} />
                  </div>
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
