import { useState } from 'react';
import RevealWrapper from './RevealWrapper';
import SectionHeader from './SectionHeader';

const SOCIALS = [
  { icon: 'fa-brands fa-github', url: 'https://github.com/Nikhi-I37', label: 'GitHub' },
  { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com/in/sivada-nikhil-reddy-409706292', label: 'LinkedIn' },
  { icon: 'fa-solid fa-code', url: 'https://www.geeksforgeeks.org/profile/snikhilre097c', label: 'GeeksforGeeks' },
  { icon: 'fa-solid fa-laptop-code', url: 'https://leetcode.com/u/NikhilReddy3446/', label: 'LeetCode' },
];

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

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
    idle: 'bg-accent text-primary shadow-[0_0_20px_var(--color-accent-dim)] hover:bg-white hover:text-primary hover:shadow-[0_0_30px_rgba(0,212,255,0.35)] hover:-translate-y-0.5',
    sending: 'bg-accent/70 text-primary pointer-events-none',
    sent: 'bg-emerald-500 text-white pointer-events-none',
    error: 'bg-red-500 text-white pointer-events-none',
  };

  return (
    <section id="contact" className="py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <RevealWrapper>
          <SectionHeader number="05" title="Get In Touch" />
        </RevealWrapper>

        <RevealWrapper>
          <p className="text-[1.05rem] text-muted max-w-[600px] mb-12">
            I'm currently looking for new opportunities! Whether you have a question, a project idea,
            or just want to say hi — my inbox is always open.
          </p>
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <RevealWrapper>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="hidden" name="access_key" value="1cd41c31-68bf-4e0a-b432-2de3138020f7" />
              <input type="hidden" name="subject" value="New message from Portfolio" />
              <input type="checkbox" name="botcheck" className="hidden" />
              {[
                { label: 'Name', type: 'text', id: 'name', placeholder: 'Your Name' },
                { label: 'Email', type: 'email', id: 'email', placeholder: 'you@example.com' },
              ].map(({ label, type, id, placeholder }) => (
                <div key={id} className="flex flex-col gap-1.5">
                  <label htmlFor={id} className="text-xs font-semibold text-dim uppercase tracking-wider">
                    {label}
                  </label>
                  <input
                    type={type} id={id} name={id} placeholder={placeholder} required
                    className="font-sans text-[0.95rem] px-4 py-3.5 bg-surface text-text border-[1.5px] border-border rounded-lg
                               outline-none transition-all duration-300
                               focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)]
                               placeholder:text-dim"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-dim uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="message" name="message" rows={5} placeholder="What's on your mind?" required
                  className="font-sans text-[0.95rem] px-4 py-3.5 bg-surface text-text border-[1.5px] border-border rounded-lg
                             outline-none resize-y transition-all duration-300
                             focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)]
                             placeholder:text-dim"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`inline-flex items-center justify-center gap-2.5 w-full px-7 py-3.5 text-[0.95rem] font-semibold rounded-lg
                  cursor-pointer transition-all duration-300 ease-out border-none
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
          </RevealWrapper>

          {/* Contact Info */}
          <RevealWrapper delay={150}>
            <div className="flex flex-col gap-5">
              {[
                { icon: 'fa-solid fa-envelope', label: 'Email', value: 's.nikhilreddy3446@gmail.com', href: 'mailto:s.nikhilreddy3446@gmail.com' },
                { icon: 'fa-solid fa-phone', label: 'Phone', value: '+91 8008043446', href: 'tel:+918008043446' },
                { icon: 'fa-solid fa-location-dot', label: 'Location', value: 'India' },
              ].map(({ icon, label, value, href }) => (
                <div key={label}
                  className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg transition-all duration-300 ease-out hover:border-border-hover hover:translate-x-1">
                  <div className="w-11 h-11 rounded-full bg-accent-dim flex items-center justify-center text-xl text-accent shrink-0">
                    <i className={icon} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-dim uppercase tracking-wider mb-0.5">{label}</h4>
                    {href ? (
                      <a href={href} className="text-[0.92rem] text-muted hover:text-accent transition-colors">{value}</a>
                    ) : (
                      <p className="text-[0.92rem] text-muted">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social Icons */}
              <div className="flex gap-3.5 mt-3">
                {SOCIALS.map(({ icon, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener" aria-label={label}
                     className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full
                                text-muted text-lg transition-all duration-300 ease-out
                                hover:bg-accent hover:border-accent hover:text-primary hover:-translate-y-1
                                hover:shadow-[0_8px_25px_var(--color-accent-dim)]">
                    <i className={icon} />
                  </a>
                ))}
              </div>
            </div>
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
