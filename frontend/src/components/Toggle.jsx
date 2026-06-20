import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  size = 'medium',
  className
}) {
  const sizeClasses = {
    small: 'w-8 h-4',
    medium: 'w-11 h-6',
    large: 'w-14 h-8',
  };

  const thumbSizeClasses = {
    small: 'h-3 w-3',
    medium: 'h-5 w-5',
    large: 'h-7 w-7',
  };

  const thumbTranslateClasses = {
    small: checked ? 'translate-x-4' : 'translate-x-0',
    medium: checked ? 'translate-x-5' : 'translate-x-0',
    large: checked ? 'translate-x-6' : 'translate-x-0',
  };

  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex items-center rounded-full shrink-0",
          "transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-muted",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          sizeClasses[size] || sizeClasses.medium
        )}
      >
        <span className="sr-only">{label || 'Toggle switch'}</span>
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0",
            "transition-transform duration-200 ease-in-out",
            "mx-0.5",
            thumbSizeClasses[size] || thumbSizeClasses.medium,
            thumbTranslateClasses[size] || thumbTranslateClasses.medium
          )}
        />
      </button>
      {label && (
        <span
          className={cn(
            "text-sm font-medium select-none text-foreground",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={handleToggle}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default Toggle;
