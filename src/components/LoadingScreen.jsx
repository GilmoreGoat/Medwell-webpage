import { motion } from 'framer-motion';
import FlameMark from './FlameMark.jsx';

/**
 * LoadingScreen
 *
 * Full-bleed splash rendered inside <AnimatePresence> in App. Three beats:
 *   1. Deep dusk-blue background fills the viewport.
 *   2. The flame draws/fades itself in at center with a warm glow.
 *   3. On exit, the flame scales up + fades, and the dark panel wipes UP,
 *      revealing the Hero underneath.
 *
 * Exit timing is choreographed in `exit` so the panel slides away just after
 * the flame finishes scaling out — that gap is the "reveal".
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

      {/* Soft sunset aura behind the flame. */}
      <motion.div
        aria-hidden
        className="absolute h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,170,90,0.45) 0%, rgba(255,106,136,0.25) 40%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.4 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Flame: draws in, lingers, then scales up + fades out before the panel wipes. */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.25 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <FlameMark draw size={180} />
      </motion.div>

      {/* Wordmark fades in below the flame for brand presence. */}
      <motion.div
        className="absolute bottom-[22%] flex flex-col items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
      >
        <span className="font-serif text-2xl tracking-[0.45em] text-cream/90">
          M E D W E L L
        </span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.5em] text-cream/50">
          at ucsd
        </span>
      </motion.div>
    </motion.div>
  );
}
