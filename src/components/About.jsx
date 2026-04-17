import { motion } from 'framer-motion';

/**
 * About
 *
 * Editorial "What is MEDWELL" section that follows the hero. Calm cream
 * background so the eye can rest after the sunset photograph. Copy is
 * distilled from the org's mission deck + Instagram bio — leading with a
 * conviction line, then the mission paragraph, closing on the tagline.
 */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export default function About() {
  return (
    <section id="about" className="relative bg-cream text-ink">
      {/* Subtle top gradient so the transition from the dark hero feels intentional. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/20 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15%' }}
          className="grid gap-16 md:grid-cols-12 md:gap-x-12"
        >
          {/* Eyebrow + heading — left column on desktop */}
          <div className="md:col-span-5">
            <motion.p
              variants={fadeUp}
              className="mb-6 text-[11px] uppercase tracking-[0.45em] text-ink/60"
            >
              <span className="mr-3 inline-block h-px w-8 translate-y-[-4px] bg-ink/40 align-middle" />
              What is MEDWELL
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="font-serif font-light leading-[0.95] tracking-tightest text-ink"
              style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)' }}
            >
              Better humans <br />
              make <em className="italic">better doctors.</em>
            </motion.h2>
          </div>

          {/* Body copy — right column */}
          <motion.div
            variants={fadeUp}
            className="space-y-6 font-sans text-base leading-relaxed text-ink/80 md:col-span-6 md:col-start-7 md:text-lg"
          >
            <p>
              MEDWELL is dedicated to redefining pre-medical culture by prioritizing
              wellness as the foundation for professional excellence. Through
              physical activity, mental health programming, mentorship, and
              community outreach, we foster a supportive environment that
              challenges the stigma that pre-med success requires burnout or
              competition.
            </p>
            <p>
              We emphasize action-based experiences that encourage balance,
              self-reflection, and meaningful connection — integrating wellness
              with service and professional development so our members approach
              medicine with empathy, sustainability, and a commitment to lifelong
              well-being.
            </p>
          </motion.div>
        </motion.div>

        {/* Pull-quote — the mission line, given breathing room. */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          viewport={{ once: true, margin: '-20%' }}
          className="mx-auto mt-24 max-w-4xl border-t border-ink/15 pt-16 text-center md:mt-32 md:pt-20"
        >
          <p
            className="font-serif font-light italic leading-[1.1] tracking-tightest text-ink/90"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            Becoming healthy people first,<br />
            healthy providers second.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-[0.45em] text-ink/50">
            MEDWELL · UC San Diego
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
