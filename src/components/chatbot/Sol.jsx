import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHoverCursor } from '../CustomCursor.jsx';
import { respond, SOL_INTRO, STARTER_CHIPS } from './engine.js';

/**
 * Sol — the floating chatbot launcher + slide-up panel.
 *
 * Mounted once at the App shell level so it persists across route
 * changes. Rule-based engine lives in ./engine.js; this file is pure
 * UI + glue.
 *
 * Why a floating pill instead of a permanent sidebar: the site is a
 * portfolio-style marketing page, not an app — a FAB stays out of the
 * way but makes Sol available from every section.
 */
export default function Sol() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      from: 'sol',
      text: SOL_INTRO,
      actions: STARTER_CHIPS.map((c) => ({ label: c.label, payload: c.payload })),
    },
  ]);
  const [input, setInput] = useState('');

  const launcherHover = useHoverCursor();
  const closeHover = useHoverCursor();
  const sendHover = useHoverCursor();

  const navigate = useNavigate();
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Autoscroll the transcript when a new message lands.
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  // Focus the input the moment the panel opens.
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // Auto-grow the textarea vertically as the user types. Caps at ~5 lines
  // so the composer never swallows the transcript, but anything beyond
  // that scrolls internally instead of running off-screen horizontally.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [input, open]);

  // Escape closes the panel from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function goTo(nav) {
    if (!nav) return;
    if (nav.external) {
      const target = nav.to.startsWith('mailto:') ? '_self' : '_blank';
      window.open(nav.to, target, 'noopener,noreferrer');
      return;
    }
    navigate(nav.to);
  }

  function send(rawText) {
    const text = (rawText || '').trim();
    if (!text) return;
    const reply = respond(text);
    setMessages((m) => [...m, { from: 'user', text }, { from: 'sol', ...reply }]);
    setInput('');
    if (reply.nav) goTo(reply.nav);
  }

  function actionClick(action) {
    if (action.payload) {
      send(action.payload);
      return;
    }
    if (action.nav) {
      setMessages((m) => [
        ...m,
        { from: 'user', text: action.label },
        { from: 'sol', text: `Taking you to ${action.nav.label}.` },
      ]);
      goTo(action.nav);
    }
  }

  return (
    <>
      {/* ---- Launcher FAB ---- */}
      <motion.button
        {...launcherHover}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Sol' : 'Chat with Sol'}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 left-5 z-[1000] grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sunset-yellow via-sunset-orange to-sunset-coral text-ink shadow-[0_14px_40px_-10px_rgba(255,138,76,0.75)] md:bottom-6 md:left-6 md:h-14 md:w-14"
      >
        <span className="relative z-10">
          <SolMark size={open ? 18 : 22} />
        </span>
        {/* Slow breathing halo so Sol feels warm, not alarming */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            animation: 'sol-pulse 3.2s ease-in-out infinite',
            background: 'radial-gradient(circle, rgba(255,190,110,0.35) 0%, transparent 70%)',
          }}
        />
      </motion.button>

      {/* ---- Panel ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sol-panel"
            role="dialog"
            aria-label="Sol — MEDWELL guide"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="fixed bottom-24 left-5 z-[999] flex h-[560px] max-h-[82vh] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-cream/10 bg-dusk-deep/95 text-cream shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl md:bottom-24 md:left-6"
          >
            {/* Soft warm glow bleeding into the header corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
              style={{
                background:
                  'radial-gradient(ellipse at 15% 0%, rgba(255,138,76,0.4) 0%, rgba(107,75,138,0.15) 45%, transparent 75%)',
              }}
            />

            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-cream/10 px-5 py-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sunset-yellow to-sunset-coral text-ink shadow-inner">
                <SolMark size={22} />
              </div>
              <div className="flex-1 leading-tight">
                <p className="font-serif text-lg">Sol</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cream/55">
                  MEDWELL guide
                </p>
              </div>
              <button
                {...closeHover}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="relative grid h-8 w-8 place-items-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>

            {/* Transcript */}
            <div
              ref={listRef}
              className="relative flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5"
            >
              {messages.map((m, i) => (
                <Message key={i} msg={m} onAction={actionClick} />
              ))}
            </div>

            {/* Composer — textarea auto-grows vertically (cap ~140px) so
                long messages wrap cleanly instead of scrolling off the
                right edge. Enter sends; Shift+Enter inserts a newline. */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative flex items-end gap-2 border-t border-cream/10 bg-dusk-deep/70 px-3 py-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask Sol anything…"
                aria-label="Message Sol"
                className="flex-1 resize-none rounded-2xl bg-cream/5 px-4 py-2 text-sm leading-relaxed text-cream placeholder:text-cream/45 focus:bg-cream/10 focus:outline-none"
                style={{ maxHeight: '140px', overflowY: 'auto' }}
              />
              <button
                {...sendHover}
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-br from-sunset-yellow to-sunset-coral text-ink transition-transform duration-200 enabled:hover:-translate-y-0.5 disabled:opacity-40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Message({ msg, onAction }) {
  const fromUser = msg.from === 'user';
  return (
    <div className={`flex items-end gap-2 ${fromUser ? 'justify-end' : 'justify-start'}`}>
      {!fromUser && (
        <div
          className="grid h-7 w-7 flex-none place-items-center rounded-full bg-gradient-to-br from-sunset-yellow to-sunset-coral text-ink"
          aria-hidden
        >
          <SolMark size={16} />
        </div>
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          fromUser
            ? 'rounded-br-sm bg-cream text-ink'
            : 'rounded-bl-sm bg-cream/10 text-cream'
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.text}</p>
        {!fromUser && msg.actions?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {msg.actions.map((a, i) => (
              <ChipButton key={i} onClick={() => onAction(a)}>
                {a.label}
              </ChipButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChipButton({ children, onClick }) {
  const hover = useHoverCursor();
  return (
    <button
      {...hover}
      type="button"
      onClick={onClick}
      className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-cream/85 transition-colors hover:border-cream/45 hover:bg-cream/15 hover:text-cream"
    >
      {children}
    </button>
  );
}

/**
 * SolMark — the sun-with-heartbeat logo.
 *
 * A filled disc surrounded by seven short rays plus one "ray" that
 * unrolls into a miniature ECG waveform on the left. That waveform is
 * what makes Sol MEDWELL-specific rather than just a generic sun icon.
 * Stroke uses currentColor so it picks up whatever ink/cream context
 * the component is dropped into.
 */
export function SolMark({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="16" cy="16" r="4.2" fill="currentColor" stroke="none" />
      {/* Seven short rays (all except the left horizontal one) */}
      <line x1="16" y1="3.5" x2="16" y2="6.5" />
      <line x1="16" y1="25.5" x2="16" y2="28.5" />
      <line x1="25.5" y1="16" x2="28.5" y2="16" />
      <line x1="24" y1="8" x2="26.2" y2="5.8" />
      <line x1="8" y1="24" x2="5.8" y2="26.2" />
      <line x1="24" y1="24" x2="26.2" y2="26.2" />
      <line x1="8" y1="8" x2="5.8" y2="5.8" />
      {/* Left ray → ECG pulse */}
      <path d="M3 16 H6.2 L7 14.2 L8.2 18.2 L9.1 13.4 L10 17.5 H11.5" />
    </svg>
  );
}
