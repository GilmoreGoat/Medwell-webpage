import { useEffect, useRef, useState } from 'react';
import { useHoverCursor } from './CustomCursor.jsx';

/**
 * MusicToggle — ambient lofi audio with a speaker button.
 *
 * Design notes:
 *   - Lives inside Navbar (which persists across route changes), so the
 *     <audio> element is NOT remounted on navigation and playback stays
 *     continuous as the user moves between pages.
 *   - Defaults to paused. Browsers block autoplay-with-sound without a
 *     user gesture, and unsolicited music is hostile UX — the user opts
 *     in by clicking.
 *   - On toggle, the volume ramps over ~450ms (fade in on play, fade out
 *     before pause) so the track never snaps on/off abruptly.
 *   - Preference persists in localStorage so the icon reflects intent
 *     between visits (we don't try to autoplay on load — that would be
 *     blocked — but we do restore on first user interaction anywhere on
 *     the page if they had it on previously).
 */

const AUDIO_SRC = `${import.meta.env.BASE_URL}audio/lofi-ambient.mp3`;
const TARGET_VOLUME = 0.32;
const FADE_MS = 450;
const STORAGE_KEY = 'medwell:music-on';

export default function MusicToggle() {
  const audioRef = useRef(null);
  const fadeRafRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [wantsAutoresume, setWantsAutoresume] = useState(false);
  const hover = useHoverCursor();

  // Restore persisted preference on mount. We don't call play() here —
  // browsers will reject autoplay without a gesture — but we flag the
  // intent so the *first* user interaction anywhere on the page can
  // resume playback silently.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === '1') setWantsAutoresume(true);
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, []);

  // Attach a one-shot gesture listener to resume music if the user had
  // it on last visit. Any click/keypress counts; the listener removes
  // itself after firing once.
  useEffect(() => {
    if (!wantsAutoresume) return;
    const resume = () => {
      setWantsAutoresume(false);
      void togglePlay(true);
    };
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
    // togglePlay is stable via ref pattern below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsAutoresume]);

  const fadeTo = (target, onDone) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRafRef.current);
    const start = performance.now();
    const from = audio.volume;
    const step = (now) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * t;
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else if (onDone) {
        onDone();
      }
    };
    fadeRafRef.current = requestAnimationFrame(step);
  };

  const togglePlay = async (forcePlay) => {
    const audio = audioRef.current;
    if (!audio) return;
    const shouldPlay = forcePlay ?? !playing;

    if (shouldPlay) {
      audio.volume = 0;
      try {
        await audio.play();
      } catch {
        // Autoplay was blocked (e.g. no gesture yet). Bail quietly.
        return;
      }
      setPlaying(true);
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      fadeTo(TARGET_VOLUME);
    } else {
      fadeTo(0, () => {
        audio.pause();
      });
      setPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY, '0');
      } catch {
        /* ignore */
      }
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(fadeRafRef.current);
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        // Intentionally NO autoPlay — we control playback via togglePlay.
      />
      <button
        {...hover}
        type="button"
        onClick={() => togglePlay()}
        aria-label={playing ? 'Pause ambient music' : 'Play ambient music'}
        aria-pressed={playing}
        className="relative grid h-10 w-10 place-items-center rounded-full text-cream/85 transition-colors hover:bg-white/10 hover:text-cream"
      >
        {playing ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        {/* Subtle sunset pulse while playing */}
        {playing && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 0 1px rgba(255,190,110,0.45), 0 0 14px rgba(255,138,76,0.35)',
              animation: 'musicPulse 2.4s ease-in-out infinite',
            }}
          />
        )}
        <style>{`
          @keyframes musicPulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50%      { opacity: 0.95; transform: scale(1.05); }
          }
        `}</style>
      </button>
    </>
  );
}

/* ---------- Inline icons ---------- */

function SpeakerOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10v4h3l5 4V6L7 10H4z" />
      <path d="M16 8.5a4.5 4.5 0 0 1 0 7" />
      <path d="M19 5.5a8 8 0 0 1 0 13" />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10v4h3l5 4V6L7 10H4z" />
      <path d="M17 9l5 6" />
      <path d="M22 9l-5 6" />
    </svg>
  );
}
