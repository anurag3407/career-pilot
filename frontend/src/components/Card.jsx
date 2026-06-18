import { cn } from '@/lib/utils'

export default function Card({
  children,
  className = '',
  variant = 'default',
}) {
  const variants = {
    default: 'rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl',
    compact: 'rounded-xl p-6 shadow-sm',
    flat: 'rounded-xl p-4 shadow-none',
  }

  return (
    <div
      className={cn(
        'bg-card border border-border',
        variants[variant] || variants.default,
        className
      )}
    >
      {children}
    </div>
  )
}
