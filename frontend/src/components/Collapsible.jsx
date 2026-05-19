import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export default function Collapsible({
  title,
  defaultOpen = false,
  children,
  icon: Icon,
  isOpen,
  onToggle,
  className = '',
  headerClassName = '',
  contentClassName = '',
}) {
  const contentId = useId()
  const contentRef = useRef(null)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [contentHeight, setContentHeight] = useState(defaultOpen ? 'auto' : '0px')
  const open = typeof isOpen === 'boolean' ? isOpen : internalOpen

  useEffect(() => {
    const element = contentRef.current
    if (!element) return

    if (open) {
      setContentHeight(`${element.scrollHeight}px`)
      return
    }

    setContentHeight('0px')
  }, [open, children])

  const handleToggle = () => {
    const nextOpen = !open
    if (typeof isOpen !== 'boolean') {
      setInternalOpen(nextOpen)
    }
    onToggle?.(nextOpen)
  }

  return (
    <section className={cn('rounded-2xl border border-border bg-card', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={handleToggle}
        className={cn(
          'flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-200',
          'hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/20',
          headerClassName
        )}
      >
        <span className="flex min-w-0 items-center gap-3">
          {Icon && <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />}
          <span className="truncate text-sm font-black text-foreground">{title}</span>
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className={cn('px-5 pb-5 pt-1', contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  )
}
