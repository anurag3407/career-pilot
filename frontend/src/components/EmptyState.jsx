import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from './Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  to,
  secondaryLabel,
  onSecondary,
  secondaryTo,
}) {
  const renderAction = () => {
    if (!actionLabel) return null

    if (to) {
      return (
        <Link
          to={to}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black tracking-wide transition-all duration-300 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-103 active:scale-97 shadow-lg shadow-primary/20 text-sm cursor-pointer"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )
    }

    return (
      <Button onClick={onAction} variant="primary" size="default">
        {actionLabel}
      </Button>
    )
  }

  const renderSecondary = () => {
    if (!secondaryLabel) return null

    if (secondaryTo) {
      return (
        <Link
          to={secondaryTo}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 font-black tracking-wide transition-all duration-300 rounded-2xl bg-card border-2 border-border text-foreground hover:bg-muted hover:border-primary/50 hover:scale-103 active:scale-97 text-sm cursor-pointer"
        >
          {secondaryLabel}
        </Link>
      )
    }

    return (
      <Button onClick={onSecondary} variant="outline" size="default">
        {secondaryLabel}
      </Button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-border bg-card/30 dark:bg-card/20 px-6 py-12 md:py-16 text-center shadow-sm w-full"
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),_transparent_55%)]" />

      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        {Icon ? (
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 dark:bg-muted/20 text-primary shadow-inner shadow-primary/5"
          >
            <Icon className="h-10 w-10 text-primary" aria-hidden="true" />
          </motion.div>
        ) : null}

        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-sm md:max-w-md">
          {description}
        </p>

        {(actionLabel && (to || onAction)) || (secondaryLabel && (secondaryTo || onSecondary)) ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {renderAction()}
            {renderSecondary()}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}