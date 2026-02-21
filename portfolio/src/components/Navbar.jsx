import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-70px 0px -40% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    document.body.style.overflow = '';
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setMenuOpen((v) => {
      document.body.style.overflow = !v ? 'hidden' : '';
      return !v;
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[1000] h-[70px] flex items-center border-b border-border
        backdrop-blur-2xl transition-all duration-300
        ${scrolled ? 'bg-primary/92 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : 'bg-primary/70'}`}
    >
      <div className="max-w-[1100px] w-full mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleClick(e, '#hero')}
           className="font-mono text-xl font-bold text-accent tracking-tight">
          &lt;NR /&gt;
        </a>

        {/* Hamburger */}
        <button onClick={toggleMenu} aria-label="Toggle navigation"
                className="md:hidden w-9 h-9 relative z-[1001] bg-transparent border-none cursor-pointer">
          <span className={`block absolute left-1.5 w-6 h-0.5 bg-text rounded transition-all duration-300
            ${menuOpen ? 'top-[17px] rotate-45' : 'top-[11px]'}`} />
          <span className={`block absolute left-1.5 w-6 h-0.5 bg-text rounded transition-all duration-300
            ${menuOpen ? 'top-[17px] -rotate-45' : 'top-[21px]'}`} />
        </button>

        {/* Menu */}
        <ul className={`list-none flex items-center gap-2
          md:flex md:static md:w-auto md:h-auto md:flex-row md:p-0 md:bg-transparent md:border-none md:shadow-none
          ${menuOpen
            ? 'fixed top-0 right-0 w-[70%] max-w-[320px] h-screen bg-secondary flex-col items-start pt-24 px-8 gap-1 border-l border-border shadow-[-10px_0_40px_rgba(0,0,0,0.5)]'
            : 'fixed top-0 -right-full w-[70%] max-w-[320px] h-screen bg-secondary flex-col items-start pt-24 px-8 gap-1 border-l border-border md:relative md:right-0 md:h-auto md:flex-row md:items-center md:pt-0 md:px-0'
          }
          transition-[right] duration-400 ease-out`}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleClick(e, href)}
                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300
                  ${activeSection === href.slice(1) ? 'text-accent bg-accent-dim' : 'text-muted hover:text-accent hover:bg-accent-dim'}
                  md:text-sm md:px-4 md:py-2 w-full md:w-auto`}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="https://github.com/Nikhi-I37" target="_blank" rel="noopener"
               className="block px-4 py-2 text-lg text-muted hover:text-accent hover:bg-accent-dim rounded-lg transition-colors">
              <i className="fa-brands fa-github" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
