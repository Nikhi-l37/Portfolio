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
