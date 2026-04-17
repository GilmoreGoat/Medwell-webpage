import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useHoverCursor } from './CustomCursor.jsx';
import logoUrl from '../assets/medwell-logo.png';

const INSTAGRAM_URL = 'https://www.instagram.com/medwell.at.ucsd/';
const LINKTREE_URL = 'https://linktr.ee/medwellucsd';

/**
 * Navbar
 *
 * Transparent over hero sunsets; fades to a dark backdrop when the user
 * scrolls, or when the current route is a subpage that doesn't open with a
 * full-bleed photo. `NAV_LINKS` mixes routes and anchors:
 *   - `to` links are client-side React Router routes (Events, News)
 *   - `hash` links anchor to sections on the home page; from subpages
 *     they prefix `/#` so clicking takes you home + scrolls
 */
const NAV_LINKS = [
  { label: 'About', hash: 'about' },
  { label: 'Anatomy', hash: 'anatomy' },
  { label: 'Events', to: '/events' },
  { label: 'News', to: '/news' },
];

export default function Navbar() {
  const logoHover = useHoverCursor();
  const igHover = useHoverCursor();
  const linktreeHover = useHoverCursor();
  const joinHover = useHoverCursor();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Subpages have a slimmer PageHeader — the backdrop should stay on to
  // keep nav text readable as soon as the user reaches cream content.
  const isHome = pathname === '/';
  const solid = scrolled || !isHome;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? 'bg-ink/80 backdrop-blur-md shadow-lg shadow-ink/10' : 'bg-transparent'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 transition-all duration-500 md:px-10 ${
          solid ? 'pt-3 pb-3 md:pt-4 md:pb-4' : 'pt-6 md:pt-8'
        }`}
      >
        <nav className="flex items-center justify-between">
          {/* Left: medallion + wordmark */}
          <Link
            to="/"
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
          </Link>

          {/* Center: route + anchor links */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavItem key={link.label} link={link} isHome={isHome} pathname={pathname} />
            ))}
          </nav>

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

function NavItem({ link, isHome, pathname }) {
  const hover = useHoverCursor();
  const baseClass =
    'group relative text-[11px] uppercase tracking-[0.3em] text-cream/85 transition-colors hover:text-cream';
  const underline = (
    <span
      aria-hidden
      className="absolute -bottom-1 left-0 h-px w-0 bg-cream/80 transition-all duration-300 group-hover:w-full"
    />
  );

  if (link.hash) {
    // Anchor on home; on subpages, route to home + hash so the ScrollManager
    // picks up the target after navigation.
    const href = isHome ? `#${link.hash}` : `/#${link.hash}`;
    return isHome ? (
      <a {...hover} href={href} className={baseClass}>
        {link.label}
        {underline}
      </a>
    ) : (
      <Link {...hover} to={`/#${link.hash}`} className={baseClass}>
        {link.label}
        {underline}
      </Link>
    );
  }

  const active = pathname === link.to;
  return (
    <Link
      {...hover}
      to={link.to}
      className={`${baseClass} ${active ? 'text-cream' : ''}`}
    >
      {link.label}
      <span
        aria-hidden
        className={`absolute -bottom-1 left-0 h-px bg-cream/80 transition-all duration-300 ${
          active ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </Link>
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
