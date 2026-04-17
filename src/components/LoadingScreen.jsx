import { motion } from 'framer-motion';
import logoUrl from '../assets/medwell-logo.png';

/**
 * LoadingScreen — redesigned splash (~2.6 s), three acts:
 *
 *  Act 1  (0 – 0.4 s)
 *    Warm coral + plum blobs bloom in from opposite corners, mirroring the
 *    warm-bg sections so the transition into the Hero feels native.
 *
 *  Act 2  (0.4 – 1.8 s)
 *    "UC San Diego" eyebrow drifts up.
 *    Each letter of "MEDWELL" rises from behind its own overflow clip —
 *    staggered spring so the word assembles left-to-right.
 *    A thin divider draws across. Medallion drops in with a warm halo.
 *    "medicine & wellness collective" fades in last.
 *
 *  Act 3  (progress bar)
 *    A sunset-gradient bar beneath the wordmark fills left-to-right over
 *    the full SPLASH_MS window so the user feels time passing.
 *
 *  Exit
 *    Dark panel wipes UPWARD revealing the Hero.
 */

const LETTERS = 'MEDWELL'.split('');
const SPLASH_MS = 2600; // keep in sync with App.jsx

export default function LoadingScreen() {
  return (
    <motion.div
      key="loader"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-dusk-deep"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: 0.15 }}
    >
      {/* ── Warm coral blob · top-right ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: '55vmax',
          height: '55vmax',
          right: '-15vmax',
          top: '-18vmax',
          background:
            'radial-gradient(circle, rgba(255,138,76,0.55) 0%, rgba(255,106,136,0.28) 45%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
      />

      {/* ── Plum blob · bottom-left ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          width: '60vmax',
          height: '60vmax',
          left: '-20vmax',
          bottom: '-22vmax',
          background:
            'radial-gradient(circle, rgba(107,75,138,0.38) 0%, rgba(255,179,198,0.2) 50%, transparent 72%)',
          filter: 'blur(120px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
      />

      {/* ── Grain noise ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.045,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* ── Center stage ── */}
      <div className="relative flex flex-col items-center">

        {/* Eyebrow */}
        <motion.p
          className="mb-10 text-[10px] uppercase tracking-[0.55em] text-cream/40"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        >
          UC San Diego
        </motion.p>

        {/* MEDWELL — each letter rises from behind a clip.
            Clip wrappers need vertical breathing room because italic
            Fraunces glyphs overshoot the baseline (and their side
            bearings extend past the em-box); a tight line-height with
            `overflow: hidden` was shearing the bottoms off. We give
            each wrapper generous em-based padding and use `clip-path`
            with negative horizontal insets so the reveal still masks
            the rise vertically without chopping italic side strokes. */}
        <div className="flex items-end" style={{ gap: '0.01em' }}>
          {LETTERS.map((letter, i) => (
            <div
              key={i}
              style={{
                lineHeight: 1,
                paddingTop: '0.12em',
                paddingBottom: '0.2em',
                clipPath: 'inset(0 -0.35em)',
              }}
            >
              <motion.span
                className="block font-serif font-light italic tracking-tightest text-cream"
                style={{ fontSize: 'clamp(4.5rem, 13vw, 9.5rem)', lineHeight: 1 }}
                initial={{ y: '115%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.55 + i * 0.075,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Divider draws across after letters land */}
        <motion.div
          className="mt-8 h-px bg-cream/20"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          style={{ originX: 0.5, width: '100%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
        />

        {/* Medallion + warm halo */}
        <motion.div
          className="relative mt-8 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.72, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
        >
          <div
            aria-hidden
            className="absolute rounded-full"
            style={{
              width: 140,
              height: 140,
              background:
                'radial-gradient(circle, rgba(255,170,90,0.7) 0%, rgba(255,106,136,0.35) 45%, transparent 72%)',
              filter: 'blur(30px)',
            }}
          />
          <img
            src={logoUrl}
            alt=""
            draggable={false}
            className="relative h-16 w-16 select-none rounded-full md:h-20 md:w-20"
            style={{ filter: 'drop-shadow(0 0 14px rgba(255,138,76,0.6))' }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mt-6 text-[10px] uppercase tracking-[0.45em] text-cream/35"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.5 }}
        >
          medicine &amp; wellness collective
        </motion.p>
      </div>

      {/* ── Progress bar fills left-to-right over SPLASH_MS ── */}
      <div className="absolute bottom-10 left-1/2 h-px w-32 -translate-x-1/2 overflow-hidden rounded-full bg-cream/15">
        <motion.div
          className="h-full rounded-full"
          style={{
            originX: 0,
            background: 'linear-gradient(to right, #FF8A4C, #FF6A88, #FFD27A)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: SPLASH_MS / 1000 - 0.1, ease: 'linear', delay: 0.05 }}
        />
      </div>
    </motion.div>
  );
}
