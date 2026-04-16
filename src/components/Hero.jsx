import { motion } from 'framer-motion';
import { useHoverCursor } from './CustomCursor.jsx';

const LINKTREE_URL = 'https://linktr.ee/medwellucsd';

/**
 * Hero
 *
 * Premium, spacious landing. Sunset mesh gradient (CSS, see index.css) slowly
 * drifts behind a serif headline and a sans-serif subhead. Text animates in
 * once the splash has cleared — see App.jsx's `introReady` flag which gates
 * this section so it starts fresh rather than mid-way.
 */
const headlineContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
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

  const headlineLines = [
    ['Redefining'],
    ['the', <em key="em" className="font-serif italic text-ink/70">‘pre-med grind’</em>, '.'],
  ];

  return (
    <section
      id="top"
      className="mesh-sunset noise relative flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* Decorative overline top-left */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute left-6 top-28 hidden items-center gap-3 md:left-10 md:top-32 md:flex"
      >
        <span className="h-px w-10 bg-ink/40" />
        <span className="text-[11px] uppercase tracking-[0.45em] text-ink/55">
          Pre-Med · UC San Diego
        </span>
      </motion.div>

      {/* Decorative side label right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 md:block"
      >
        <span className="text-[10px] uppercase tracking-[0.6em] text-ink/40">
          2025 · Collective · 001
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* ===== Headline ===== */}
        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="show"
          className="font-serif font-light leading-[0.92] tracking-tightest text-ink"
          style={{ fontSize: 'clamp(3rem, 10vw, 9.5rem)' }}
        >
          {headlineLines.map((line, li) => (
            <span key={li} className="block overflow-hidden pb-2">
              <motion.span variants={headlineWord} className="inline-block">
                {line.map((chunk, ci) =>
                  typeof chunk === 'string' ? (
                    <span key={ci}>
                      {chunk}
                      {ci < line.length - 1 ? ' ' : ''}
                    </span>
                  ) : (
                    chunk
                  )
                )}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* ===== Sub-headline ===== */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl font-sans text-lg font-light leading-relaxed text-ink/70 md:mt-10 md:text-xl"
        >
          Medicine is about people, not just textbooks.
        </motion.p>

        {/* ===== CTA + meta row ===== */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-5 md:mt-14"
        >
          <a
            {...ctaHover}
            href={LINKTREE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative inline-flex items-center gap-3 overflow-hidden
                       rounded-full bg-ink px-8 py-4 text-sm font-medium uppercase
                       tracking-[0.22em] text-cream shadow-lg shadow-ink/10
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

            {/* Warm sunset glaze on hover */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sunset-yellow/0 via-sunset-orange/80 to-sunset-coral/0 opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-30"
            />
          </a>

          <span className="text-xs uppercase tracking-[0.35em] text-ink/45">
            No application fee · All majors welcome
          </span>
        </motion.div>

        {/* ===== Bottom scroll hint ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/50"
        >
          <span className="text-[10px] uppercase tracking-[0.5em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="block h-6 w-px bg-ink/40"
          />
        </motion.div>
      </div>
    </section>
  );
}
