import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// --- Global perf: limit ScrollTrigger callbacks & force GPU compositing ---
ScrollTrigger.config({ limitCallbacks: true });
gsap.defaults({ force3D: true });

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
      // --- Section headers — word-by-word slide-up with overflow mask ---
      const headers = sectionRef.current.querySelectorAll('h2');
      headers.forEach((h2) => {
        const split = SplitText.create(h2, { type: 'words', mask: 'overflow' });
        gsap.from(split.words, {
          y: '110%',
          opacity: 0,
          duration: 0.7,
          ease: 'back.out(1.4)',
          stagger: 0.06,
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

      // --- Text animation: words fade-up, important words fly in ---
      const splitBlocks = sectionRef.current.querySelectorAll('.gsap-split-text');

      // Directions important words can fly from (no filter:blur — too expensive)
      const flyDirections = [
        { x: -80, y: -30, rot: -8 },
        { x: 90, y: -25, rot: 7 },
        { x: 0, y: -50, rot: -4 },
        { x: -70, y: 25, rot: 10 },
        { x: 80, y: 20, rot: -8 },
      ];

      splitBlocks.forEach((el) => {
        // Add perspective for 3D char rotation
        el.style.perspective = '600px';

        const split = SplitText.create(el, { type: 'chars,words' });

        // Identify important words (inside styled spans/links/strongs)
        const importantWordEls = new Set();
        el.querySelectorAll('span[class*="font-medium"], span[class*="font-semibold"], a, strong').forEach((wrapper) => {
          split.words.forEach((wordEl) => {
            if (wrapper.contains(wordEl)) importantWordEls.add(wordEl);
          });
        });

        // Identify chars belonging to important words
        const importantChars = new Set();
        const regularChars = [];
        split.chars.forEach((charEl) => {
          let isImportant = false;
          importantWordEls.forEach((wordEl) => {
            if (wordEl.contains(charEl)) isImportant = true;
          });
          if (isImportant) importantChars.add(charEl);
          else regularChars.push(charEl);
        });

        // Regular chars: typewriter sweep (same as Hero name/greeting)
        if (regularChars.length) {
          gsap.from(regularChars, {
            y: '100%',
            opacity: 0,
            rotateY: -40,
            scaleX: 0.7,
            transformOrigin: '0% 50%',
            duration: 0.35,
            ease: 'power4.out',
            stagger: 0.01,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });
        }

        // Important word chars: fly in with scale + rotation (punchy entrance)
        let flyIdx = 0;
        importantWordEls.forEach((wordEl) => {
          const dir = flyDirections[flyIdx % flyDirections.length];
          flyIdx++;
          // Find all chars inside this word
          const wordChars = split.chars.filter((c) => wordEl.contains(c));
          if (wordChars.length) {
            // Find the index of the first char in this word within the full char array
            const firstCharIdx = split.chars.indexOf(wordChars[0]);
            const delay = firstCharIdx * 0.01; // sync timing with regular chars stagger

            gsap.from(wordChars, {
              x: dir.x,
              y: dir.y,
              rotation: dir.rot,
              scale: 0.4,
              opacity: 0,
              duration: 0.5,
              ease: 'back.out(1.6)',
              stagger: 0.02,
              delay,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            });
          }
        });
      });

      // --- Tags — drop/fall into place from above (single ST per group) ---
      const tags = sectionRef.current.querySelectorAll('.gsap-tag');
      if (tags.length) {
        const tagGroups = new Map();
        tags.forEach((tag) => {
          const parent = tag.parentElement;
          if (!tagGroups.has(parent)) tagGroups.set(parent, []);
          tagGroups.get(parent).push(tag);
        });

        tagGroups.forEach((groupTags) => {
          // One ScrollTrigger per group, not per tag
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: groupTags[0].parentElement,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          groupTags.forEach((tag, i) => {
            const dir = i % 2 === 0 ? -1 : 1;
            tl.fromTo(tag,
              {
                y: -40,
                opacity: 0,
                rotation: dir * (4 + Math.random() * 8),
                scale: 0.75,
              },
              {
                y: 0,
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.8)',
              },
              i * 0.08
            );
          });
        });
      }

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
