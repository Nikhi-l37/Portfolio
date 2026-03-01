import { useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ===== SVG Flower / Shape Particle Burst (GSAP-site style) ===== */
const COLORS = [
  '#06b6d4', '#8b5cf6', '#10b981', '#f43f5e',
  '#fbbf24', '#3b82f6', '#ec4899', '#22c55e',
];

// Inline SVG shapes drawn as strings — pinwheel flower, 4-petal, star, cross-star, diamond-sparkle
const SHAPES = [
  // 4-petal flower
  (c) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 14 8 12 12C10 8 12 2 12 2Z" fill="${c}"/>
    <path d="M22 12C22 12 16 14 12 12C16 10 22 12 22 12Z" fill="${c}"/>
    <path d="M12 22C12 22 10 16 12 12C14 16 12 22 12 22Z" fill="${c}"/>
    <path d="M2 12C2 12 8 10 12 12C8 14 2 12 2 12Z" fill="${c}"/>
    <circle cx="12" cy="12" r="2" fill="${c}" opacity="0.7"/>
  </svg>`,
  // Pinwheel
  (c) => `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 1C11 1 15 7 11 11C7 7 11 1 11 1Z" fill="${c}" opacity="0.9"/>
    <path d="M21 11C21 11 15 15 11 11C15 7 21 11 21 11Z" fill="${c}" opacity="0.7"/>
    <path d="M11 21C11 21 7 15 11 11C15 15 11 21 11 21Z" fill="${c}" opacity="0.9"/>
    <path d="M1 11C1 11 7 7 11 11C7 15 1 11 1 11Z" fill="${c}" opacity="0.7"/>
  </svg>`,
  // 6-point star
  (c) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5Z" fill="${c}"/>
  </svg>`,
  // Diamond sparkle
  (c) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 0L11 7L18 9L11 11L9 18L7 11L0 9L7 7Z" fill="${c}"/>
  </svg>`,
  // Tiny circle dot
  (c) => `<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="5" fill="${c}"/>
  </svg>`,
];

function createParticleBurst(container, buttonRect) {
  const particleCount = 10;
  const containerRect = container.getBoundingClientRect();
  const centerX = buttonRect.left - containerRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - containerRect.top;

  for (let i = 0; i < particleCount; i++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shapeFn = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const size = Math.random() * 14 + 14;

    const el = document.createElement('div');
    el.innerHTML = shapeFn(color);
    el.style.cssText = `
      position:absolute; left:${centerX}px; top:${centerY}px;
      width:${size}px; height:${size}px; pointer-events:none; z-index:100;
      filter:drop-shadow(0 0 4px ${color});
    `;
    el.firstElementChild.style.cssText = 'width:100%;height:100%;';
    container.appendChild(el);

    // Burst upward in a fan arc (-140° to -40° from horizontal)
    const angle = -Math.PI * 0.78 + (i / particleCount) * Math.PI * 0.56 + (Math.random() - 0.5) * 0.3;
    const dist = 60 + Math.random() * 60;

    gsap.fromTo(el,
      { scale: 0, rotation: Math.random() * 180 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        scale: 1,
        rotation: Math.random() * 360,
        duration: 0.5 + Math.random() * 0.3,
        ease: 'power2.out',
      }
    );
    gsap.to(el, {
      opacity: 0,
      delay: 0.35 + Math.random() * 0.2,
      duration: 0.4,
      ease: 'power1.in',
      onComplete: () => el.remove(),
    });
  }
}

export default function Button({ children, href, variant = 'primary', className = '', withBurst = false, ...props }) {
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  
  const handleMouseEnter = useCallback(() => {
    if (withBurst && buttonRef.current && containerRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      createParticleBurst(containerRef.current, buttonRect);
    }
  }, [withBurst]);

  const base =
    'inline-flex items-center gap-2.5 px-7 py-3.5 text-[0.95rem] font-semibold rounded-lg cursor-pointer float-1 will-change-transform transition-[box-shadow,opacity,background-color,border-color,color] duration-300 ease-out';

  const variants = {
    primary:
      'bg-accent text-primary shadow-[0_0_20px_var(--color-accent-dim)] hover:opacity-90 hover:shadow-[0_0_30px_var(--color-accent-glow)]',
    outline:
      'bg-transparent text-accent border-[1.5px] border-accent hover:bg-accent-dim',
  };

  const Tag = href ? 'a' : 'button';
  const linkProps = href ? { href, target: href.startsWith('http') ? '_blank' : undefined, rel: 'noopener' } : {};

  return (
    <div ref={containerRef} className="relative inline-block">
      <Tag 
        ref={buttonRef}
        className={`${base} ${variants[variant]} ${className}`} 
        onMouseEnter={handleMouseEnter}
        {...linkProps} 
        {...props}
      >
        {children}
      </Tag>
    </div>
  );
}
