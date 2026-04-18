import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../context/CursorContext.jsx';

/**
 * CustomCursor — "point-sun"
 *
 * Inline-SVG sun-shaped cursor: a warm filled disc with eight tapered
 * rays radiating outward. All styling is live (no external asset), so
 * the cursor can respond to state without swapping images:
 *
 *   idle  → compact disc, rays at rest
 *   hover → disc pulses brighter, rays extend outward
 *   press → rays retract inward (the sun "blinks" on click)
 *
 * Context-driven values:
 *   hover      — set by <useHoverCursor /> on interactive elements
 *   intensity  — 0..1, scroll-linked; dims the glow as the user scrolls
 *                down so the cursor recedes in content-heavy sections
 */
export default function CustomCursor() {
  const { hover, intensity } = useCursor();
  const [pressed, setPressed] = useState(false);

  // Raw mouse position — instant, no spring so clicks feel precise.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Scale is spring-smoothed so hover/press transitions feel organic.
  const scale = useSpring(1, { stiffness: 320, damping: 22 });
  useEffect(() => {
    if (pressed) scale.set(0.78);
    else if (hover) scale.set(1.55);
    else scale.set(1);
  }, [hover, pressed, scale]);

  // Ray length (in % of svg) — expands on hover, retracts on press.
  const rayReach = useSpring(1, { stiffness: 280, damping: 24 });
  useEffect(() => {
    if (pressed) rayReach.set(0.35);
    else if (hover) rayReach.set(1.35);
    else rayReach.set(1);
  }, [hover, pressed, rayReach]);

  // Glow radius / opacity fade out with scroll intensity.
  const glowSize = useTransform(() => `${34 + intensity * 28}px`);
  const glowOpacity = useTransform(() => 0.3 + intensity * 0.55);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    // Cover the case where the user drags off-window and releases.
    window.addEventListener('blur', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('blur', up);
    };
  }, [x, y]);

  // Don't render on touch devices — no cursor makes sense there.
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, scale }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      {/* Warm ambient glow — softens as the page scrolls. */}
      <motion.span
        style={{ width: glowSize, height: glowSize, opacity: glowOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-[radial-gradient(circle,rgba(255,180,95,0.85)_0%,rgba(255,120,95,0.4)_45%,transparent_72%)]
                   blur-md"
      />

      {/* The sun itself. 32×32 viewBox — the disc sits at (16,16). */}
      <svg
        viewBox="0 0 32 32"
        className="relative h-8 w-8"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,150,70,0.55))' }}
      >
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFE8B0" />
            <stop offset="55%" stopColor="#FFB366" />
            <stop offset="100%" stopColor="#FF7A4E" />
          </radialGradient>
        </defs>

        {/* Eight tapered rays. Each one animates length via rayReach. */}
        <SunRays reach={rayReach} />

        {/* Core disc */}
        <circle cx="16" cy="16" r="3.4" fill="url(#sunCore)" />
        {/* Inner highlight — tiny bright dot, adds dimensionality */}
        <circle cx="15" cy="14.6" r="0.9" fill="#FFF6DC" opacity="0.9" />
      </svg>
    </motion.div>
  );
}

/**
 * SunRays — eight motion lines around the cursor core. Length scales
 * with `reach` (1 = resting). Laid out at 45° increments.
 */
function SunRays({ reach }) {
  const baseInner = 5.2;
  const baseOuter = 8.6;
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <g stroke="#FFC07A" strokeWidth="1.1" strokeLinecap="round" opacity="0.95">
      {angles.map((deg) => {
        // The ray end-point extends or retracts in spring with `reach`.
        // Using useTransform per ray would be ideal but adds overhead;
        // for 8 rays a shared style works fine.
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.line
            key={deg}
            x1={16 + Math.cos(rad) * baseInner}
            y1={16 + Math.sin(rad) * baseInner}
            style={{
              // Map reach through a CSS var so the line endpoint shifts.
              // motion.line supports SVG attrs via style transforms; the
              // simplest cross-browser approach is to scale the whole ray
              // via transform-box.
              transformBox: 'fill-box',
              transformOrigin: `${16 + Math.cos(rad) * baseInner}px ${
                16 + Math.sin(rad) * baseInner
              }px`,
              scale: reach,
            }}
            x2={16 + Math.cos(rad) * baseOuter}
            y2={16 + Math.sin(rad) * baseOuter}
          />
        );
      })}
    </g>
  );
}

/**
 * useHoverCursor
 *
 * Spread the returned props onto any interactive element so the sun
 * cursor extends its rays on hover.
 */
export function useHoverCursor() {
  const { setHover } = useCursor();
  const ref = useRef(null);
  return {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
    ref,
  };
}
