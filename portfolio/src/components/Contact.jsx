import { useState, useRef, useEffect } from 'react';
import SectionHeader from './SectionHeader';
import TypewriterInput from './TypewriterInput';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';
import { useTheme } from '../hooks/useTheme';

/* ===== Aurora/Warm Background ===== */
function AuroraBackground({ isLight }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, smoothX: -1000, smoothY: -1000 });
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let time = 0;

    const auroras = [];
    const AURORA_COUNT = 4;
    const particles = [];
    const PARTICLE_COUNT = 50;
    const orbs = [];
    const ORB_COUNT = 5;

    const colors = isLight
      ? {
          aurora: ['rgba(236, 72, 153, 0.08)', 'rgba(168, 85, 247, 0.08)', 'rgba(99, 102, 241, 0.06)'],
          particle: ['rgba(236, 72, 153, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(251, 191, 36, 0.6)'],
          orb: ['rgba(236, 72, 153, 0.12)', 'rgba(168, 85, 247, 0.1)', 'rgba(99, 102, 241, 0.08)'],
          connection: 'rgba(236, 72, 153, 0.06)',
          mouseOrb: 'rgba(236, 72, 153, 0.2)',
        }
      : {
          aurora: ['rgba(236, 72, 153, 0.05)', 'rgba(168, 85, 247, 0.05)', 'rgba(99, 102, 241, 0.04)'],
          particle: ['rgba(236, 72, 153, 0.9)', 'rgba(168, 85, 247, 0.9)', 'rgba(251, 191, 36, 0.8)'],
          orb: ['rgba(236, 72, 153, 0.08)', 'rgba(168, 85, 247, 0.06)', 'rgba(99, 102, 241, 0.05)'],
          connection: 'rgba(236, 72, 153, 0.04)',
          mouseOrb: 'rgba(236, 72, 153, 0.25)',
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

    const initAuroras = () => {
      auroras.length = 0;
      for (let i = 0; i < AURORA_COUNT; i++) {
        auroras.push({
          points: [],
          color: colors.aurora[i % colors.aurora.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.005,
          amplitude: 30 + Math.random() * 50,
          yOffset: height * (0.2 + i * 0.2),
        });
        // Initialize points
        const segments = 20;
        for (let j = 0; j <= segments; j++) {
          auroras[i].points.push({
            x: (j / segments) * width,
            baseY: auroras[i].yOffset,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.3,
          size: 1 + Math.random() * 2.5,
          baseSize: 0,
          opacity: 0.3 + Math.random() * 0.7,
          color: colors.particle[Math.floor(Math.random() * colors.particle.length)],
          phase: Math.random() * Math.PI * 2,
        });
        particles[particles.length - 1].baseSize = particles[particles.length - 1].size;
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
          size: 100 + Math.random() * 150,
          color: colors.orb[i % colors.orb.length],
          speed: 0.002 + Math.random() * 0.002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawAuroras = () => {
      auroras.forEach((aurora) => {
        aurora.phase += aurora.speed;
        
        // Update points
        aurora.points.forEach((p, i) => {
          p.phase += 0.02;
          const wave1 = Math.sin(aurora.phase + i * 0.3) * aurora.amplitude;
          const wave2 = Math.sin(aurora.phase * 1.5 + i * 0.5) * aurora.amplitude * 0.5;
          p.y = p.baseY + wave1 + wave2;
        });

        // Draw aurora as gradient fill
        ctx.beginPath();
        ctx.moveTo(aurora.points[0].x, aurora.points[0].y);
        
        for (let i = 1; i < aurora.points.length; i++) {
          const xc = (aurora.points[i].x + aurora.points[i - 1].x) / 2;
          const yc = (aurora.points[i].y + aurora.points[i - 1].y) / 2;
          ctx.quadraticCurveTo(aurora.points[i - 1].x, aurora.points[i - 1].y, xc, yc);
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, aurora.yOffset - aurora.amplitude, 0, height);
        gradient.addColorStop(0, aurora.color);
        gradient.addColorStop(0.5, aurora.color.replace(/[\d.]+\)$/, '0.02)'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
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
        gradient.addColorStop(0, orb.color.replace(/[\d.]+\)$/, '0.25)'));
        gradient.addColorStop(0.4, orb.color.replace(/[\d.]+\)$/, '0.1)'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    const drawConnections = () => {
      const mouse = mouseRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            const opacity = (1 - dist / 80) * 0.3;
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
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.2;
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
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 0.008;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.03;
        p.size = p.baseSize * (1 + Math.sin(p.phase) * 0.25);

        // Wrap
        if (p.y < -20) { p.y = height + 20; p.x = Math.random() * width; }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.opacity})`));
        gradient.addColorStop(0.5, p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.3})`));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };

    const drawMouseOrb = () => {
      const mouse = mouseRef.current;
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.08;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.08;

      if (mouse.smoothX > 0) {
        const gradient = ctx.createRadialGradient(mouse.smoothX, mouse.smoothY, 0, mouse.smoothX, mouse.smoothY, 80);
        gradient.addColorStop(0, colors.mouseOrb.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(0.5, colors.mouseOrb.replace(/[\d.]+\)$/, '0.1)'));
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
      drawAuroras();
      drawOrbs();
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
    initAuroras();
    initParticles();
    initOrbs();
    animate();

    window.addEventListener('resize', () => { resize(); initAuroras(); });
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

const NAME_PHRASES = ['Enter your name...', 'How should I call you?'];
const EMAIL_PHRASES = ['you@example.com', 'What is your best email?'];
const MESSAGE_PHRASES = ["What's on your mind?", "Let's talk about a project!", 'I have a question about Vedic Vox...'];

const SOCIALS = [
  { icon: 'fa-brands fa-github', url: 'https://github.com/Nikhi-l37', label: 'GitHub' },
  { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com/in/sivada-nikhil-reddy-409706292', label: 'LinkedIn' },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.292-.906h3.549l.065-.252a2.5 2.5 0 0 0 .072-.584c0-.188-.019-.377-.057-.564H14.27c.052-.31.148-.607.287-.886.245-.5.593-.94 1.013-1.296l.11-.091a3.79 3.79 0 0 1 2.445-.894c.762 0 1.468.188 2.076.562.344.21.644.481.886.8l1.484-1.345a5.878 5.878 0 0 0-4.444-2.017 5.95 5.95 0 0 0-1.312.164 5.773 5.773 0 0 0-2.7 1.527 5.532 5.532 0 0 0-1.16 1.712L12 12.065l-.03-.063a5.532 5.532 0 0 0-1.16-1.712 5.773 5.773 0 0 0-2.7-1.527 5.95 5.95 0 0 0-1.312-.164 5.878 5.878 0 0 0-4.444 2.017L3.838 11.96c.242-.319.542-.59.886-.8a3.891 3.891 0 0 1 2.076-.562c.97 0 1.83.324 2.555.985.42.356.768.796 1.013 1.296.14.279.235.576.288.886H4.52a4.88 4.88 0 0 0-.058.564c0 .198.024.394.073.584l.064.252h3.549a3.571 3.571 0 0 1-.293.906 3.79 3.79 0 0 1-2.135 2.078 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 3.263 3.263 0 0 1-.565-.745L0 15.255a5.501 5.501 0 0 0 .904 1.5c.467.53 1.036.96 1.69 1.106a6.592 6.592 0 0 0 4.505.106 5.813 5.813 0 0 0 2.174-1.263c.476-.44.862-.96 1.106-1.37.46.632.826 1.068 1.106 1.37a5.813 5.813 0 0 0 2.174 1.263 6.592 6.592 0 0 0 4.505-.106c.654-.146 1.223-.576 1.69-1.106a5.501 5.501 0 0 0 .904-1.5l-1.842-.94z" />
      </svg>
    ),
    url: 'https://www.geeksforgeeks.org/profile/snikhilre097c',
    label: 'GeeksforGeeks',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.038-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.535-1.387-.552-1.902-.038l-10.1 10.101c-.981.982-1.494 2.337-1.494 3.835 0 1.498.513 2.895 1.494 3.875l4.347 4.361c.981.979 2.337 1.452 3.834 1.452s2.853-.512 3.835-1.494l2.609-2.637c.514-.514.496-1.365-.039-1.9s-1.386-.553-1.899-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z" />
      </svg>
    ),
    url: 'https://leetcode.com/u/NikhilReddy3446/',
    label: 'LeetCode',
  },
];

export default function Contact() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [formKey, setFormKey] = useState(0);
  const sectionRef = useRef(null);
  useGSAPScrollReveal(sectionRef);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.target);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStatus('sent');
        e.target.reset();
        setFormKey((k) => k + 1);
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const btnClass = {
    idle: 'bg-accent text-primary shadow-[0_0_20px_var(--color-accent-dim)] hover:opacity-90 hover:shadow-[0_0_30px_var(--color-accent-glow)]',
    sending: 'bg-accent/70 text-primary pointer-events-none',
    sent: 'bg-emerald-500 text-white pointer-events-none',
    error: 'bg-red-500 text-white pointer-events-none',
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background */}
      <AuroraBackground isLight={isLight} />
      {/* Subtle section tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/[0.012] to-transparent pointer-events-none" />
      <div className="relative z-10 max-w-[1100px] mx-auto px-6">
        <SectionHeader number="05" title="Get In Touch" />

        <p className="gsap-text text-[0.95rem] md:text-[1.05rem] text-muted max-w-[600px] mb-8 md:mb-12">
            I'm currently looking for new opportunities! Whether you have a question, a project idea,
            or just want to say hi — my inbox is always open.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY} />
              <input type="hidden" name="subject" value="New message from Portfolio" />
              <input type="checkbox" name="botcheck" className="hidden" />
              <div className="gsap-form-field flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-dim uppercase tracking-wider">
                  Name
                </label>
                <TypewriterInput
                  key={`name-${formKey}`}
                  phrases={NAME_PHRASES}
                  type="text" id="name" name="name" required
                  className="w-full font-sans text-[0.95rem] px-4 py-3.5 bg-surface text-text border-[1.5px] border-border rounded-lg
                             outline-none transition-[border-color,box-shadow] duration-300
                             focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)]"
                />
              </div>
              <div className="gsap-form-field flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-dim uppercase tracking-wider">
                  Email
                </label>
                <TypewriterInput
                  key={`email-${formKey}`}
                  phrases={EMAIL_PHRASES}
                  type="email" id="email" name="email" required
                  className="w-full font-sans text-[0.95rem] px-4 py-3.5 bg-surface text-text border-[1.5px] border-border rounded-lg
                             outline-none transition-[border-color,box-shadow] duration-300
                             focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)]"
                />
              </div>
              <div className="gsap-form-field flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-dim uppercase tracking-wider">
                  Message
                </label>
                <TypewriterInput
                  key={`message-${formKey}`}
                  phrases={MESSAGE_PHRASES}
                  as="textarea"
                  id="message" name="message" rows={5} required
                  className="w-full font-sans text-[0.95rem] px-4 py-3.5 bg-surface text-text border-[1.5px] border-border rounded-lg
                             outline-none resize-y transition-[border-color,box-shadow] duration-300
                             focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)]"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`gsap-form-field inline-flex items-center justify-center gap-2.5 w-full px-7 py-3.5 text-[0.95rem] font-semibold rounded-lg
                  cursor-pointer transition-[transform,box-shadow,opacity,background-color,color] duration-300 ease-out border-none
                  ${btnClass[status]}`}
              >
                {status === 'sending' && (
                  <>
                    <span>Sending...</span>
                    <i className="fa-solid fa-spinner animate-spin" />
                  </>
                )}
                {status === 'sent' && (
                  <>
                    <span>Message Sent!</span>
                    <i className="fa-solid fa-check" />
                  </>
                )}
                {status === 'error' && (
                  <>
                    <span>Failed — Try Again</span>
                    <i className="fa-solid fa-xmark" />
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <span>Send Message</span>
                    <i className="fa-solid fa-paper-plane" />
                  </>
                )}
              </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col gap-5">
              {[
                { icon: 'fa-solid fa-envelope', label: 'Email', value: 's.nikhilreddy3446@gmail.com', href: 'mailto:s.nikhilreddy3446@gmail.com' },
                { icon: 'fa-solid fa-phone', label: 'Phone', value: '+91 8008043446', href: 'tel:+918008043446' },
                { icon: 'fa-solid fa-location-dot', label: 'Location', value: 'India' },
              ].map(({ icon, label, value, href }) => (
                <div key={label}
                  className="gsap-contact-item flex items-center gap-4 p-5 bg-card border border-border rounded-lg float-3 transition-[border-color,box-shadow] duration-300 ease-out hover:border-border-hover">
                  <div className="w-11 h-11 rounded-full bg-accent-dim flex items-center justify-center text-xl text-accent shrink-0">
                    <i className={icon} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-dim uppercase tracking-wider mb-0.5">{label}</h4>
                    {href ? (
                      <a href={href} className="text-[0.92rem] text-muted hover:text-accent transition-colors break-all">{value}</a>
                    ) : (
                      <p className="text-[0.92rem] text-muted">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social Icons */}
              <div className="flex gap-3.5 mt-3">
                {SOCIALS.map(({ icon, svg, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="gsap-contact-item w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full
                                text-muted text-lg float-2 will-change-transform
                                transition-[box-shadow,background-color,border-color,color] duration-300 ease-out
                                hover:bg-accent hover:border-accent hover:text-primary
                                hover:shadow-[0_8px_25px_var(--color-accent-dim)]">
                    {svg || <i className={icon} />}
                  </a>
                ))}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
