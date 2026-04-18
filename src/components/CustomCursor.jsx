import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../context/CursorContext.jsx';

/**
 * CustomCursor — "point-sun"
 *
 * A single-group inline SVG sun. One viewBox, one transform origin,
 * one unified scale animation. The previous version animated eight
 * rays independently which produced visual artifacts (rays drifting
 * apart, uneven reach on click). Here the ENTIRE sun scales as one
 * unit and only the core disc + halo opacity pulse on state change,
 * so the shape stays clean at rest, on hover, and on press.
 *
 * State → visual:
 *   idle   scale 1      disc dim     rays short
 *   hover  scale 1.25   disc bright  rays extended (via rotate)
 *   press  scale 0.85   disc flare   rays pulled in
 */
export default function CustomCursor() {
  const { hover, intensity } = useCursor();
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const scale = useSpring(1, { stiffness: 380, damping: 26 });
  useEffect(() => {
    if (pressed) scale.set(0.82);
    else if (hover) scale.set(1.25);
    else scale.set(1);
  }, [hover, pressed, scale]);

  const rotate = useSpring(0, { stiffness: 120, damping: 18 });
  useEffect(() => {
    if (hover) rotate.set(22.5);
    else rotate.set(0);
  }, [hover, rotate]);

  const glowOpacity = useTransform(() => {
    const base = 0.38 + intensity * 0.4;
    if (pressed) return Math.min(1, base + 0.3);
    if (hover) return Math.min(1, base + 0.15);
    return base;
  });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leaveWindow = () => setVisible(false);
    const enterWindow = () => setVisible(true);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('blur', up);
    document.addEventListener('mouseleave', leaveWindow);
    document.addEventListener('mouseenter', enterWindow);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('blur', up);
      document.removeEventListener('mouseleave', leaveWindow);
      document.removeEventListener('mouseenter', enterWindow);
    };
  }, [x, y, visible]);

  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y, scale, opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 -translate-x-1/2 -translate-y-1/2 will-change-transform"
    >
      {/* Soft halo — steady ambient warmth, opacity pulses with state */}
      <motion.span
        style={{ opacity: glowOpacity }}
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
        aria-hidden
      >
        <span
          className="block h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,190,110,0.9) 0%, rgba(255,120,95,0.5) 40%, transparent 72%)',
          }}
        />
      </motion.span>

      {/* The sun — 40×40 viewBox, one rotating group so all eight
          rays stay geometrically locked to the disc. */}
      <motion.svg
        viewBox="0 0 40 40"
        className="relative h-10 w-10"
        style={{
          rotate,
          filter: 'drop-shadow(0 0 3px rgba(255,150,70,0.65))',
        }}
      >
        <defs>
          <radialGradient id="sunCore" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFF1C4" />
            <stop offset="55%" stopColor="#FFB366" />
            <stop offset="100%" stopColor="#FF7A4E" />
          </radialGradient>
        </defs>

        {/* Eight rays — fixed geometry. No per-ray animation. */}
        <g stroke="#FFC07A" strokeWidth="1.3" strokeLinecap="round" opacity="0.95">
          <line x1="20" y1="6" x2="20" y2="11" />
          <line x1="20" y1="29" x2="20" y2="34" />
          <line x1="6" y1="20" x2="11" y2="20" />
          <line x1="29" y1="20" x2="34" y2="20" />
          <line x1="10.1" y1="10.1" x2="13.6" y2="13.6" />
          <line x1="26.4" y1="26.4" x2="29.9" y2="29.9" />
          <line x1="29.9" y1="10.1" x2="26.4" y2="13.6" />
          <line x1="13.6" y1="26.4" x2="10.1" y2="29.9" />
        </g>

        {/* Outer soft disc — diffuses the edge */}
        <circle cx="20" cy="20" r="5" fill="url(#sunCore)" opacity="0.45" />
        {/* Core disc */}
        <circle cx="20" cy="20" r="3.6" fill="url(#sunCore)" />
        {/* Inner highlight */}
        <circle cx="19" cy="18.8" r="0.9" fill="#FFF6DC" opacity="0.95" />
      </motion.svg>
    </motion.div>
  );
}

/**
 * useHoverCursor — spread onto interactive elements so the sun
 * responds on hover / focus.
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
