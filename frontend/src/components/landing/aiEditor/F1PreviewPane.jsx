import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { F1_EDITABLE_ELEMENTS, applyFieldEdit } from './f1EditableMap';
import InlineElementEditor from './InlineElementEditor';

/**
 * F1PreviewPane — left side of the AI Builder modal.
 *
 * Strategy: load `/preview/F1_Racing` in an iframe. That route already
 * renders the F1_Racing template wrapped in a `TemplatePreviewOnly`
 * listener that responds to `postMessage('UPDATE_PORTFOLIO_DATA')` and
 * reads `localStorage.ai_portfolio_draft` on mount.
 *
 * For click-to-edit: we listen to clicks inside the iframe, identify
 * which editable element was clicked using a text-matching heuristic
 * against the configured `matchText` patterns, and open an
 * InlineElementEditor popover positioned over the click target.
 */

const F1_PREVIEW_PATH = '/preview/F1_Racing';

function findElementForClick(clickedText, editableElements, currentData) {
  if (!clickedText) return null;
  const text = clickedText.trim();
  if (!text) return null;

  for (const el of editableElements) {
    // 1. Match against current live data
    if (el.dataPath && currentData) {
      const parts = el.dataPath.split('.');
      let cur = currentData;
      for (const p of parts) {
        if (cur == null) break;
        cur = cur[p];
      }
      if (cur != null) {
        const curStr = String(cur).trim();
        if (curStr && (text.includes(curStr) || curStr.includes(text))) {
          return el;
        }
      }
    }

    // 2. Fallback to default matchText array
    if (el.matchText && el.matchText.length > 0) {
      if (el.matchText.some((m) => text.includes(m) || m.includes(text))) {
        return el;
      }
    }
  }
  return null;
}

export default function F1PreviewPane({
  portfolioData,
  onUpdate,
  onRequestEnhance,
  onShowToast,
}) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState(null); // { element, position, currentValue }
  const [highlightSlug, setHighlightSlug] = useState(null);

  // Push current data into iframe (both via localStorage for first paint
  // AND via postMessage for live updates while it's open)
  useEffect(() => {
    try {
      localStorage.setItem('ai_portfolio_draft', JSON.stringify(portfolioData || {}));
    } catch (e) {
      // ignore quota errors
    }
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'UPDATE_PORTFOLIO_DATA', payload: portfolioData },
        '*'
      );
    }
  }, [portfolioData]);

  const portfolioDataRef = useRef(portfolioData);
  useEffect(() => {
    portfolioDataRef.current = portfolioData;
  }, [portfolioData]);

  const handleIframeClick = useCallback((event) => {
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

    try {
      const innerDoc = iframe.contentDocument;
      const target = event.target;

      // Walk up a few levels to find a node with substantive text
      let candidate = target;
      let depth = 0;
      let text = '';
      while (candidate && depth < 6 && candidate !== innerDoc.body) {
        if (candidate.textContent) {
          text = candidate.textContent.trim();
          if (text.length > 1 && text.length < 500) break;
        }
        candidate = candidate.parentElement;
        depth += 1;
      }

      const currentData = portfolioDataRef.current;
      const element = findElementForClick(text, F1_EDITABLE_ELEMENTS, currentData);
      if (!element) return;

      event.preventDefault();
      event.stopPropagation();

      const rect = target.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();
      const screenX = iframeRect.left + rect.left + rect.width / 2;
      const screenY = iframeRect.top + rect.top;

      const parts = (element.dataPath || '').split('.');
      let cur = currentData;
      for (const p of parts) {
        if (cur == null) break;
        cur = cur[p];
      }

      setEditorState({
        element,
        position: { x: screenX, y: screenY },
        currentValue: cur != null ? String(cur) : '',
        currentColor: currentData?.themeAccent || '#E10600',
      });
      setHighlightSlug(element.slug);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        iframe.contentDocument.addEventListener('click', handleIframeClick, true);
      }
    } catch (e) {
      // ignore cross-origin access errors
    }
  }, [handleIframeClick]);

  // Listen for iframe messages so we can react to inner events
  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      // Future: handle iframe-originated events like "element:clicked"
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorState(null);
    setHighlightSlug(null);
  }, []);

  const commitEdit = useCallback(
    ({ slug, value, color }) => {
      const element = F1_EDITABLE_ELEMENTS.find((e) => e.slug === slug);
      if (!element) return;
      const next = applyFieldEdit(portfolioData, element.dataPath, value);
      if (color) {
        next.themeAccent = color;
      }
      onUpdate?.(next);
      onShowToast?.(`Saved ${element.label}`);
    },
    [onShowToast, onUpdate, portfolioData]
  );

  const handleEnhanceForInline = useCallback(
    async ({ slug, kind, value }) => {
      try {
        const res = await fetch('/api/enhance/element', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, kind, value }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data?.enhanced ?? null;
      } catch (e) {
        return null; // falls back to mockEnhanceElement inside InlineElementEditor
      }
    },
    []
  );

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      setLoading(true);
      // Re-load iframe to pick up latest localStorage
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  return (
    <div className="relative h-full bg-[#070709] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800 bg-[#0c0c10]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            F1_Racing · live preview · click any element to edit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshPreview}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white border border-neutral-800 rounded px-2 py-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <a
            href={F1_PREVIEW_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white border border-neutral-800 rounded px-2 py-1"
          >
            Open <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Frame wrapper */}
      <div className="relative flex-1 bg-neutral-950 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
              <Loader2 className="h-4 w-4 animate-spin text-[#E10600]" />
              Loading F1_Racing…
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={F1_PREVIEW_PATH}
          title="F1 Racing preview"
          onLoad={handleIframeLoad}
          className="w-full h-full border-0 bg-[#070709]"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        />

        {/* Hint badge for new users */}
        {!editorState && !loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#E10600]/15 border border-[#E10600]/40 backdrop-blur-sm text-[10px] font-mono uppercase tracking-widest text-[#ff6655] pointer-events-none animate-pulse">
            👆 click any text on the page to edit
          </div>
        )}
      </div>

      {/* Footer hint when something is selected */}
      {highlightSlug && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 backdrop-blur-sm text-[10px] font-mono uppercase tracking-widest text-emerald-300 pointer-events-none">
          Selected: {highlightSlug}
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
          onRequestEnhance={handleEnhanceForInline}
        />
      )}
    </div>
  );
}