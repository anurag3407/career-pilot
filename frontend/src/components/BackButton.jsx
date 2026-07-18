import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { cn } from '@/lib/utils'

export default function BackButton({
  to,
  label = 'Back',
  fallbackTo = '/dashboard',
  className = '',
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
      return
    }

    if ((window.history.state?.idx ?? 0) <= 0) {
      navigate(fallbackTo)
      return
    }

    navigate(-1)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-bold text-muted-foreground transition-colors duration-200',
        'hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20',
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
