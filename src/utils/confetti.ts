// Lightweight, zero-dependency Canvas confetti engine tailored to Agri-Next Vietnam's brand palette.
// Features classic ribbons, diamond brocade shapes, and tiny leaf petals with reduced-motion compliance.

const AGRI_CONFETTI_COLORS = [
  '#F4991A', // Harvest Amber
  '#8FA31E', // Meadow Moss
  '#C6D870', // Sprout Lime
  '#556B2F', // Deep Olive
  '#FFB84D', // Warm Marigold
  '#EFF5D2', // Cream Parchment
];

type ConfettiShape = 'rect' | 'diamond' | 'leaf';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  opacity: number;
  decay: number;
}

let activeCanvas: HTMLCanvasElement | null = null;
let activeParticles: Particle[] = [];
let rafId: number | null = null;

function ensureCanvas(): HTMLCanvasElement | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;

  if (!activeCanvas) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '60';
    document.body.appendChild(canvas);
    activeCanvas = canvas;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  activeCanvas.width = Math.floor(window.innerWidth * dpr);
  activeCanvas.height = Math.floor(window.innerHeight * dpr);
  const ctx = activeCanvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  return activeCanvas;
}

function createBurstParticles(
  originX: number,
  originY: number,
  count: number,
  spreadRad: number,
  baseAngleRad: number,
  speedMin: number,
  speedMax: number
): Particle[] {
  const shapes: ConfettiShape[] = ['rect', 'rect', 'diamond', 'leaf'];
  const list: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = baseAngleRad + (Math.random() - 0.5) * spreadRad;
    const speed = speedMin + Math.random() * (speedMax - speedMin);
    list.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      color: AGRI_CONFETTI_COLORS[Math.floor(Math.random() * AGRI_CONFETTI_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.22,
      tiltAngle: Math.random() * Math.PI * 2,
      tiltSpeed: 0.06 + Math.random() * 0.08,
      opacity: 1,
      decay: 0.0055 + Math.random() * 0.005,
    });
  }
  return list;
}

function animateConfetti() {
  if (!activeCanvas) return;
  const ctx = activeCanvas.getContext('2d');
  if (!ctx) return;

  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  const next: Particle[] = [];
  for (const p of activeParticles) {
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.28; // gentle gravity
    p.tiltAngle += p.tiltSpeed;
    p.x += p.vx + Math.sin(p.tiltAngle) * 0.65;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    if (p.y > h * 0.65) {
      p.opacity -= p.decay * 1.8;
    } else {
      p.opacity -= p.decay * 0.45;
    }

    if (p.opacity > 0.02 && p.y < h + 40) {
      next.push(p);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      const scaleY = Math.cos(p.tiltAngle);
      ctx.scale(1, Math.abs(scaleY) < 0.2 ? 0.2 : scaleY);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
      } else if (p.shape === 'diamond') {
        const r = p.size * 0.58;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Organic leaf petal matching Agri-Next identity
        const r = p.size * 0.65;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(r * 0.9, 0, 0, r);
        ctx.quadraticCurveTo(-r * 0.9, 0, 0, -r);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  activeParticles = next;

  if (activeParticles.length > 0) {
    rafId = window.requestAnimationFrame(animateConfetti);
  } else {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (activeCanvas && activeCanvas.parentNode) {
      activeCanvas.parentNode.removeChild(activeCanvas);
    }
    activeCanvas = null;
  }
}

export function launchConfetti(intensity: 'game' | 'badge' | 'master' = 'game') {
  const canvas = ensureCanvas();
  if (!canvas) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  const count = intensity === 'master' ? 75 : intensity === 'badge' ? 52 : 38;

  // Dual side celebratory cannons
  activeParticles.push(
    ...createBurstParticles(w * 0.14, h * 0.72, count, 0.95, -Math.PI / 3, 9, 17),
    ...createBurstParticles(w * 0.86, h * 0.72, count, 0.95, -Math.PI * (2 / 3), 9, 17)
  );

  // Extra center-top crown burst for new badge or master achievement
  if (intensity === 'badge' || intensity === 'master') {
    window.setTimeout(() => {
      if (!ensureCanvas()) return;
      activeParticles.push(
        ...createBurstParticles(
          window.innerWidth * 0.5,
          window.innerHeight * 0.28,
          intensity === 'master' ? 85 : 46,
          Math.PI * 1.4,
          -Math.PI / 2,
          6,
          14
        )
      );
      if (rafId === null) {
        rafId = window.requestAnimationFrame(animateConfetti);
      }
    }, 240);
  }

  if (rafId === null) {
    rafId = window.requestAnimationFrame(animateConfetti);
  }
}
