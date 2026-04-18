import { useEffect, useState } from 'react';
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
      {/* ===== Background photo — ken-burns pan + "digicam" treatment =====
          Three stacked layers fake the look of a warm point-and-shoot
          print from a decade-old sunset photo:
            · base   — the sunset pushed to punchier contrast / saturation
            · rChan  — same photo, shifted +1px right, red-tinted, blended
            · bChan  — same photo, shifted -1px left, blue-tinted, blended
          Together they add a subtle chromatic aberration without needing
          a new asset or a WebGL shader. The bloom + grain layers below
          finish the warm, slightly-degraded digicam feel. */}
      <div aria-hidden className="sunset-pan pointer-events-none absolute inset-0">
        <img
          src={sunsetBg}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover"
          style={{ filter: 'contrast(1.18) saturate(1.35) brightness(1.02) hue-rotate(-4deg)' }}
        />
        {/* Red channel — shifted right */}
        <img
          src={sunsetBg}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover mix-blend-screen"
          style={{
            transform: 'translate3d(2px, 0, 0)',
            filter: 'saturate(1.4) sepia(0.2) hue-rotate(-15deg) opacity(0.35)',
          }}
        />
        {/* Blue channel — shifted left */}
        <img
          src={sunsetBg}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover mix-blend-screen"
          style={{
            transform: 'translate3d(-2px, 0, 0)',
            filter: 'saturate(1.3) hue-rotate(22deg) opacity(0.22)',
          }}
        />
      </div>

      {/* Warm bloom — reinforces the deep-reds of Nadia's reference photo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(255,120,70,0.45) 0%, rgba(160,40,80,0.35) 40%, rgba(30,10,35,0.2) 80%)',
        }}
      />

      {/* ===== Scrim for text contrast ===== */}
      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-0" />

      {/* Digicam grain — coarser than .noise so it reads as film texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.18,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.85'/></svg>\")",
        }}
      />

      {/* Heavy corner vignette — finishes the point-and-shoot look. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(20,6,30,0.55) 100%)',
        }}
      />

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
          {/* Each line uses a clip-path mask so the word can rise from
              behind a horizontal edge WITHOUT shearing italic side
              strokes or descender overshoots. `overflow: hidden` clips
              all four sides (chopping the 'g' tail on 'grind', the 'R'
              swash on 'Redefining', the italic apostrophes, etc.);
              `clip-path: inset(0 -1em -0.1em -1em)` only masks the top
              and leaves generous room below + on the sides. Leading is
              also loosened from 0.95 → 1.02 so descenders don't collide
              with the next line. */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate="show"
            className="max-w-[18ch] font-serif font-light tracking-tightest text-cream drop-shadow-[0_2px_24px_rgba(46,29,63,0.35)]"
            style={{ fontSize: 'clamp(2.75rem, 9vw, 8.5rem)', lineHeight: 1.02 }}
          >
            <span
              className="block"
              style={{ clipPath: 'inset(-0.05em -1em 0 -1em)', paddingBottom: '0.1em' }}
            >
              <motion.span variants={headlineWord} className="inline-block">
                Redefining
              </motion.span>
            </span>
            <span
              className="block"
              style={{ clipPath: 'inset(-0.05em -1em 0 -1em)', paddingBottom: '0.18em' }}
            >
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
            Great care starts with self care.
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

      {/* ===== Digicam timestamp — very bottom right ===== */}
      <DigicamStamp />
    </section>
  );
}

/**
 * DigicamStamp
 *
 * Warm orange monospace readout in the bottom-right corner, mimicking
 * the burnt-in date on an old point-and-shoot print. Updates every
 * second so the stamp is always current. The color + glow match the
 * reference photo's hot-orange clock font.
 */
function DigicamStamp() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 1 }}
      aria-hidden
      className="pointer-events-none absolute bottom-3 right-4 z-10 select-none tabular-nums md:bottom-4 md:right-6"
      style={{
        fontFamily: "'Courier New', ui-monospace, Menlo, monospace",
        color: '#FFB04A',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textShadow:
          '0 0 6px rgba(255,140,60,0.75), 0 0 14px rgba(255,120,50,0.45), 0 1px 2px rgba(0,0,0,0.65)',
        fontSize: 'clamp(0.7rem, 1.1vw, 0.95rem)',
      }}
    >
      {mm} . {dd} . {yyyy}  {hh}:{mi}
    </motion.div>
  );
}
