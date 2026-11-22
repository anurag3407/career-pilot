import { useEffect, useMemo, useState } from 'react'
import { cn } from '../lib/utils'

const sizes = {
  sm: {
    container: 'h-8 w-8 text-xs',
    status: 'h-2.5 w-2.5 border-2',
  },
  md: {
    container: 'h-10 w-10 text-sm',
    status: 'h-3 w-3 border-2',
  },
  lg: {
    container: 'h-12 w-12 text-base',
    status: 'h-3.5 w-3.5 border-2',
  },
  xl: {
    container: 'h-16 w-16 text-xl',
    status: 'h-4 w-4 border-[3px]',
  },
}

const colors = [
  'bg-sky-500 text-white',
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-600 text-white',
  'bg-indigo-500 text-white',
  'bg-teal-600 text-white',
]

function hashName(name = '') {
  return name
    .trim()
    .toLowerCase()
    .split('')
    .reduce((hash, char) => char.charCodeAt(0) + ((hash << 5) - hash), 0)
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return '?'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export default function Avatar({ src, alt, name = '', size = 'md', status, className }) {
  const [imageError, setImageError] = useState(false)
  const safeSize = sizes[size] ? size : 'md'
  const showImage = Boolean(src) && !imageError
  const initials = useMemo(() => getInitials(name), [name])
  const color = useMemo(() => {
    const index = Math.abs(hashName(name || alt || initials)) % colors.length
    return colors[index]
  }, [alt, initials, name])

  useEffect(() => {
    setImageError(false)
  }, [src])

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden rounded-full font-semibold uppercase leading-none ring-1 ring-border/60',
          sizes[safeSize].container,
          showImage ? 'bg-muted' : color
        )}
        aria-label={alt || name || 'User avatar'}
        role="img"
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'User avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </span>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-background',
            sizes[safeSize].status,
            status === 'online' ? 'bg-emerald-500' : 'bg-muted-foreground'
          )}
          aria-label={status === 'online' ? 'Online' : 'Offline'}
          role="status"
        />
      )}
    </span>
  )
}
