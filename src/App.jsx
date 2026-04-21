import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen.jsx';
import Navbar from './components/Navbar.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import Sol from './components/chatbot/Sol.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import News from './pages/News.jsx';
import Team from './pages/Team.jsx';
import { CursorProvider, useCursor } from './context/CursorContext.jsx';

/**
 * Splash is shown for ~2.6s on first load.
 *
 * Routing: BrowserRouter with a basename from Vite's BASE_URL so the same
 * build works on localhost (`/`) and on GitHub Pages (`/Medwell-webpage/`).
 */
const SPLASH_MS = 2600;
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Place this file in `public/` (same name as your download). */
const BACKGROUND_MUSIC_FILE = 'lofi_music_library-chill-lofi-ambient-lofi-music-457259.mp3';

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
      <BackgroundMusic />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <Navbar />
        <ScrollManager />
        <AnimatedRoutes />
        <Sol />
      </motion.main>

      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
    </>
  );
}

function BackgroundMusic() {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    audio.volume = 0.35;
    audio.loop = true;

    const attemptPlay = () => {
      if (!enabled) {
        return;
      }
      audio.play().catch(() => {
        // Browsers can block autoplay until the first user interaction.
      });
    };

    attemptPlay();
    window.addEventListener('pointerdown', attemptPlay, { once: true });

    return () => {
      window.removeEventListener('pointerdown', attemptPlay);
    };
  }, [enabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (enabled) {
      audio.play().catch(() => {
        // Ignore autoplay restriction errors.
      });
      return;
    }
    audio.pause();
  }, [enabled]);

  return (
    <>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}${BACKGROUND_MUSIC_FILE}`}
        preload="auto"
      />
      <button
        type="button"
        onClick={() => setEnabled((current) => !current)}
        aria-label={enabled ? 'Mute background music' : 'Play background music'}
        className="fixed bottom-5 right-5 z-50 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-xs font-medium uppercase tracking-wide text-white backdrop-blur transition hover:bg-black/65"
      >
        {enabled ? 'Music: On' : 'Music: Off'}
      </button>
    </>
  );
}

/**
 * AnimatedRoutes
 *
 * Keying the motion wrapper on pathname remounts it on every nav, so each
 * page fades up from its initial state. We skip AnimatePresence/exit on
 * purpose — under React StrictMode + router v7 the exit phase stalls and
 * pins the outgoing page on screen. ScrollManager's 400ms delay on the
 * scroll reset is replaced by an immediate reset since there's no old
 * page to protect anymore.
 */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<News />} />
        <Route path="/team" element={<Team />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}

/**
 * Handles scroll position on navigation:
 *   - With a hash (e.g. `/#about`): scroll that anchor into view.
 *   - Without one: reset to the top, so subpage nav feels like a real page.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
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
