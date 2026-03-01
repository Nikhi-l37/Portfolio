import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Hook: attach GSAP ScrollTrigger-based reveal animations to a section.
 * Call once per section with a ref to the section element.
 *
 * Animates:
 * - Section headings (SplitText word reveal)
 * - Cards / bento items (staggered rise)
 * - Paragraphs (fade in + slight rise)
 * - Timeline items (slide in from alternating sides)
 */
export function useGSAPScrollReveal(sectionRef) {
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // --- Section headers — word-by-word reveal ---
      const headers = sectionRef.current.querySelectorAll('h2');
      headers.forEach((h2) => {
        const split = SplitText.create(h2, { type: 'words, chars', mask: 'overflow' });
        gsap.from(split.words, {
          y: '100%',
          opacity: 0,
          rotateX: -60,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: h2,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // --- Cards — staggered rise ---
      const cards = sectionRef.current.querySelectorAll('.gsap-card');
      if (cards.length) {
        gsap.from(cards, {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // --- Paragraphs & text blocks ---
      const textBlocks = sectionRef.current.querySelectorAll('.gsap-text');
      textBlocks.forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });

      // --- Skill items — staggered pop ---
      const skillItems = sectionRef.current.querySelectorAll('.gsap-skill');
      if (skillItems.length) {
        gsap.from(skillItems, {
          y: 60,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.08,
          scrollTrigger: {
            trigger: skillItems[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }

      // --- Timeline items — slide from alternating sides ---
      const timelineItems = sectionRef.current.querySelectorAll('.gsap-timeline-item');
      timelineItems.forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        gsap.from(item, {
          x: fromLeft ? -80 : 80,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // --- Form fields — stagger in ---
      const formFields = sectionRef.current.querySelectorAll('.gsap-form-field');
      if (formFields.length) {
        gsap.from(formFields, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: formFields[0],
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      // --- Contact info items ---
      const contactItems = sectionRef.current.querySelectorAll('.gsap-contact-item');
      if (contactItems.length) {
        gsap.from(contactItems, {
          x: 60,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: contactItems[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}

/**
 * Magnetic effect for buttons/elements.
 * Attach to any element — it will pull toward cursor on hover.
 */
export function useMagnetic(ref, strength = 0.3) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, strength]);
}
