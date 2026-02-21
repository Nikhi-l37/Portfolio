import { useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
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
        backdrop-blur-2xl transition-[background-color,box-shadow] duration-300
        ${scrolled ? 'bg-primary/92 shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : 'bg-primary/70'}`}
    >
      <div className="max-w-[1100px] w-full mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleClick(e, '#hero')}
           className="font-mono text-xl font-bold text-accent tracking-tight">
          &lt;NR /&gt;
        </a>

        {/* Right side: links + icons */}
        <div className="flex items-center gap-1">
          {/* Hamburger (mobile) */}
          <button onClick={toggleMenu} aria-label="Toggle navigation"
                  className="md:hidden w-9 h-9 relative z-[1001] bg-transparent border-none cursor-pointer">
            <span className={`block absolute left-1.5 w-6 h-0.5 bg-text rounded transition-[top,transform] duration-300
              ${menuOpen ? 'top-[17px] rotate-45' : 'top-[11px]'}`} />
            <span className={`block absolute left-1.5 w-6 h-0.5 bg-text rounded transition-[top,transform] duration-300
              ${menuOpen ? 'top-[17px] -rotate-45' : 'top-[21px]'}`} />
          </button>

          {/* Mobile backdrop overlay */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden"
              onClick={toggleMenu}
            />
          )}

          {/* Nav Links */}
          <ul className={`list-none flex items-center gap-1
            md:flex md:static md:w-auto md:max-w-none md:h-auto md:flex-row md:p-0 md:bg-transparent md:border-none md:shadow-none md:translate-x-0
            fixed top-0 right-0 w-[70%] max-w-[320px] h-screen bg-secondary flex-col items-start pt-24 px-8 gap-1 border-l border-border shadow-[-10px_0_40px_rgba(0,0,0,0.5)]
            z-[999] transition-transform duration-300 ease-out
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
            md:relative md:h-auto md:flex-row md:items-center md:pt-0 md:px-0 md:shadow-none md:border-none`}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => handleClick(e, href)}
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300
                    ${activeSection === href.slice(1) ? 'text-accent bg-accent-dim' : 'text-muted hover:text-accent hover:bg-accent-dim'}
                    md:text-[13px] md:px-3 md:py-2 w-full md:w-auto`}
                >
                  {label}
                </a>
              </li>
            ))}

            {/* Theme + GitHub — visible inside mobile menu */}
            <li className="md:hidden flex items-center gap-2 mt-6 pt-4 border-t border-border w-full">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-10 h-10 flex items-center justify-center text-muted hover:text-accent
                           hover:bg-accent-dim rounded-lg transition-colors duration-300 cursor-pointer"
              >
                <i className={`text-base ${theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}`} />
              </button>
              <a href="https://github.com/Nikhi-I37" target="_blank" rel="noopener"
                 className="w-10 h-10 flex items-center justify-center text-muted hover:text-accent hover:bg-accent-dim rounded-lg transition-colors">
                <i className="fa-brands fa-github text-base" />
              </a>
            </li>
          </ul>

          {/* Divider + Icon buttons — always visible on desktop */}
          <div className="hidden md:flex items-center gap-1 ml-3 pl-3 border-l border-border">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center text-muted hover:text-accent
                         hover:bg-accent-dim rounded-lg transition-colors duration-300 cursor-pointer"
            >
              <i className={`text-base ${theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}`} />
            </button>
            <a href="https://github.com/Nikhi-I37" target="_blank" rel="noopener"
               className="w-9 h-9 flex items-center justify-center text-muted hover:text-accent hover:bg-accent-dim rounded-lg transition-colors">
              <i className="fa-brands fa-github text-base" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
