import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader.jsx';
import { useHoverCursor } from '../components/CustomCursor.jsx';

/**
 * News
 *
 * Editable news feed. Each entry is a self-contained card — title, kicker,
 * date, and an excerpt. A `category` color-tags the card so the feed scans
 * quickly. Ordered by `date` (newest first at the top of the array).
 *
 * Long-form posts are deliberately out of scope for now. When the team
 * wants full articles, we'll add a /news/:slug route and a post layout.
 */
const ARTICLES = [
  {
    id: 'spring-board-2026',
    date: '2026-04-12',
    category: 'Announcement',
    title: 'Welcoming our 2026–2027 Executive Board.',
    excerpt:
      'Meet the eleven students carrying MEDWELL into its next chapter — new Backbone, new projects, same people-first philosophy.',
  },
  {
    id: 'hikes-with-healers-recap',
    date: '2026-04-05',
    category: 'Recap',
    title: 'Sunrise, summit, stethoscope: inside Hikes with Healers.',
    excerpt:
      'Forty-two members, three Scripps physicians, one very steep trail. A quick photo essay from our March trek at Cowles Mountain.',
  },
  {
    id: 'mind-journal-club',
    date: '2026-03-22',
    category: 'Feature',
    title: 'Why MIND started a journal club (and what happens when you read something besides a textbook).',
    excerpt:
      'Our mental-health subcommittee on picking the quarter\'s first book, the debate over whether Kalanithi counts as “assigned reading,” and the rules they wrote for themselves.',
  },
  {
    id: 'impact-clinic-partnership',
    date: '2026-03-08',
    category: 'Partnership',
    title: 'MEDWELL × Mountain View Family Clinic: a year of Saturday mornings.',
    excerpt:
      'How a one-off volunteer day became a standing partnership — and what our IMPACT members learned that no classroom covers.',
  },
];

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const categoryAccent = {
  Announcement: 'text-sunset-coral',
  Recap: 'text-sunset-orange',
  Feature: 'text-sunset-plum',
  Partnership: 'text-dusk-soft',
};

export default function News() {
  return (
    <>
      <PageHeader
        eyebrow="Dispatches"
        title={
          <>
            News &amp; <em className="italic">stories.</em>
          </>
        }
        lead="Announcements, recaps, and the quieter moments that make MEDWELL feel like a collective."
      />

      <section className="relative bg-cream pb-28 pt-20 text-ink md:pb-40 md:pt-28">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {ARTICLES.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ArticleCard({ article, index }) {
  const hover = useHoverCursor();
  const accent = categoryAccent[article.category] ?? 'text-ink/60';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      {...hover}
      className="group flex flex-col border-t border-ink/15 pt-8 md:pt-10"
    >
      <div className="flex items-center gap-4">
        <span className={`text-[10px] uppercase tracking-[0.4em] ${accent}`}>
          {article.category}
        </span>
        <span aria-hidden className="h-px flex-1 bg-ink/15" />
        <time className="text-[10px] uppercase tracking-[0.3em] text-ink/50">
          {formatDate(article.date)}
        </time>
      </div>

      <h3
        className="mt-6 font-serif font-light leading-[1.05] tracking-tightest text-ink transition-colors group-hover:text-sunset-orange"
        style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)' }}
      >
        {article.title}
      </h3>

      <p className="mt-5 font-sans text-base leading-relaxed text-ink/75">
        {article.excerpt}
      </p>

      <span
        aria-hidden
        className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-ink/60 transition-colors group-hover:text-ink"
      >
        Read
        <span className="inline-block h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
      </span>
    </motion.article>
  );
}
