import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'border-border bg-muted text-muted-foreground',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  error: 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400',
  info: 'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400',
}

const sizeStyles = {
  sm: 'px-2.5 py-1 text-[10px] leading-none tracking-[0.16em]',
  md: 'px-3 py-1.5 text-xs leading-none tracking-[0.14em]',
}

const dotStyles = {
  default: 'bg-muted-foreground/60',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  info: 'bg-sky-500',
}

export default function Badge({
  variant = 'default',
  size = 'md',
  children,
  dot = false,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-bold uppercase whitespace-nowrap',
        'transition-colors select-none',
        variantStyles[variant] ?? variantStyles.default,
        sizeStyles[size] ?? sizeStyles.md,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={cn(
            'mr-2 h-1.5 w-1.5 shrink-0 rounded-full',
            dotStyles[variant] ?? dotStyles.default,
          )}
        />
      )}
      {children}
    </span>
  )
}
