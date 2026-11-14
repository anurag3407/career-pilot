import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, MousePointerClick, ShieldCheck } from 'lucide-react';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: 1280 },
  { id: 'tablet', label: 'Tablet', width: 834 },
  { id: 'mobile', label: 'Mobile', width: 390 },
];

/**
 * Live canvas.
 *
 * The stage route renders in an iframe at a *fixed* device width (1280 for
 * desktop) and is scaled down to fit the available space with CSS `zoom`.
 * That keeps the template's desktop layout — and its media queries — intact
 * even when the builder's own panels leave only ~700px of canvas.
 */
export default function CanvasPreview({
  doc,
  editing = false,
  device = 'desktop',
  zoom = 1,
  scrollToken = null,
  reloadToken = 0,
  onCommit,
  onNoField,
}) {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const post = useCallback((message) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(message, '*');
    } catch {
      /* iframe not mounted yet */
    }
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setViewport((current) =>
        Math.abs(current.width - rect.width) < 1 && Math.abs(current.height - rect.height) < 1
          ? current
          : { width: rect.width, height: rect.height },
      );
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'pf:ready') {
        setReady(true);
        // Handshake: a freshly loaded stage (first mount or a template switch)
        // starts empty, so push the document and edit mode back explicitly.
        post({ type: 'pf:doc', doc });
        post({ type: 'pf:editing', enabled: editing });
      }
      if (data.type === 'pf:commit') onCommit?.(data.path, data.value);
      if (data.type === 'pf:no-field') onNoField?.(data.text);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [doc, editing, onCommit, onNoField, post]);

  useEffect(() => {
    if (!ready) return;
    post({ type: 'pf:doc', doc });
  }, [doc, ready, post]);

  useEffect(() => {
    if (!ready) return;
    post({ type: 'pf:editing', enabled: editing });
  }, [editing, ready, post]);

  useEffect(() => {
    if (!ready || !scrollToken?.section) return;
    post({ type: 'pf:scroll', section: scrollToken.section });
  }, [scrollToken, ready, post]);

  useEffect(() => {
    if (!reloadToken) return;
    setReady(false);
    setFrameKey((key) => key + 1);
  }, [reloadToken]);

  const activeDevice = DEVICES.find((item) => item.id === device) || DEVICES[0];
  const frameWidth = activeDevice.width;
  const fit = viewport.width ? Math.min(1, (viewport.width - 2) / frameWidth) : 1;
  const scale = Math.max(0.25, Math.min(1.5, fit * zoom));
  const frameHeight = viewport.height ? viewport.height / scale : 720;

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card/60 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${ready ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
            {ready ? 'Live preview' : 'Connecting…'}
          </span>
          <span className="hidden truncate font-mono text-[10px] text-muted-foreground/70 sm:inline">
            {doc?.pf?.meta?.slug ? `/${doc.pf.meta.slug}` : '/your-portfolio'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          {editing ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 font-semibold text-emerald-500">
              <MousePointerClick className="h-3 w-3" /> Click text to edit
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 font-medium">
              <ShieldCheck className="h-3 w-3" /> Preview mode
            </span>
          )}
          <span className="hidden sm:inline">
            {activeDevice.label} · {frameWidth}px
          </span>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(120,120,130,0.18)_1px,transparent_0)] [background-size:16px_16px]">
        <div ref={containerRef} className="absolute inset-0 flex items-start justify-center overflow-hidden p-3 sm:p-5">
          <div
            className="origin-top overflow-hidden rounded-xl border border-border bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]"
            style={{ width: frameWidth, height: frameHeight, zoom: scale }}
          >
            <iframe
              key={frameKey}
              ref={iframeRef}
              src={`/portfolio-builder/stage?template=${encodeURIComponent(doc?.pf?.templateId || 'Studio')}`}
              title="Portfolio preview"
              className="h-full w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>

        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 text-xs text-muted-foreground shadow-lg">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Rendering your portfolio…
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
