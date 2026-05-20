import { useRef, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useAICompletion } from '../hooks/useAICompletion'

/**
 * Textarea with inline AI ghost text suggestions.
 * Shows a faded completion after the cursor text. Tab accepts, Escape dismisses.
 */
export default function GhostTextArea({
  value = '',
  onChange,
  sectionContext = '',
  fieldType = 'description',
  className = '',
  ghostEnabled = true,
  ...props
}) {
  const textareaRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const { suggestion, isLoading, fetchCompletion, dismiss } = useAICompletion({
    sectionContext,
    fieldType,
    enabled: ghostEnabled
  })

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    onChange(e)
    dismiss()
    const cursorPos = e.target.selectionStart
    fetchCompletion(newValue, cursorPos)
  }, [onChange, fetchCompletion, dismiss])

  const handleKeyDown = useCallback((e) => {
    if (!suggestion) return

    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const cursorPos = textarea.selectionStart
      const before = value.slice(0, cursorPos)
      const after = value.slice(cursorPos)
      const newValue = before + suggestion + after

      const syntheticEvent = { target: { value: newValue } }
      onChange(syntheticEvent)
      dismiss()

      requestAnimationFrame(() => {
        const newCursorPos = cursorPos + suggestion.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      })
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      dismiss()
    }
  }, [suggestion, value, onChange, dismiss])

  const showGhost = isFocused && suggestion && !isLoading

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          dismiss()
        }}
        className={cn(
          'relative z-10 bg-transparent',
          className
        )}
        {...props}
      />

      {showGhost && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 pointer-events-none overflow-hidden whitespace-pre-wrap break-words',
            'px-3 py-2 text-sm leading-[1.5]',
          )}
        >
          <span className="invisible">{value}</span>
          <span className="text-muted-foreground/40 italic">{suggestion}</span>
        </div>
      )}

      {showGhost && (
        <div className="absolute bottom-1 right-2 z-20 flex items-center gap-1.5 text-[10px] text-muted-foreground/50 pointer-events-none">
          <kbd className="px-1 py-0.5 rounded border border-border/50 bg-muted/50 font-mono">Tab</kbd>
          <span>accept</span>
          <kbd className="px-1 py-0.5 rounded border border-border/50 bg-muted/50 font-mono">Esc</kbd>
          <span>dismiss</span>
        </div>
      )}

      {isLoading && isFocused && (
        <div className="absolute top-2 right-2 z-20 pointer-events-none">
          <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
