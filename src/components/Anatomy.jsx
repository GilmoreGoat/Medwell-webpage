import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useHoverCursor } from './CustomCursor.jsx';

/**
 * Anatomy
 *
 * Interactive pillar stage. One pillar is "active" at a time and gets a
 * full-panel gradient with its name, tier, and copy. A numbered list on the
 * left lets the user pick one directly; otherwise, the stage auto-rotates
 * every AUTO_MS with a progress bar showing the beat. Hovering the whole
 * stage pauses the rotation so the user can read at their own pace.
 *
 * A subtle parallax tilt responds to the mouse so the feature card feels
 * physical rather than flat. Crossfade is handled by AnimatePresence keyed
 * on the active pillar's id.
 */

const PILLARS = [
  {
    id: 'backbone',
    name: 'Backbone',
    tier: 'Executive Board',
    copy: 'The strategic backbone of MEDWELL — protecting the vision and ensuring every initiative aligns with our people-first philosophy. Balancing organizational excellence with empathetic leadership so our collective thrives without burnout.',
    gradient: 'linear-gradient(135deg, #E85D5D 0%, #E8705D 45%, #E89B6A 100%)',
    accent: '#FFD9B8',
    ink: 'cream',
  },
  {
    id: 'mind',
    name: 'Mind',
    tier: 'Subcommittee',
    copy: 'Your mind matters as much as your GPA. We host meditation circles, journal clubs, and professional panels to challenge the stigma of burnout and foster a supportive space for emotional growth and self-reflection.',
    gradient: 'linear-gradient(135deg, #E8805D 0%, #EC9868 50%, #F2B072 100%)',
    accent: '#FFE6C4',
    ink: 'cream',
  },
  {
    id: 'motion',
    name: 'Motion',
    tier: 'Subcommittee',
    copy: 'Redefining the "pre-med grind" by getting outside and moving. From Hikes with Healers to sunset yoga and gym sessions — we build physical resilience and prove that your health is your greatest asset.',
    gradient: 'linear-gradient(135deg, #F2B072 0%, #F3C27E 50%, #F5D58B 100%)',
    accent: '#1B1710',
    ink: 'ink',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    tier: 'General Members',
    copy: 'General members are the core of our community — choosing to redefine their pre-medical journey through active participation in wellness and service. Isolated students become a resilient collective, grounded in meaningful connection.',
    gradient: 'linear-gradient(135deg, #F5E8D2 0%, #F3DCC0 50%, #E8C9A8 100%)',
    accent: '#1B1710',
    ink: 'ink',
  },
  {
    id: 'impact',
    name: 'Impact',
    tier: 'Subcommittee',
    copy: 'Medicine is about people, not just textbooks. We focus on health equity and volunteerism, partnering with local and student organizations to give back — helping you find deeper meaning and connection within healthcare.',
    gradient: 'linear-gradient(135deg, #8B5BA8 0%, #7A5A9F 50%, #6B6BAE 100%)',
    accent: '#F8D7FF',
    ink: 'cream',
  },
  {
    id: 'voice',
    name: 'Voice',
    tier: 'Subcommittee',
    copy: 'The storytellers of the MEDWELL mission. Through aesthetic videography and sunset-inspired design, we curate a digital space that feels like a welcoming, inclusive home for every student seeking a healthier path to medicine.',
    gradient: 'linear-gradient(135deg, #6B7FB8 0%, #7C95CF 50%, #9FB4DC 100%)',
    accent: '#E8F0FF',
    ink: 'cream',
  },
];

const AUTO_MS = 7000;

export default function Anatomy() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = PILLARS[activeIndex];

  // Tick — resets when activeIndex changes or pause toggles. `tick` is 0..1
  // and feeds the progress bar. Once it reaches 1, advance to the next
  // pillar.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    setTick(0);
    const start = performance.now();
    let raf;
    const loop = (now) => {
      const pct = Math.min(1, (now - start) / AUTO_MS);
      setTick(pct);
      if (pct < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setActiveIndex((i) => (i + 1) % PILLARS.length);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [activeIndex, paused]);

  const handleSelect = (i) => {
    setActiveIndex(i);
  };

  return (
    <section id="anatomy" className="warm-bg text-ink">
      <div aria-hidden className="warm-grain" />

      <div className="warm-content mx-auto w-full max-w-7xl px-6 pb-28 pt-20 md:px-10 md:pb-40 md:pt-28">
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

        {/* Stage */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="grid gap-8 md:grid-cols-12 md:gap-10"
        >
          {/* Left: numbered pillar list */}
          <div className="md:col-span-4">
            <ol className="space-y-1">
              {PILLARS.map((p, i) => (
                <PillarButton
                  key={p.id}
                  pillar={p}
                  index={i}
                  active={i === activeIndex}
                  onClick={() => handleSelect(i)}
                />
              ))}
            </ol>
          </div>

          {/* Right: feature panel */}
          <div className="md:col-span-8">
            <FeaturePanel active={active} activeIndex={activeIndex} tick={tick} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PillarButton({ pillar, index, active, onClick }) {
  const hover = useHoverCursor();
  const num = String(index + 1).padStart(2, '0');

  return (
    <li>
      <button
        {...hover}
        onClick={onClick}
        aria-pressed={active}
        className={`group flex w-full items-center gap-5 border-t border-ink/15 py-5 text-left transition-colors ${
          active ? 'text-ink' : 'text-ink/50 hover:text-ink/80'
        }`}
      >
        <span className={`font-serif italic tabular-nums transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}>
          {num}
        </span>

        <span
          className="font-serif leading-none tracking-tightest"
          style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.25rem)' }}
        >
          {pillar.name}
        </span>

        <motion.span
          aria-hidden
          className="ml-auto h-px bg-ink/70"
          initial={false}
          animate={{ width: active ? 48 : 12, opacity: active ? 1 : 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </button>
    </li>
  );
}

function FeaturePanel({ active, activeIndex, tick }) {
  // Parallax tilt — mouse position converted to spring-damped rotation.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-6, 6]), { stiffness: 120, damping: 18 });
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(x);
    my.set(y);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const textColor = active.ink === 'cream' ? 'text-cream' : 'text-ink';
  const textMuted = active.ink === 'cream' ? 'text-cream/75' : 'text-ink/65';

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-ink/15 md:aspect-[5/4] lg:aspect-[6/5]"
    >
      {/* Gradient layers — AnimatePresence crossfades between pillars. */}
      <AnimatePresence mode="sync">
        <motion.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
          style={{ background: active.gradient }}
        />
      </AnimatePresence>

      {/* Soft inner highlight — animated shimmer gives the panel life. */}
      <div
        aria-hidden
        className="pillar-shimmer pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 25% 10%, rgba(255,255,255,0.35), transparent 55%)',
        }}
      />

      {/* Secondary accent glow — keyed to pillar color. */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`accent-${active.id}`}
          aria-hidden
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 rounded-full blur-3xl"
          style={{ background: active.accent }}
        />
      </AnimatePresence>

      {/* Content */}
      <div className={`relative flex h-full flex-col justify-between p-8 md:p-12 ${textColor}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] uppercase tracking-[0.42em] ${textMuted}`}>
                MEDWELL · {active.tier}
              </span>
              <span aria-hidden className={`text-[10px] tabular-nums tracking-[0.3em] ${textMuted}`}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(PILLARS.length).padStart(2, '0')}
              </span>
            </div>

            <h3
              className="mt-8 font-serif italic leading-none tracking-tightest"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
            >
              {active.name}
            </h3>
          </motion.div>
        </AnimatePresence>

        <div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`copy-${active.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              className={`mt-10 max-w-xl font-sans text-sm leading-relaxed md:text-base ${
                active.ink === 'cream' ? 'text-cream/90' : 'text-ink/80'
              }`}
            >
              {active.copy}
            </motion.p>
          </AnimatePresence>

          {/* Progress bar */}
          <div className={`mt-10 h-px w-full overflow-hidden ${active.ink === 'cream' ? 'bg-cream/25' : 'bg-ink/20'}`}>
            <div
              className={`h-full transition-[width] duration-75 ${
                active.ink === 'cream' ? 'bg-cream' : 'bg-ink'
              }`}
              style={{ width: `${tick * 100}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
