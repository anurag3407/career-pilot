import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Wand2, Save, X, Loader2, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { mockEnhanceElement } from './f1EditableMap';

/**
 * InlineElementEditor — floating popover anchored to a clicked element in
 * the F1 preview iframe. Provides:
 *   • text input (textarea for `kind === 'textarea'`)
 *   • color swatch + <input type="color"> for the optional color
 *   • ✨ Enhance button (calls backend, falls back to mock)
 *
 * Communicates changes upward via `onCommit({ value, color })` — the parent
 * updates portfolioData and pushes the new data into the iframe via the
 * existing `postMessage('UPDATE_PORTFOLIO_DATA')` channel.
 */
export default function InlineElementEditor({
  slug,
  label,
  kind = 'text',
  currentValue = '',
  currentColor = null,
  position, // { x, y } — screen coords for the popover
  onCommit,
  onClose,
  onRequestEnhance,
}) {
  const [value, setValue] = useState(currentValue);
  const [color, setColor] = useState(currentColor || '#E10600');
  const [enhancing, setEnhancing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-focus the input on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  // Close on Escape, save on Cmd/Ctrl+Enter
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        onCommit({ slug, value: valueRef.current, color });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onCommit, slug, color]);

  // Click outside to close
  useEffect(() => {
    const onClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay so the click that opened us doesn't immediately close us
    const t = setTimeout(() => document.addEventListener('mousedown', onClick), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onClick);
    };
  }, [onClose]);

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleEnhance = useCallback(async () => {
    setEnhancing(true);
    setError(null);
    try {
      let enhanced = null;
      const currentValue = valueRef.current;
      if (onRequestEnhance) {
        enhanced = await onRequestEnhance({ slug, kind, value: currentValue });
      }
      if (!enhanced) enhanced = mockEnhanceElement(kind, currentValue);
      if (enhanced) setValue(enhanced);
    } catch (e) {
      setError('Enhance failed. Please try again.');
    } finally {
      setEnhancing(false);
    }
    // We intentionally exclude `value` — capturing it would re-create this
    // callback on every keystroke and would tear down/recreate the
    // document-level listeners attached in other effects, which is the
    // cause of the EventEmitter MaxListeners warnings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, onRequestEnhance, slug]);

  const handleSave = useCallback(() => {
    onCommit({ slug, value, color });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }, [color, onCommit, slug, value]);

  // Enter to save for single-line text inputs
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && kind === 'text' && !e.shiftKey) {
      e.preventDefault();
      onCommit({ slug, value: valueRef.current, color });
    }
  }, [kind, onCommit, slug, color]);

  // Popover positioning with simple viewport clamping
  const POPOVER_W = 320;
  const left = Math.min(Math.max(position?.x ?? 0, 8), window.innerWidth - POPOVER_W - 8);
  const top = Math.min(Math.max((position?.y ?? 0) + 12, 8), window.innerHeight - 280);

  return (
    <div
      ref={popoverRef}
      data-editor-popover
      role="dialog"
      aria-label={`Edit ${label}`}
      className={cn(
        'absolute z-[100] w-[320px] rounded-xl border border-neutral-700 bg-[#0a0a0d]/98 backdrop-blur-xl',
        'shadow-2xl shadow-black/80 text-white p-3.5 space-y-2.5'
      )}
      style={{ left, top }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 truncate">
            Editing
          </div>
          <div className="text-xs font-semibold truncate">{label}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1 rounded"
          aria-label="Close editor"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Text input */}
      {kind === 'textarea' ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className={cn(
            'w-full rounded-lg bg-neutral-950 border border-neutral-700 px-3 py-2.5',
            'text-xs text-white placeholder-neutral-600 resize-none leading-relaxed',
            'focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]/40'
          )}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-lg bg-neutral-950 border border-neutral-700 px-3 py-2.5',
            'text-xs text-white placeholder-neutral-600',
            'focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]/40'
          )}
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      )}

      {/* Color row */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Color
          </span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-6 w-8 rounded border border-neutral-800 bg-neutral-950 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-neutral-400 uppercase">{color}</span>
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="text-[10px] text-red-400 font-mono">{error}</div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={enhancing}
          className={cn(
            'flex-1 inline-flex items-center justify-center gap-1.5',
            'rounded-lg border border-[#E10600]/40 bg-[#E10600]/10 px-2.5 py-2',
            'text-xs font-medium text-[#ff6655] hover:bg-[#E10600]/20 hover:border-[#E10600]/60',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          )}
        >
          {enhancing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Enhancing…
            </>
          ) : (
            <>
              <Wand2 className="h-3.5 w-3.5" />
              ✨ AI Enhance
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'flex-1 inline-flex items-center justify-center gap-1.5',
            'rounded-lg bg-emerald-500 hover:bg-emerald-400 px-2.5 py-2',
            'text-xs font-semibold text-black transition-colors'
          )}
        >
          {saved ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Saved ✓
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="text-[9px] font-mono text-neutral-600 text-center uppercase tracking-widest">
        {kind === 'text' ? 'Enter to save · ' : ''}⌘+Enter to save · Esc to close
      </div>
    </div>
  );
}