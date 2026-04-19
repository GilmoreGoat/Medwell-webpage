import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHoverCursor } from './CustomCursor.jsx';
import logoUrl from '../assets/medwell-logo.png';

const INSTAGRAM_URL = 'https://www.instagram.com/medwell.at.ucsd/';
const LINKTREE_URL = 'https://linktr.ee/medwellucsd';
const EMAIL = 'medwell@ucsd.edu';

const EXPLORE = [
  { label: 'About', hash: 'about' },
  { label: 'Anatomy', hash: 'anatomy' },
  { label: 'Events', to: '/events' },
  { label: 'News', to: '/news' },
];

const CONNECT = [
  { label: 'Join MEDWELL', href: LINKTREE_URL, external: true },
  { label: 'Instagram', href: INSTAGRAM_URL, external: true },
  { label: 'Linktree', href: LINKTREE_URL, external: true },
  { label: 'Email the board', href: `mailto:${EMAIL}`, external: true },
];

/**
 * Footer — sunset-lit sign-off panel.
 *
 * Mirrors the reference: logo + affiliation block on the left, two link
 * columns in the middle, socials + contact CTA on the right, a giant
 * watermark wordmark behind everything, and a bottom bar with copyright,
 * legal links, and a back-to-top control.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const logoHover = useHoverCursor();
  const igHover = useHoverCursor();
  const linktreeHover = useHoverCursor();
  const contactHover = useHoverCursor();
  const backTopHover = useHoverCursor();

  return (
    <footer className="relative isolate overflow-hidden bg-gradient-to-br from-sunset-plum via-dusk-soft to-dusk-deep text-cream">
      {/* Warm glow bleeding in from top-right, like a setting sun on the horizon */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[70vmax] w-[70vmax] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(255,138,76,0.35) 0%, rgba(255,106,136,0.18) 45%, transparent 72%)',
        }}
      />
      {/* Cool plum drift from bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] -bottom-[25%] h-[60vmax] w-[60vmax] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(107,75,138,0.45) 0%, rgba(255,179,198,0.18) 50%, transparent 72%)',
        }}
      />

      {/* Giant watermark wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-2vw] select-none text-center font-serif leading-none tracking-tightest text-cream/[0.05]"
        style={{ fontSize: 'clamp(10rem, 28vw, 32rem)' }}
      >
        MEDWELL
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-20 md:px-10 md:pt-24">
        <div className="grid gap-14 md:grid-cols-12">
          {/* Brand + affiliation */}
          <div className="md:col-span-4">
            <Link
              to="/"
              {...logoHover}
              className="group inline-flex items-center gap-3"
              aria-label="MEDWELL home"
            >
              <img
                src={logoUrl}
                alt=""
                width={52}
                height={52}
                draggable={false}
                className="h-13 w-13 select-none rounded-full shadow-lg ring-1 ring-cream/15 transition-transform duration-300 group-hover:scale-105"
                style={{ height: 52, width: 52 }}
              />
              <span className="font-serif text-xl tracking-[0.3em]">MEDWELL</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
              A pre-medical wellness collective at UC San Diego — community,
              care, and curiosity for the future of medicine.
            </p>

            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
                Affiliated with
              </p>
              <p className="mt-2 font-serif text-base text-cream/85">
                UC San Diego · Student Affairs
              </p>
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-cream/15 bg-cream/5 px-4 py-3 backdrop-blur-sm">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sunset-yellow to-sunset-orange text-ink shadow-inner"
              >
                <HeartIcon />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.25em] text-cream/60">
                  Recognized
                </p>
                <p className="text-sm text-cream/90">Triton Org · 2025–2026</p>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 md:col-span-5 md:grid-cols-2">
            <LinkColumn title="Explore" items={EXPLORE} />
            <LinkColumn title="Connect" items={CONNECT} />
          </div>

          {/* Socials + contact CTA */}
          <div className="md:col-span-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cream/50">
              Follow
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                {...igHover}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="MEDWELL on Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 bg-cream/5 text-cream/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-cream/40 hover:bg-cream/15 hover:text-cream"
              >
                <InstagramIcon />
              </a>
              <a
                {...linktreeHover}
                href={LINKTREE_URL}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="MEDWELL Linktree"
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 bg-cream/5 text-cream/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-cream/40 hover:bg-cream/15 hover:text-cream"
              >
                <LinktreeIcon />
              </a>
            </div>

            <p className="mt-10 text-[11px] uppercase tracking-[0.3em] text-cream/50">
              Reach out
            </p>
            <motion.a
              {...contactHover}
              href={`mailto:${EMAIL}`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              className="mt-3 inline-flex w-full items-center justify-between gap-3 rounded-full border border-cream/25 bg-cream/10 px-5 py-3 text-xs font-medium uppercase tracking-[0.25em] text-cream backdrop-blur-md transition-colors duration-300 hover:border-cream/60 hover:bg-cream/20"
            >
              <span>Contact us</span>
              <ArrowIcon />
            </motion.a>
            <p className="mt-3 break-all text-xs text-cream/55">{EMAIL}</p>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="mt-16 border-t border-cream/10 pt-6">
          <div className="flex flex-col-reverse items-start justify-between gap-4 text-[11px] uppercase tracking-[0.25em] text-cream/55 md:flex-row md:items-center">
            <p>© {year} MEDWELL at UCSD. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a
                href="#privacy"
                className="transition-colors duration-200 hover:text-cream"
              >
                Privacy
              </a>
              <a
                href="#code-of-conduct"
                className="transition-colors duration-200 hover:text-cream"
              >
                Code of conduct
              </a>
              <button
                {...backTopHover}
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-cream"
              >
                Back to top
                <span aria-hidden className="inline-block -translate-y-px">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LinkColumn({ title, items }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-cream/50">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <FooterLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ item }) {
  const hover = useHoverCursor();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const className =
    'group relative inline-flex items-center gap-2 text-sm text-cream/85 transition-colors duration-200 hover:text-cream';

  const inner = (
    <>
      <span>{item.label}</span>
      <span
        aria-hidden
        className="h-px w-4 origin-left scale-x-0 bg-cream/60 transition-transform duration-300 group-hover:scale-x-100"
      />
    </>
  );

  if (item.external) {
    return (
      <a
        {...hover}
        href={item.href}
        target={item.href?.startsWith('mailto:') ? undefined : '_blank'}
        rel="noreferrer noopener"
        className={className}
      >
        {inner}
      </a>
    );
  }

  if (item.hash) {
    const href = isHome ? `#${item.hash}` : `/#${item.hash}`;
    return isHome ? (
      <a {...hover} href={href} className={className}>
        {inner}
      </a>
    ) : (
      <Link {...hover} to={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <Link {...hover} to={item.to} className={className}>
      {inner}
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

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-7.5-4.6-9.6-9.2A5.4 5.4 0 0 1 12 5.4a5.4 5.4 0 0 1 9.6 6.4C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
