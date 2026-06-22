import { cn } from '@/lib/utils'
import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = ''
}, ref) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="mb-6">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-bold text-foreground mb-2 uppercase tracking-widest opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-5 py-3.5 pr-12 rounded-2xl transition-all duration-300',
            'bg-muted/30 border border-border',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-destructive/50 focus:ring-destructive/20' : '',
            className
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm font-bold text-destructive uppercase tracking-wide">{error}</p>
      )}
    </div>
  )
})

export default Input