import confetti from 'canvas-confetti';

// Brand colours — emerald green + white, with a touch of cyan
const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#ffffff', '#a7f3d0', '#00d4ff'];

/**
 * Fire two angled "cannon" bursts from the bottom-left and bottom-right
 * corners toward the centre. Uses circles and squares.
 */
export function fireCornersConfetti() {
  const defaults = {
    particleCount: 60,
    spread: 60,
    startVelocity: 45,
    ticks: 120,
    gravity: 0.9,
    colors: COLORS,
    shapes: ['circle', 'square'],
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  // Bottom-left → upper-right
  confetti({ ...defaults, angle: 60, origin: { x: 0.05, y: 1 } });
  // Bottom-right → upper-left
  confetti({ ...defaults, angle: 120, origin: { x: 0.95, y: 1 } });
}

/**
 * Fire a centred burst from ~60% down the viewport (feels like "from the button").
 */
export function fireCenterConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 40,
    ticks: 100,
    gravity: 0.85,
    colors: COLORS,
    shapes: ['circle', 'square'],
    origin: { x: 0.5, y: 0.6 },
    zIndex: 9999,
    disableForReducedMotion: true,
  });
}

/**
 * Fire small celebratory bursts from the left and right edges of a DOM element.
 * Designed for the profile photo — compact particles that fan out sideways.
 * @param {HTMLElement} el — the element to anchor the bursts to
 */
export function fireProfileConfetti(el) {
  if (!el) return;

  // Find the actual photo circle inside the wrapper
  const photo = el.querySelector('.photo-card') || el;
  const rect = photo.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Anchor to the true left/right edges and vertical center of the photo
  const cy = (rect.top + rect.height / 2) / vh;
  const leftX = rect.left / vw;
  const rightX = rect.right / vw;

  const base = {
    particleCount: 30,
    spread: 55,
    startVelocity: 26,
    ticks: 80,
    gravity: 1,
    scalar: 0.75,
    colors: COLORS,
    shapes: ['circle', 'square'],
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  // Left edge — shoots outward-left
  confetti({ ...base, angle: 150, origin: { x: leftX, y: cy } });
  // Right edge — shoots outward-right
  confetti({ ...base, angle: 30, origin: { x: rightX, y: cy } });

  // Delayed secondary sparkle
  setTimeout(() => {
    confetti({ ...base, particleCount: 15, spread: 40, startVelocity: 18, angle: 160, origin: { x: leftX, y: cy } });
    confetti({ ...base, particleCount: 15, spread: 40, startVelocity: 18, angle: 20, origin: { x: rightX, y: cy } });
  }, 200);
}
