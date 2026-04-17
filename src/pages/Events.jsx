import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader.jsx';
import { useHoverCursor } from '../components/CustomCursor.jsx';

/**
 * Events
 *
 * Editable event feed. Drop new items into EVENTS — keep them in order.
 * `date` should be ISO (YYYY-MM-DD) so sorting + formatting stays stable.
 * `type` must match one of FILTERS so the chip count works.
 *
 * When the user has real events, replace these placeholders — the layout
 * and formatting are data-driven so no component edits are needed.
 */
const EVENTS = [
  {
    id: 'spring-mixer',
    date: '2026-04-24',
    time: '6:00 – 8:00 PM',
    title: 'Spring Sunset Mixer',
    location: 'La Jolla Shores',
    type: 'Social',
    description:
      'Meet the board, the subcommittees, and your future study partners over golden-hour snacks on the sand. Come as you are.',
  },
  {
    id: 'hikes-with-healers-4',
    date: '2026-05-03',
    time: '7:30 – 10:00 AM',
    title: 'Hikes with Healers: Torrey Pines',
    location: 'Torrey Pines State Reserve',
    type: 'Motion',
    description:
      'A guided hike with three UCSD-affiliated physicians. Candid career Q&A on the trail — no slides, no polish, just conversation.',
  },
  {
    id: 'gbm-may',
    date: '2026-05-14',
    time: '6:30 – 7:45 PM',
    title: 'General Body Meeting · Burnout Panel',
    location: 'Price Center West · Forum',
    type: 'GBM',
    description:
      'Med students, residents, and attendings on how they stayed themselves through the long road. Meditation open at 6:15 PM.',
  },
  {
    id: 'impact-clinic-day',
    date: '2026-05-21',
    time: '9:00 AM – 2:00 PM',
    title: 'Impact · Free Clinic Volunteer Day',
    location: 'Mountain View Family Clinic',
    type: 'Service',
    description:
      'Intake support, translation help, and patient companionship. Spanish bilingual volunteers especially welcome.',
  },
  {
    id: 'sunset-yoga',
    date: '2026-05-28',
    time: '6:45 – 7:45 PM',
    title: 'Sunset Yoga on RIMAC Field',
    location: 'RIMAC Field',
    type: 'Motion',
    description:
      'All levels. Mats provided for the first 30 RSVPs. Stick around after for journaling prompts with MIND.',
  },
  {
    id: 'end-of-year',
    date: '2026-06-07',
    time: '5:30 – 8:30 PM',
    title: 'End-of-Year Collective Dinner',
    location: 'Geisel Garden',
    type: 'Social',
    description:
      'A reflective evening to close out the year. Senior send-off, board transition, and a toast to everyone who redefined the grind with us.',
  },
];

const FILTERS = ['All', 'GBM', 'Motion', 'Social', 'Service'];

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
  const [filter, setFilter] = useState('All');

  const visible = useMemo(() => {
    const now = new Date().toISOString().slice(0, 10);
    const upcoming = EVENTS.filter((e) => e.date >= now).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    return filter === 'All' ? upcoming : upcoming.filter((e) => e.type === filter);
  }, [filter]);

  return (
    <>
      <PageHeader
        eyebrow="What's coming up"
        title={
          <>
            Events &amp; <em className="italic">gatherings.</em>
          </>
        }
        lead="Everything we're hosting this quarter — mixers, movement, service, and the conversations that keep us grounded."
      />

      <section className="relative bg-cream pb-28 pt-20 text-ink md:pb-40 md:pt-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <FilterRow filter={filter} setFilter={setFilter} />

          {visible.length === 0 ? (
            <EmptyState filter={filter} />
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

function FilterRow({ filter, setFilter }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTERS.map((name) => (
        <FilterChip
          key={name}
          name={name}
          active={filter === name}
          onClick={() => setFilter(name)}
        />
      ))}
    </div>
  );
}

function FilterChip({ name, active, onClick }) {
  const hover = useHoverCursor();
  return (
    <button
      {...hover}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${
        active
          ? 'border-ink bg-ink text-cream'
          : 'border-ink/20 text-ink/70 hover:border-ink/60 hover:text-ink'
      }`}
    >
      {name}
    </button>
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
        <span className="font-serif italic text-ink/60" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}>
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
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink/50">{event.type}</p>
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

function EmptyState({ filter }) {
  return (
    <div className="mt-16 rounded-2xl border border-ink/10 bg-ink/[0.02] p-10 text-center md:p-16">
      <p className="font-serif italic text-ink/60" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
        Nothing on the calendar
        {filter === 'All' ? '' : ` under ${filter}`} just yet.
      </p>
      <p className="mt-4 text-sm text-ink/50">
        Follow us on Instagram to be the first to hear about new events.
      </p>
    </div>
  );
}
