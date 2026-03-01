import { useState, useRef } from 'react';
import SectionHeader from './SectionHeader';
import TypewriterInput from './TypewriterInput';
import { useGSAPScrollReveal } from '../hooks/useGSAPAnimations';

const NAME_PHRASES = ['Enter your name...', 'How should I call you?'];
const EMAIL_PHRASES = ['you@example.com', 'What is your best email?'];
const MESSAGE_PHRASES = ["What's on your mind?", "Let's talk about a project!", 'I have a question about Vedic Vox...'];

const SOCIALS = [
  { icon: 'fa-brands fa-github', url: 'https://github.com/Nikhi-137', label: 'GitHub' },
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
    <section id="contact" ref={sectionRef} className="relative py-16 md:py-24">
      {/* Subtle section tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-500/[0.012] to-transparent pointer-events-none" />
      <div className="max-w-[1100px] mx-auto px-6">
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
