import React, { useState, useCallback, useRef, useEffect } from 'react';
import data from '../../../../data/dummy_data.json';
import PortfolioContent from './PortfolioContent';
import { GripVertical, Sun, Moon } from 'lucide-react';

/**
 * Split Personality Portfolio Template
 * Category: Interactive / Experimental
 *
 * Architecture:
 * - DESKTOP: Two full-width layers with a draggable clip-path slider
 * - MOBILE:  Single layer with a floating toggle button to switch themes
 */
export default function SplitPersonality() {
  const [splitPos, setSplitPos] = useState(50);
  const [mobileTheme, setMobileTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  /* ───── detect mobile ───── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ───── pointer handlers (desktop only) ───── */
  const handlePointerDown = useCallback((e) => {
    isDragging.current = true;
    e.target.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPos(Math.min(95, Math.max(5, x)));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /* Keyboard accessibility for the slider */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      setSplitPos((p) => Math.max(5, p - 2));
    } else if (e.key === 'ArrowRight') {
      setSplitPos((p) => Math.min(95, p + 2));
    }
  }, []);

  /* Sync scroll between the two layers */
  const lightRef = useRef(null);
  const darkRef = useRef(null);

  const onScroll = useCallback((e) => {
    const source = e.target;
    const target = source === lightRef.current ? darkRef.current : lightRef.current;
    if (target && target.scrollTop !== source.scrollTop) {
      target.scrollTop = source.scrollTop;
    }
  }, []);

  /* Prevent scroll-jank during drag */
  useEffect(() => {
    const handleGlobalUp = () => { isDragging.current = false; };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, []);

  /* ═══════════════════════════════════════════════
     MOBILE: Single layer + toggle button
     ═══════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <PortfolioContent data={data} theme={mobileTheme} />
        </div>

        {/* Floating toggle button */}
        <button
          onClick={() => setMobileTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] active:scale-95 transition-all"
          aria-label="Toggle theme personality"
        >
          {mobileTheme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white tracking-wider uppercase">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-gray-800 tracking-wider uppercase">Dark</span>
            </>
          )}
        </button>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     DESKTOP: Dual layer + draggable slider
     ═══════════════════════════════════════════════ */
  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ touchAction: isDragging.current ? 'none' : 'auto' }}
    >
      {/* ─── LIGHT LAYER (base) ─── */}
      <div
        ref={lightRef}
        onScroll={onScroll}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{ zIndex: 1 }}
      >
        <PortfolioContent data={data} theme="light" />
      </div>

      {/* ─── DARK LAYER (clipped overlay) ─── */}
      <div
        ref={darkRef}
        onScroll={onScroll}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          zIndex: 2,
          clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)`,
          willChange: 'clip-path',
        }}
      >
        <PortfolioContent data={data} theme="dark" />
      </div>

      {/* ─── DRAG HANDLE ─── */}
      <div
        className="absolute top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ left: `${splitPos}%`, transform: 'translateX(-50%)', zIndex: 10 }}
      >
        {/* Pulsing laser line */}
        <div className="absolute inset-y-0 w-[2px]">
          <div className="w-full h-full bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-indigo-500 opacity-80" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-cyan-400 via-fuchsia-500 to-indigo-500 blur-[6px] opacity-60 animate-pulse" />
        </div>

        {/* Frosted glass grip */}
        <div
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="slider"
          aria-label="Drag to adjust the split between dark and light modes"
          aria-valuenow={Math.round(splitPos)}
          aria-valuemin={5}
          aria-valuemax={95}
          className="relative pointer-events-auto cursor-col-resize w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center transition-all duration-200 hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95"
        >
          <GripVertical className="w-5 h-5 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]" />
        </div>

        {/* Labels */}
        <div className="absolute top-6 flex w-48 justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 -translate-x-full pr-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900/60 backdrop-blur-md border border-cyan-500/30">
              <Moon className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">Dark</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 translate-x-full pl-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 backdrop-blur-md border border-indigo-200">
              <Sun className="w-3 h-3 text-indigo-500" />
              <span className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase">Light</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
