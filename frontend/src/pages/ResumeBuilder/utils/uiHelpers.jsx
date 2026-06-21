import { cn } from '@/lib/utils'

/** Red border class when an error exists for a field key. */
export function errBorder(errors, key) {
  return errors?.[key] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
}

/** Inline error message below a field. */
export function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="text-red-500 text-sm mt-1" role="alert">{msg}</p>
  )
}

/** Builder for the main personal-step input class (uses personalErrors by default). */
export function makeInputCls(personalErrors) {
  return (errorKey, errors = personalErrors) =>
    cn(
      'w-full bg-muted border rounded-xl px-4 py-2 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary/30',
      errors?.[errorKey] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
    )
}

/** Builder for per-entry (education/experience array) input classes. */
export function inputClsArr(errors) {
  return (errorKey) =>
    cn(
      'w-full bg-muted border rounded-lg px-4 py-2 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary/30',
      errors?.[errorKey] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
    )
}
