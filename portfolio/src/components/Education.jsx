import { useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';
import { useTheme } from '../hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ===== Soft Gradient Blobs Background ===== */
function GradientBlobsBackground({ isLight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;

    // Soft floating blobs
    const blobs = [];
    const BLOB_COUNT = 6;

    const colors = isLight
      ? [
          { r: 139, g: 92, b: 246, a: 0.08 },   // Purple
          { r: 99, g: 102, b: 241, a: 0.06 },   // Indigo
          { r: 6, g: 182, b: 212, a: 0.05 },    // Cyan
          { r: 236, g: 72, b: 153, a: 0.04 },   // Pink
        ]
      : [
          { r: 139, g: 92, b: 246, a: 0.06 },   // Purple
          { r: 99, g: 102, b: 241, a: 0.05 },   // Indigo
          { r: 6, g: 182, b: 212, a: 0.04 },    // Cyan
          { r: 236, g: 72, b: 153, a: 0.03 },   // Pink
        ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const initBlobs = () => {
      blobs.length = 0;
      for (let i = 0; i < BLOB_COUNT; i++) {
        const color = colors[i % colors.length];
        blobs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 150 + Math.random() * 250,
          color,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.005 + Math.random() * 0.005,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      blobs.forEach(blob => {
        // Move blob
        blob.x += blob.speedX;
        blob.y += blob.speedY;
        blob.phase += blob.phaseSpeed;

        // Bounce off edges softly
        if (blob.x < -blob.size / 2) blob.x = width + blob.size / 2;
        if (blob.x > width + blob.size / 2) blob.x = -blob.size / 2;
        if (blob.y < -blob.size / 2) blob.y = height + blob.size / 2;
        if (blob.y > height + blob.size / 2) blob.y = -blob.size / 2;

        // Breathing size effect
        const breathe = 1 + Math.sin(blob.phase) * 0.15;
        const size = blob.size * breathe;

        // Draw soft gradient blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, size
        );
        const { r, g, b, a } = blob.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a * 1.5})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${a})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${a * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    initBlobs();
    animate();

    window.addEventListener('resize', () => { resize(); initBlobs(); });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
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

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Soft Gradient Blobs Background */}
      <GradientBlobsBackground isLight={isLight} />

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
