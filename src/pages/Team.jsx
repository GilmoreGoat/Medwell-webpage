import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader.jsx';
import Footer from '../components/Footer.jsx';
import { useHoverCursor } from '../components/CustomCursor.jsx';

/**
 * Team
 *
 * Leadership page — two founder cards in a warm cream section with a
 * giant serif watermark behind them and a pull quote below. Design
 * mirrors the site's existing subpages (PageHeader dark-to-cream
 * transition, Footer below) and leans on the same sunset palette.
 *
 * Photos live in `public/team/` so the user can drop or replace them
 * without a rebuild. If a photo 404s, the card falls back to a
 * sunset-gradient monogram with the member's initials so the page
 * still looks intentional.
 *
 * To add a member: append an object to MEMBERS. `photo` can be null
 * and the initials fallback will render automatically.
 */

const BASE = import.meta.env.BASE_URL;

const MEMBERS = [
  {
    id: 'nadia',
    name: 'Nadia Burciu',
    role: 'Cofounder · President',
    index: '01',
    photo: `${BASE}team/nadia.png`,
    photoPosition: '72% 15%',
    bio: "Nadia is a Human Biology and Literature student at UC San Diego with her sights set on becoming an interventional cardiologist. She co-founded MEDWELL out of a belief that pre-medical culture could be something warmer and more human. Her research at Scripps Research — studying how autism-linked genes affect neuron growth and morphology — was published as part of the Perturb-CLEAR paper and presented at both SACNAS and the UCSD Undergraduate Research Conference. Beyond the lab, she serves on the HOPE and BMES subcommittees at UCSD and coordinates the KP Launch program — channeling the same energy into every community she is part of.",
    linkedin: 'https://www.linkedin.com/in/nadia-burciu-85047836b/',
    instagram:
      'https://www.instagram.com/nanis.herself?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    portfolio: null,
  },
  {
    id: 'ariel',
    name: 'Ariel Yee',
    role: 'Cofounder · President',
    index: '02',
    photo: `${BASE}team/ariel.png`,
    photoPosition: 'center 20%',
    bio: "Ariel is drawn to oncology — and everything she does reflects that: volunteering in the Bone Marrow Transplant unit at UC San Diego Health, coordinating marrow drives with Gift of Life, and writing cancer awareness stories for the American Cancer Society. A PATHS Scholar and Eighth College financial consultant managing a $60K+ student budget, she has spent years in clinical and community spaces proving that care is something you practice long before you earn the title. She co-founded MEDWELL because she believes that same intentionality belongs in pre-med culture, too.",
    linkedin: 'https://www.linkedin.com/in/ariel-yee-69b990320/',
    instagram:
      'https://www.instagram.com/arielandthesea?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    portfolio: null,
  },
];

export default function Team() {
  return (
    <>
      <PageHeader
        eyebrow="Leadership"
        title={
          <>
            The people behind
            <br />
            <em className="font-serif italic">the mission.</em>
          </>
        }
        lead="MEDWELL was built by two people who decided the pre-med path could be done differently. Here's who they are."
      />

      <section className="warm-bg relative isolate overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-20 md:px-10 md:pb-40 md:pt-24">
          {/* Serif watermark — huge, nearly invisible "people" behind the grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[2vw] right-[-2vw] select-none font-serif italic font-light leading-none tracking-tightest text-ink/[0.045]"
            style={{ fontSize: 'clamp(8rem, 22vw, 20rem)' }}
          >
            people
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.45em] text-ink/60">
              <span className="h-px w-8 bg-ink/40" />
              Our Team
            </p>
            <h2
              className="font-serif font-light leading-[0.95] tracking-tightest text-ink"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)' }}
            >
              Meet the <em className="font-serif italic">founders.</em>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
              MEDWELL was built by two people who decided the pre-med path could
              be done differently. Here's who they are.
            </p>
          </motion.div>

          {/* Cards grid — two columns on desktop, stacked on mobile */}
          <div className="relative mt-16 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-x-16 md:gap-y-20">
            {MEMBERS.map((m, i) => (
              <MemberCard key={m.id} member={m} delay={i * 0.14} />
            ))}
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-24 border-t border-ink/10 pt-20 text-center"
          >
            <p
              className="mx-auto max-w-3xl font-serif font-light italic leading-[1.2] tracking-tightest text-ink/85"
              style={{ fontSize: 'clamp(1.25rem, 2.4vw, 2rem)' }}
            >
              We didn't start MEDWELL because the path was easy.
              <br />
              We started it because we knew it could be{' '}
              <em className="font-serif italic">human.</em>
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.42em] text-ink/50">
              Nadia Burciu &amp; Ariel Yee · Cofounders, MEDWELL
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/**
 * MemberCard — photo + metadata + social chips.
 *
 * The photo element swaps to an initials-gradient fallback on load
 * error, so the page still looks composed if the JPG isn't in
 * `public/team/` yet. On hover the photo gets a gentle 4% zoom, which
 * is the same subtle life we give the hero sunset.
 */
function MemberCard({ member, delay }) {
  const liHover = useHoverCursor();
  const igHover = useHoverCursor();
  const portfolioHover = useHoverCursor();
  const [imgError, setImgError] = useState(false);

  const initials = member.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      {/* Photo */}
      <div className="relative w-full overflow-hidden rounded-[1.25rem] bg-[#c8b8a2]" style={{ aspectRatio: '3 / 4' }}>
        {member.photo && !imgError ? (
          <img
            src={member.photo}
            alt={member.name}
            draggable={false}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ objectPosition: member.photoPosition || 'center top' }}
          />
        ) : (
          <InitialsFallback initials={initials} />
        )}

        {/* Bottom-darken gradient for caption legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 55%, rgba(27,23,16,0.28) 100%)',
          }}
        />

        {/* Lo-fi corner caption — same voice as the hero digicam stamp */}
        <span
          aria-hidden
          className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.18em] text-cream/60"
          style={{ fontFamily: "'Courier New', ui-monospace, monospace" }}
        >
          {member.index} · {member.id}
        </span>
      </div>

      {/* Body */}
      <div className="mt-7">
        <div className="mb-2 font-serif italic text-ink/40" style={{ fontSize: 'clamp(0.85rem, 1.05vw, 1rem)' }}>
          {member.index}
        </div>
        <h3
          className="font-serif font-light italic leading-[1] tracking-tightest text-ink"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
        >
          {member.name}
        </h3>
        <div className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.42em] text-ink/50">
          <span className="inline-block h-[3px] w-[3px] rounded-full bg-sunset-orange" />
          {member.role}
        </div>

        <p className="mt-5 max-w-[42ch] border-t border-ink/10 pt-5 text-[0.95rem] leading-[1.75] text-ink/75">
          {member.bio}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {member.linkedin && (
            <a
              {...liHover}
              href={member.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-cream"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </a>
          )}
          {member.instagram && (
            <a
              {...igHover}
              href={member.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-cream"
            >
              <InstagramIcon />
              <span>Instagram</span>
            </a>
          )}
          <PortfolioChip member={member} hover={portfolioHover} />
        </div>
      </div>
    </motion.article>
  );
}

function PortfolioChip({ member, hover }) {
  if (member.portfolio) {
    return (
      <a
        {...hover}
        href={member.portfolio}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-sunset-orange/50 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-sunset-orange transition-all duration-300 hover:-translate-y-0.5 hover:border-sunset-orange hover:bg-sunset-orange hover:text-cream"
      >
        <PortfolioIcon />
        <span>Portfolio</span>
      </a>
    );
  }
  // "Coming soon" ghost chip — dashed border, not interactive.
  return (
    <span
      className="inline-flex cursor-default items-center gap-2 whitespace-nowrap rounded-full border border-dashed border-ink/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ink/40"
      title="Portfolio coming soon"
    >
      <PortfolioIcon />
      <span>Portfolio — coming soon</span>
    </span>
  );
}

/**
 * InitialsFallback — shown when the photo file is missing. A warm
 * sunset-gradient disc with the member's initials in serif, so the
 * page stays composed while real photos are being sourced.
 */
function InitialsFallback({ initials }) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 grid place-items-center bg-gradient-to-br from-sunset-yellow via-sunset-coral to-sunset-plum"
    >
      <span
        className="select-none font-serif font-light italic text-cream/90"
        style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', letterSpacing: '-0.05em' }}
      >
        {initials}
      </span>
    </div>
  );
}

/* ---------- Inline social icons ---------- */

function LinkedInIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
