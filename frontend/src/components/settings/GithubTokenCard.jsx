import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Key,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useGithubConfigStore } from '../../stores/useGithubConfigStore';
import { githubPortfolioApi, githubAuthApi } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Settings card for GitHub integration. Supports all three auth modes:
 *   1. PAT (paste a Personal Access Token)
 *   2. OAuth App (one-click connect — handled by the backend)
 *   3. Public username (no token — low rate limits)
 */
export default function GithubTokenCard() {
  const token = useGithubConfigStore((s) => s.token);
  const validated = useGithubConfigStore((s) => s.validated);
  const validatedLogin = useGithubConfigStore((s) => s.validatedLogin);
  const scopes = useGithubConfigStore((s) => s.scopes);
  const isValidating = useGithubConfigStore((s) => s.isValidating);
  const validationError = useGithubConfigStore((s) => s.validationError);
  const oauthConnected = useGithubConfigStore((s) => s.oauthConnected);
  const oauthLogin = useGithubConfigStore((s) => s.oauthLogin);

  const setToken = useGithubConfigStore((s) => s.setToken);
  const markValidated = useGithubConfigStore((s) => s.markValidated);
  const setValidating = useGithubConfigStore((s) => s.setValidating);
  const setValidationError = useGithubConfigStore((s) => s.setValidationError);
  const clear = useGithubConfigStore((s) => s.clear);
  const setOauthStatus = useGithubConfigStore((s) => s.setOauthStatus);
  const disconnectOauth = useGithubConfigStore((s) => s.disconnectOauth);
  const getDecryptedToken = useGithubConfigStore((s) => s.getDecryptedToken);

  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [draftToken, setDraftToken] = useState('');

  // Refresh OAuth status when the card mounts
  useEffect(() => {
    githubAuthApi
      .status()
      .then((res) => {
        const d = res.data || res;
        if (d) {
          setOauthStatus({
            connected: d.connected,
            login: d.githubLogin,
            connectedAt: d.connectedAt,
          });
        }
      })
      .catch(() => {});
  }, [setOauthStatus]);

  const handleValidate = async () => {
    if (!draftToken || draftToken.length < 10) {
      setValidationError('Paste a GitHub PAT (at least 10 characters)');
      return;
    }
    setValidating(true);
    try {
      const res = await githubPortfolioApi.validateToken(draftToken);
      const data = res.data || res;
      setToken(draftToken);
      markValidated({ login: data.login, scopes: data.scopes || [] });
      toast.success(`Token validated — connected as @${data.login}`);
      setDraftToken('');
      setExpanded(false);
    } catch (err) {
      console.error(err);
      setValidationError(err.message || 'Token validation failed');
      toast.error(err.message || 'Token validation failed');
    }
  };

  const handleRemove = () => {
    if (!confirm('Remove the saved GitHub PAT from this browser?')) return;
    clear();
    toast.success('PAT removed');
  };

  const handleConnectOauth = async () => {
    try {
      const res = await githubAuthApi.start();
      const data = res.data || res;
      if (!data?.authUrl) {
        throw new Error('Failed to start OAuth flow');
      }
      window.location.href = data.authUrl;
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Could not start GitHub OAuth');
    }
  };

  const handleDisconnectOauth = async () => {
    if (!confirm('Disconnect GitHub? This will revoke server-side access to your repos.')) return;
    try {
      await githubAuthApi.disconnect();
      disconnectOauth();
      toast.success('GitHub disconnected');
    } catch (err) {
      toast.error(err.message || 'Disconnect failed');
    }
  };

  const isActive = validated || oauthConnected;

  return (
    <motion.div
      layout
      className={cn(
        'relative rounded-2xl border bg-card/80 backdrop-blur-sm transition-all',
        isActive ? 'border-emerald-500/30' : 'border-border'
      )}
    >
      {/* Header */}
      <button type="button"
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5">
            <Github className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold">GitHub</span>
              {isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Not connected
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {validated && oauthConnected
                ? `PAT @${validatedLogin} · OAuth @${oauthLogin}`
                : validated
                ? `PAT @${validatedLogin}`
                : oauthConnected
                ? `OAuth @${oauthLogin}`
                : 'Connect for private repos + 5000 req/hr'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform',
            expanded && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-border p-5">
              {/* OAuth connect row */}
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-sm font-bold">OAuth App — recommended</h4>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  One-click connection. We never see your password. Access is revocable.
                </p>
                {oauthConnected ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ Connected as @{oauthLogin}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDisconnectOauth}
                      className="gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectOauth}
                    size="sm"
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Connect GitHub
                  </Button>
                )}
              </div>

              {/* PAT paste row */}
              <div className="rounded-xl border border-border bg-background/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold">Personal Access Token</h4>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">
                  <a
                    href="https://github.com/settings/tokens?type=beta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    Generate a token <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  with <code className="text-[10px]">repo</code> +{' '}
                  <code className="text-[10px]">read:user</code> scopes. Stored encrypted in your browser.
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={draftToken}
                      onChange={(e) => setDraftToken(e.target.value)}
                      placeholder={
                        token
                          ? '•••••••••••• (saved — paste to replace)'
                          : 'ghp_xxxxxxxxxxxxxxxxxxxx'
                      }
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((p) => !p)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showKey ? 'Hide token' : 'Show token'}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button
                    onClick={handleValidate}
                    disabled={isValidating || !draftToken}
                    size="sm"
                    className="gap-2"
                  >
                    {isValidating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {token ? 'Replace' : 'Save'}
                  </Button>
                </div>

                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: [0, -4, 4, -4, 4, 0] }}
                    transition={{ duration: 0.35 }}
                    className="mt-2 flex items-center gap-1.5 text-xs text-destructive"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    {validationError}
                  </motion.div>
                )}

                {validated && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="font-semibold">@{validatedLogin}</span>
                      {scopes.length > 0 && (
                        <span className="text-muted-foreground">
                          · scopes: {scopes.slice(0, 4).join(', ')}
                          {scopes.length > 4 ? '…' : ''}
                        </span>
                      )}
                    </div>
                    <button type="button"
                      onClick={handleRemove}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove PAT"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Public option row */}
              <div className="rounded-xl border border-dashed border-border bg-background/30 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-bold text-muted-foreground">
                    Public repos only (no auth)
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Just paste a username on the Portfolio Builder page. Public data only,
                  60 req/hr limit.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}