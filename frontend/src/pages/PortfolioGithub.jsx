import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import AuthMethodPicker from '../components/githubPortfolio/AuthMethodPicker';
import RepoPicker from '../components/githubPortfolio/RepoPicker';
import PortfolioPreview from '../components/githubPortfolio/PortfolioPreview';
import { Button } from '../components/ui/button';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import { useGithubConfigStore } from '../stores/useGithubConfigStore';
import { githubPortfolioApi } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = ['auth', 'username', 'repos', 'preview'];

export default function PortfolioGithub() {
  const navigate = useNavigate();
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
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Auto-advance to username step when auth mode is chosen
  useEffect(() => {
    if (step === 'auth' && authMode) {
      // Stay on auth step until user clicks Continue
    }
  }, [step, authMode]);

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
      const pat = authMode === 'pat' ? getDecryptedToken() : null;
      const res = await githubPortfolioApi.build({
        username: username.trim(),
        token: pat,
        selectedRepos: Array.from(selected),
        templateSlug: 'github-default',
      });
      const data = res.data || res;
      setResult(data);
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
              className="space-y-5"
            >
              <PortfolioPreview data={result} />
              <div className="flex items-center justify-between rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4">
                <span className="text-xs text-muted-foreground">
                  Generated with {result.provider || 'AI'} · {result.selectedRepos.length} repos
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={startOver} className="gap-2">
                    Build another
                  </Button>
                  <Button
                    onClick={() => toast.success('Saved to your portfolio history')}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}