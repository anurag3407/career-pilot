import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRY_CODES } from '../constants/countryCodes'

/**
 * PhoneInput
 * – Trigger shows  : 🇮🇳 +91          (flag + code only)
 * – Dropdown shows : 🇮🇳 +91 India    (flag + code + country name, searchable)
 *
 * Props:
 *   countryCode     {string}  – e.g. '+91'
 *   onCountryChange {fn}      – called with new dial code string
 *   digits          {string}  – numeric digits only
 *   onDigitsChange  {fn}      – called with sanitised digit string
 *   error           {string}  – validation error message
 */
export default function PhoneInput({
  countryCode = '+91',
  onCountryChange,
  digits = '',
  onDigitsChange,
  error,
}) {
  const [isOpen, setIsOpen]   = useState(false)
  const [query,  setQuery]    = useState('')
  const containerRef          = useRef(null)
  const searchRef             = useRef(null)

  // Derive selected country object
  const selected = useMemo(
    () => COUNTRY_CODES.find(c => c.code === countryCode) ?? COUNTRY_CODES[0],
    [countryCode]
  )

  // Filter list by query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRY_CODES
    return COUNTRY_CODES.filter(
      c =>
        c.country.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.flag.includes(q)
    )
  }, [query])

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (isOpen) {
      window.requestAnimationFrame(() => searchRef.current?.focus())
    } else {
      setQuery('')
    }
  }, [isOpen])

  function selectCountry(code) {
    onCountryChange?.(code)
    setIsOpen(false)
  }

  function handleDigitsChange(e) {
    const cleaned = e.target.value.replace(/\D/g, '')
    onDigitsChange?.(cleaned)
  }

  return (
    <div>
      <div className="flex gap-2">

        {/* ── Country code trigger ── */}
        <div ref={containerRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Select country code"
            className={cn(
              'flex items-center gap-1.5 h-full px-3 py-2 rounded-xl border transition-colors',
              'bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30',
              'whitespace-nowrap text-sm font-medium',
              error
                ? 'border-red-500 focus:ring-red-400/30'
                : isOpen
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            )}
          >
            {/* Short form: flag + code only */}
            <span aria-hidden="true">{selected.flag}</span>
            <span>{selected.code}</span>
            <ChevronDown
              size={14}
              className={cn(
                'text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {/* ── Dropdown ── */}
          {isOpen && (
            <div
              role="listbox"
              aria-label="Country codes"
              className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-border bg-background shadow-xl"
            >
              {/* Search */}
              <div className="relative border-b border-border">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search country..."
                  className="w-full bg-transparent py-2.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>

              {/* Options list */}
              <div className="max-h-56 overflow-y-auto p-1">
                {filtered.length > 0 ? (
                  filtered.map(c => (
                    <button
                      key={`${c.code}-${c.country}`}
                      type="button"
                      role="option"
                      aria-selected={c.code === countryCode}
                      onClick={() => selectCountry(c.code)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        'hover:bg-muted focus:outline-none',
                        c.code === countryCode && 'bg-primary/10 font-semibold text-primary'
                      )}
                    >
                      {/* Full form in dropdown: flag + code + country */}
                      <span aria-hidden="true">{c.flag}</span>
                      <span className="font-mono text-xs text-muted-foreground w-10 shrink-0">
                        {c.code}
                      </span>
                      <span className="truncate">{c.country}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-3 text-sm text-muted-foreground">No results found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Numeric digit input ── */}
        <input
          id="phone-number"
          type="tel"
          inputMode="numeric"
          value={digits}
          onChange={handleDigitsChange}
          placeholder="9876543210"
          aria-label="Phone number"
          aria-describedby={error ? 'phone-error' : undefined}
          aria-invalid={!!error}
          className={cn(
            'flex-1 bg-background/50 border rounded-xl px-4 py-2 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary/30',
            error
              ? 'border-red-500 focus:ring-red-400/30'
              : 'border-border hover:border-primary/50'
          )}
        />
      </div>

      {error && (
        <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
