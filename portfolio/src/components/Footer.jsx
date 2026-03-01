import { useRef } from 'react';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';

const SOCIALS = [
  { icon: 'fa-brands fa-github', url: 'https://github.com/NikhilReddy3446', label: 'GitHub' },
  { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com/in/nikhilreddy3446', label: 'LinkedIn' },
  { icon: 'fa-solid fa-envelope', url: 'mailto:snikhilreddy097@gmail.com', label: 'Email' },
];

export default function Footer() {
  const footerRef = useRef(null);
  useGSAPScrollReveal(footerRef);

  return (
    <footer ref={footerRef} className="relative py-12 md:py-16 border-t border-border overflow-hidden">
      {/* Subtle gradient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-px bg-gradient-to-r from-transparent via-accent-alt/25 to-transparent" />

      <div className="max-w-[1100px] mx-auto px-6 flex flex-col items-center gap-6">
        {/* Logo */}
        <a href="#hero" className="gsap-card font-mono text-2xl font-bold bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity">
          &lt;NR /&gt;
        </a>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {SOCIALS.map(({ icon, url, label }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="gsap-card w-10 h-10 flex items-center justify-center rounded-full border border-border
                         text-muted text-sm transition-all duration-300
                         hover:border-accent/40 hover:text-accent hover:bg-accent-dim hover:scale-110"
            >
              <i className={icon} />
            </a>
          ))}
        </div>

        {/* Tagline */}
        <p className="gsap-text text-sm text-muted text-center max-w-md">
          Building things for the web with clean code and a passion for great user experiences.
        </p>

        {/* Credits + copyright */}
        <div className="flex flex-col items-center gap-1.5 pt-4 border-t border-border/50 w-full max-w-xs">
          <p className="text-xs text-dim">
            Designed & Built by <strong className="text-heading font-semibold">Sivada Nikhil Reddy</strong>
          </p>
          <p className="text-[11px] text-dim/60">&copy; {new Date().getFullYear()} &mdash; All rights reserved.</p>
        </div>

        {/* Back to top */}
        <a
          href="#hero"
          className="gsap-card group mt-2 flex items-center gap-2 text-xs text-dim hover:text-accent transition-colors"
        >
          <i className="fa-solid fa-arrow-up text-[10px] transition-transform duration-300 group-hover:-translate-y-0.5" />
          Back to top
        </a>
      </div>
    </footer>
  );
}
