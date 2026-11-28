import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PortfolioProvider, normalizePortfolioData } from '../../../context/PortfolioContext';
import { getTemplateComponent, STUDIO_TEMPLATE_ID } from '../../../data/portfolioTemplates';
import StudioSite from './StudioSite';
import { buildFieldIndex, normalizeDocument, scoreDocument } from './portfolioDocument';

const EDITABLE_TAGS = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'P', 'SPAN', 'LI', 'A', 'DIV', 'STRONG', 'EM', 'BLOCKQUOTE', 'FIGCAPTION', 'TD', 'TH', 'SMALL', 'LABEL',
]);

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .trim()
    .toLowerCase();
}

/** Deepest element that actually holds the clicked text. */
function findTextElement(target) {
  let element = target;
  if (!(element instanceof HTMLElement)) return null;
  if (element.closest('input, textarea, select, button, svg, [contenteditable="true"], [data-pf-chrome="1"]')) return null;

  while (element.children.length > 0) {
    const child = element.lastElementChild;
    if (!(child instanceof HTMLElement) || !child.textContent?.trim()) break;
    if (!EDITABLE_TAGS.has(child.tagName)) break;
    element = child;
  }
  if (!EDITABLE_TAGS.has(element.tagName)) return null;
  return element;
}

/**
 * Studio stage — the document rendered inside the builder's iframe.
 *
 * Two jobs:
 *  1. render the Studio layout (ordered/hidden sections) or any art-directed
 *     template with the live document
 *  2. provide real in-canvas editing: `[data-pf-path]` nodes are exact, other
 *     templates fall back to matching the clicked text against the document.
 */
export default function StudioStage() {
  const [searchParams] = useSearchParams();
  const [doc, setDoc] = useState(() => {
    if (typeof window !== 'undefined' && window.__PF_DOC__) return normalizeDocument(window.__PF_DOC__);
    return normalizeDocument({ pf: { templateId: searchParams.get('template') || STUDIO_TEMPLATE_ID } });
  });
  const [editing, setEditing] = useState(false);

  const fieldIndexRef = useRef([]);
  const activeEditRef = useRef(null);

  const fieldIndex = useMemo(() => buildFieldIndex(doc), [doc]);
  useEffect(() => {
    fieldIndexRef.current = fieldIndex;
  }, [fieldIndex]);

  const post = useCallback((message) => {
    try {
      window.parent?.postMessage(message, '*');
    } catch {
      /* not embedded */
    }
  }, []);

  /* ── bridge messages ───────────────────────────────────────────────────── */
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'pf:doc' && data.doc) {
        setDoc(normalizeDocument(data.doc));
      }
      if (data.type === 'pf:editing') {
        setEditing(Boolean(data.enabled));
        if (!data.enabled && activeEditRef.current) {
          const active = activeEditRef.current;
          active.element.removeAttribute('contenteditable');
          active.element.classList.remove('pf-canvas-editing');
          activeEditRef.current = null;
        }
      }
      if (data.type === 'pf:scroll') {
        const target = document.querySelector(`[data-pf-section="${data.section}"]`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (data.type === 'pf:reload') {
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    post({ type: 'pf:ready', templateId: doc.pf.templateId });
    return () => window.removeEventListener('message', handleMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  /* ── in-canvas editing for art-directed templates ──────────────────────── */
  useEffect(() => {
    const root = document.getElementById('pf-stage-root');
    if (!root) return undefined;

    const resolvePath = (element) => {
      const direct = element.getAttribute('data-pf-path');
      if (direct) return direct;

      const text = normalizeText(element.textContent);
      if (!text || text.length < 2) return null;

      const matches = fieldIndexRef.current.filter((entry) => normalizeText(entry.value) === text);
      if (matches.length === 1) return matches[0].path;
      if (matches.length > 1) {
        // Prefer the most specific (longest) value, which is usually the
        // unique headline rather than a shared "Read more" label.
        return matches.reduce((best, entry) => (entry.value.length > best.value.length ? entry : best)).path;
      }
      return null;
    };

    const finish = (element, path, original, { commit }) => {
      const value = commit ? element.innerText?.replace(/\u00a0/g, ' ').trimEnd() : original;
      element.removeAttribute('contenteditable');
      element.classList.remove('pf-canvas-editing');
      if (!commit) element.textContent = original;
      activeEditRef.current = null;
      if (commit && path) post({ type: 'pf:commit', path, value });
    };

    if (!editing) {
      root.classList.remove('pf-canvas-editing-mode');
      return undefined;
    }

    root.classList.add('pf-canvas-editing-mode');

    const handleClick = (event) => {
      const link = event.target.closest?.('a');
      if (link) event.preventDefault();

      if (activeEditRef.current) return;
      const element = findTextElement(event.target);
      if (!element) return;

      const path = resolvePath(element);
      if (!path) {
        post({ type: 'pf:no-field', text: String(element.textContent || '').slice(0, 60) });
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const original = element.innerText || element.textContent || '';
      element.setAttribute('contenteditable', 'true');
      element.classList.add('pf-canvas-editing');
      activeEditRef.current = { element, path, original };
      element.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);

      const onKeyDown = (keyEvent) => {
        if (keyEvent.key === 'Escape') {
          keyEvent.preventDefault();
          element.removeEventListener('keydown', onKeyDown);
          finish(element, path, original, { commit: false });
        }
        if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
          keyEvent.preventDefault();
          element.blur();
        }
      };
      element.addEventListener('keydown', onKeyDown);

      const onBlur = () => {
        element.removeEventListener('blur', onBlur);
        element.removeEventListener('keydown', onKeyDown);
        if (activeEditRef.current?.element === element) finish(element, path, original, { commit: true });
      };
      element.addEventListener('blur', onBlur);
    };

    const handleMouseOver = (event) => {
      if (activeEditRef.current) return;
      const element = findTextElement(event.target);
      if (!element || element.dataset.pfHover === '1') return;
      document.querySelectorAll('[data-pf-hover="1"]').forEach((node) => {
        node.removeAttribute('data-pf-hover');
      });
      if (resolvePath(element)) element.dataset.pfHover = '1';
    };

    const handleMouseOut = (event) => {
      const element = event.target;
      if (element?.dataset?.pfHover === '1') element.removeAttribute('data-pf-hover');
    };

    root.addEventListener('click', handleClick, true);
    root.addEventListener('mouseover', handleMouseOver, true);
    root.addEventListener('mouseout', handleMouseOut, true);
    return () => {
      root.removeEventListener('click', handleClick, true);
      root.removeEventListener('mouseover', handleMouseOver, true);
      root.removeEventListener('mouseout', handleMouseOut, true);
      root.classList.remove('pf-canvas-editing-mode');
    };
  }, [editing, post]);

  const templateId = doc.pf.templateId || STUDIO_TEMPLATE_ID;
  const isStudio = templateId === STUDIO_TEMPLATE_ID;
  const TemplateComponent = useMemo(
    () => (isStudio ? null : getTemplateComponent(templateId)),
    [isStudio, templateId],
  );

  const portfolioData = useMemo(() => normalizePortfolioData(doc, { isDeploy: false }), [doc]);
  const readiness = useMemo(() => scoreDocument(doc), [doc]);

  return (
    <div id="pf-stage-root" className="cp-raw-palette" style={{ minHeight: '100vh' }}>
      <style>{`
        #pf-stage-root.pf-canvas-editing-mode, #pf-stage-root.pf-canvas-editing-mode * { cursor: text !important; }
        #pf-stage-root [data-pf-hover="1"] { outline: 1px dashed rgba(52, 211, 153, 0.8) !important; outline-offset: 3px !important; }
        #pf-stage-root .pf-canvas-editing { outline: 2px solid #34d399 !important; outline-offset: 3px !important; background: rgba(52, 211, 153, 0.08) !important; }
      `}</style>

      {isStudio ? (
        <StudioSite
          doc={doc}
          editable={editing}
          onEdit={(path, value, options) => post({ type: 'pf:commit', path, value, options })}
          onAction={(action, payload) => post({ type: 'pf:action', action, payload })}
        />
      ) : (
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-xs">
              Loading template…
            </div>
          }
        >
          <PortfolioProvider portfolioData={portfolioData}>
            {TemplateComponent && (
              <TemplateComponent
                portfolioData={portfolioData}
                data={portfolioData}
                qualityScore={readiness.score}
                qualitySuggestions={readiness.failing.map((check) => check.hint)}
                missingInfo={[]}
              />
            )}
          </PortfolioProvider>
        </Suspense>
      )}
    </div>
  );
}
