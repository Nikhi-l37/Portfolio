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
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.292-.906h3.549l.065-.252c.049-.19.072-.386.072-.584 0-.188-.019-.377-.057-.564H14.27a3.584 3.584 0 0 1 .287-.886c.245-.5.593-.94 1.013-1.296l.11-.091a3.79 3.79 0 0 1 2.445-.894 3.891 3.891 0 0 1 2.076.562c.344.21.644.481.886.8l.001.003.002.001 1.481-1.348a5.878 5.878 0 0 0-4.444-2.017c-.44.001-.881.056-1.312.164a5.773 5.773 0 0 0-2.7 1.527 5.532 5.532 0 0 0-1.16 1.712l-.03.063-.03-.063a5.532 5.532 0 0 0-1.16-1.712 5.773 5.773 0 0 0-2.7-1.527A5.95 5.95 0 0 0 7.923 7.89a5.878 5.878 0 0 0-4.444 2.017L4.96 11.255l.002-.001c.242-.319.542-.59.886-.8a3.891 3.891 0 0 1 2.076-.562 3.79 3.79 0 0 1 2.555.985c.42.356.768.796 1.013 1.296a3.584 3.584 0 0 1 .288.886H5.645a4.88 4.88 0 0 0-.058.564c0 .198.024.394.073.584l.064.252h3.549a3.571 3.571 0 0 1-.293.906 3.79 3.79 0 0 1-2.135 2.078 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 3.263 3.263 0 0 1-.565-.745l-2.06.94A5.501 5.501 0 0 0 2.525 19.5a5.58 5.58 0 0 0 1.69 1.106 6.592 6.592 0 0 0 4.505.106 5.813 5.813 0 0 0 2.174-1.263A5.424 5.424 0 0 0 12 18.08a5.424 5.424 0 0 0 1.106 1.37 5.813 5.813 0 0 0 2.174 1.262 6.592 6.592 0 0 0 4.505-.106 5.58 5.58 0 0 0 1.69-1.106 5.501 5.501 0 0 0 2.525-2.245z" />
      </svg>
    ),
    url: 'https://www.geeksforgeeks.org/profile/snikhilre097c',
    label: 'GeeksforGeeks',
  },
  {
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 .406.976l4.276 4.194c.652.64.972 1.469.948 2.263a2.68 2.68 0 0 1-.066.523c-.128.465-.337.89-.619 1.164l-4.14 4.43c-1.058 1.134-3.204 1.27-4.43.278l-3.501-2.831a1.381 1.381 0 0 0-1.94.207c-.48.593-.387 1.46.207 1.943l3.5 2.831c.8.647 1.766 1.045 2.774 1.202l-2.015 2.158A1.384 1.384 0 0 0 10.517 24a1.374 1.374 0 0 0 .961-.438l5.406-5.788 3.854-4.126a5.266 5.266 0 0 0 1.209-2.104c.06-.189.1-.382.125-.513a5.527 5.527 0 0 0-.062-2.362 5.83 5.83 0 0 0-.349-1.017 5.938 5.938 0 0 0-1.271-1.818l-4.277-4.193-.039-.038c-2.248-2.165-5.852-2.133-8.063.074l-2.396 2.392a1.384 1.384 0 0 0 .003 1.955 1.378 1.378 0 0 0 1.951.003l2.396-2.392a3.021 3.021 0 0 1 4.205-.038l.02.019 4.276 4.193c.652.64.972 1.469.948 2.263a2.68 2.68 0 0 1-.066.523 2.545 2.545 0 0 1-.619 1.164l-2.057 2.203H10.617z" />
      </svg>
    ),
    url: 'https://leetcode.com/u/NikhilReddy3446/',
    label: 'LeetCode',
  },
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
                {SOCIALS.map(({ icon, svg, url, label }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                     className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-full
                                text-muted text-lg float-2 will-change-transform
                                transition-[box-shadow,background-color,border-color,color] duration-300 ease-out
                                hover:bg-accent hover:border-accent hover:text-primary
                                hover:shadow-[0_8px_25px_var(--color-accent-dim)]">
                    {svg || <i className={icon} />}
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
