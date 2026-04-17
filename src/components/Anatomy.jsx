import { motion } from 'framer-motion';

/**
 * Anatomy
 *
 * "MEDWELL's Anatomy" — a 6-card grid explaining how the collective is
 * structured. Colors sweep through the sunset palette (coral → amber → cream
 * → plum → dusk) so the section reads as a visual continuation of the hero.
 *
 * Data-driven so copy edits live in one place. Each pillar specifies its own
 * gradient + ink/cream text color to keep contrast legible across the sweep.
 */
const PILLARS = [
  {
    name: 'Backbone',
    tier: 'Executive Board',
    copy: 'The strategic backbone of MEDWELL — protecting the vision and ensuring every initiative aligns with our people-first philosophy. Balancing organizational excellence with empathetic leadership so our collective thrives without burnout.',
    bg: 'bg-gradient-to-br from-[#E85D5D] via-[#E8705D] to-[#E89B6A]',
    text: 'text-cream',
  },
  {
    name: 'Mind',
    tier: 'Subcommittee',
    copy: 'Your mind matters as much as your GPA. We host meditation circles, journal clubs, and professional panels to challenge the stigma of burnout and foster a supportive space for emotional growth and self-reflection.',
    bg: 'bg-gradient-to-br from-[#E8805D] via-[#EC9868] to-[#F2B072]',
    text: 'text-cream',
  },
  {
    name: 'Motion',
    tier: 'Subcommittee',
    copy: 'Redefining the “pre-med grind” by getting outside and moving. From Hikes with Healers to sunset yoga and gym sessions — we build physical resilience and prove that your health is your greatest asset.',
    bg: 'bg-gradient-to-br from-[#F2B072] via-[#F3C27E] to-[#F5D58B]',
    text: 'text-ink',
  },
  {
    name: 'Pulse',
    tier: 'General Members',
    copy: 'General members are the core of our community — choosing to redefine their pre-medical journey through active participation in wellness and service. Isolated students become a resilient collective, grounded in meaningful connection.',
    bg: 'bg-gradient-to-br from-[#F5E8D2] via-[#F3DCC0] to-[#E8C9A8]',
    text: 'text-ink',
  },
  {
    name: 'Impact',
    tier: 'Subcommittee',
    copy: 'Medicine is about people, not just textbooks. We focus on health equity and volunteerism, partnering with local and student organizations to give back — helping you find deeper meaning and connection within healthcare.',
    bg: 'bg-gradient-to-br from-[#8B5BA8] via-[#7A5A9F] to-[#6B6BAE]',
    text: 'text-cream',
  },
  {
    name: 'Voice',
    tier: 'Subcommittee',
    copy: 'The storytellers of the MEDWELL mission. Through aesthetic videography and sunset-inspired design, we curate a digital space that feels like a welcoming, inclusive home for every student seeking a healthier path to medicine.',
    bg: 'bg-gradient-to-br from-[#6B7FB8] via-[#7C95CF] to-[#9FB4DC]',
    text: 'text-cream',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Anatomy() {
  return (
    <section id="anatomy" className="relative bg-cream pb-28 md:pb-40">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl md:mb-20"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.45em] text-ink/60">
            <span className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-ink/40 align-middle" />
            How we're built
          </p>
          <h2
            className="font-serif font-light leading-[0.95] tracking-tightest text-ink"
            style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)' }}
          >
            MEDWELL's <em className="italic">Anatomy.</em>
          </h2>
          <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-ink/70 md:text-lg">
            Six parts, one collective. Every pillar carries a different piece of
            the mission — together, they keep MEDWELL whole.
          </p>
        </motion.div>

        {/* Pillar grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <motion.article
              key={pillar.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10%' }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 shadow-lg shadow-ink/5 md:p-10 ${pillar.bg} ${pillar.text}`}
            >
              {/* Subtle inner highlight for a glassy sunset finish */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.25),transparent_55%)]"
              />

              <div className="relative">
                <p className={`text-[10px] uppercase tracking-[0.4em] ${pillar.text === 'text-cream' ? 'text-cream/75' : 'text-ink/55'}`}>
                  MEDWELL · {pillar.tier}
                </p>
                <h3
                  className="mt-6 font-serif italic leading-none tracking-tightest"
                  style={{ fontSize: 'clamp(2.75rem, 4.2vw, 3.75rem)' }}
                >
                  {pillar.name}
                </h3>
              </div>

              <p
                className={`relative mt-10 font-sans text-sm leading-relaxed md:text-[0.95rem] ${pillar.text === 'text-cream' ? 'text-cream/90' : 'text-ink/80'}`}
              >
                {pillar.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
