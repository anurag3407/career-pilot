import { useState, useRef, useEffect, useId } from 'react';
import { Info, X } from 'lucide-react';

export default function AIReasoningTooltip({
  title = 'AI Insight',
  reason = '',
  details = [],
}) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);
  const tooltipId = useId();

  const detailList = (Array.isArray(details) ? details : [])
    .map((item) => (typeof item === 'string' ? item.trim() : String(item)))
    .filter(Boolean);

  const hasContent = Boolean(reason?.trim()) || detailList.length > 0;
  if (!hasContent) return null;

  useEffect(() => {
    if (!expanded) return undefined;

    const handleOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [expanded]);

  const showHoverTip = hovered && !expanded && Boolean(reason?.trim());

  return (
    <div ref={containerRef} className="relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-label={title}
        aria-expanded={expanded}
        aria-describedby={showHoverTip || expanded ? tooltipId : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded((prev) => !prev);
        }}
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {showHoverTip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 max-w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-lg"
        >
          <p className="line-clamp-4">{reason}</p>
        </div>
      )}

      {expanded && (
        <div
          id={tooltipId}
          role="dialog"
          aria-label={title}
          className="absolute left-1/2 top-full z-50 mt-2 w-72 max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-border bg-popover p-3 shadow-xl"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-xs font-semibold text-foreground">{title}</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(false);
              }}
              className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Dismiss details"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {reason?.trim() && (
            <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{reason}</p>
          )}

          {detailList.length > 0 && (
            <ul className="max-h-40 space-y-1.5 overflow-y-auto text-xs text-foreground">
              {detailList.map((detail, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
