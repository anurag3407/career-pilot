import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Accessible horizontal progress bar using design tokens.
 */
export default function ProgressBar({
  value = 0,
  label,
  className = '',
  barClassName = 'bg-gradient-to-r from-primary to-secondary',
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">{label}</span>
          <span className="text-foreground font-bold tabular-nums">{clamped}%</span>
        </div>
      )}
      <div
        className="h-2.5 bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn('h-full rounded-full', barClassName)}
        />
      </div>
    </div>
  );
}
