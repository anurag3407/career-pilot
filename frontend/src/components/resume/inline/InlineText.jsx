import React, { useEffect, useRef } from 'react'

/**
 * InlineText — a direct-manipulation editable field.
 *
 * Click the text on the resume and type. React never re-renders the node's
 * children, so the caret never jumps; the DOM text is synced from `value` only
 * while the field is *not* focused (so external updates — AI polish, undo,
 * version restore — still land).
 *
 * Rendering no children is intentional: it is what keeps the caret stable.
 */
/**
 * Read what the user actually sees. `innerText` preserves the line breaks the
 * browser inserts for Enter; `textContent` is the fallback for environments
 * that do not implement it.
 */
function readText(element) {
  if (!element) return ''
  return typeof element.innerText === 'string' ? element.innerText : (element.textContent || '')
}

export default function InlineText({
  value = '',
  onChange,
  onCommit,
  placeholder = '',
  className = '',
  style,
  multiline = false,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.activeElement === el) return
    const next = value == null ? '' : String(value)
    // textContent (not innerText) so this also works where innerText is
    // unimplemented; `white-space: pre-wrap` keeps authored line breaks.
    if (el.textContent !== next) el.textContent = next
  }, [value])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !multiline) {
      event.preventDefault()
      event.currentTarget.blur()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.currentTarget.blur()
    }
    if (multiline && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  const handlePaste = (event) => {
    // Paste as plain text so foreign fonts/colours never leak into the page.
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain') ?? ''
          const clean = multiline ? text : text.replace(/\s*\n+\s*/g, ' ')
    const inserted = typeof document.execCommand === 'function'
      ? document.execCommand('insertText', false, clean)
      : false
    if (!inserted) {
      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return
      selection.deleteFromDocument()
      selection.getRangeAt(0).insertNode(document.createTextNode(clean))
      selection.collapseToEnd()
      onChange?.(readText(event.currentTarget))
    }
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      spellCheck
      data-placeholder={placeholder}
      className={`rce-editable ${className}`.trim()}
      style={style}
      onInput={(event) => onChange?.(readText(event.currentTarget))}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onBlur={(event) => onCommit?.(readText(event.currentTarget))}
      {...rest}
    />
  )
}
