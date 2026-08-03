import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Reusable star-rating row. Renders N filled stars (1-5).
 *
 * Props
 * - label:      string
 * - value:      integer 1-5
 * - hint:       optional one-liner below the row
 */
export default function StarRating({ label, value = 0, hint, className }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="text-sm font-bold text-foreground">{value}/5</span>
      </div>
      <div className="flex gap-1">
        {stars.map((i) => {
          const filled = i <= value;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
            >
              <Star
                className={cn(
                  'h-5 w-5 transition-colors',
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground/30'
                )}
                aria-label={`${filled ? 'Filled' : 'Empty'} star ${i}`}
              />
            </motion.div>
          );
        })}
      </div>
      {hint && (
        <p className="text-xs text-muted-foreground/80 italic">{hint}</p>
      )}
    </div>
  );
}