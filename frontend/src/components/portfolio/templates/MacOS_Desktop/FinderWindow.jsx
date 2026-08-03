import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FinderWindow({ title, children, defaultOpen = true, icon = "📁" }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) {
    return (
      <div 
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center cursor-pointer p-4 w-24 hover:bg-white/10 rounded-xl transition-colors"
      >
        <div className="text-4xl mb-1 drop-shadow-md">{icon}</div>
        <span className="text-white text-xs font-medium text-center shadow-sm drop-shadow-md truncate w-full">{title}</span>
      </div>
    );
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        height: isMinimized ? 'auto' : (isFullscreen ? '100%' : 'auto'),
      }}
      className={`flex flex-col bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl rounded-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-40' : 'w-full mb-8'
      }`}
      style={isFullscreen ? { maxHeight: 'calc(100vh - 8rem)' } : {}}
    >
      {/* Title Bar */}
      <div 
        onDoubleClick={() => setIsFullscreen(!isFullscreen)}
        className="h-10 flex items-center justify-between px-4 bg-gradient-to-b from-white/80 to-white/40 dark:from-white/10 dark:to-transparent border-b border-gray-200 dark:border-white/10 select-none cursor-default"
      >
        <div className="flex gap-2 w-16">
          <button type="button" 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 shadow-inner flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-red-900 leading-none">✕</span>
          </button>
          <button type="button" 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 shadow-inner flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-yellow-900 leading-none">−</span>
          </button>
          <button type="button" 
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(!isFullscreen); }}
            className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 shadow-inner flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-green-900 leading-none">⤢</span>
          </button>
        </div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span>{icon}</span> {title}
        </div>
        <div className="w-16"></div>
      </div>
      
      {/* Content Area */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-auto ${isFullscreen ? 'flex-1' : ''}`}
            style={{ maxHeight: isFullscreen ? 'none' : '600px' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
