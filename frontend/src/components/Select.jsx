import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

function normalizeOption(option) {
  if (typeof option === 'string' || typeof option === 'number') {
    return {
      value: option,
      label: String(option),
      disabled: false
    }
  }

  return {
    ...option,
    value: option.value,
    label: String(option.label ?? option.value),
    disabled: Boolean(option.disabled)
  }
}

function valuesMatch(a, b) {
  return String(a) === String(b)
}

export default function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  multiple = false,
  multiSelect = false,
  disabled = false,
  className = '',
  name
}) {
  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options])
  const isMulti = multiple || multiSelect || Array.isArray(value)
  const selectedValues = useMemo(() => {
    if (isMulti) return Array.isArray(value) ? value : []
    return value === undefined || value === null || value === '' ? [] : [value]
  }, [isMulti, value])

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const searchRef = useRef(null)

  const selectedOptions = useMemo(
    () => normalizedOptions.filter(option => selectedValues.some(selected => valuesMatch(selected, option.value))),
    [normalizedOptions, selectedValues]
  )

  const filteredOptions = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase()
    if (!searchable || !trimmedQuery) return normalizedOptions

    return normalizedOptions.filter(option =>
      option.label.toLowerCase().includes(trimmedQuery)
    )
  }, [normalizedOptions, query, searchable])

  const selectableOptions = useMemo(
    () => filteredOptions.filter(option => !option.disabled),
    [filteredOptions]
  )

  useEffect(() => {
    if (!isOpen) return

    const firstSelectedIndex = filteredOptions.findIndex(option =>
      selectedValues.some(selected => valuesMatch(selected, option.value))
    )
    const firstEnabledIndex = filteredOptions.findIndex(option => !option.disabled)

    setActiveIndex(firstSelectedIndex >= 0 ? firstSelectedIndex : firstEnabledIndex)

    if (searchable) {
      window.requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [filteredOptions, isOpen, searchable, selectedValues])

  useEffect(() => {
    if (!isOpen) setQuery('')
  }, [isOpen])

  function openDropdown() {
    if (!disabled) setIsOpen(true)
  }

  function closeDropdown() {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleBlur(event) {
    if (!containerRef.current?.contains(event.relatedTarget)) {
      closeDropdown()
    }
  }

  function emitChange(nextValue) {
    onChange?.(nextValue)
  }

  function isSelected(optionValue) {
    return selectedValues.some(selected => valuesMatch(selected, optionValue))
  }

  function selectOption(option) {
    if (!option || option.disabled) return

    if (isMulti) {
      const nextValues = isSelected(option.value)
        ? selectedValues.filter(selected => !valuesMatch(selected, option.value))
        : [...selectedValues, option.value]

      emitChange(nextValues)
      closeDropdown()
      return
    }

    emitChange(option.value)
    closeDropdown()
  }

  function removeOption(optionValue, event) {
    event.stopPropagation()
    emitChange(selectedValues.filter(selected => !valuesMatch(selected, optionValue)))
  }

  function moveActiveIndex(direction) {
    if (!filteredOptions.length || !selectableOptions.length) return

    const currentIndex = activeIndex >= 0 ? activeIndex : filteredOptions.findIndex(option => !option.disabled)
    let nextIndex = currentIndex

    do {
      nextIndex = (nextIndex + direction + filteredOptions.length) % filteredOptions.length
    } while (filteredOptions[nextIndex]?.disabled && nextIndex !== currentIndex)

    setActiveIndex(nextIndex)
  }

  function handleKeyDown(event) {
    if (disabled) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          openDropdown()
        } else {
          moveActiveIndex(1)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          openDropdown()
        } else {
          moveActiveIndex(-1)
        }
        break
      case 'Enter':
        event.preventDefault()
        if (!isOpen) {
          openDropdown()
        } else {
          selectOption(filteredOptions[activeIndex])
        }
        break
      case 'Escape':
        closeDropdown()
        break
      default:
        break
    }
  }

  const displayText = selectedOptions.length
    ? selectedOptions.map(option => option.label).join(', ')
    : placeholder

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        name={name}
        disabled={disabled}
        onClick={() => setIsOpen(open => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-multiselectable={isMulti}
        className={cn(
          'relative w-full min-h-[52px] px-5 py-3.5 pr-12 rounded-2xl transition-all duration-300',
          'bg-muted/30 border border-border',
          'text-left text-foreground placeholder:text-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          'disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
          isOpen && 'ring-2 ring-primary/20 border-primary'
        )}
      >
        {isMulti && selectedOptions.length > 0 ? (
          <span className="flex flex-wrap gap-2">
            {selectedOptions.map(option => (
              <span
                key={String(option.value)}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                <span className="truncate">{option.label}</span>
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${option.label}`}
                  className="rounded-full text-primary/70 transition hover:text-primary"
                  onClick={event => removeOption(option.value, event)}
                >
                  <X size={14} />
                </span>
              </span>
            ))}
          </span>
        ) : (
          <span className={cn('block truncate', selectedOptions.length === 0 && 'text-muted-foreground')}>
            {displayText}
          </span>
        )}
        <ChevronDown
          size={18}
          className={cn(
            'pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-background shadow-xl"
          role="listbox"
          aria-multiselectable={isMulti}
        >
          {searchable && (
            <div className="relative border-b border-border">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const selected = isSelected(option.value)
                const active = index === activeIndex

                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition-colors',
                      'text-foreground hover:bg-muted focus:outline-none',
                      active && 'bg-muted',
                      selected && 'font-semibold text-primary',
                      option.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                    )}
                  >
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {selected && <Check size={16} />}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">No options found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
