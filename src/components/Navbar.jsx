import { motion } from 'framer-motion';
import { useHoverCursor } from './CustomCursor.jsx';
import logoUrl from '../assets/medwell-logo.png';

const INSTAGRAM_URL = 'https://www.instagram.com/medwell.at.ucsd/';
const LINKTREE_URL = 'https://linktr.ee/medwellucsd';

/**
 * Minimalist, fully transparent nav. Fades in after the splash completes.
 * Uses `useHoverCursor` on every interactive element so the custom cursor
 * expands/intensifies when the user targets them.
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10 md:py-7">
        {/* Left: circular MEDWELL medallion. */}
        <a
          href="#top"
          {...logoHover}
          className="group flex items-center gap-3"
          aria-label="MEDWELL home"
        >
          <img
            src={logoUrl}
            alt="MEDWELL — medicine & wellness collective"
            width={40}
            height={40}
            draggable={false}
            className="h-10 w-10 select-none rounded-full shadow-sm ring-1 ring-ink/5 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-serif text-xl tracking-[0.28em] text-ink/90">
            MEDWELL
          </span>
        </a>

        {/* Right: socials + CTA. */}
        <div className="flex items-center gap-4 md:gap-6">
          <a
            {...igHover}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="MEDWELL on Instagram"
            className="rounded-full p-2 text-ink/70 transition-colors hover:text-ink"
          >
            <InstagramIcon />
          </a>
          <a
            {...linktreeHover}
            href={LINKTREE_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="MEDWELL Linktree"
            className="rounded-full p-2 text-ink/70 transition-colors hover:text-ink"
          >
            <LinktreeIcon />
          </a>

          <a
            {...joinHover}
            href={LINKTREE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative overflow-hidden rounded-full border border-ink/15
                       bg-white/40 px-5 py-2 text-sm font-medium tracking-wide text-ink
                       backdrop-blur-md transition-all duration-300
                       hover:border-ink/30 hover:bg-white/70"
          >
            <span className="relative z-10">Join Us</span>
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sunset-yellow/0 via-sunset-orange/30 to-sunset-coral/0 transition-transform duration-700 group-hover:translate-x-full"
            />
          </a>
        </div>
      </nav>
    </motion.header>
  );
}

/* ---------- Inline icons (kept tiny — no icon library dependency) ---------- */

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinktreeIcon() {
  // Stylized "tree" mark — three stacked links.
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 3v7" />
      <path d="M6 7l6 3 6-3" />
      <path d="M6 12l6 3 6-3" />
      <path d="M12 15v6" />
    </svg>
  );
}
