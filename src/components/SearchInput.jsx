import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

export default function SearchInput({
  label,
  required = false,
  disabled = false,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  error,
  debounceMs = 300,
  isLoading = false,
  wrapperClassName = "",
  inputClassName = "",
}) {
  // Internal input state used for debouncing.
  // Starts with the external value prop if provided.
  const [query, setQuery] = useState(value || "");

  /**
   * Keep internal query state synced with external value changes.
   * Useful when parent components reset or update the search value.
   */
  useEffect(() => {
    setQuery(value);
  }, [value]);

  /**
   * Store the latest onChange in a ref so the debounce effect doesn't need onChange in its dependency array.
   * This prevents the timer from resetting when the parent passes a new function reference on re-render
   * (e.g. an inline arrow function), which would break the debounce.
   */
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /**
   * Fire onChange after the user stops typing for `debounceMs` milliseconds.
   * The cleanup function cancels the pending timer if query changes again
   * before the delay completes, ensuring onChange is never called mid-typing.
   */

  // Used to skip the debounce effect during the initial render
  // so onChange is not triggered immediately on mount.
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip debounce on first render to avoid firing
    // an unnecessary initial onChange call.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onChangeRef.current(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Update local query state immediately for responsive typing.
  // The parent onChange will still be debounced separately.
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  // Clear the current search query.
  // This will also trigger the debounced onChange effect.
  const handleInputClear = () => {
    setQuery("");
  };

  return (
    <div className={cn(wrapperClassName)}>
      {/* Label only rendered when the label prop is provided */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-bold text-foreground mb-2 uppercase tracking-widest opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Relative wrapper so the icons can be absolutely positioned over the input without affecting its width or layout */}
      <div className="relative flex items-center">
        {/* Search icon turns destructive color when there's an error */}
        <span
          className={cn(
            "absolute left-4 pointer-events-none z-10",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          <Search size={16} />
        </span>

        <input
          type={type}
          id={name}
          name={name}
          value={query}
          aria-label={label || placeholder || "Search"}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full px-5 py-3.5 rounded-2xl transition-all duration-300",
            "bg-muted/30 border border-border",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "disabled:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
            "pl-10 pr-10", // room for icons on both sides
            error ? "border-destructive/50 focus:ring-destructive/20" : "",
            inputClassName,
          )}
        />

        {/* Right slot which shows spinner while loading, clear button when there's a query, and nothing when the input is empty */}
        <span className="absolute right-4 z-10 flex items-center">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : query ? (
            <button
              type="button"
              onClick={handleInputClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
        </span>
      </div>

      {/* Error message which mirrors Input component's error block */}
      {error && (
        <p className="mt-2 text-sm font-bold text-destructive uppercase tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
}

SearchInput.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  debounceMs: PropTypes.number,
  isLoading: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  inputClassName: PropTypes.string,
};
