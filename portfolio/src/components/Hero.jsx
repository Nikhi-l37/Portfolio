import { useRef, useLayoutEffect } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import Button from './Button';
import profileImg from '../assets/Nikhil.jpg';
import { useTheme } from '../hooks/useTheme';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ===== Lightweight CSS-only background with floating NIKHIL letters ===== */
function HeroBackground({ isLight }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {isLight ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/60 to-purple-50/40" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#020a1a] via-[#0a0d2e] to-[#0c0514]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_45%,transparent_50%,rgba(2,10,26,0.5)_100%)]" />
        </>
      )}

      {/* Floating NIKHIL letters — pure CSS, no JS, no layout thrash */}
      <div className="absolute inset-0 pointer-events-none select-none hidden md:block" aria-hidden="true">
        {['N', 'I', 'K', 'H', 'I', 'L'].map((char, i) => (
          <span
            key={i}
            className="absolute font-black opacity-[0.06] animate-[heroFloat_8s_ease-in-out_infinite]"
            style={{
              fontSize: `clamp(5rem, 12vw, 10rem)`,
              left: `${10 + i * 14}%`,
              top: `${30 + (i % 3) * 12}%`,
              animationDelay: `${i * -1.3}s`,
              color: isLight ? '#0891b2' : '#22d3ee',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ===== Profile Photo Component ===== */
function ProfilePhoto({ isLight }) {
  return (
    <div className="photo-card relative group cursor-pointer">
      {/* Glow backdrop */}
      <div className={`absolute -inset-6 rounded-full bg-gradient-to-br ${isLight ? 'from-emerald-400/10 to-cyan-400/10' : 'from-emerald-500/15 to-cyan-500/15'}
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-700 pointer-events-none`} />

      {/* Photo circle */}
      <div className={`relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden
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
    { icon: Github, href: 'https://github.com/Nikhi-l37', label: 'GitHub' },
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
          <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
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

  const typedName = useTypewriter('Sivada Nikhil Reddy.', {
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseAfter: 2000,
    pauseBefore: 600,
  });

  // GSAP Entrance Animations (simplified - no SplitText for better performance)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Master timeline for entrance animations
      const tl = gsap.timeline({
        defaults: { 
          ease: 'power3.out',
          duration: 1 
        }
      });

      // Set initial states - simple fade up for all text elements
      gsap.set([greetingRef.current, nameRef.current, desc1Ref.current, desc2Ref.current, ctaRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set(profileRef.current, {
        opacity: 0,
        scale: 0.9,
        x: 30,
      });
      gsap.set(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
      });

      // ── Greeting — simple fade up ──
      tl.to(greetingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, 0.2)

      // ── Name fade-up ──
      .to(nameRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
      }, 0.4)

      // ── Profile photo entrance ──
      .to(profileRef.current, {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.3)

      // ── Paragraph 1 — simple fade up ──
      .to(desc1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, 0.6)

      // ── Paragraph 2 — simple fade up ──
      .to(desc2Ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, 0.8)

      // ── CTA buttons ──
      .to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, 1.0)

      // ── Scroll indicator ──
      .to(scrollIndicatorRef.current, {
        opacity: 0.4,
        y: 0,
        duration: 0.5,
      }, 1.2);

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
      className="relative min-h-[calc(100vh-70px)] md:min-h-screen flex flex-col md:flex-row items-center pt-[70px] md:pt-[100px] pb-8 md:pb-20 overflow-hidden"
    >
      {/* ===== Lightweight CSS-only background ===== */}
      <HeroBackground isLight={isLight} />

      {/* ===== Profile Photo - centered on mobile, absolute top-right on desktop ===== */}
      <div ref={profileRef} className="relative z-20 flex justify-center w-full md:w-auto md:absolute md:top-32 md:right-16 lg:right-24 mb-4 md:mb-0">
        <ProfilePhoto isLight={isLight} />
      </div>

      {/* ===== Main Content ===== */}
      <div ref={contentRef} className="relative z-10 max-w-[1100px] mx-auto px-6 w-full">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left pt-0 md:pt-0">
            <div>
              <p ref={greetingRef} className={`font-mono text-sm sm:text-base mb-3 sm:mb-5 tracking-wider ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`}>Hi, my name is</p>
            </div>

            <div ref={nameRef}>
              <h1 className="text-[clamp(2rem,5vw,4rem)] font-black leading-[1.1] mb-4 tracking-tighter relative whitespace-nowrap">
                <span className="inline relative">
                  <span className="invisible font-inherit pointer-events-none" aria-hidden="true">
                    Sivada Nikhil Reddy.
                  </span>
                  <span className="absolute left-0 top-0 whitespace-nowrap">
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isLight ? 'from-cyan-600 via-violet-600 to-fuchsia-600' : 'from-cyan-400 via-violet-400 to-fuchsia-500'}`}>
                      {typedName}
                    </span>
                    <span className="inline-block w-[3px] h-[0.85em] ml-0.5 bg-accent rounded-sm align-baseline relative top-[0.08em] animate-[blink-caret_0.75s_step-end_infinite]" />
                  </span>
                </span>
              </h1>
            </div>

            <div>
              <p ref={desc1Ref} className="text-[0.85rem] sm:text-[0.95rem] md:text-[1.05rem] text-muted max-w-[540px] mx-auto lg:mx-0 mb-3 sm:mb-4 leading-relaxed">
                Full-Stack Developer focused on building{' '}
                <strong className={`font-semibold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>scalable backend systems</strong> and{' '}
                <strong className={`font-semibold ${isLight ? 'text-blue-700' : 'text-blue-400'}`}>clean, responsive web applications</strong>.
              </p>
            </div>

            <div>
              <p ref={desc2Ref} className="text-[0.8rem] sm:text-[0.9rem] md:text-[1rem] text-dim max-w-[540px] mx-auto lg:mx-0 mb-4 sm:mb-5 md:mb-10 leading-relaxed">
                Strong in backend development with hands-on experience in{' '}
                <strong className={`font-medium ${isLight ? 'text-violet-700' : 'text-violet-400'}`}>APIs</strong>,{' '}
                <strong className={`font-medium ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>databases</strong>, and{' '}
                <strong className={`font-medium ${isLight ? 'text-fuchsia-700' : 'text-fuchsia-400'}`}>server-side logic</strong>.
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
