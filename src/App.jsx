import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen.jsx';
import Navbar from './components/Navbar.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import News from './pages/News.jsx';
import { CursorProvider, useCursor } from './context/CursorContext.jsx';

/**
 * Splash is shown for ~2.6s on first load.
 *
 * Routing: BrowserRouter with a basename from Vite's BASE_URL so the same
 * build works on localhost (`/`) and on GitHub Pages (`/Medwell-webpage/`).
 */
const SPLASH_MS = 2600;
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');

function SiteShell() {
  const [loading, setLoading] = useState(true);
  const { setIntensity } = useCursor();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // Scroll-linked cursor dim — fires on every page so the glow settles as
  // the user scrolls past the hero or page header.
  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight * 1.2;
      const ratio = Math.min(1, window.scrollY / max);
      setIntensity(1 - ratio * 0.65);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setIntensity]);

  return (
    <>
      <CustomCursor />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <Navbar />
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>

      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
    </>
  );
}

/**
 * Handles scroll position on navigation:
 *   - With a hash (e.g. `/#about`): scroll that anchor into view.
 *   - Without one: reset to the top, so subpage nav feels like a real page.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const hasHandledInitialLoad = useRef(false);

  useEffect(() => {
    if (!hasHandledInitialLoad.current) {
      hasHandledInitialLoad.current = true;
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (hash) {
      // Wait a tick for the target section to mount.
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <CursorProvider>
      <BrowserRouter basename={BASENAME}>
        <SiteShell />
      </BrowserRouter>
    </CursorProvider>
  );
}
