import { useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './SectionHeader';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';
import { useTheme } from '../hooks/useTheme';

gsap.registerPlugin(ScrollTrigger);

/* ===== Circuit/Electric Background ===== */
function CircuitBackground({ isLight }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let time = 0;

    const nodes = [];
    const NODE_COUNT = 40;
    const pulses = [];
    const sparks = [];

    const colors = isLight
      ? {
          node: 'rgba(34, 211, 238, 0.7)',
          nodeGlow: 'rgba(34, 211, 238, 0.3)',
          line: 'rgba(34, 211, 238, 0.12)',
          pulse: 'rgba(34, 211, 238, 0.9)',
          spark: ['rgba(251, 191, 36, 0.9)', 'rgba(34, 211, 238, 0.9)'],
          mouseOrb: 'rgba(34, 211, 238, 0.2)',
          grid: 'rgba(34, 211, 238, 0.03)',
        }
      : {
          node: 'rgba(34, 211, 238, 0.9)',
          nodeGlow: 'rgba(34, 211, 238, 0.4)',
          line: 'rgba(34, 211, 238, 0.08)',
          pulse: 'rgba(34, 211, 238, 1)',
          spark: ['rgba(251, 191, 36, 1)', 'rgba(34, 211, 238, 1)'],
          mouseOrb: 'rgba(34, 211, 238, 0.25)',
          grid: 'rgba(34, 211, 238, 0.02)',
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

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: 2 + Math.random() * 3,
          connections: [],
          pulse: Math.random() * Math.PI * 2,
          active: Math.random() > 0.7,
        });
      }
      // Build connections
      nodes.forEach((n, i) => {
        nodes.forEach((m, j) => {
          if (i !== j && Math.random() < 0.15) {
            n.connections.push(j);
          }
        });
      });
    };

    const createPulse = () => {
      if (pulses.length < 8 && Math.random() < 0.02) {
        const start = Math.floor(Math.random() * nodes.length);
        const node = nodes[start];
        if (node.connections.length > 0) {
          const end = node.connections[Math.floor(Math.random() * node.connections.length)];
          pulses.push({ start, end, progress: 0, speed: 0.02 + Math.random() * 0.02 });
        }
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      const spacing = 50;
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawConnections = () => {
      nodes.forEach((n, i) => {
        n.connections.forEach(j => {
          const m = nodes[j];
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            // Create angular lines (circuit-like)
            const midX = n.x + dx * 0.5;
            const midY = n.y;
            ctx.lineTo(midX, midY);
            ctx.lineTo(midX, m.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = colors.line;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
    };

    const drawPulses = () => {
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const startNode = nodes[p.start];
        const endNode = nodes[p.end];
        
        p.progress += p.speed;

        // Calculate position along angular path
        let x, y;
        const dx = endNode.x - startNode.x;
        const dy = endNode.y - startNode.y;
        const midX = startNode.x + dx * 0.5;

        if (p.progress < 0.33) {
          const t = p.progress / 0.33;
          x = startNode.x + (midX - startNode.x) * t;
          y = startNode.y;
        } else if (p.progress < 0.66) {
          const t = (p.progress - 0.33) / 0.33;
          x = midX;
          y = startNode.y + (endNode.y - startNode.y) * t;
        } else {
          const t = (p.progress - 0.66) / 0.34;
          x = midX + (endNode.x - midX) * t;
          y = endNode.y;
        }

        // Draw pulse glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, colors.pulse);
        gradient.addColorStop(0.5, colors.pulse.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors.pulse;
        ctx.fill();

        if (p.progress >= 1) {
          // Spark at end
          for (let s = 0; s < 3; s++) {
            sparks.push({
              x: endNode.x,
              y: endNode.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              life: 1,
              color: colors.spark[Math.floor(Math.random() * colors.spark.length)],
            });
          }
          pulses.splice(i, 1);
        }
      }
    };

    const drawSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.life -= 0.03;

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(/[\d.]+\)$/, `${s.life})`);
        ctx.fill();

        if (s.life <= 0) sparks.splice(i, 1);
      }
    };

    const drawNodes = () => {
      const mouse = mouseRef.current;
      
      nodes.forEach((n) => {
        // Mouse interaction
        if (mouse.smoothX > 0) {
          const dx = n.x - mouse.smoothX;
          const dy = n.y - mouse.smoothY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 0.008;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
        }

        n.vx *= 0.99;
        n.vy *= 0.99;
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.05;

        // Wrap
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;

        const pulseSize = n.size * (1 + Math.sin(n.pulse) * 0.3);

        // Glow
        const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pulseSize * 4);
        gradient.addColorStop(0, colors.nodeGlow);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = colors.node;
        ctx.fill();

        // Active nodes have extra ring
        if (n.active) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseSize + 5, 0, Math.PI * 2);
          ctx.strokeStyle = colors.node.replace(/[\d.]+\)$/, '0.3)');
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    const drawMouseOrb = () => {
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.1;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.1;

      if (mouse.smoothX > 0) {
        const gradient = ctx.createRadialGradient(mouse.smoothX, mouse.smoothY, 0, mouse.smoothX, mouse.smoothY, 60);
        gradient.addColorStop(0, colors.mouseOrb);
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mouse.smoothX, mouse.smoothY, 60, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawConnections();
      createPulse();
      drawPulses();
      drawSparks();
      drawNodes();
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
    initNodes();
    animate();

    window.addEventListener('resize', () => { resize(); initNodes(); });
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
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
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
      className="skill-pill inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold
                 tracking-wide cursor-default select-none"
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
   Spark Effect — small particles on bounce/collision
   ───────────────────────────────────────────── */
function spawnSparks(container, x, y, color, sparksArr, count = 3) {
  if (sparksArr.length > 15) return;
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    const size = 2 + Math.random() * 3;
    Object.assign(spark.style, {
      position: 'absolute',
      left: `${x - size / 2}px`,
      top: `${y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: color,
      pointerEvents: 'none',
      zIndex: '10',
    });
    container.appendChild(spark);
    sparksArr.push(spark);
    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 20;
    gsap.to(spark, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0,
      duration: 0.35 + Math.random() * 0.25,
      ease: 'power2.out',
      onComplete: () => {
        spark.remove();
        const idx = sparksArr.indexOf(spark);
        if (idx > -1) sparksArr.splice(idx, 1);
      },
    });
  }
}

/* ─────────────────────────────────────────────
   Bento Card with Physics-based Bounce + Collision
   ───────────────────────────────────────────── */
function BentoCard({ category }) {
  const { label, icon: Icon, accent, skills } = category;
  const cardRef = useRef(null);
  const pillsRef = useRef(null);
  const physicsRef = useRef(null);
  const blastDone = useRef(false);
  const isHovered = useRef(false);
  const rafId = useRef(null);
  const cleanups = useRef([]);

  /* ── Init: blast, then physics (desktop only) ── */
  useEffect(() => {
    const card = cardRef.current;
    const container = pillsRef.current;
    if (!card || !container) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    const pills = [...container.querySelectorAll('.skill-pill')];
    if (!pills.length) return;

    let blastTimer;
    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        blastTimer = setTimeout(() => runBlastAndPhysics(card, container, pills), 3000);
      },
    });

    return () => {
      st.kill();
      clearTimeout(blastTimer);
      stopPhysics();
      cleanups.current.forEach((fn) => fn());
    };
  }, [accent]);

  /* ── Stop physics loop ── */
  function stopPhysics() {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }

  /* ── Blast sequence then start physics ── */
  function runBlastAndPhysics(card, container, pills) {
    if (blastDone.current) return;
    blastDone.current = true;

    // Use FULL card area (clientWidth/Height) so pills reach the actual border
    const cardRect = card.getBoundingClientRect();
    const fullW = card.clientWidth;
    const fullH = card.clientHeight;

    // Pill positions relative to card top-left corner (not padding)
    const positions = pills.map((pill) => {
      const pr = pill.getBoundingClientRect();
      return {
        left: pr.left - cardRect.left,
        top: pr.top - cardRect.top,
        w: pr.width,
        h: pr.height,
      };
    });

    // Move pills from the flex container into the card for full-area roaming
    pills.forEach((pill, i) => {
      card.appendChild(pill);
      const p = positions[i];
      pill.style.position = 'absolute';
      pill.style.left = `${p.left}px`;
      pill.style.top = `${p.top}px`;
      pill.style.margin = '0';
      pill.style.zIndex = '5';
      pill.style.transition = 'none';
    });

    // Hide original container (avoid empty space collapse issues)
    container.style.height = `${container.offsetHeight}px`;
    container.style.visibility = 'hidden';

    const state = pills.map((pill, i) => ({
      pill,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      origLeft: positions[i].left,
      origTop: positions[i].top,
      w: positions[i].w,
      h: positions[i].h,
      setX: gsap.quickSetter(pill, 'x', 'px'),
      setY: gsap.quickSetter(pill, 'y', 'px'),
    }));

    physicsRef.current = {
      state,
      boundsW: fullW,
      boundsH: fullH,
      card,
      sparks: [],
    };

    const tl = gsap.timeline();

    // Shockwave flash
    tl.call(() => {
      const flash = document.createElement('div');
      Object.assign(flash.style, {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}, transparent)`,
        boxShadow: `0 0 40px ${accent}, 0 0 80px ${accent}80`,
        zIndex: '3',
        pointerEvents: 'none',
      });
      card.appendChild(flash);
      gsap.to(flash, {
        width: 200,
        height: 200,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        onComplete: () => flash.remove(),
      });
    });

    // Phase 4 — Explode outward + assign velocities
    tl.call(() => {
      state.forEach((s, i) => {
        const tx = gsap.utils.random(2, fullW - s.w - 2) - s.origLeft;
        const ty = gsap.utils.random(2, fullH - s.h - 2) - s.origTop;
        gsap.to(s.pill, {
          x: tx,
          y: ty,
          scale: 1,
          opacity: 1,
          duration: 0.65,
          delay: i * 0.04,
          ease: 'back.out(1.4)',
          onComplete: () => {
            s.x = tx;
            s.y = ty;
            const a = Math.random() * Math.PI * 2;
            const spd = 0.8 + Math.random() * 1.2;
            s.vx = Math.cos(a) * spd;
            s.vy = Math.sin(a) * spd;
          },
        });
      });

      gsap.fromTo(
        pills,
        { filter: `drop-shadow(0 0 8px ${accent})` },
        { filter: 'drop-shadow(0 0 0px transparent)', duration: 0.8, stagger: 0.03 },
      );
    }, null, '-=0.4');

    // Phase 5 — Start physics after explosion settles
    tl.call(() => {
      startPhysicsLoop();
    }, null, '+=0.7');

    // Pause physics when off-screen
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) stopPhysics();
        else if (blastDone.current && !isHovered.current && !rafId.current) startPhysicsLoop();
      },
      { threshold: 0 },
    );
    obs.observe(card);
    cleanups.current.push(() => obs.disconnect());
  }

  /* ── Physics loop — boundary bounce + collision + sparks ── */
  function startPhysicsLoop() {
    if (rafId.current) return;
    const FRICTION = 0.9988;
    const MAX_SPEED = 2.8;
    const MIN_SPEED = 0.6;
    const BOUNCE = 0.92;
    const COLLISION_BOOST = 1.1;
    const PAD = 1;

    function tick() {
      const phys = physicsRef.current;
      if (!phys || isHovered.current) {
        rafId.current = null;
        return;
      }

      const { state, boundsW, boundsH, card, sparks } = phys;

      // --- Move + wall bounce ---
      for (let i = 0; i < state.length; i++) {
        const s = state[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= FRICTION;
        s.vy *= FRICTION;

        // Absolute position within card inner area
        const absX = s.origLeft + s.x;
        const absY = s.origTop + s.y;
        let bounced = false;
        let sparkX = 0, sparkY = 0;

        // Left wall
        if (absX < PAD) {
          s.x = PAD - s.origLeft;
          s.vx = Math.abs(s.vx) * BOUNCE + 0.15;
          bounced = true;
          sparkX = absX;
          sparkY = absY + s.h / 2;
        }
        // Right wall
        else if (absX + s.w > boundsW - PAD) {
          s.x = boundsW - PAD - s.w - s.origLeft;
          s.vx = -(Math.abs(s.vx) * BOUNCE + 0.15);
          bounced = true;
          sparkX = absX + s.w;
          sparkY = absY + s.h / 2;
        }

        // Top wall
        if (absY < PAD) {
          s.y = PAD - s.origTop;
          s.vy = Math.abs(s.vy) * BOUNCE + 0.15;
          bounced = true;
          sparkX = absX + s.w / 2;
          sparkY = absY;
        }
        // Bottom wall
        else if (absY + s.h > boundsH - PAD) {
          s.y = boundsH - PAD - s.h - s.origTop;
          s.vy = -(Math.abs(s.vy) * BOUNCE + 0.15);
          bounced = true;
          sparkX = absX + s.w / 2;
          sparkY = absY + s.h;
        }

        if (bounced) {
          spawnSparks(card, sparkX, sparkY, accent, sparks, 2);
        }

        // Speed cap + min speed kick
        const spd = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (spd > MAX_SPEED) {
          s.vx = (s.vx / spd) * MAX_SPEED;
          s.vy = (s.vy / spd) * MAX_SPEED;
        }
        if (spd < MIN_SPEED) {
          const a = Math.random() * Math.PI * 2;
          s.vx += Math.cos(a) * 0.25;
          s.vy += Math.sin(a) * 0.25;
        }

        s.setX(s.x);
        s.setY(s.y);
      }

      // --- Pill-to-pill collision (snappy bounce) ---
      for (let i = 0; i < state.length; i++) {
        for (let j = i + 1; j < state.length; j++) {
          const A = state[i];
          const B = state[j];
          const aCx = A.origLeft + A.x + A.w / 2;
          const aCy = A.origTop + A.y + A.h / 2;
          const bCx = B.origLeft + B.x + B.w / 2;
          const bCy = B.origTop + B.y + B.h / 2;
          const dx = bCx - aCx;
          const dy = bCy - aCy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (Math.max(A.w, A.h) + Math.max(B.w, B.h)) * 0.45;

          if (dist < minDist && dist > 0.1) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Push apart
            const overlap = (minDist - dist) / 2 + 1;
            A.x -= nx * overlap;
            A.y -= ny * overlap;
            B.x += nx * overlap;
            B.y += ny * overlap;

            // Elastic + boosted velocity swap
            const dvx = A.vx - B.vx;
            const dvy = A.vy - B.vy;
            const dot = dvx * nx + dvy * ny;
            if (dot > 0) {
              A.vx -= dot * nx * COLLISION_BOOST;
              A.vy -= dot * ny * COLLISION_BOOST;
              B.vx += dot * nx * COLLISION_BOOST;
              B.vy += dot * ny * COLLISION_BOOST;
            } else {
              // Even if moving apart, give a small kick
              const kick = 0.3;
              A.vx -= nx * kick;
              A.vy -= ny * kick;
              B.vx += nx * kick;
              B.vy += ny * kick;
            }

            const midX = (aCx + bCx) / 2;
            const midY = (aCy + bCy) / 2;
            spawnSparks(card, midX, midY, accent, sparks, 3);
          }
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);
  }

  /* ── Hover: gently return pills to original positions ── */
  const handleMouseEnter = (e) => {
    isHovered.current = true;
    e.currentTarget.style.boxShadow = `0 4px 40px ${accent}15, 0 0 60px ${accent}08`;

    if (!physicsRef.current) return;
    const { state } = physicsRef.current;

    // Kill velocities, animate pills home with stagger
    state.forEach((s, i) => {
      s.vx = 0;
      s.vy = 0;
      gsap.killTweensOf(s.pill);
      gsap.to(s.pill, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1.06,
        duration: 1.4 + i * 0.08,
        ease: 'power3.out',
        onUpdate: () => {
          s.x = gsap.getProperty(s.pill, 'x') || 0;
          s.y = gsap.getProperty(s.pill, 'y') || 0;
        },
        onComplete: () => {
          s.x = 0;
          s.y = 0;
          gsap.to(s.pill, { scale: 1, duration: 0.3, ease: 'power2.out' });
        },
      });
    });
  };

  /* ── Leave: resume physics ── */
  const handleMouseLeave = (e) => {
    isHovered.current = false;
    e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.25)';

    if (!physicsRef.current) return;
    const { state } = physicsRef.current;

    state.forEach((s) => {
      gsap.killTweensOf(s.pill);
      s.x = gsap.getProperty(s.pill, 'x') || 0;
      s.y = gsap.getProperty(s.pill, 'y') || 0;
      // Give random velocity to scatter
      const a = Math.random() * Math.PI * 2;
      const spd = 0.4 + Math.random() * 0.8;
      s.vx = Math.cos(a) * spd;
      s.vy = Math.sin(a) * spd;
    });

    startPhysicsLoop();
  };

  return (
    <div
      ref={cardRef}
      className="gsap-card group relative rounded-2xl h-full
                 border border-border bg-card
                 p-7 md:p-8 transition-shadow duration-500 ease-out
                 hover:border-border-hover
                 overflow-hidden min-h-[220px] md:min-h-[260px]"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.25)' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Corner accent glow (hover-only) — large radial gradient for soft glow without blur filter */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-0
                   group-hover:opacity-100 transition-opacity duration-700
                   pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}30 0%, ${accent}10 40%, transparent 70%)`, zIndex: 0 }}
      />

      {/* Header row — z-index above floating pills */}
      <div className="relative flex items-center gap-3 mb-5" style={{ zIndex: 8 }}>
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

      {/* Skill pills — origin container (pills get moved to card after blast) */}
      <div ref={pillsRef} className="relative flex flex-wrap gap-2.5" style={{ zIndex: 5 }}>
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
          zIndex: 9,
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
                 border border-border bg-card
                 p-7 md:p-8 transition-[box-shadow,border-color,transform] duration-500 ease-out
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
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useGSAPScrollReveal(sectionRef);
  useBentoAnimations(gridRef);

  return (
    <section id="skills" ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background */}
      <CircuitBackground isLight={isLight} />
      {/* Subtle section tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.015] to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
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
