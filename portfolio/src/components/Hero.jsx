import { useTypewriter } from '../hooks/useTypewriter';
import RevealWrapper from './RevealWrapper';
import Button from './Button';

export default function Hero() {
  const typedName = useTypewriter('Sivada Nikhil Reddy.', {
    typingSpeed: 70,
    deletingSpeed: 40,
    pauseAfter: 2000,
    pauseBefore: 600,
  });

  return (
    <section id="hero" className="relative min-h-[calc(100vh-70px)] md:min-h-screen flex items-center pt-[80px] md:pt-[120px] pb-10 md:pb-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full top-[-100px] md:top-[-200px] right-[-80px] md:right-[-150px] pointer-events-none opacity-20 md:opacity-30 animate-[float_8s_ease-in-out_infinite]"
           style={{ background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 w-full">
        <RevealWrapper>
          <p className="font-mono text-base text-accent mb-5 tracking-wider">Hi, my name is</p>
        </RevealWrapper>

        <RevealWrapper delay={150}>
          <h1 className="text-[clamp(2rem,6vw,5rem)] font-black text-heading leading-[1.1] mb-4 tracking-tighter relative">
            <span className="inline relative">
              {/* Reserve space — wraps naturally on mobile so height is correct */}
              <span className="invisible font-inherit pointer-events-none" aria-hidden="true">
                Sivada Nikhil Reddy.
              </span>
              {/* Typed text */}
              <span className="absolute left-0 top-0 bg-gradient-to-br from-accent to-accent-alt bg-clip-text text-transparent">
                {typedName}
              </span>
              {/* Blinking cursor */}
              <span className="inline-block w-[3px] h-[0.85em] ml-0.5 bg-accent rounded-sm align-baseline relative top-[0.08em] animate-[blink-caret_0.75s_step-end_infinite]" />
            </span>
          </h1>
        </RevealWrapper>

        <RevealWrapper delay={300}>
          <h2 className="text-[clamp(1.1rem,3vw,2.2rem)] font-semibold text-dim mb-5 md:mb-6 tracking-tight">
            I build scalable backend systems and modern web applications.
          </h2>
        </RevealWrapper>

        <RevealWrapper delay={450}>
          <p className="text-[0.95rem] md:text-[1.05rem] text-muted max-w-[540px] mb-5 md:mb-10 leading-relaxed">
            Full-Stack Developer focused on building{' '}
            <strong className="text-heading font-semibold">scalable backend systems</strong> and{' '}
            <strong className="text-heading font-semibold">clean, responsive web applications</strong>.
          </p>
          <p className="text-[0.95rem] md:text-[1.05rem] text-muted max-w-[540px] mb-5 md:mb-10 leading-relaxed">
            Strong in backend development with hands-on experience in{' '}
            <strong className="text-heading font-semibold">APIs</strong>,{' '}
            <strong className="text-heading font-semibold">databases</strong>, and{' '}
            <strong className="text-heading font-semibold">server-side logic</strong>.
            I also create modern, beautiful user interfaces using AI-assisted tools.
          </p>
        </RevealWrapper>

        <RevealWrapper delay={600}>
          <div className="flex gap-4 flex-wrap">
            <Button href="#projects">
              <span>View My Work</span>
              <i className="fa-solid fa-arrow-down" />
            </Button>
            <Button href="#contact" variant="outline">
              <span>Get In Touch</span>
              <i className="fa-solid fa-arrow-right" />
            </Button>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}
