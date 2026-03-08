import { useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';
import { useTheme } from '../hooks/useTheme';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ===== Enhanced Magical Sparkle Background ===== */
function MagicalBackground({ isLight }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let time = 0;

    // Particles for sparkle effect
    const particles = [];
    const PARTICLE_COUNT = 80;

    // Floating orbs
    const orbs = [];
    const ORB_COUNT = 6;

    // Shooting stars
    const shootingStars = [];

    // Connection lines threshold
    const CONNECTION_DISTANCE = 120;

    const colors = isLight
      ? {
          particle: [
            'rgba(99, 102, 241, 0.9)',   // Indigo
            'rgba(139, 92, 246, 0.9)',   // Purple
            'rgba(6, 182, 212, 0.85)',   // Cyan
            'rgba(236, 72, 153, 0.7)',   // Pink
            'rgba(251, 191, 36, 0.7)',   // Amber
          ],
          orb: [
            'rgba(99, 102, 241, 0.25)',
            'rgba(139, 92, 246, 0.2)',
            'rgba(6, 182, 212, 0.2)',
            'rgba(236, 72, 153, 0.15)',
          ],
          connection: 'rgba(99, 102, 241, 0.08)',
          mouseOrb: 'rgba(99, 102, 241, 0.3)',
          shootingStar: 'rgba(251, 191, 36, 1)',
        }
      : {
          particle: [
            'rgba(139, 92, 246, 1)',     // Purple
            'rgba(99, 102, 241, 1)',     // Indigo
            'rgba(6, 182, 212, 1)',      // Cyan
            'rgba(236, 72, 153, 0.9)',   // Pink
            'rgba(251, 191, 36, 0.85)',  // Amber
          ],
          orb: [
            'rgba(139, 92, 246, 0.15)',
            'rgba(99, 102, 241, 0.12)',
            'rgba(6, 182, 212, 0.12)',
            'rgba(236, 72, 153, 0.1)',
          ],
          connection: 'rgba(139, 92, 246, 0.06)',
          mouseOrb: 'rgba(139, 92, 246, 0.35)',
          shootingStar: 'rgba(251, 191, 36, 1)',
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

    // Initialize particles with variety
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const type = Math.random();
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.15 - Math.random() * 0.4,
          size: type > 0.8 ? 2 + Math.random() * 3 : 1 + Math.random() * 2,
          baseSize: 0,
          opacity: Math.random(),
          opacitySpeed: 0.008 + Math.random() * 0.015,
          opacityDir: 1,
          color: colors.particle[Math.floor(Math.random() * colors.particle.length)],
          trail: [],
          maxTrail: type > 0.7 ? 8 + Math.floor(Math.random() * 12) : 3 + Math.floor(Math.random() * 5),
          type: type > 0.9 ? 'star' : type > 0.7 ? 'glow' : 'normal',
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          rotation: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
        });
        particles[particles.length - 1].baseSize = particles[particles.length - 1].size;
      }
    };

    // Initialize floating orbs
    const initOrbs = () => {
      orbs.length = 0;
      for (let i = 0; i < ORB_COUNT; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          targetX: Math.random() * width,
          targetY: Math.random() * height,
          size: 100 + Math.random() * 180,
          color: colors.orb[i % colors.orb.length],
          speed: 0.003 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: 0.008 + Math.random() * 0.008,
        });
      }
    };

    // Create shooting star
    const createShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.003) {
        const startX = Math.random() * width * 0.5;
        const startY = Math.random() * height * 0.3;
        shootingStars.push({
          x: startX,
          y: startY,
          vx: 4 + Math.random() * 4,
          vy: 2 + Math.random() * 3,
          size: 2 + Math.random() * 2,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          trail: [],
          maxTrail: 20,
        });
      }
    };

    // Draw shooting stars
    const drawShootingStars = () => {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        
        s.trail.push({ x: s.x, y: s.y, life: s.life });
        if (s.trail.length > s.maxTrail) s.trail.shift();
        
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        // Draw trail with gradient
        if (s.trail.length > 1) {
          for (let j = 1; j < s.trail.length; j++) {
            const t = s.trail[j];
            const prev = s.trail[j - 1];
            const progress = j / s.trail.length;
            
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = colors.shootingStar.replace(/[\d.]+\)$/, `${progress * t.life * 0.8})`);
            ctx.lineWidth = s.size * progress;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // Draw head
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
        gradient.addColorStop(0.3, colors.shootingStar.replace(/[\d.]+\)$/, `${s.life * 0.8})`));
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        if (s.life <= 0) shootingStars.splice(i, 1);
      }
    };

    // Draw floating orbs with enhanced blur effect
    const drawOrbs = () => {
      orbs.forEach((orb) => {
        orb.x += (orb.targetX - orb.x) * orb.speed;
        orb.y += (orb.targetY - orb.y) * orb.speed;

        if (Math.random() < 0.003) {
          orb.targetX = Math.random() * width;
          orb.targetY = Math.random() * height;
        }

        orb.phase += orb.phaseSpeed;
        const pulseSize = orb.size * (1 + Math.sin(orb.phase) * 0.25);
        const breathe = Math.sin(orb.phase * 0.5) * 0.1 + 0.9;

        // Multi-layer gradient for depth
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulseSize);
        gradient.addColorStop(0, orb.color.replace(/[\d.]+\)$/, `${0.4 * breathe})`));
        gradient.addColorStop(0.3, orb.color.replace(/[\d.]+\)$/, `${0.2 * breathe})`));
        gradient.addColorStop(0.6, orb.color.replace(/[\d.]+\)$/, `${0.08 * breathe})`));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    // Draw connections between nearby particles
    const drawConnections = () => {
      const mouse = mouseRef.current;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.5 * 
              Math.min(particles[i].opacity, particles[j].opacity);
            
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = colors.connection.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.smoothX > 0 && mouse.smoothY > 0) {
          const dx = particles[i].x - mouse.smoothX;
          const dy = particles[i].y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE * 1.5) {
            const opacity = (1 - dist / (CONNECTION_DISTANCE * 1.5)) * 0.3 * particles[i].opacity;
            
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

    // Draw sparkle particles with enhanced effects
    const drawParticles = () => {
      const mouse = mouseRef.current;

      particles.forEach((p) => {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrail) p.trail.shift();

        // Mouse attraction/repulsion
        if (mouse.smoothX > 0 && mouse.smoothY > 0) {
          const dx = p.x - mouse.smoothX;
          const dy = p.y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150 * 0.015;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Apply friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Pulse size
        p.pulsePhase += 0.03;
        p.size = p.baseSize * (1 + Math.sin(p.pulsePhase) * 0.3);

        // Rotation for star type
        p.rotation += p.rotationSpeed;

        // Twinkle effect
        p.opacity += p.opacitySpeed * p.opacityDir;
        if (p.opacity >= 1 || p.opacity <= 0.1) p.opacityDir *= -1;
        p.opacity = Math.max(0.1, Math.min(1, p.opacity));

        // Wrap around
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
          p.trail = [];
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        // Draw trail with gradient fade
        if (p.trail.length > 1 && p.type !== 'normal') {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.25})`);
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw based on type
        if (p.type === 'star') {
          // Draw 4-point star
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          const outerRadius = p.size * 2.5;
          const innerRadius = p.size * 0.8;
          
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / 4;
            if (i === 0) ctx.moveTo(radius, 0);
            else ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
          ctx.closePath();
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
          ctx.fill();
          
          // Inner glow
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.8})`;
          ctx.fill();
          
          ctx.restore();
        } else {
          // Outer glow
          const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          glowGradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.5})`));
          glowGradient.addColorStop(0.5, p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.15})`));
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
          ctx.fill();

          // Bright center
          if (p.type === 'glow' && p.opacity > 0.7) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${(p.opacity - 0.5) * 1.2})`;
            ctx.fill();
          }
        }

        // Cross sparkle for bright particles
        if (p.opacity > 0.85 && p.size > 2) {
          const sparkleSize = p.size * 4;
          ctx.beginPath();
          ctx.moveTo(p.x - sparkleSize, p.y);
          ctx.lineTo(p.x + sparkleSize, p.y);
          ctx.moveTo(p.x, p.y - sparkleSize);
          ctx.lineTo(p.x, p.y + sparkleSize);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(p.opacity - 0.85) * 3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    // Draw enhanced mouse-following orb
    const drawMouseOrb = () => {
      const mouse = mouseRef.current;
      
      // Smooth mouse position
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.1;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.1;
      
      if (mouse.smoothX < 0 || mouse.smoothY < 0) return;

      // Multi-layer glow
      const layers = [
        { radius: 200, opacity: 0.08 },
        { radius: 120, opacity: 0.15 },
        { radius: 60, opacity: 0.25 },
      ];

      layers.forEach(layer => {
        const gradient = ctx.createRadialGradient(
          mouse.smoothX, mouse.smoothY, 0,
          mouse.smoothX, mouse.smoothY, layer.radius
        );
        gradient.addColorStop(0, colors.mouseOrb.replace(/[\d.]+\)$/, `${layer.opacity})`));
        gradient.addColorStop(0.5, colors.mouseOrb.replace(/[\d.]+\)$/, `${layer.opacity * 0.3})`));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(mouse.smoothX, mouse.smoothY, layer.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Center bright spot
      ctx.beginPath();
      ctx.arc(mouse.smoothX, mouse.smoothY, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
      ctx.fill();
    };

    // Main animation loop
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Create shooting stars occasionally
      createShootingStar();

      // Layer 1: Floating orbs (background)
      drawOrbs();

      // Layer 2: Connections
      drawConnections();

      // Layer 3: Mouse-following light
      drawMouseOrb();

      // Layer 4: Sparkle particles
      drawParticles();

      // Layer 5: Shooting stars (foreground)
      drawShootingStars();

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

    // Initialize
    resize();
    initParticles();
    initOrbs();
    animate();

    const handleResize = () => {
      resize();
      initParticles();
      initOrbs();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLight]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />
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

  return (
    <section 
      id="education" 
      ref={sectionRef}
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Magical Aurora Background */}
      <MagicalBackground isLight={isLight} />

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
