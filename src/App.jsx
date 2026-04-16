import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import { CursorProvider, useCursor } from './context/CursorContext.jsx';

/**
 * Splash is shown for ~2.6s so the flame has time to:
 *   - fade/draw in (~1.2s)
 *   - linger briefly
 *   - scale up + fade out, while the dusk panel wipes upward (~0.9s)
 */
const SPLASH_MS = 2600;

function SiteShell() {
  const [loading, setLoading] = useState(true);
  const { setIntensity } = useCursor();

  // Dismiss the splash after the fixed window. Using a timeout (rather than
  // font/asset gating) keeps the sequence predictable and on-brand.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // ---- Scroll-linked cursor intensity (scaffolded for future sections) ----
  // Currently the hero is the only section, so scrollY stays near 0 and the
  // cursor is bright. When more sections are added, `intensity` will smoothly
  // dim from 1 → 0.35 as the user scrolls past the first viewport.
  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight * 1.2;
      const ratio = Math.min(1, window.scrollY / max);
      // Remap so we never fully kill the glow — min floor ~0.35.
      setIntensity(1 - ratio * 0.65);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setIntensity]);

  return (
    <>
      {/* Custom cursor lives at root so it floats above every layer. */}
      <CustomCursor />

      {/* Nav + Hero render beneath the loader; they animate in after splash. */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <Navbar />
        <Hero />
      </motion.main>

      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <CursorProvider>
      <SiteShell />
    </CursorProvider>
  );
}
