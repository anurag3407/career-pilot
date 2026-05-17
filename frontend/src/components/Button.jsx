import { cn } from '@/lib/utils'

export default function Button({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'default',
  disabled = false,
  loading = false,
  onClick,
  className = ''
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black active:scale-95'
  
  const variants = {
    primary: 'bg-white text-black hover:bg-neutral-200 focus:ring-white',
    secondary: 'bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 hover:border-neutral-700 focus:ring-neutral-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border border-neutral-700 text-white hover:bg-neutral-900 hover:border-neutral-600 focus:ring-neutral-500',
    ghost: 'text-neutral-400 hover:text-white hover:bg-neutral-900 focus:ring-neutral-500',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25 focus:ring-indigo-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  )
}
