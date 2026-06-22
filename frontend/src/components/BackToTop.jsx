import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating "Back to Top" button.
 *
 * This component monitors scroll activity and becomes visible after the
 * user scrolls beyond a configurable threshold. It supports two modes:
 *   • Default: listens to the window scroll (for pages that use the native
 *     browser scroll).
 *   • Container mode: if a `scrollContainerRef` is provided, it listens to
 *     that element's `scroll` event (used by the app's main content area
 *     which has `overflow-y-auto`).
 */
export default function BackToTop({ scrollContainerRef }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    const scrollY = scrollContainerRef?.current?.scrollTop ?? window.scrollY;
    if (scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const target = scrollContainerRef?.current ?? window;
    target.addEventListener('scroll', toggleVisibility);
    // Initial check in case page loads already scrolled
    toggleVisibility();
    return () => target.removeEventListener('scroll', toggleVisibility);
  }, [scrollContainerRef]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary/80 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
