import React, { createContext, useContext, useState } from 'react';
import data from '../../../../data/dummy_data.json';

// ─── Terminal Color Themes ────────────────────────────────────────────────────
export const TERMINAL_THEMES = {
  green: {
    id: 'green',
    label: 'Matrix',
    dot: '#22c55e',
    primary: '#22c55e',       // green-500  — main text / accents
    primaryDim: '#16a34a',    // green-600  — dim text
    primaryBright: '#86efac', // green-300  — highlights
    primaryGlow: 'rgba(34,197,94,0.25)',
    primaryDeep: '#14532d',   // scrollbar track
    border: '#166534',        // green-800
    scanline: 'rgba(34,197,94,0.6)',
    scrollThumb: '#14532d',
    scrollThumbHover: '#16a34a',
    selection: 'rgba(34,197,94,0.25)',
    selectionText: '#86efac',
    navBorder: '#14532d',
  },
  amber: {
    id: 'amber',
    label: 'Amber',
    dot: '#f59e0b',
    primary: '#f59e0b',
    primaryDim: '#d97706',
    primaryBright: '#fcd34d',
    primaryGlow: 'rgba(245,158,11,0.25)',
    primaryDeep: '#451a03',
    border: '#92400e',
    scanline: 'rgba(245,158,11,0.6)',
    scrollThumb: '#451a03',
    scrollThumbHover: '#d97706',
    selection: 'rgba(245,158,11,0.25)',
    selectionText: '#fcd34d',
    navBorder: '#451a03',
  },
  cyan: {
    id: 'cyan',
    label: 'Cyan',
    dot: '#06b6d4',
    primary: '#06b6d4',
    primaryDim: '#0891b2',
    primaryBright: '#67e8f9',
    primaryGlow: 'rgba(6,182,212,0.25)',
    primaryDeep: '#083344',
    border: '#155e75',
    scanline: 'rgba(6,182,212,0.6)',
    scrollThumb: '#083344',
    scrollThumbHover: '#0891b2',
    selection: 'rgba(6,182,212,0.25)',
    selectionText: '#67e8f9',
    navBorder: '#083344',
  },
  red: {
    id: 'red',
    label: 'Red Alert',
    dot: '#ef4444',
    primary: '#ef4444',
    primaryDim: '#dc2626',
    primaryBright: '#fca5a5',
    primaryGlow: 'rgba(239,68,68,0.25)',
    primaryDeep: '#450a0a',
    border: '#991b1b',
    scanline: 'rgba(239,68,68,0.6)',
    scrollThumb: '#450a0a',
    scrollThumbHover: '#dc2626',
    selection: 'rgba(239,68,68,0.25)',
    selectionText: '#fca5a5',
    navBorder: '#450a0a',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [themeId, setThemeId] = useState('green');
  const theme = TERMINAL_THEMES[themeId];

  return (
    <PortfolioContext.Provider value={{ ...data, theme, themeId, setThemeId }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside <PortfolioProvider>');
  return ctx;
}

export default PortfolioContext;
