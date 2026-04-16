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

      {/* Medallion: fades/scales in, lingers, then scales up + fades out. */}
      <motion.img
        src={logoUrl}
        alt="MEDWELL — medicine & wellness collective"
        draggable={false}
        initial={{ opacity: 0, scale: 0.82, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.22, filter: 'blur(2px)' }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
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
      </motion.div>
    </motion.div>
  );
}
