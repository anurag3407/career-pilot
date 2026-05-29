import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton
 *
 * A floating "Scroll to Top" button that:
 * - Appears only after the user scrolls past a configurable threshold (default 300px).
 * - Displays a circular SVG progress ring showing how far down the page the user has scrolled.
 * - Smoothly scrolls back to the top when clicked.
 * - Uses framer-motion for fade + scale entrance/exit animations.
 * - Shows a tooltip label on hover.
 *
 * Usage:
 *   import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
 *   <ScrollToTopButton threshold={300} />
 */
export default function ScrollToTopButton({ threshold = 300 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Show/hide button based on threshold
      setIsVisible(scrollY > threshold);

      // Calculate scroll progress as a percentage (0–100)
      const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialise on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG ring parameters
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                           px-2.5 py-1 rounded-lg text-xs font-medium
                           bg-foreground text-background shadow-lg pointer-events-none"
              >
                Back to top
                {/* Arrow */}
                <span
                  className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
                  style={{ borderTopColor: 'var(--foreground)' }}
                />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.button
            onClick={scrollToTop}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
            className="relative flex items-center justify-center rounded-full
                       bg-background border border-border shadow-lg
                       hover:border-primary/60 hover:shadow-primary/20
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
                       transition-shadow duration-300"
            style={{ width: size, height: size }}
          >
            {/* Progress ring */}
            <svg
              width={size}
              height={size}
              className="absolute inset-0 -rotate-90"
              aria-hidden="true"
            >
              {/* Track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--border)"
                strokeWidth={strokeWidth}
              />
              {/* Progress */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.15s ease' }}
              />
            </svg>

            {/* Arrow icon */}
            <ArrowUp className="w-5 h-5 text-primary relative z-10" aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
