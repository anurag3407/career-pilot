import { cn } from '@/lib/utils'

export default function Input({
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
}) {
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
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full px-5 py-3.5 rounded-2xl transition-all duration-300',
          'bg-muted/30 border border-border',
          'text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-destructive/50 focus:ring-destructive/20' : '',
          className
        )}
      />
      {error && (
        <p className="mt-2 text-sm font-bold text-destructive uppercase tracking-wide">{error}</p>
      )}
    </div>
  )
}
