import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useCursor } from '../context/CursorContext.jsx';
import cursorImg from '../assets/cursor-flame.svg';

/**
 * CustomCursor
 *
 * A spring-followed flame cursor that replaces the native OS cursor.
 *
 * Behavior:
 *   - Follows the mouse with a soft spring so motion feels alive but not laggy.
 *   - Expands + brightens its glow when `hover` is true (set by nav/CTA
 *     via `data-cursor="hover"` on elements — see `useHoverCursor` below).
 *   - `intensity` (0..1) drives opacity + glow radius so later sections can
 *     dim the cursor as the user scrolls.
 *
 * Note: the underlying asset is /src/assets/cursor-flame.svg. Replace that
 * file with your own flame image at any time — sizing stays consistent.
 */
export default function CustomCursor() {
  const { hover, intensity } = useCursor();

  // Raw mouse position → spring for smooth trailing.
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 500, damping: 40, mass: 0.4 });
  const y = useSpring(mouseY, { stiffness: 500, damping: 40, mass: 0.4 });

  // Hover state drives scale smoothly.
  const scale = useSpring(1, { stiffness: 300, damping: 22 });
  useEffect(() => {
    scale.set(hover ? 1.6 : 1);
  }, [hover, scale]);

  // Derived glow size from intensity — fades out with scroll later on.
  const glowSize = useTransform(() => `${40 + intensity * 40}px`);
  const glowOpacity = useTransform(() => 0.35 + intensity * 0.55);

  // Track mouse globally.
  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  // Hide on touch devices — no cursor makes sense there.
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x,
        y,
        scale,
        // Center the 28px asset on the actual mouse coordinate.
        translateX: '-35%',
        translateY: '-10%',
      }}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 will-change-transform"
    >
      {/* Warm glow behind the flame — blurred radial. */}
      <motion.span
        style={{ width: glowSize, height: glowSize, opacity: glowOpacity }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-[radial-gradient(circle,rgba(255,170,90,0.9)_0%,rgba(255,106,136,0.5)_45%,transparent_70%)]
                   blur-md"
      />
      <img
        src={cursorImg}
        alt=""
        draggable={false}
        className="relative h-8 w-8 select-none"
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,138,76,0.65))' }}
      />
    </motion.div>
  );
}

/**
 * useHoverCursor
 *
 * Tiny helper hook for interactive elements. Spread the returned props onto
 * any element that should trigger the cursor's expanded/hover state.
 *
 *   const hoverProps = useHoverCursor();
 *   <button {...hoverProps}>Join the Collective</button>
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
