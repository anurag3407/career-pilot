import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  MousePointerClick,
  Undo2,
  Redo2,
  RotateCcw,
  Save,
  ExternalLink,
} from 'lucide-react';
import AuthMethodPicker from '../components/githubPortfolio/AuthMethodPicker';
import RepoPicker from '../components/githubPortfolio/RepoPicker';
import PortfolioPreview from '../components/githubPortfolio/PortfolioPreview';
import { Button } from '../components/ui/button';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import { useGithubConfigStore } from '../stores/useGithubConfigStore';
import { githubPortfolioApi } from '../services/api';
import { fromGithubPortfolioBuild } from '../components/portfolio/studio/portfolioDocument';
import toast from 'react-hot-toast';

const STEPS = ['auth', 'username', 'repos', 'preview'];
const HISTORY_LIMIT = 50;

function hasGithubCustomLayout(layout) {
  if (!layout || typeof layout !== 'object') return false;
  if (layout.avatarSize && layout.avatarSize !== 64) return true;
  if (Object.values(layout.sections || {}).some((s) => (s?.maxWidth && s.maxWidth !== 'full') || s?.paddingY)) {
    return true;
  }
  if (Object.values(layout.projects || {}).some((p) => (p?.colSpan && p.colSpan > 1) || p?.cardHeight)) {
    return true;
  }
  if (Object.values(layout.skills || {}).some((s) => (s?.colSpan && s.colSpan > 1) || s?.cardHeight)) {
    return true;
  }
  return false;
}

export default function PortfolioGithub() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buildIdParam = searchParams.get('build');

  const activeProvider = useAIConfigStore((s) => s.activeProvider);
  const oauthConnected = useGithubConfigStore((s) => s.oauthConnected);
  const validated = useGithubConfigStore((s) => s.validated);
  const getDecryptedToken = useGithubConfigStore((s) => s.getDecryptedToken);

  const [step, setStep] = useState('auth');
  const [authMode, setAuthMode] = useState(null);
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingBuild, setLoadingBuild] = useState(Boolean(buildIdParam));
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(true);
  const [history, setHistory] = useState({ past: [], future: [] });
  const [saveState, setSaveState] = useState('saved'); // 'saved' | 'dirty' | 'saving' | 'error'

  const mergeRef = useRef({ key: null, time: 0 });
  const autosaveTimerRef = useRef(null);

  // Load an existing build when navigated via /github-portfolio/build?build=<id>
  useEffect(() => {
    if (!buildIdParam) return undefined;
    let cancelled = false;
    setLoadingBuild(true);
    githubPortfolioApi
      .getById(buildIdParam)
      .then((res) => {
        if (cancelled) return;
        const build = res.data || res;
        if (build) {
          setResult(build);
          setUsername(build.username || '');
          setSelected(new Set(build.selectedRepos || []));
          setHistory({ past: [], future: [] });
          setSaveState('saved');
          setStep('preview');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err?.message || 'Could not load saved portfolio build');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingBuild(false);
      });
    return () => {
      cancelled = true;
    };
  }, [buildIdParam]);

  // Auto-advance to username step when auth mode is chosen
  useEffect(() => {
    if (step === 'auth' && authMode) {
      // Stay on auth step until user clicks Continue
    }
  }, [step, authMode]);

  const persistBuild = useCallback(async (targetResult, { silent = false } = {}) => {
    const id = targetResult?._id || targetResult?.id;
    if (!id) return;
    setSaveState('saving');
    try {
      await githubPortfolioApi.update(id, {
        sections: targetResult.sections,
        layout: targetResult.layout || {},
      });
      setSaveState('saved');
      if (!silent) toast.success('Portfolio changes saved');
    } catch (err) {
      setSaveState('error');
      if (!silent) toast.error(err?.message || 'Failed to save portfolio changes');
    }
  }, []);

  const handlePreviewChange = useCallback(
    (nextResult, options = {}) => {
      const now = Date.now();
      const key = options.mergeKey || null;
      const shouldMerge =
        Boolean(key) && mergeRef.current.key === key && now - mergeRef.current.time < 900;
      mergeRef.current = { key, time: now };

      setResult((prev) => {
        if (!prev) return nextResult;
        if (!shouldMerge) {
          setHistory((h) => ({
            past: [...h.past, prev].slice(-HISTORY_LIMIT),
            future: [],
          }));
        }
        return nextResult;
      });
      setSaveState('dirty');

      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = setTimeout(() => {
        persistBuild(nextResult, { silent: true });
      }, 750);
    },
    [persistBuild],
  );

  useEffect(() => () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
  }, []);

  const handleUndo = useCallback(() => {
    setHistory((h) => {
      if (!h.past.length) return h;
      const previous = h.past[h.past.length - 1];
      setResult((current) => {
        if (current) {
          if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
          autosaveTimerRef.current = setTimeout(() => persistBuild(previous, { silent: true }), 500);
          setSaveState('dirty');
        }
        return previous;
      });
      return {
        past: h.past.slice(0, -1),
        future: result ? [result, ...h.future].slice(0, HISTORY_LIMIT) : h.future,
      };
    });
  }, [persistBuild, result]);

  const handleRedo = useCallback(() => {
    setHistory((h) => {
      if (!h.future.length) return h;
      const [next, ...rest] = h.future;
      setResult((current) => {
        if (current) {
          if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
          autosaveTimerRef.current = setTimeout(() => persistBuild(next, { silent: true }), 500);
          setSaveState('dirty');
        }
        return next;
      });
      return {
        past: result ? [...h.past, result].slice(-HISTORY_LIMIT) : h.past,
        future: rest,
      };
    });
  }, [persistBuild, result]);

  const resetSizes = useCallback(() => {
    if (!result) return;
    handlePreviewChange({ ...result, layout: {} });
    toast.success('Item sizes reset');
  }, [handlePreviewChange, result]);

  const openInStudio = useCallback(() => {
    if (!result) return;
    try {
      const studioDoc = fromGithubPortfolioBuild(result);
      window.localStorage.setItem('careerpilot:portfolio:studio:v1', JSON.stringify(studioDoc));
      window.localStorage.setItem('ai_portfolio_draft', JSON.stringify(studioDoc));
      navigate('/portfolio-builder/studio');
    } catch {
      toast.error('Could not open in Portfolio Studio');
    }
  }, [navigate, result]);

  const fetchRepos = async () => {
    if (!username.trim()) {
      toast.error('Enter a GitHub username');
      return;
    }
    setLoadingRepos(true);
    setError(null);
    try {
      const pat = authMode === 'pat' ? getDecryptedToken() : null;
      const res = await githubPortfolioApi.listRepos(username.trim(), pat);
      const data = res.data || res;
      if (data.rateLimited) {
        setError('GitHub rate limit reached. Add a token in Settings to continue.');
        return;
      }
      const list = data.repos || [];
      setRepos(list);
      // Auto-select top 6 by stars
      const top = list
        .filter((r) => !r.fork && !r.private)
        .sort((a, b) => b.stars - a.stars)
        .slice(0, 6);
      setSelected(new Set(top.map((r) => r.fullName)));
      setStep('repos');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch repos');
    } finally {
      setLoadingRepos(false);
    }
  };

  const toggleRepo = (fullName) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(fullName)) next.delete(fullName);
      else next.add(fullName);
      return next;
    });
  };

  const buildPortfolio = async () => {
    if (!activeProvider) {
      toast.error('Add an AI provider key in Settings first');
      navigate('/settings');
      return;
    }
    if (selected.size === 0) {
      toast.error('Select at least one repo');
      return;
    }
    setBuilding(true);
    setError(null);
    try {
      const pat = authMode === 'pat' ? (getDecryptedToken() || undefined) : undefined;
      const res = await githubPortfolioApi.build({
        username: username.trim(),
        token: pat,
        selectedRepos: Array.from(selected),
        templateSlug: 'github-default',
      });
      const data = res.data || res;
      setResult(data);
      setHistory({ past: [], future: [] });
      setSaveState('saved');
      setEditing(true);
      setStep('preview');
      toast.success(`Portfolio generated — ${data.selectedRepos.length} repos`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Portfolio build failed');
      if (err?.status === 403 || err?.requireApiKey) {
        toast.error('Add an AI provider key in Settings');
        navigate('/settings');
      } else {
        toast.error(err.message || 'Portfolio build failed');
      }
    } finally {
      setBuilding(false);
    }
  };

  const startOver = () => {
    setStep('auth');
    setAuthMode(null);
    setUsername('');
    setRepos([]);
    setSelected(new Set());
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/hub/portfolio/github"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            GitHub Portfolio Hub
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Step {STEPS.indexOf(step) + 1} of {STEPS.length}
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border text-xs font-bold uppercase tracking-wider mb-3">
            <Github className="w-3.5 h-3.5" />
            GitHub-Powered Portfolio
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Build a portfolio from your GitHub
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm">
            Pick a username, choose your best repos, and AI generates a complete portfolio in seconds.
          </p>
        </motion.div>

        {/* Step content */}
        {loadingBuild ? (
          <div className="rounded-2xl border border-border bg-card/80 p-12 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            Loading saved portfolio…
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {step === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-8"
            >
              <h2 className="text-lg font-bold mb-4">Choose how to connect</h2>
              <AuthMethodPicker
                value={authMode}
                onChange={setAuthMode}
                onContinue={(mode) => {
                  setAuthMode(mode);
                  setStep('username');
                }}
              />
              {(oauthConnected || validated) && (
                <p className="mt-4 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  You're already connected via {oauthConnected ? 'OAuth' : 'PAT'}.
                  Pick the matching option above to continue.
                </p>
              )}
            </motion.div>
          )}

          {step === 'username' && (
            <motion.div
              key="username"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-8 space-y-5"
            >
              <h2 className="text-lg font-bold">Whose GitHub are we pulling from?</h2>
              <div>
                <label className="text-sm font-medium">GitHub username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  maxLength={39}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') fetchRepos();
                  }}
                />
              </div>

              {authMode === 'pat' && !validated && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    You haven't added a GitHub PAT yet.{' '}
                    <Link to="/settings" className="text-amber-600 font-semibold hover:underline">
                      Add one in Settings
                    </Link>{' '}
                    first, or switch to public mode.
                  </p>
                </div>
              )}

              {authMode === 'oauth' && !oauthConnected && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Complete the OAuth flow in{' '}
                    <Link to="/settings" className="text-amber-600 font-semibold hover:underline">
                      Settings
                    </Link>{' '}
                    first, or switch to a different auth method.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep('auth')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={fetchRepos} disabled={!username.trim() || loadingRepos} className="gap-2">
                  {loadingRepos ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Fetch repos
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'repos' && (
            <motion.div
              key="repos"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Choose repos</h2>
                  <p className="text-sm text-muted-foreground">
                    From <strong>@{username}</strong> · {repos.length} repos found
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setStep('username')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </div>

              <RepoPicker
                repos={repos}
                selected={selected}
                onToggle={toggleRepo}
                max={12}
                loading={loadingRepos}
              />

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs text-destructive">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {selected.size} repo{selected.size === 1 ? '' : 's'} selected
                </span>
                <Button
                  onClick={buildPortfolio}
                  disabled={selected.size === 0 || building}
                  className="gap-2"
                  size="lg"
                >
                  {building ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating portfolio…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate portfolio
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && result && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Same-window Edit & Resize toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card/90 backdrop-blur-sm px-4 py-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing((v) => !v)}
                    aria-pressed={editing}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      editing
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MousePointerClick className="h-3.5 w-3.5" />
                    {editing ? 'Editing & resizing' : 'Edit & resize'}
                  </button>

                  <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={history.past.length === 0}
                      title="Undo"
                      aria-label="Undo"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={history.future.length === 0}
                      title="Redo"
                      aria-label="Redo"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                    >
                      <Redo2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {hasGithubCustomLayout(result.layout) && (
                    <button
                      type="button"
                      onClick={resetSizes}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset sizes
                    </button>
                  )}

                  {editing && (
                    <span className="hidden md:inline text-[11px] text-muted-foreground">
                      Click any text to edit · Drag edges or corners to resize items
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {saveState === 'saving'
                      ? 'Saving…'
                      : saveState === 'dirty'
                        ? 'Unsaved'
                        : saveState === 'error'
                          ? 'Save failed'
                          : 'Saved'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => persistBuild(result)}
                    disabled={saveState === 'saving'}
                    className="gap-1.5 h-8 text-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    onClick={openInStudio}
                    className="gap-1.5 h-8 text-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in Full Studio
                  </Button>
                </div>
              </div>

              <PortfolioPreview
                data={result}
                editable={editing}
                onChange={handlePreviewChange}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4">
                <span className="text-xs text-muted-foreground">
                  {saveState === 'saving' ? 'Saving changes…' : 'Synced to your account'} · Generated with{' '}
                  {result.provider || 'AI'} · {(result.selectedRepos || []).length} repos
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={startOver} className="gap-2">
                    Build another
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/hub/portfolio/github')}
                    className="gap-2"
                  >
                    View saved portfolios
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
}