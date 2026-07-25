import React, { useCallback, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, MousePointerClick } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { F1_EDITABLE_ELEMENTS, applyFieldEdit, resolveEditableFromClick } from './f1EditableMap';
import InlineElementEditor from './InlineElementEditor';
import F1RacingTemplate from '../../portfolio/templates/F1_Racing/index';

/**
 * F1PreviewPane — left side of the AI Builder modal.
 *
 * v2: Renders the F1_Racing template DIRECTLY in the React tree (no iframe).
 * Click-to-edit works via event delegation on the wrapper div. We walk up
 * the DOM from the click target, extract text content, and resolve it
 * against the current portfolioData to find the matching editable field.
 *
 * This eliminates all cross-origin issues, postMessage round-trips, and
 * fragile text-matching heuristics that broke after the first edit.
 */
export default function F1PreviewPane({
  portfolioData,
  onUpdate,
  onShowToast,
}) {
  const containerRef = useRef(null);
  const [editorState, setEditorState] = useState(null);
  const [hoveredPath, setHoveredPath] = useState(null);

  const handleClick = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;

    // Don't intercept clicks on the editor popover itself
    if (e.target.closest('[data-editor-popover]')) return;

    // Walk up from click target to find meaningful text
    let target = e.target;
    let depth = 0;
    let text = '';

    while (target && target !== container && depth < 8) {
      const nodeText = target.textContent?.trim() || '';
      if (nodeText.length > 1 && nodeText.length < 600) {
        text = nodeText;
        break;
      }
      target = target.parentElement;
      depth += 1;
    }

    if (!text) return;

    // Resolve which editable field this text belongs to
    const resolved = resolveEditableFromClick(text, portfolioData);
    if (!resolved) return;

    e.preventDefault();
    e.stopPropagation();

    // Get position for the popover
    const rect = (target || e.target).getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setEditorState({
      element: resolved.element,
      position: {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top,
      },
      currentValue: resolved.currentValue,
      currentColor: portfolioData?.themeAccent || '#E10600',
    });
  }, [portfolioData]);

  const handleMouseOver = useCallback((e) => {
    const container = containerRef.current;
    if (!container || editorState) return;

    let target = e.target;
    let depth = 0;
    let text = '';

    while (target && target !== container && depth < 6) {
      const nodeText = target.textContent?.trim() || '';
      if (nodeText.length > 1 && nodeText.length < 300) {
        text = nodeText;
        break;
      }
      target = target.parentElement;
      depth += 1;
    }

    if (!text) {
      setHoveredPath(null);
      return;
    }

    const resolved = resolveEditableFromClick(text, portfolioData);
    setHoveredPath(resolved ? resolved.element.dataPath : null);
  }, [portfolioData, editorState]);

  const closeEditor = useCallback(() => {
    setEditorState(null);
  }, []);

  const commitEdit = useCallback(({ slug, value, color }) => {
    const element = F1_EDITABLE_ELEMENTS.find((el) => el.slug === slug);
    if (!element) return;
    const next = applyFieldEdit(portfolioData, element.dataPath, value);
    if (color && color !== portfolioData?.themeAccent) {
      next.themeAccent = color;
    }
    onUpdate?.(next);
    onShowToast?.(`Updated ${element.label}`);
    setEditorState(null);
  }, [onShowToast, onUpdate, portfolioData]);

  const handleEnhance = useCallback(async ({ slug, kind, value }) => {
    try {
      const res = await fetch('/api/enhance/element', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, kind, value }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data?.enhanced ?? null;
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="relative h-full bg-[#070709] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800 bg-[#0c0c10] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            F1_Racing · click any element to edit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/preview/F1_Racing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white border border-neutral-800 rounded px-2 py-1 transition-colors"
          >
            Full Preview <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Template rendered directly — no iframe */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={() => setHoveredPath(null)}
        className={cn(
          'relative flex-1 overflow-y-auto overflow-x-hidden',
          'cursor-crosshair',
          hoveredPath && 'cursor-pointer'
        )}
      >
        {/* Editable highlight overlay hint */}
        {!editorState && (
          <div className="sticky top-0 z-20 flex justify-center pointer-events-none py-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E10600]/15 border border-[#E10600]/40 backdrop-blur-sm text-[10px] font-mono uppercase tracking-widest text-[#ff6655]">
              <MousePointerClick className="h-3 w-3" />
              Click any text to edit inline
            </div>
          </div>
        )}

        {/* The actual template — rendered in-place, fully interactive */}
        <div className={cn(
          'transition-opacity duration-200',
          hoveredPath && '[&_*]:transition-shadow'
        )}>
          <F1RacingTemplate portfolioData={portfolioData} />
        </div>
      </div>

      {/* Selected element indicator */}
      {editorState && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 backdrop-blur-sm text-[10px] font-mono uppercase tracking-widest text-emerald-300 pointer-events-none">
          Editing: {editorState.element.label}
        </div>
      )}

      {/* Inline editor popover */}
      {editorState && (
        <InlineElementEditor
          slug={editorState.element.slug}
          label={editorState.element.label}
          kind={editorState.element.kind}
          currentValue={editorState.currentValue}
          currentColor={editorState.currentColor}
          position={editorState.position}
          onCommit={commitEdit}
          onClose={closeEditor}
          onRequestEnhance={handleEnhance}
        />
      )}
    </div>
  );
}
