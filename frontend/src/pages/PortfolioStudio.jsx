import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ChevronDown,
  Download,
  ExternalLink,
  Layers,
  LayoutTemplate,
  Maximize2,
  Minus,
  Monitor,
  MousePointerClick,
  Plus,
  Redo2,
  Rocket,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  Upload,
} from 'lucide-react';
import { usePortfolioDocument } from '../components/portfolio/studio/usePortfolioDocument';
import CanvasPreview from '../components/portfolio/studio/CanvasPreview';
import Inspector from '../components/portfolio/studio/Inspector';
import SectionsPanel from '../components/portfolio/studio/SectionsPanel';
import TemplatesPanel from '../components/portfolio/studio/TemplatesPanel';
import DeployModal from '../components/portfolio/DeployModal';
import { SECTION_TYPES, scoreDocument } from '../components/portfolio/studio/portfolioDocument';
import { getTemplateMeta } from '../data/portfolioTemplates';
import { cn } from '../lib/utils';

const DEVICES = [
  { id: 'desktop', icon: Monitor, label: 'Desktop' },
  { id: 'tablet', icon: Tablet, label: 'Tablet' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
];

function formatSaved(savedAt, dirty, now) {
  if (dirty) return 'Unsaved changes';
  if (!savedAt || !now) return 'Autosave on';
  const seconds = Math.max(0, Math.round((now - savedAt) / 1000));
  if (seconds < 5) return 'Saved just now';
  if (seconds < 60) return `Saved ${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  return `Saved ${minutes}m ago`;
}

export default function PortfolioStudio() {
  const [searchParams] = useSearchParams();
  const initialTemplate = searchParams.get('template') || 'Studio';
  const portfolioId = searchParams.get('portfolioId');

  const store = usePortfolioDocument({ templateId: initialTemplate, portfolioId });
  const { doc } = store;

  const [panel, setPanel] = useState('sections');
  const [activeSectionId, setActiveSectionId] = useState(doc.pf.sections[0]?.id || 'hero');
  const [device, setDevice] = useState('desktop');
  const [zoom, setZoom] = useState(1);
  const [editing, setEditing] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(null);
  const [scrollToken, setScrollToken] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [publishOpen, setPublishOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [now, setNow] = useState(0);
  const fileInputRef = useRef(null);

  const openImportDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const activeSection = useMemo(
    () => doc.pf.sections.find((section) => section.id === activeSectionId) || doc.pf.sections[0],
    [doc.pf.sections, activeSectionId],
  );

  const readiness = useMemo(() => scoreDocument(doc), [doc]);
  const templateMeta = getTemplateMeta(doc.pf.templateId);
  const title = doc.pf.meta.siteTitle || [doc.personal.name, doc.personal.title].filter(Boolean).join(' — ') || 'Untitled portfolio';

  /* ticking clock keeps the autosave label honest */
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  const savedLabel = formatSaved(store.savedAt, store.dirty, now);

  /* keep the selected section valid after template/document swaps */
  useEffect(() => {
    if (!doc.pf.sections.some((section) => section.id === activeSectionId)) {
      setActiveSectionId(doc.pf.sections[0]?.id || 'hero');
    }
  }, [doc.pf.sections, activeSectionId]);

  const selectSection = useCallback((section) => {
    setActiveSectionId(section.id);
    setScrollToken({ section: section.id, at: Date.now() });
    setMobilePanel('right');
  }, []);

  const addSection = useCallback(
    (type) => {
      const existing = doc.pf.sections.find((section) => section.type === type);
      if (existing) {
        if (!existing.visible) store.toggleSection(existing.id);
        selectSection(existing);
        return;
      }
      const label = SECTION_TYPES.find((entry) => entry.type === type)?.label || type;
      store.setSections([...doc.pf.sections, { id: type, type, visible: true }]);
      setActiveSectionId(type);
      toast.success(`${label} section added`);
    },
    [doc.pf.sections, selectSection, store],
  );

  const handleAddCustom = useCallback(() => {
    const id = store.addCustomSection();
    setActiveSectionId(id);
    setMobilePanel('right');
  }, [store]);

  const handleSelectTemplate = useCallback(
    (templateId) => {
      store.setTemplate(templateId);
      const meta = getTemplateMeta(templateId);
      toast.success(`${meta.title} applied`);
    },
    [store],
  );

  const handleCommit = useCallback(
    (path, value) => {
      const current = path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), doc);
      if (typeof current === 'string' && current === value) return;
      store.patch(path, value, { history: true, mergeKey: null });
    },
    [doc, store],
  );

  /* keyboard shortcuts */
  useEffect(() => {
    const handler = (event) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        store.undo();
      }
      if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault();
        store.redo();
      }
      if (key === 's') {
        event.preventDefault();
        store.save();
      }
      if (key === 'e') {
        event.preventDefault();
        setEditing((value) => !value);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [store]);

  return (
    <div className="flex h-[calc(100vh-0px)] min-h-[640px] flex-col bg-background text-foreground lg:h-[calc(100vh-49px)]">
      {/* top bar */}
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-card/80 px-3 py-2 backdrop-blur">
        <Link
          to="/portfolio-builder"
          className="hidden items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground sm:flex"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Exit
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold leading-tight text-foreground">{title}</p>
            <p className="truncate text-[10px] leading-tight text-muted-foreground">
              {store.saving ? 'Saving…' : savedLabel}
              {' · '}
              {templateMeta.title}
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={store.undo}
              disabled={!store.canUndo}
              title="Undo (⌘Z)"
              aria-label="Undo"
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={store.redo}
              disabled={!store.canRedo}
              title="Redo (⇧⌘Z)"
              aria-label="Redo"
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="hidden items-center rounded-lg border border-border bg-background p-0.5 sm:flex">
            {DEVICES.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setDevice(id)}
                title={label}
                aria-label={label}
                aria-pressed={device === id}
                className={cn(
                  'rounded-md p-1.5 transition',
                  device === id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>

          <div className="hidden items-center rounded-lg border border-border bg-background p-0.5 md:flex">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(0.6, Number((value - 0.1).toFixed(2))))}
              aria-label="Zoom out"
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            >
              <Minus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="rounded-md px-1.5 py-1 text-[10px] font-semibold tabular-nums text-muted-foreground hover:text-foreground"
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(1.4, Number((value + 0.1).toFixed(2))))}
              aria-label="Zoom in"
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            aria-pressed={editing}
            title="Click-to-edit on the canvas (⌘E)"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition',
              editing
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                : 'border-border bg-background text-muted-foreground hover:text-foreground',
            )}
          >
            <MousePointerClick className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{editing ? 'Editing' : 'Edit on canvas'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.open(`/portfolio-builder/preview?template=${encodeURIComponent(doc.pf.templateId)}`, '_blank', 'noopener')}
            title="Open a full-page preview in a new tab"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={store.save}
            disabled={store.saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-foreground hover:border-primary/50 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </button>

          <button
            type="button"
            onClick={() => setPublishOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Rocket className="h-3.5 w-3.5" /> Publish
            <span className="ml-0.5 rounded bg-black/20 px-1 py-0.5 text-[9px] font-bold">{readiness.score}%</span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((value) => !value)}
              aria-label="More actions"
              className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() => setMoreOpen(false)}
                />
                <div className="absolute right-0 z-40 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      store.exportDocument();
                      setMoreOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <Download className="h-3.5 w-3.5 text-muted-foreground" /> Export JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openImportDialog();
                      setMoreOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <Upload className="h-3.5 w-3.5 text-muted-foreground" /> Import JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      store.resetDocument({ sample: true });
                      setMoreOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" /> Reset to sample
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      store.resetDocument({ sample: false });
                      setMoreOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" /> Start blank
                  </button>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) store.importDocument(file);
              event.target.value = '';
            }}
          />
        </div>
      </header>

      {/* body */}
      <div className="flex min-h-0 flex-1">
        {/* left panel */}
        <div className="hidden w-[286px] shrink-0 flex-col border-r border-border bg-card lg:flex">
          <div className="grid grid-cols-2 gap-1 border-b border-border p-2">
            {[
              { id: 'sections', label: 'Sections', icon: Layers },
              { id: 'templates', label: 'Templates', icon: LayoutTemplate },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPanel(item.id)}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-semibold transition',
                  panel === item.id
                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <item.icon className="h-3.5 w-3.5" /> {item.label}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1">
            {panel === 'sections' ? (
              <SectionsPanel
                doc={doc}
                activeSectionId={activeSectionId}
                onSelect={selectSection}
                onReorder={store.reorderSections}
                onToggle={store.toggleSection}
                onRemove={store.removeSection}
                onAddCustom={handleAddCustom}
                onAddSection={addSection}
              />
            ) : (
              <TemplatesPanel currentTemplateId={doc.pf.templateId} onSelectTemplate={handleSelectTemplate} />
            )}
          </div>
        </div>

        {/* canvas */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          <CanvasPreview
            doc={doc}
            editing={editing}
            device={device}
            zoom={zoom}
            scrollToken={scrollToken}
            reloadToken={reloadToken}
            onCommit={handleCommit}
            onNoField={() =>
              toast('That text belongs to the template itself — edit it from the panel on the right.', {
                icon: 'ℹ️',
              })
            }
          />

          {/* mobile panel triggers */}
          <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-between px-3 lg:hidden">
            <div className="pointer-events-auto flex gap-1.5">
              <button
                type="button"
                onClick={() => setMobilePanel('left')}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-lg"
              >
                <Layers className="mr-1 inline h-3 w-3" /> Sections
              </button>
              <button
                type="button"
                onClick={() => setMobilePanel('right')}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-lg"
              >
                Edit
              </button>
            </div>
            <button
              type="button"
              onClick={() => setDevice(device === 'desktop' ? 'mobile' : 'desktop')}
              className="pointer-events-auto rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold shadow-lg"
            >
              <Maximize2 className="mr-1 inline h-3 w-3" /> {device === 'desktop' ? 'Mobile' : 'Desktop'}
            </button>
          </div>
        </div>

        {/* right inspector */}
        <div className="hidden w-[340px] shrink-0 lg:block">
          <Inspector doc={doc} section={activeSection} store={store} onPublish={() => setPublishOpen(true)} />
        </div>
      </div>

      {/* mobile drawers */}
      {mobilePanel && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            type="button"
            aria-label="Close panel"
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobilePanel(null)}
          />
          <div className={cn('flex h-full w-[86%] max-w-sm flex-col bg-card shadow-2xl', mobilePanel === 'left' ? 'mr-auto' : 'ml-auto')}>
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-xs font-bold text-foreground">
                {mobilePanel === 'left' ? (panel === 'sections' ? 'Sections' : 'Templates') : 'Edit'}
              </span>
              <div className="flex gap-1">
                {mobilePanel === 'left' && (
                  <button
                    type="button"
                    onClick={() => setPanel(panel === 'sections' ? 'templates' : 'sections')}
                    className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground"
                  >
                    {panel === 'sections' ? 'Templates' : 'Sections'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobilePanel(null)}
                  className="rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-muted-foreground"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              {mobilePanel === 'left' ? (
                panel === 'sections' ? (
                  <SectionsPanel
                    doc={doc}
                    activeSectionId={activeSectionId}
                    onSelect={selectSection}
                    onReorder={store.reorderSections}
                    onToggle={store.toggleSection}
                    onRemove={store.removeSection}
                    onAddCustom={handleAddCustom}
                    onAddSection={addSection}
                  />
                ) : (
                  <TemplatesPanel currentTemplateId={doc.pf.templateId} onSelectTemplate={handleSelectTemplate} />
                )
              ) : (
                <Inspector doc={doc} section={activeSection} store={store} onPublish={() => setPublishOpen(true)} />
              )}
            </div>
          </div>
        </div>
      )}

      <DeployModal
        isOpen={publishOpen}
        onClose={() => setPublishOpen(false)}
        portfolioTitle={doc.pf.meta.siteTitle || doc.personal.name || 'My portfolio'}
        templateId={doc.pf.templateId}
        theme={doc.pf.design.preset}
        aiDraft={doc}
        onDeploySuccess={() => {
          setPublishOpen(false);
          toast.success('Published — link copied to your deployments');
        }}
        onEditContent={() => {
          setPublishOpen(false);
          setEditing(true);
        }}
      />
    </div>
  );
}
