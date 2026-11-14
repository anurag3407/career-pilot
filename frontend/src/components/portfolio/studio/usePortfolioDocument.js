import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../../../services/api';
import {
  createDocument,
  normalizeDocument,
  parseDocument,
  serializeDocument,
  setPath,
  moveItem,
  uid,
  slugify,
} from './portfolioDocument';

const STORAGE_KEY = 'careerpilot:portfolio:studio:v1';
const DRAFT_KEY = 'ai_portfolio_draft';
const META_KEY = 'careerpilot:portfolio:studio:meta:v1';
const HISTORY_LIMIT = 80;
const MERGE_WINDOW_MS = 900;

function readJson(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — the document still lives in memory */
  }
}

function loadInitialDocument(templateId) {
  const stored = readJson(STORAGE_KEY);
  if (stored) {
    try {
      return normalizeDocument(stored);
    } catch {
      /* fall through to the draft */
    }
  }
  const draft = readJson(DRAFT_KEY);
  if (draft) {
    try {
      return normalizeDocument(draft);
    } catch {
      /* fall through to a fresh document */
    }
  }
  return createDocument({ templateId });
}

/**
 * The Studio's document store.
 *
 * - one immutable document + undo/redo history (typing coalesces into a single
 *   history entry per field)
 * - debounced autosave to localStorage, mirrored into the legacy
 *   `ai_portfolio_draft` key so the gallery and preview routes keep working
 * - explicit "save to account" through Supabase (create on first save,
 *   update afterwards)
 */
export function usePortfolioDocument({ templateId = 'Studio', portfolioId: initialPortfolioId = null } = {}) {
  const [doc, setDoc] = useState(() => loadInitialDocument(templateId));
  const [history, setHistory] = useState({ past: [], future: [] });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [portfolioId, setPortfolioId] = useState(
    () => initialPortfolioId || readJson(META_KEY)?.portfolioId || null,
  );
  const [hydrated, setHydrated] = useState(false);

  // Refs mirror state for callbacks. They are written only from handlers and
  // effects — never during render — so reads always see the last commit.
  const docRef = useRef(doc);
  const historyRef = useRef(history);
  const mergeRef = useRef({ key: null, time: 0 });

  const commitDoc = useCallback((next) => {
    docRef.current = next;
    setDoc(next);
  }, []);

  const commitHistory = useCallback((next) => {
    historyRef.current = next;
    setHistory(next);
  }, []);

  /* ── load a saved document (cloud) ─────────────────────────────────────── */
  useEffect(() => {
    if (!initialPortfolioId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const result = await portfolioApi.getById(initialPortfolioId);
        const row = result?.data || result?.portfolio || null;
        if (cancelled || !row) return;
        commitDoc(normalizeDocument(row));
        commitHistory({ past: [], future: [] });
        setPortfolioId(initialPortfolioId);
      } catch (error) {
        console.warn('Could not load the saved portfolio document', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialPortfolioId, commitDoc, commitHistory]);

  /* ── autosave ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => {
      writeJson(STORAGE_KEY, doc);
      writeJson(DRAFT_KEY, doc);
      writeJson(META_KEY, { portfolioId, updatedAt: Date.now() });
      setSavedAt(Date.now());
      setDirty(false);
      setHydrated(true);
    }, 700);
    return () => clearTimeout(timer);
  }, [doc, portfolioId]);

  const apply = useCallback((mutator, options = {}) => {
    const previous = docRef.current;
    const next = typeof mutator === 'function' ? mutator(previous) : mutator;
    if (!next || next === previous) return;

    const now = Date.now();
    const key = options.mergeKey || null;
    const shouldMerge = Boolean(key) && mergeRef.current.key === key && now - mergeRef.current.time < MERGE_WINDOW_MS;
    mergeRef.current = { key, time: now };

    if (options.history !== false && !shouldMerge) {
      commitHistory({
        past: [...historyRef.current.past, previous].slice(-HISTORY_LIMIT),
        future: [],
      });
    }
    commitDoc(next);
    setDirty(true);
  }, [commitDoc, commitHistory]);

  const patch = useCallback(
    (path, value, options = {}) => {
      apply((current) => setPath(current, path, value), {
        mergeKey: options.mergeKey === undefined ? path : options.mergeKey,
        history: options.history,
      });
    },
    [apply],
  );

  const patchFields = useCallback(
    (fields, options = {}) => {
      apply((current) => {
        let next = current;
        for (const [path, value] of Object.entries(fields)) next = setPath(next, path, value);
        return next;
      }, { mergeKey: options.mergeKey || null, history: options.history });
    },
    [apply],
  );

  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (!past.length) return;
    const previous = past[past.length - 1];
    mergeRef.current = { key: null, time: 0 };
    commitHistory({ past: past.slice(0, -1), future: [docRef.current, ...future].slice(0, HISTORY_LIMIT) });
    commitDoc(previous);
    setDirty(true);
  }, [commitDoc, commitHistory]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (!future.length) return;
    const [next, ...rest] = future;
    mergeRef.current = { key: null, time: 0 };
    commitHistory({ past: [...past, docRef.current].slice(-HISTORY_LIMIT), future: rest });
    commitDoc(next);
    setDirty(true);
  }, [commitDoc, commitHistory]);

  /* ── list helpers ──────────────────────────────────────────────────────── */
  const readList = useCallback((path) => {
    const value = String(path)
      .split('.')
      .reduce((acc, key) => (acc == null ? undefined : acc[key]), docRef.current);
    return Array.isArray(value) ? value : [];
  }, []);

  const addItem = useCallback(
    (path, factory) => {
      const items = readList(path);
      const item = typeof factory === 'function' ? factory(items.length) : factory;
      patch(path, [...items, { id: uid('item'), ...item }], { history: true });
    },
    [patch, readList],
  );

  const removeItem = useCallback(
    (path, index) => {
      patch(path, readList(path).filter((_, i) => i !== index), { history: true });
    },
    [patch, readList],
  );

  const moveListItem = useCallback(
    (path, from, to) => {
      patch(path, moveItem(readList(path), from, to), { history: true });
    },
    [patch, readList],
  );

  const patchItem = useCallback(
    (path, index, field, value, options = {}) => {
      const items = readList(path);
      if (index < 0 || index >= items.length) return;
      const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
      patch(path, next, { mergeKey: options.mergeKey === undefined ? `${path}.${index}.${field}` : options.mergeKey });
    },
    [patch, readList],
  );

  /* ── sections ──────────────────────────────────────────────────────────── */
  const setSections = useCallback(
    (sections, options = {}) => {
      apply((current) => ({ ...current, pf: { ...current.pf, sections } }), options);
    },
    [apply],
  );

  const reorderSections = useCallback(
    (from, to) => {
      apply((current) => ({
        ...current,
        pf: { ...current.pf, sections: moveItem(current.pf.sections, from, to) },
      }));
    },
    [apply],
  );

  const toggleSection = useCallback(
    (sectionId) => {
      apply((current) => ({
        ...current,
        pf: {
          ...current.pf,
          sections: current.pf.sections.map((section) =>
            section.id === sectionId ? { ...section, visible: !section.visible } : section,
          ),
        },
      }));
    },
    [apply],
  );

  const addCustomSection = useCallback(() => {
    const customId = uid('section');
    apply((current) => ({
      ...current,
      custom: [
        ...current.custom,
        {
          id: customId,
          title: 'New section',
          description: '',
          items: [
            { id: uid('item'), title: 'First item', description: 'Describe the work, award or talk.', meta: '', url: '' },
          ],
        },
      ],
      pf: {
        ...current.pf,
        sections: [
          ...current.pf.sections,
          { id: customId, type: 'custom', visible: true, customId },
        ],
      },
    }));
    return customId;
  }, [apply]);

  const removeSection = useCallback(
    (section) => {
      apply((current) => {
        if (!section) return current;
        if (section.type === 'custom') {
          return {
            ...current,
            custom: current.custom.filter((entry) => entry.id !== section.customId),
            pf: {
              ...current.pf,
              sections: current.pf.sections.filter((entry) => entry.id !== section.id),
            },
          };
        }
        return {
          ...current,
          pf: {
            ...current.pf,
            sections: current.pf.sections.filter((entry) => entry.id !== section.id),
          },
        };
      });
    },
    [apply],
  );

  /* ── template + design ─────────────────────────────────────────────────── */
  const setTemplate = useCallback(
    (nextTemplateId) => {
      apply((current) => ({
        ...current,
        pf: { ...current.pf, templateId: String(nextTemplateId || 'Studio') },
      }));
    },
    [apply],
  );

  const setDesign = useCallback(
    (patchObject, options = {}) => {
      apply(
        (current) => ({ ...current, pf: { ...current.pf, design: { ...current.pf.design, ...patchObject } } }),
        { mergeKey: options.mergeKey || null },
      );
    },
    [apply],
  );

  /* ── persistence ───────────────────────────────────────────────────────── */
  const save = useCallback(async () => {
    setSaving(true);
    const payload = {
      ...docRef.current,
      templateId: docRef.current.pf.templateId,
      title: docRef.current.pf.meta.siteTitle || docRef.current.personal.name || 'My portfolio',
      theme: docRef.current.pf.design.preset,
    };
    try {
      if (portfolioId) {
        await portfolioApi.update(portfolioId, payload);
      } else {
        const slug = slugify(docRef.current.pf.meta.slug || docRef.current.personal.name, `portfolio-${uid('s')}`);
        const created = await portfolioApi.create({ ...payload, slug });
        const row = created?.data || created?.portfolio;
        if (row?.id) {
          setPortfolioId(row.id);
          writeJson(META_KEY, { portfolioId: row.id, updatedAt: Date.now() });
        }
      }
      setDirty(false);
      setSavedAt(Date.now());
      toast.success('Portfolio saved');
      return true;
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Could not save to your account — your work is stored locally.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [portfolioId]);

  const exportDocument = useCallback(() => {
    const blob = new Blob([serializeDocument(docRef.current)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    const name = slugify(docRef.current.personal.name || 'portfolio');
    anchor.href = url;
    anchor.download = `${name}.portfolio.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Portfolio JSON downloaded');
  }, []);

  const importDocument = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = parseDocument(String(reader.result || ''));
        apply(next);
        toast.success('Portfolio imported');
      } catch (error) {
        toast.error(error?.message || 'That file could not be read.');
      }
    };
    reader.readAsText(file);
  }, [apply]);

  const resetDocument = useCallback(
    (options = {}) => {
      apply(createDocument({ templateId: docRef.current.pf.templateId, sample: options.sample !== false }));
      toast.success('Portfolio reset');
    },
    [apply],
  );

  const state = useMemo(
    () => ({
      doc,
      dirty,
      saving,
      savedAt,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      portfolioId,
    }),
    [doc, dirty, saving, savedAt, history, portfolioId],
  );

  return {
    ...state,
    apply,
    patch,
    patchFields,
    undo,
    redo,
    addItem,
    removeItem,
    moveListItem,
    patchItem,
    setSections,
    reorderSections,
    toggleSection,
    addCustomSection,
    removeSection,
    setTemplate,
    setDesign,
    save,
    exportDocument,
    importDocument,
    resetDocument,
    ready: hydrated,
  };
}
