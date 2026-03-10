import { useRef, useEffect, useCallback} from 'react';

/**
 * BouncingLettersBackground - Canvas physics animation
 * Displays "NIKHIL" letters that:
 * - Start as floating letters
 * - After 3 seconds, blast animation disperses them
 * - Letters move with physics, bounce off walls
 * - Collision detection with sparks
 */
export default function BouncingLettersBackground({ isLight }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = window.innerWidth;
    let height = window.innerHeight;

    // High DPI support
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Colors - cyan/teal + pink palette
    const letterColor = isLight ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.18)';
    const letterColorBright = isLight ? 'rgba(6, 182, 212, 0.28)' : 'rgba(6, 182, 212, 0.4)';
    const sparkColors = isLight 
      ? ['#06b6d4', '#22d3ee', '#ec4899', '#f43f5e', '#fbbf24']
      : ['#22d3ee', '#67e8f9', '#ec4899', '#fb7185', '#fcd34d'];

    // Letters configuration
    const LETTERS = 'NIKHIL'.split('');
    const letters = [];
    const sparks = [];
    let blastTriggered = false;
    let blastTime = 0;

    // Initialize letters
    const initLetters = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const spread = Math.min(width, height) * 0.35;

      LETTERS.forEach((char, i) => {
        const angle = (i / LETTERS.length) * Math.PI * 2 - Math.PI / 2;
        const radius = spread * 0.4;
        letters.push({
          char,
          x: centerX + Math.cos(angle) * radius * (0.3 + Math.random() * 0.4),
          y: centerY + Math.sin(angle) * radius * (0.3 + Math.random() * 0.4),
          vx: 0,
          vy: 0,
          size: Math.min(width, height) * (0.08 + Math.random() * 0.04),
          rotation: (Math.random() - 0.5) * 0.3,
          rotationSpeed: 0,
          opacity: 0,
          targetOpacity: 1,
          // Pre-blast floating animation
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: 0.5 + Math.random() * 0.5,
          floatRadius: 5 + Math.random() * 10,
          baseX: 0,
          baseY: 0,
        });
      });

      // Store base positions for floating
      letters.forEach((l) => {
        l.baseX = l.x;
        l.baseY = l.y;
      });
    };

    initLetters();

    // Trigger blast after 3 seconds
    const blastTimer = setTimeout(() => {
      blastTriggered = true;
      blastTime = performance.now();

      // Apply blast velocity to each letter
      const centerX = width / 2;
      const centerY = height / 2;

      letters.forEach((letter) => {
        const dx = letter.x - centerX;
        const dy = letter.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 8 + Math.random() * 6;
        letter.vx = (dx / dist) * force + (Math.random() - 0.5) * 4;
        letter.vy = (dy / dist) * force + (Math.random() - 0.5) * 4;
        letter.rotationSpeed = (Math.random() - 0.5) * 0.15;
      });

      // Create initial blast sparks (reduced for performance)
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 10;
        sparks.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.025 + Math.random() * 0.02,
          size: 2 + Math.random() * 3,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        });
      }
    }, 3000);

    // Create collision sparks (optimized - limit max sparks)
    const MAX_SPARKS = 50;
    const createCollisionSparks = (x, y, intensity = 1) => {
      if (sparks.length > MAX_SPARKS) return; // Limit sparks for performance
      const count = Math.floor(2 + Math.random() * 3 * intensity);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3 * intensity;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.04 + Math.random() * 0.03,
          size: 1 + Math.random() * 2,
          color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        });
      }
    };

    // Check collision between two letters
    const checkCollision = (a, b) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = (a.size + b.size) * 0.35;

      if (dist < minDist && dist > 0) {
        // Collision detected - create sparks
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const intensity = Math.abs(a.vx - b.vx) + Math.abs(a.vy - b.vy);
        createCollisionSparks(midX, midY, Math.min(intensity * 0.3, 2));

        // Calculate collision response
        const nx = dx / dist;
        const ny = dy / dist;

        // Relative velocity
        const dvx = a.vx - b.vx;
        const dvy = a.vy - b.vy;
        const dvn = dvx * nx + dvy * ny;

        // Only resolve if moving toward each other
        if (dvn > 0) {
          const restitution = 0.85;
          const impulse = dvn * restitution;

          a.vx -= impulse * nx;
          a.vy -= impulse * ny;
          b.vx += impulse * nx;
          b.vy += impulse * ny;

          // Add spin on collision
          a.rotationSpeed += (Math.random() - 0.5) * 0.05;
          b.rotationSpeed += (Math.random() - 0.5) * 0.05;

          // Separate overlapping letters
          const overlap = minDist - dist;
          const separationX = (overlap / 2) * nx;
          const separationY = (overlap / 2) * ny;
          a.x -= separationX;
          a.y -= separationY;
          b.x += separationX;
          b.y += separationY;
        }
      }
    };

    // Animation frame counter for throttling
    let frameCount = 0;
    const PHYSICS_SKIP = 1; // Run physics every frame for smoothness

    // Main animation loop
    const animate = () => {
      frameCount++;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      if (isLight) {
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.5, '#f0f9ff');
        bgGrad.addColorStop(1, '#fdf2f8');
      } else {
        bgGrad.addColorStop(0, '#030712');
        bgGrad.addColorStop(0.5, '#0c1222');
        bgGrad.addColorStop(1, '#0a0f1e');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle radial glow
      const glowGrad = ctx.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, width * 0.5);
      if (isLight) {
        glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
        glowGrad.addColorStop(1, 'transparent');
      } else {
        glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
        glowGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw letters
      const now = performance.now();

      letters.forEach((letter, i) => {
        // Fade in letters
        letter.opacity += (letter.targetOpacity - letter.opacity) * 0.05;

        if (!blastTriggered) {
          // Pre-blast: gentle floating animation
          letter.floatPhase += letter.floatSpeed * 0.02;
          letter.x = letter.baseX + Math.sin(letter.floatPhase) * letter.floatRadius;
          letter.y = letter.baseY + Math.cos(letter.floatPhase * 0.7) * letter.floatRadius * 0.6;
        } else {
          // Post-blast: physics simulation
          if (frameCount % PHYSICS_SKIP === 0) {
            // Apply friction
            letter.vx *= 0.995;
            letter.vy *= 0.995;

            // Apply slight gravity toward center (keeps letters in view)
            const centerX = width / 2;
            const centerY = height / 2;
            const dx = centerX - letter.x;
            const dy = centerY - letter.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > width * 0.3) {
              letter.vx += (dx / dist) * 0.02;
              letter.vy += (dy / dist) * 0.02;
            }

            // Mouse repulsion
            const mdx = letter.x - mouseRef.current.x;
            const mdy = letter.y - mouseRef.current.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < 150 && mDist > 0) {
              const force = (150 - mDist) / 150 * 2;
              letter.vx += (mdx / mDist) * force;
              letter.vy += (mdy / mDist) * force;
            }

            // Update position
            letter.x += letter.vx;
            letter.y += letter.vy;

            // Update rotation
            letter.rotation += letter.rotationSpeed;
            letter.rotationSpeed *= 0.98;

            // Bounce off walls
            const padding = letter.size * 0.4;
            if (letter.x < padding) {
              letter.x = padding;
              letter.vx = Math.abs(letter.vx) * 0.8;
              createCollisionSparks(letter.x, letter.y, 0.5);
            }
            if (letter.x > width - padding) {
              letter.x = width - padding;
              letter.vx = -Math.abs(letter.vx) * 0.8;
              createCollisionSparks(letter.x, letter.y, 0.5);
            }
            if (letter.y < padding) {
              letter.y = padding;
              letter.vy = Math.abs(letter.vy) * 0.8;
              createCollisionSparks(letter.x, letter.y, 0.5);
            }
            if (letter.y > height - padding) {
              letter.y = height - padding;
              letter.vy = -Math.abs(letter.vy) * 0.8;
              createCollisionSparks(letter.x, letter.y, 0.5);
            }
          }

          // Check collisions with other letters
          for (let j = i + 1; j < letters.length; j++) {
            checkCollision(letter, letters[j]);
          }
        }

        // Draw letter with glow (optimized - reduced shadow blur)
        ctx.save();
        ctx.translate(letter.x, letter.y);
        ctx.rotate(letter.rotation);
        ctx.globalAlpha = letter.opacity;

        // Simplified glow effect (expensive shadow only on fast movement)
        const speed = Math.sqrt(letter.vx * letter.vx + letter.vy * letter.vy);
        if (speed > 1) {
          ctx.shadowColor = isLight ? 'rgba(6, 182, 212, 0.35)' : 'rgba(6, 182, 212, 0.55)';
          ctx.shadowBlur = Math.min(15, 8 + speed * 2);
        }

        ctx.font = `bold ${letter.size}px 'Inter', system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = speed > 2 ? letterColorBright : letterColor;
        ctx.fillText(letter.char, 0, 0);

        ctx.restore();
      });

      // Update and draw sparks (optimized)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.96;
        spark.vy *= 0.96;
        spark.life -= spark.decay;

        if (spark.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        // Simplified spark drawing (no shadow blur for performance)
        ctx.save();
        ctx.globalAlpha = spark.life * 0.9;
        ctx.fillStyle = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw blast shockwave
      if (blastTriggered) {
        const elapsed = now - blastTime;
        if (elapsed < 600) {
          const progress = elapsed / 600;
          const radius = progress * Math.min(width, height) * 0.6;
          ctx.save();
          ctx.globalAlpha = (1 - progress) * 0.3;
          ctx.strokeStyle = isLight ? 'rgba(6, 182, 212, 0.5)' : 'rgba(6, 182, 212, 0.6)';
          ctx.lineWidth = 3 - progress * 2;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    // Pause animation when tab is not visible (performance optimization)
    let isPageVisible = true;
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible && !animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      clearTimeout(blastTimer);
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLight, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
