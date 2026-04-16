import { motion } from 'framer-motion';

/**
 * FlameMark
 *
 * Inline SVG version of the flame so Framer Motion can animate `pathLength`
 * for the splash-screen "self-drawing" effect. The visual should match the
 * /assets/flame-logo.svg file used elsewhere.
 *
 * Props:
 *   - draw: when true, animates the stroke drawing itself in.
 *   - size: pixel width/height (keeps aspect via viewBox).
 */
export default function FlameMark({ draw = false, size = 160, className = '' }) {
  return (
    <svg
      viewBox="0 0 200 260"
      width={size}
      height={(size * 260) / 200}
      className={className}
      aria-label="MEDWELL flame"
    >
      <defs>
        <linearGradient id="fm-sunset" x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE7A8" />
          <stop offset="40%" stopColor="#FFB36A" />
          <stop offset="75%" stopColor="#FF7A6B" />
          <stop offset="100%" stopColor="#FF5C8A" />
        </linearGradient>
        <radialGradient id="fm-core" cx="0.5" cy="0.65" r="0.6">
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFB36A" stopOpacity="0" />
        </radialGradient>
        <filter id="fm-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Stroke traces the silhouette first (draw-in effect), then fill fades in. */}
      <motion.path
        d="M100 10
           C 120 50, 160 70, 150 120
           C 145 145, 115 150, 120 180
           C 123 200, 140 205, 140 225
           C 140 245, 115 255, 100 250
           C 85 255, 60 245, 60 225
           C 60 205, 77 200, 80 180
           C 85 150, 55 145, 50 120
           C 40 70, 80 50, 100 10 Z"
        fill="url(#fm-sunset)"
        stroke="url(#fm-sunset)"
        strokeWidth={2}
        strokeLinejoin="round"
        filter="url(#fm-glow)"
        initial={draw ? { pathLength: 0, fillOpacity: 0 } : false}
        animate={draw ? { pathLength: 1, fillOpacity: 1 } : false}
        transition={{
          pathLength: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
          fillOpacity: { delay: 0.8, duration: 0.9, ease: 'easeOut' },
        }}
      />

      <motion.ellipse
        cx={100}
        cy={170}
        rx={28}
        ry={48}
        fill="url(#fm-core)"
        initial={draw ? { opacity: 0 } : false}
        animate={draw ? { opacity: 1 } : false}
        transition={{ delay: 1.2, duration: 0.8 }}
      />
    </svg>
  );
}
