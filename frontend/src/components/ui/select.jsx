import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext(null)

/**
 * Main wrapper component for Custom Select Dropdown.
 * Provides the interactive selection context to all subcomponents.
 */
export function Select({ children, value, onValueChange, defaultValue }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")
  const [options, setOptions] = React.useState({})
  const containerRef = React.useRef(null)

  // Sync selectedValue state with external value prop updates
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  // Register option labels dynamically so trigger can display them based on current value
  const registerOption = React.useCallback((val, label) => {
    setOptions(prev => {
      if (prev[val] === label) return prev
      return { ...prev, [val]: label }
    })
  }, [])

  // Deregister option labels on unmount to prevent memory leaks
  const deregisterOption = React.useCallback((val) => {
    setOptions(prev => {
      if (!(val in prev)) return prev
      const copy = { ...prev }
      delete copy[val]
      return copy
    })
  }, [])

  // Close dropdown when clicking outside the component
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = React.useCallback((val) => {
    setSelectedValue(val)
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(val)
    }
  }, [onValueChange])

  const selectedLabel = options[selectedValue] || ""

  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, selectedValue, selectedLabel, registerOption, deregisterOption, handleSelect }}>
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

/**
 * The trigger button for opening and closing the Select dropdown.
 */
export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, selectedLabel } = React.useContext(SelectContext)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-left transition-all duration-200 select-none",
        isOpen && "ring-2 ring-ring ring-offset-2 border-primary/50",
        className
      )}
      {...props}
    >
      {children || <span className="truncate">{selectedLabel}</span>}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200 ml-2 flex-shrink-0", isOpen && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

/**
 * Component to display the current selection or a placeholder.
 */
export const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
  const { selectedValue, selectedLabel } = React.useContext(SelectContext)

  return (
    <span
      ref={ref}
      className={cn("block truncate", !selectedValue && "text-muted-foreground", className)}
      {...props}
    >
      {selectedLabel || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

/**
 * The animated container showing the list of selectable options.
 */
export const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SelectContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 4, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-lg max-h-60 overflow-y-auto backdrop-blur-md bg-background/95"
        >
          <div ref={ref} className={cn("p-1 space-y-0.5", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
SelectContent.displayName = "SelectContent"

/**
 * An individual option selectable within the dropdown.
 */
export const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const { selectedValue, registerOption, deregisterOption, handleSelect } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  const label = typeof children === "string" ? children : value

  React.useEffect(() => {
    registerOption(value, label)
    return () => deregisterOption(value)
  }, [value, label, registerOption, deregisterOption])

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => handleSelect(value)}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left transition-colors duration-150",
        isSelected && "bg-accent text-accent-foreground font-medium",
        className
      )}
      {...props}
    >
      <span className="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
      </span>
      <span className="truncate">{children}</span>
    </button>
  )
})
SelectItem.displayName = "SelectItem"
