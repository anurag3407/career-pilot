import { Children, cloneElement, isValidElement, useId } from 'react'
import { cn } from '@/lib/utils'

const positions = {
  top: {
    bubble: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
    arrow: 'left-1/2 top-full -translate-x-1/2 border-x-transparent border-b-transparent border-t-foreground',
  },
  bottom: {
    bubble: 'left-1/2 top-full mt-3 -translate-x-1/2',
    arrow: 'bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-t-transparent border-b-foreground',
  },
  left: {
    bubble: 'right-full top-1/2 mr-3 -translate-y-1/2',
    arrow: 'left-full top-1/2 -translate-y-1/2 border-y-transparent border-r-transparent border-l-foreground',
  },
  right: {
    bubble: 'left-full top-1/2 ml-3 -translate-y-1/2',
    arrow: 'right-full top-1/2 -translate-y-1/2 border-y-transparent border-l-transparent border-r-foreground',
  },
}

export default function Tooltip({
  children,
  content,
  position = 'top',
  className = '',
  contentClassName = '',
}) {
  const placement = positions[position] || positions.top
  const tooltipId = useId()

  const trigger = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child
    }

    const currentDescription = child.props['aria-describedby']

    return cloneElement(child, {
      'aria-describedby': currentDescription
        ? `${currentDescription} ${tooltipId}`
        : tooltipId,
    })
  })

  return (
    <span className={cn('group relative inline-flex w-fit', className)}>
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 min-w-max max-w-xs rounded-xl bg-foreground px-3 py-2 text-xs font-semibold leading-relaxed text-background shadow-xl',
          'whitespace-pre-line opacity-0 transition-all duration-200 ease-out',
          'group-hover:opacity-100 group-focus-within:opacity-100',
          placement.bubble,
          contentClassName
        )}
      >
        {content}
        <span
          className={cn(
            'absolute h-0 w-0 border-4',
            placement.arrow
          )}
        />
      </span>
    </span>
  )
}
