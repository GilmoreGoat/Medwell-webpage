import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * CursorContext
 *
 * Central state for the custom sunset cursor. Two things are tracked:
 *   1. `hover` — a boolean toggled by interactive elements (nav links, CTAs).
 *   2. `intensity` — a 0..1 float representing cursor brightness/glow.
 *
 * The hero sets intensity to 1 (full midday/sunset orange). Later pages can
 * lower `intensity` based on window.scrollY to make the cursor "dim" as the
 * user scrolls into cooler/darker sections. Consumers only need to call
 * `setIntensity(value)` — the CustomCursor component reads it live.
 */
const CursorContext = createContext(null);

export function CursorProvider({ children }) {
  const [hover, setHover] = useState(false);
  const [intensity, setIntensity] = useState(1);

  // Expose intensity as a CSS variable so non-React CSS (glows, filters)
  // can also react to scroll-based dimming later on.
  useEffect(() => {
    document.documentElement.style.setProperty('--cursor-glow', String(intensity));
  }, [intensity]);

  const value = useMemo(
    () => ({ hover, setHover, intensity, setIntensity }),
    [hover, intensity]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursor must be used inside <CursorProvider>');
  return ctx;
}
