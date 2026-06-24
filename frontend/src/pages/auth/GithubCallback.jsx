import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { githubAuthApi } from '../../services/api';
import { useGithubConfigStore } from '../../stores/useGithubConfigStore';
import toast from 'react-hot-toast';

/**
 * OAuth callback handler for the GitHub-Powered Portfolio Builder.
 * Reads ?error or ?success from the URL and refreshes the connection status.
 */
export default function GithubCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const error = params.get('error');
  const success = params.get('success');
  const login = params.get('login');
  const [status, setStatus] = useState('loading');
  const setOauthStatus = useGithubConfigStore((s) => s.setOauthStatus);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await githubAuthApi.status();
        const d = res.data || res;
        setOauthStatus({
          connected: d.connected,
          login: d.githubLogin,
          connectedAt: d.connectedAt,
        });
        if (error) {
          setStatus('error');
          toast.error(`GitHub OAuth failed: ${error}`);
        } else if (success) {
          setStatus('success');
          toast.success(`Connected to GitHub as @${login || d.githubLogin}`);
          setTimeout(() => navigate('/portfolio/github'), 1500);
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };
    run();
  }, [error, success, login, navigate, setOauthStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 text-center"
      >
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-foreground/5 mb-4">
          <Github className="h-7 w-7" />
        </div>

        {status === 'loading' && (
          <>
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-3" />
            <h2 className="text-lg font-bold mb-1">Connecting GitHub…</h2>
            <p className="text-sm text-muted-foreground">Verifying your account</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-500 mb-3" />
            <h2 className="text-lg font-bold mb-1">Connected!</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to the portfolio builder…
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-10 w-10 mx-auto text-destructive mb-3" />
            <h2 className="text-lg font-bold mb-1">Connection failed</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {error || 'Something went wrong during the OAuth handshake.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Link to="/settings">
                <button className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
                  Open Settings
                </button>
              </Link>
              <Link to="/portfolio/github">
                <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Try again
                </button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}