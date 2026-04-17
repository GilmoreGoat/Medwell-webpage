import { motion } from 'framer-motion';
import sunsetBg from '../assets/sunset-bg.jpg';

/**
 * PageHeader
 *
 * Slim sunset banner for subpages — echoes the home hero's tone without
 * stealing its drama. Used on /events and /news to keep the brand cohesive.
 *
 *   eyebrow   small uppercase kicker shown above the title
 *   title     main headline (serif)
 *   lead      optional paragraph underneath
 */
export default function PageHeader({ eyebrow, title, lead }) {
  return (
    <section className="relative flex min-h-[55svh] w-full items-end overflow-hidden bg-ink pb-12 pt-36 md:min-h-[60svh] md:pb-16 md:pt-40">
      <img
        src={sunsetBg}
        alt=""
        aria-hidden
        draggable={false}
        className="sunset-pan pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
      />
      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.45em] text-cream/85 drop-shadow-[0_1px_6px_rgba(46,29,63,0.45)]"
          >
            <span className="h-px w-10 bg-cream/60" />
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[14ch] font-serif font-light leading-[0.95] tracking-tightest text-cream drop-shadow-[0_2px_24px_rgba(46,29,63,0.35)]"
          style={{ fontSize: 'clamp(2.25rem, 6.5vw, 5.25rem)' }}
        >
          {title}
        </motion.h1>

        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-cream/90 drop-shadow-[0_1px_12px_rgba(46,29,63,0.35)] md:text-lg"
          >
            {lead}
          </motion.p>
        )}
      </div>
    </section>
  );
}
