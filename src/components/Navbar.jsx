import { motion } from 'framer-motion';
import { useHoverCursor } from './CustomCursor.jsx';
import logoUrl from '../assets/medwell-logo.png';

const INSTAGRAM_URL = 'https://www.instagram.com/medwell.at.ucsd/';
const LINKTREE_URL = 'https://linktr.ee/medwellucsd';

/**
 * Navbar
 *
 * Transparent over the hero sunset sky. Uses the same max-width container
 * as the hero content so the logo on the left aligns vertically with the
 * hero's overline and headline. Text is light (cream) to read against the
 * dusk-purple crown of the sunset.
 */
export default function Navbar() {
  const logoHover = useHoverCursor();
  const igHover = useHoverCursor();
  const linktreeHover = useHoverCursor();
  const joinHover = useHoverCursor();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto max-w-7xl px-6 pt-6 md:px-10 md:pt-8">
        <nav className="flex items-center justify-between">
          {/* Left: medallion + wordmark */}
          <a
            href="#top"
            {...logoHover}
            className="group flex items-center gap-3"
            aria-label="MEDWELL home"
          >
            <img
              src={logoUrl}
              alt="MEDWELL — medicine & wellness collective"
              width={44}
              height={44}
              draggable={false}
              className="h-11 w-11 select-none rounded-full shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="hidden font-serif text-lg tracking-[0.3em] text-cream/95 drop-shadow-[0_1px_8px_rgba(46,29,63,0.35)] sm:inline">
              MEDWELL
            </span>
          </a>

          {/* Right: socials + CTA */}
          <div className="flex items-center gap-2 md:gap-4">
            <a
              {...igHover}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="MEDWELL on Instagram"
              className="grid h-10 w-10 place-items-center rounded-full text-cream/85 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <InstagramIcon />
            </a>
            <a
              {...linktreeHover}
              href={LINKTREE_URL}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="MEDWELL Linktree"
              className="grid h-10 w-10 place-items-center rounded-full text-cream/85 transition-colors hover:bg-white/10 hover:text-cream"
            >
              <LinktreeIcon />
            </a>

            <a
              {...joinHover}
              href={LINKTREE_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative ml-2 overflow-hidden rounded-full border border-cream/30
                         bg-cream/10 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em]
                         text-cream backdrop-blur-md transition-all duration-300
                         hover:border-cream/60 hover:bg-cream/20"
            >
              <span className="relative z-10">Join Us</span>
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sunset-yellow/0 via-sunset-orange/40 to-sunset-coral/0 transition-transform duration-700 group-hover:translate-x-full"
              />
            </a>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}

/* ---------- Inline icons ---------- */

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinktreeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3v7" />
      <path d="M6 7l6 3 6-3" />
      <path d="M6 12l6 3 6-3" />
      <path d="M12 15v6" />
    </svg>
  );
}
