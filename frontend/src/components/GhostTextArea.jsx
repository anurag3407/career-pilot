import { useRef, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useAICompletion } from '../hooks/useAICompletion'

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
  const [cursorPos, setCursorPos] = useState(0)
  const { suggestion, isLoading, fetchCompletion, dismiss } = useAICompletion({
    sectionContext,
    fieldType,
    enabled: ghostEnabled
  })

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    const pos = e.target.selectionStart
    onChange(e)
    dismiss()
    setCursorPos(pos)
    fetchCompletion(newValue, pos)
  }, [onChange, fetchCompletion, dismiss])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      dismiss()
      return
    }

    if (!suggestion) return

    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const pos = textarea.selectionStart
      const currentValue = textarea.value
      const before = currentValue.slice(0, pos)
      const after = currentValue.slice(pos)
      const newValue = before + suggestion + after

      const syntheticEvent = { target: { value: newValue } }
      onChange(syntheticEvent)
      dismiss()

      const newCursorPos = pos + suggestion.length
      setCursorPos(newCursorPos)
      requestAnimationFrame(() => {
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      })
    }
  }, [suggestion, onChange, dismiss])

  const handleSelect = useCallback((e) => {
    setCursorPos(e.target.selectionStart)
  }, [])

  const showGhost = isFocused && suggestion && !isLoading

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
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
          <span className="invisible">{value.slice(0, cursorPos)}</span>
          <span className="text-muted-foreground/40 italic">{suggestion}</span>
          <span className="invisible">{value.slice(cursorPos)}</span>
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
