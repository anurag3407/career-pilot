import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Wand2, LayoutTemplate } from 'lucide-react';
import MarkdownEditor from '../ui/MarkdownEditor';

export default function PortfolioBuilderModal({ isOpen, onClose, onProceedToDeploy, portfolioTitle = "My Portfolio" }) {
  const [markdownContent, setMarkdownContent] = useState(
    `# Hi, I'm a Developer 👋\n\nWelcome to my portfolio! I specialize in building **high-performance** web applications and creating beautiful user experiences.\n\n### Featured Skills\n- React & Next.js\n- Tailwind CSS\n- Node.js & Edge Computing\n\n> "Simplicity is the ultimate sophistication."`
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Modern Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 shadow-inner">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-zinc-100 tracking-tight">Portfolio Builder</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Customizing: <span className="font-mono text-cyan-400">{portfolioTitle}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Builder Dialog"
              className="p-2 hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-1">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                Customize Content
              </h4>
              <p className="text-xs text-zinc-400">
                Write your project descriptions and about section in Markdown. The live preview will show exactly how it renders on your deployed portfolio.
              </p>
            </div>

            <MarkdownEditor
              value={markdownContent}
              onChange={setMarkdownContent}
              placeholder="Start typing your portfolio content here in Markdown..."
            />
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-zinc-800/60 shrink-0 bg-zinc-900/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-200 rounded-2xl font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onProceedToDeploy(markdownContent)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-600 text-zinc-100 rounded-2xl font-semibold shadow-xl shadow-indigo-950/20 hover:from-indigo-600 hover:to-cyan-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-100" />
              Save & Proceed to Deploy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
