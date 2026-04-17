import { motion } from 'framer-motion';
import logoUrl from '../assets/medwell-logo.png';

/**
 * LoadingScreen
 *
 * Full-bleed splash rendered inside <AnimatePresence> in App. Three beats:
 *   1. Deep dusk-blue background fills the viewport.
 *   2. The MEDWELL medallion scales up + fades in at center, haloed by a
 *      warm sunset aura. (Raster logo, so we use a glow-reveal rather than
 *      an SVG path draw.)
 *   3. On exit, the medallion scales up further + fades, and the dark panel
 *      wipes UP, revealing the Hero underneath.
 */
export default function LoadingScreen() {
  const orbitDots = Array.from({ length: 6 }, (_, i) => i);
  // "Fake beat" cadence: quick hit, rebound, then rest.
  const beatTimes = [0, 0.18, 0.34, 0.52, 1];

  return (
    <motion.div
      key="loader"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-dusk-deep"
      initial={{ y: 0 }}
      // Background panel wipes UPWARD to reveal the hero.
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.15 }}
    >
      {/* Subtle radial dusk vignette for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(26,42,86,0.9) 0%, rgba(7,15,36,1) 70%)',
        }}
      />

      {/* Soft sunset aura behind the medallion. */}
      <motion.div
        aria-hidden
        className="absolute h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,170,90,0.55) 0%, rgba(255,106,136,0.28) 42%, transparent 72%)',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Secondary neon-ish accent ring for a modern 2026 vibe. */}
      <motion.div
        aria-hidden
        className="absolute h-[420px] w-[420px] rounded-full border border-sunset-coral/35"
        initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
        animate={{
          opacity: [0.24, 0.58, 0.42, 0.5, 0.24],
          scale: [0.96, 1.06, 0.99, 1.03, 0.96],
          rotate: [-8, 10, 6, 8, -8],
        }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 2.1, times: beatTimes, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Orbiting micro-dots add playful kinetic motion around the logo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        {orbitDots.map((dot) => {
          const angle = (dot / orbitDots.length) * 360;
          return (
            <motion.span
              key={dot}
              className="absolute h-2 w-2 rounded-full bg-sunset-yellow/80 shadow-[0_0_14px_rgba(255,170,90,0.65)]"
              style={{ transform: `rotate(${angle}deg) translateY(-185px)` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0.28, 1, 0.52, 0.84, 0.28],
                scale: [0.68, 1.32, 0.88, 1.12, 0.68],
                y: [0, -12, -3, -8, 0],
              }}
              transition={{
                duration: 2.1,
                times: beatTimes,
                delay: dot * 0.11,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </div>

      {/* Medallion: fades/scales in, lingers, then scales up + fades out. */}
      <motion.img
        src={logoUrl}
        alt="MEDWELL — medicine & wellness collective"
        draggable={false}
        initial={{ opacity: 0, scale: 0.82, filter: 'blur(6px)' }}
        animate={{ opacity: [1, 1, 0.94, 1, 1], scale: [1, 1.02, 0.99, 1.015, 1], filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.22, filter: 'blur(2px)' }}
        transition={{
          duration: 2.1,
          times: beatTimes,
          repeat: Infinity,
          ease: 'easeOut',
          filter: { duration: 0.8 },
        }}
        className="relative h-[260px] w-[260px] select-none rounded-full shadow-[0_0_80px_rgba(255,138,76,0.35)] ring-1 ring-white/5 md:h-[300px] md:w-[300px]"
      />

      {/* Supporting wordmark. */}
      <motion.div
        className="absolute bottom-[18%] flex flex-col items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
      >
        <span className="text-[10px] uppercase tracking-[0.5em] text-cream/60">
          at ucsd
        </span>
        <motion.span
          className="mt-2 text-[11px] uppercase tracking-[0.35em] text-cream/75"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.32, 1, 0.62, 0.86, 0.32],
            letterSpacing: ['0.31em', '0.43em', '0.36em', '0.4em', '0.31em'],
          }}
          transition={{ duration: 2.1, times: beatTimes, delay: 0.25, repeat: Infinity, ease: 'easeOut' }}
        >
          wellness in motion
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
