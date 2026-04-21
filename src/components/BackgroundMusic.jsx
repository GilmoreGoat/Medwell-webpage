import { useEffect, useRef, useState } from 'react';
import trackUrl from '../assets/lofi-ambient.mp3';

const VOLUME = 0.22;

/**
 * Ambient loop using the bundled MP3 from `src/assets/lofi-ambient.mp3`.
 * Browsers usually block autoplay with sound until a gesture — we try on
 * mount, then retry on the first pointer or key event.
 */
export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.src = trackUrl;
    el.loop = true;
    el.volume = VOLUME;
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const tryPlay = () => el.play().catch(() => {});

    void tryPlay();

    const unlock = () => {
      void tryPlay();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} preload="auto" playsInline aria-hidden />

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-pressed={!muted}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
        className="fixed bottom-5 right-5 z-[900] flex h-10 items-center gap-2 rounded-full border border-cream/15 bg-dusk-deep/90 px-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/90 shadow-lg shadow-ink/30 backdrop-blur-md transition-colors hover:border-cream/25 hover:bg-dusk-deep md:bottom-6 md:right-6"
      >
        <span className="grid h-5 w-5 place-items-center text-cream" aria-hidden>
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M22 9l-6 6M16 9l6 6" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
            </svg>
          )}
        </span>
        <span className="hidden sm:inline">{muted ? 'Sound' : 'Mute'}</span>
      </button>
    </>
  );
}
