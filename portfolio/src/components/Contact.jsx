import { useState } from 'react';
import RevealWrapper from './RevealWrapper';
import SectionHeader from './SectionHeader';
import TypewriterInput from './TypewriterInput';

const NAME_PHRASES = ['Enter your name...', 'How should I call you?'];
const EMAIL_PHRASES = ['you@example.com', 'What is your best email?'];
const MESSAGE_PHRASES = ["What's on your mind?", "Let's talk about a project!", 'I have a question about Vedic Vox...'];

const SOCIALS = [
  { icon: 'fa-brands fa-github', url: 'https://github.com/Nikhi-137', label: 'GitHub' },
  { icon: 'fa-brands fa-linkedin-in', url: 'https://linkedin.com/in/sivada-nikhil-reddy-409706292', label: 'LinkedIn' },
  { icon: 'fa-solid fa-code', url: 'https://www.geeksforgeeks.org/profile/snikhilre097c', label: 'GeeksforGeeks' },
  { icon: 'fa-solid fa-laptop-code', url: 'https://leetcode.com/u/NikhilReddy3446/', label: 'LeetCode' },
];

export default function Contact() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [formKey, setFormKey] = useState(0);

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
    <section id="contact" className="py-16 md:py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <RevealWrapper>
          <SectionHeader number="05" title="Get In Touch" />
        </RevealWrapper>

        <RevealWrapper>
          <p className="text-[0.95rem] md:text-[1.05rem] text-muted max-w-[600px] mb-8 md:mb-12">
            I'm currently looking for new opportunities! Whether you have a question, a project idea,
            or just want to say hi — my inbox is always open.
          </p>
        </RevealWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <RevealWrapper>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY} />
              <input type="hidden" name="subject" value="New message from Portfolio" />
              <input type="checkbox" name="botcheck" className="hidden" />
              <div className="flex flex-col gap-1.5">
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
              <div className="flex flex-col gap-1.5">
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
              <div className="flex flex-col gap-1.5">
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
                className={`inline-flex items-center justify-center gap-2.5 w-full px-7 py-3.5 text-[0.95rem] font-semibold rounded-lg
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
                  className="flex items-center gap-4 p-5 bg-card border border-border rounded-lg float-3 transition-[border-color,box-shadow] duration-300 ease-out hover:border-border-hover">
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
                {SOCIALS.map(({ icon, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full
                                text-muted text-lg float-2 will-change-transform
                                transition-[box-shadow,background-color,border-color,color] duration-300 ease-out
                                hover:bg-accent hover:border-accent hover:text-primary
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
