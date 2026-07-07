import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Save, Download, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import F1PreviewPane from './F1PreviewPane';
import AIChatPanel from './AIChatPanel';
import { cn } from '../../../lib/utils';

const STORAGE_KEY = 'ai_portfolio_draft';

const FALLBACK_PORTFOLIO = {
  personal: {
    name: 'Alex Verstappen',
    title: 'Lead Full-Stack Developer & Performance Architect',
    location: 'Monaco / Remote',
    avatar: null,
    bio:
      'Engineering high-performance web systems with sub-millisecond response times. Specializing in React, Node.js, Go, and high-octane system architecture.',
    email: 'alex@example.com',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
  },
  personalInfo: {
    name: 'Alex Verstappen',
    title: 'Lead Full-Stack Developer & Performance Architect',
    location: 'Monaco / Remote',
    avatar: null,
    bio:
      'Engineering high-performance web systems with sub-millisecond response times. Specializing in React, Node.js, Go, and high-octane system architecture.',
    email: 'alex@example.com',
  },
  stats: {
    driverNumber: '33',
    team: 'Red Bull Technical Labs',
    experience: '8 Yrs',
    podiums: '42 Projects',
    fastestLaps: '99.9% Uptime',
    status: 'ACTIVE CONTRACT',
  },
  skills: [
    { name: 'React / Next.js', rating: 98, type: 'Engine' },
    { name: 'Node.js / Go', rating: 95, type: 'Turbocharger' },
    { name: 'Cloud & Devops', rating: 92, type: 'Aerodynamics' },
    { name: 'DB Performance', rating: 96, type: 'Tires' },
  ],
  themeAccent: '#E10600',
};

function readDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return FALLBACK_PORTFOLIO;
    const parsed = JSON.parse(raw);
    return { ...FALLBACK_PORTFOLIO, ...parsed };
  } catch (e) {
    return FALLBACK_PORTFOLIO;
  }
}

function writeDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    /* ignore */
  }
}

/**
 * AIBuilderModal — full-screen split modal hosting F1PreviewPane (left)
 * and AIChatPanel (right). Owns the in-memory portfolioData state, persists
 * to localStorage on every change so the draft survives reloads and is
 * already compatible with the existing `TemplatePreviewOnly` previewer.
 */
export default function AIBuilderModal({ isOpen, onClose }) {
  const [data, setData] = useState(() => readDraft());

  useEffect(() => {
    if (!isOpen) return;
    setData(readDraft());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    writeDraft(data);
  }, [data, isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleUpdate = useCallback((next) => {
    setData(next);
  }, []);

  const handleApplyPatch = useCallback((patch) => {
    setData((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(patch || {})) {
        if (
          value &&
          typeof value === 'object' &&
          !Array.isArray(value) &&
          next[key] &&
          typeof next[key] === 'object' &&
          !Array.isArray(next[key])
        ) {
          next[key] = { ...next[key], ...value };
        } else {
          next[key] = value;
        }
      }
      return next;
    });
  }, []);

  const showToast = useCallback((msg) => {
    toast.success(msg);
  }, []);

  const handleSave = useCallback(() => {
    writeDraft(data);
    toast.success('Saved locally. Reload anytime — your draft is preserved.');
  }, [data]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-draft.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Draft exported as JSON.');
  }, [data]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ai-builder-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-stretch justify-stretch bg-black/80 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.98, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.98, y: 8 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.05 }}
            className={cn(
              'relative w-full h-full flex flex-col',
              'bg-[#070709] text-white border border-neutral-800 shadow-2xl'
            )}
          >
            {/* Modal top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-[#0c0c10]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#E10600]" />
                  <span className="font-mono text-sm font-bold uppercase tracking-widest">
                    AI Portfolio Builder
                  </span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-neutral-800 bg-neutral-900/50 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  F1_Racing · v1
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 rounded-md px-3 py-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest border border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700 rounded-md px-3 py-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:text-white hover:border-neutral-700"
                  aria-label="Close AI builder"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Split layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] overflow-hidden">
              <F1PreviewPane
                portfolioData={data}
                onUpdate={handleUpdate}
                onShowToast={showToast}
              />
              <AIChatPanel
                portfolioData={data}
                onApplyPatch={handleApplyPatch}
                onShowToast={showToast}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}