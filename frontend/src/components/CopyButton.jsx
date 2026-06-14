import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * CopyButton – copies `text` to clipboard and shows a "Copied!" badge.
 *
 * Props:
 *  text        – string to copy (required)
 *  label       – button label shown next to the icon (default: "Copy")
 *  size        – icon size in px (default: 14)
 *  className   – extra CSS classes for the button
 *  variant     – "default" | "ghost" (controls base styling)
 */
export default function CopyButton({
  text,
  label = 'Copy',
  size = 14,
  className = '',
  variant = 'default',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation(); // prevent parent onClick from firing
    if (!text) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers / insecure contexts
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silently fail; parent can add toast if needed
    }
  };

  const base =
    variant === 'ghost'
      ? 'inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors'
      : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ' +
        (copied
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border/80');

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : `Copy ${label}`}
      className={`${base} ${className}`}
    >
      {copied ? (
        <Check size={size} className="shrink-0" />
      ) : (
        <Copy size={size} className="shrink-0" />
      )}
      {label && <span>{copied ? 'Copied!' : label}</span>}
    </button>
  );
}
