import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader.jsx';
import { useHoverCursor } from '../components/CustomCursor.jsx';

/**
 * Events
 *
 * Editable event feed + Google-Calendar subscribe flow.
 *
 * Filters map to MEDWELL's pillar values (not generic event types) so
 * the page reinforces the brand's anatomy. Each pillar has its own
 * Google Calendar URL once it's been provisioned — selecting a pillar
 * updates the filtered event list AND swaps the subscribe link so
 * members can add that pillar's calendar to their own Google account
 * in one click.
 *
 * `gcalUrl === null` means "calendar not provisioned yet" — the button
 * renders as a disabled chip with a "coming soon" note, so the
 * affordance is still present and no copy edits are needed once more
 * calendars are added.
 *
 * When the user supplies new calendar URLs, drop them into PILLARS.
 */
const PILLARS = [
  {
    key: 'All',
    label: 'All',
    blurb: 'Every event, every pillar.',
    gcalUrl:
      'https://calendar.google.com/calendar/u/0?cid=YzMxZTk5OWI1YWIwMGQxM2ZmMmZkODQ4MTc4NTQ3MzNjZmZlNjU4ZWI2ZTExNjNiMmIxMWQ2NWQwNGI0MmFiMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
  },
  { key: 'Mind', label: 'Mind', blurb: 'Mental-health programming.', gcalUrl: null },
  { key: 'Motion', label: 'Motion', blurb: 'Movement and the outdoors.', gcalUrl: null },
  { key: 'Impact', label: 'Impact', blurb: 'Service and health equity.', gcalUrl: null },
  { key: 'Pulse', label: 'Pulse', blurb: 'Community, mixers, dinners.', gcalUrl: null },
];

/**
 * Events carry a `pillar` value matching one of PILLARS[].key above.
 * Future events — drop them in chronologically; sorting is by `date`.
 */
const EVENTS = [
  {
    id: 'spring-mixer',
    date: '2026-04-24',
    time: '6:00 – 8:00 PM',
    title: 'Spring Sunset Mixer',
    location: 'La Jolla Shores',
    pillar: 'Pulse',
    description:
      'Meet the board, the subcommittees, and your future study partners over golden-hour snacks on the sand. Come as you are.',
  },
  {
    id: 'hikes-with-healers-4',
    date: '2026-05-03',
    time: '7:30 – 10:00 AM',
    title: 'Hikes with Healers: Torrey Pines',
    location: 'Torrey Pines State Reserve',
    pillar: 'Motion',
    description:
      'A guided hike with three UCSD-affiliated physicians. Candid career Q&A on the trail — no slides, no polish, just conversation.',
  },
  {
    id: 'gbm-may',
    date: '2026-05-14',
    time: '6:30 – 7:45 PM',
    title: 'General Body Meeting · Burnout Panel',
    location: 'Price Center West · Forum',
    pillar: 'Mind',
    description:
      'Med students, residents, and attendings on how they stayed themselves through the long road. Meditation open at 6:15 PM.',
  },
  {
    id: 'impact-clinic-day',
    date: '2026-05-21',
    time: '9:00 AM – 2:00 PM',
    title: 'Impact · Free Clinic Volunteer Day',
    location: 'Mountain View Family Clinic',
    pillar: 'Impact',
    description:
      'Intake support, translation help, and patient companionship. Spanish bilingual volunteers especially welcome.',
  },
  {
    id: 'sunset-yoga',
    date: '2026-05-28',
    time: '6:45 – 7:45 PM',
    title: 'Sunset Yoga on RIMAC Field',
    location: 'RIMAC Field',
    pillar: 'Motion',
    description:
      'All levels. Mats provided for the first 30 RSVPs. Stick around after for journaling prompts with MIND.',
  },
  {
    id: 'end-of-year',
    date: '2026-06-07',
    time: '5:30 – 8:30 PM',
    title: 'End-of-Year Collective Dinner',
    location: 'Geisel Garden',
    pillar: 'Pulse',
    description:
      'A reflective evening to close out the year. Senior send-off, board transition, and a toast to everyone who redefined the grind with us.',
  },
];

/* Format an ISO date into a two-line month + day badge. */
function formatBadge(iso) {
  const d = new Date(iso + 'T00:00:00');
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleString('en-US', { weekday: 'long' }),
  };
}

export default function Events() {
  const [pillarKey, setPillarKey] = useState('All');
  const activePillar = PILLARS.find((p) => p.key === pillarKey) ?? PILLARS[0];

  const visible = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    const upcoming = EVENTS.filter((e) => e.date >= now).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    return pillarKey === 'All'
      ? upcoming
      : upcoming.filter((e) => e.pillar === pillarKey);
  }, [pillarKey]);

  return (
    <>
      <PageHeader
        eyebrow="What's coming up"
        title={
          <>
            Events &amp; <em className="italic">gatherings.</em>
          </>
        }
        lead="Everything we're hosting this quarter — filter by pillar, then add the calendar straight to your Google account."
      />

      <section className="warm-bg pb-28 pt-20 text-ink md:pb-40 md:pt-28">
        <div aria-hidden className="warm-grain" />
        <div className="warm-content mx-auto w-full max-w-7xl px-6 md:px-10">
          <PillarRow active={pillarKey} onSelect={setPillarKey} />

          <SubscribeBar pillar={activePillar} />

          {visible.length === 0 ? (
            <EmptyState label={activePillar.label} />
          ) : (
            <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
              {visible.map((event, i) => (
                <EventRow key={event.id} event={event} index={i} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

function PillarRow({ active, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PILLARS.map((p) => (
        <PillarChip
          key={p.key}
          pillar={p}
          active={active === p.key}
          onClick={() => onSelect(p.key)}
        />
      ))}
    </div>
  );
}

function PillarChip({ pillar, active, onClick }) {
  const hover = useHoverCursor();
  return (
    <button
      {...hover}
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${
        active
          ? 'border-ink bg-ink text-cream'
          : 'border-ink/20 text-ink/70 hover:border-ink/60 hover:text-ink'
      }`}
    >
      {pillar.label}
    </button>
  );
}

/**
 * SubscribeBar
 *
 * Sits below the filter chips. Left side explains the currently
 * selected pillar in a short sentence; right side is the subscribe
 * CTA. If the pillar has no URL yet, the CTA is a disabled
 * "coming soon" chip so the affordance still reads.
 */
function SubscribeBar({ pillar }) {
  const hover = useHoverCursor();
  const hasUrl = Boolean(pillar.gcalUrl);

  return (
    <motion.div
      key={pillar.key}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 flex flex-col items-start gap-5 border-y border-ink/10 py-6 md:flex-row md:items-center md:justify-between md:gap-8"
    >
      <div className="flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.45em] text-ink/50">
          {pillar.key === 'All' ? 'Subscribe to' : `${pillar.label} calendar`}
        </p>
        <p
          className="mt-2 font-serif italic text-ink/80"
          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.25rem)' }}
        >
          {pillar.blurb}
        </p>
      </div>

      {hasUrl ? (
        <a
          {...hover}
          href={pillar.gcalUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-cream shadow-lg shadow-ink/20 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <GCalIcon />
          <span className="relative z-10">Add to Google Calendar</span>
          <span
            aria-hidden
            className="relative z-10 grid h-5 w-5 place-items-center rounded-full bg-cream text-ink transition-transform duration-300 group-hover:translate-x-1"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </span>
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sunset-yellow/0 via-sunset-orange/80 to-sunset-coral/0 opacity-0 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-30"
          />
        </a>
      ) : (
        <span className="inline-flex items-center gap-3 rounded-full border border-dashed border-ink/25 px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-ink/45">
          <GCalIcon muted />
          Calendar coming soon
        </span>
      )}
    </motion.div>
  );
}

function GCalIcon({ muted }) {
  const stroke = muted ? 'currentColor' : '#F8F1E4';
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

function EventRow({ event, index }) {
  const hover = useHoverCursor();
  const badge = formatBadge(event.date);

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      {...hover}
      className="group grid grid-cols-[auto_1fr] gap-x-8 py-10 transition-colors md:grid-cols-[140px_1fr_auto] md:gap-x-12 md:py-14"
    >
      {/* Date badge */}
      <div className="flex flex-col items-start leading-none">
        <span
          className="font-serif italic text-ink/60"
          style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}
        >
          {badge.month}
        </span>
        <span
          className="mt-2 font-serif font-light text-ink"
          style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}
        >
          {badge.day}
        </span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-ink/50">
          {badge.weekday}
        </span>
      </div>

      {/* Title + meta + description */}
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink/50">{event.pillar}</p>
        <h3
          className="mt-3 font-serif font-light leading-[1.05] tracking-tightest text-ink transition-colors group-hover:text-sunset-orange"
          style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)' }}
        >
          {event.title}
        </h3>
        <p className="mt-3 font-sans text-sm text-ink/60 md:text-[0.95rem]">
          {event.time} &nbsp;·&nbsp; {event.location}
        </p>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ink/75">
          {event.description}
        </p>
      </div>

      {/* Arrow — desktop only; RSVP flow can hook in here later */}
      <div className="hidden items-center md:flex">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-full border border-ink/25 text-ink/60 transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-cream"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.li>
  );
}

function EmptyState({ label }) {
  return (
    <div className="mt-16 rounded-2xl border border-ink/10 bg-ink/[0.02] p-10 text-center md:p-16">
      <p className="font-serif italic text-ink/60" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
        Nothing on the calendar
        {label === 'All' ? '' : ` under ${label}`} just yet.
      </p>
      <p className="mt-4 text-sm text-ink/50">
        Follow us on Instagram to be the first to hear about new events.
      </p>
    </div>
  );
}
