import { motion } from 'framer-motion'
import Button from './Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-14 text-center shadow-sm"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.04),_transparent_55%)]" />

      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        {Icon ? (
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted/60 text-muted-foreground">
            <Icon className="h-10 w-10" aria-hidden="true" />
          </div>
        ) : null}

        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>

        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>

        {(actionLabel && onAction) || (secondaryLabel && onSecondary) ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {actionLabel && onAction ? (
              <Button onClick={onAction} variant="primary" size="default">
                {actionLabel}
              </Button>
            ) : null}

            {secondaryLabel && onSecondary ? (
              <Button onClick={onSecondary} variant="outline" size="default">
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}