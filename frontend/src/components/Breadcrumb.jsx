import { createElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

function formatSegment(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function Breadcrumb({
  className,
  labelMap = {},
  rootLabel = 'Dashboard',
  rootPath = '/dashboard',
  separator: Separator = ChevronRight,
}) {
  const { pathname } = useLocation()
  const cleanPath = pathname.replace(/\/+$/, '')

  if (!cleanPath || cleanPath === '/' || cleanPath === rootPath) {
    return null
  }

  const pathSegments = cleanPath.split('/').filter(Boolean)
  const crumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`
    const label = labelMap[path] || labelMap[segment] || formatSegment(segment)

    return {
      label,
      path,
      current: index === pathSegments.length - 1,
    }
  })

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
    >
      <Link to={rootPath} className="font-medium transition-colors hover:text-foreground">
        {rootLabel}
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex min-w-0 items-center gap-2">
          {createElement(Separator, {
            className: 'h-3.5 w-3.5 shrink-0',
            'aria-hidden': 'true',
          })}
          {crumb.current ? (
            <span className="truncate font-medium text-muted-foreground" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link to={crumb.path} className="truncate font-medium transition-colors hover:text-foreground">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
