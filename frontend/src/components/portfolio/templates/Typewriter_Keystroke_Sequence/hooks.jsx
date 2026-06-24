import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

// ── Palette ───────────────────────────────────────────────────────────────────
export const C = {
  paperWhite:  '#F8F5EE',
  vintageCream:'#EFE7D2',
  paperDark:   '#E8E0CC',
  black:       '#1F1F1F',
  inkGray:     '#4A4A4A',
  warmBrown:   '#8B6B4E',
  deepRed:     '#9E2A2B',
  deepRedLight:'#C13B3C',
  amber:       '#B8860B',
  border:      '#C9B99A',
  borderDark:  '#A89070',
  marginLine:  '#D4B8A0',
};

// ── Core typewriter hook (immediate start) ───────────────────────────────────
export function useTypewriter(text = '', speed = 35, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setDisplayed('');
    setDone(false);
    let destroyed = false;
    const delay = setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (destroyed) { clearInterval(timer); return; }
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(timer); setDone(true); }
      }, speed);
    }, startDelay);
    return () => { destroyed = true; clearTimeout(delay); };
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
}

// ── Viewport-triggered typewriter ─────────────────────────────────────────────
export function useViewportTypewriter(text = '', speed = 28) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setDisplayed(''); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(t); setDone(true); }
    }, speed);
    return () => clearInterval(t);
  }, [inView, text, speed]);

  return { ref, displayed, done };
}
