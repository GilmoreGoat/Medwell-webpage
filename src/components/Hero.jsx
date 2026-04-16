import { motion } from 'framer-motion';
import { useHoverCursor } from './CustomCursor.jsx';
import sunsetBg from '../assets/sunset-bg.jpg';

const LINKTREE_URL = 'https://linktr.ee/medwellucsd';

/**
 * Hero
 *
 * Full-bleed sunset photograph behind a single max-width content block.
 * Three stacked layers (z-ascending):
 *
 *   0  sunset-bg.jpg       — the photo, slow ken-burns pan
 *   1  .hero-scrim         — warm gradient wash for text contrast
 *   10 content + scroll    — overline, headline, subhead, CTA, indicator
 *
 * The photo is imported so Vite fingerprints/optimizes it. The scrim is a
 * single gradient tuned to (a) dim the top so the cream navbar stays
 * readable over pale clouds, and (b) lightly brighten the midband so the
 * dark serif headline reads over the busy cloud detail.
 */
const headlineContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.2 },
  },
};

const headlineWord = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  const ctaHover = useHoverCursor();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink"
    >
      {/* ===== Background photo — ken-burns pan ===== */}
      <img
        src={sunsetBg}
        alt=""
        aria-hidden
        draggable={false}
        className="sunset-pan pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />

      {/* ===== Scrim for text contrast ===== */}
      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />

      {/* ===== Main content block — anchored to the same container as the nav ===== */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pt-36 pb-40 md:px-10 md:pt-40 md:pb-44">
          {/* Overline — lives inside the content container, not floating. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-10 flex items-center gap-4 md:mb-14"
          >
            <span className="h-px w-10 bg-cream/60" />
            <span className="text-[11px] uppercase tracking-[0.45em] text-cream/85 drop-shadow-[0_1px_6px_rgba(46,29,63,0.45)]">
              Pre-Med · UC San Diego
            </span>
          </motion.div>

          {/* Headline — cream on sunset reads cinematic; drop shadow guarantees
              contrast over the photo's bright & dark bands. */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate="show"
            className="max-w-[18ch] font-serif font-light leading-[0.95] tracking-tightest text-cream drop-shadow-[0_2px_24px_rgba(46,29,63,0.35)]"
            style={{ fontSize: 'clamp(2.75rem, 9vw, 8.5rem)' }}
          >
            <span className="block overflow-hidden pb-2">
              <motion.span variants={headlineWord} className="inline-block">
                Redefining
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span variants={headlineWord} className="inline-block">
                the <em className="font-serif italic text-cream/90">‘pre-med grind’</em>.
              </motion.span>
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-cream/90 drop-shadow-[0_1px_12px_rgba(46,29,63,0.35)] md:mt-10 md:text-lg"
          >
            Medicine is about people, not just textbooks.
          </motion.p>

          {/* CTA row — button on its own, meta below for calmer hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 md:mt-16"
          >
            <a
              {...ctaHover}
              href={LINKTREE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative inline-flex items-center gap-3 overflow-hidden
                         rounded-full bg-ink px-8 py-4 text-xs font-medium uppercase
                         tracking-[0.24em] text-cream shadow-lg shadow-ink/20
                         transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Join the Collective</span>
              <span
                aria-hidden
                className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:translate-x-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </span>

              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sunset-yellow/0 via-sunset-orange/80 to-sunset-coral/0 opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-30"
              />
            </a>

            <p className="mt-5 text-[10px] uppercase tracking-[0.42em] text-cream/70 drop-shadow-[0_1px_6px_rgba(46,29,63,0.45)]">
              No application fee · All majors welcome
            </p>
          </motion.div>
        </div>
      </div>

      {/* ===== Scroll indicator — pinned to the frame, not the content ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 1 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/75 drop-shadow-[0_1px_6px_rgba(46,29,63,0.5)]"
      >
        <span className="text-[9px] uppercase tracking-[0.5em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-6 w-px bg-cream/70"
        />
      </motion.div>
    </section>
  );
}
