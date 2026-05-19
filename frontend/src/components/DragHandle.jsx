import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

export default function DragHandle({
  label = 'Drag to reorder',
  isDragging = false,
  className = '',
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200',
        'cursor-grab hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20',
        'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
        isDragging && 'cursor-grabbing bg-muted text-foreground opacity-100',
        className
      )}
    >
      <GripVertical className="h-4 w-4" aria-hidden="true" />
    </button>
  )
}
