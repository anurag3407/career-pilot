import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Sparkles, Key, ShieldCheck, History } from 'lucide-react';
import HubLayout from '../../components/HubLayout';
import ToolCard from '../../components/ToolCard';
import { motion } from 'framer-motion';
import { githubPortfolioApi } from '../../services/api';
import { useGithubConfigStore } from '../../stores/useGithubConfigStore';
import toast from 'react-hot-toast';

export default function GithubPortfolioHub() {
  const oauthConnected = useGithubConfigStore((s) => s.oauthConnected);
  const oauthLogin = useGithubConfigStore((s) => s.oauthLogin);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    githubPortfolioApi
      .getHistory(10)
      .then((res) => {
        const list = res.data || [];
        setHistory(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  const removeBuild = async (id) => {
    if (!confirm('Delete this portfolio?')) return;
    try {
      await githubPortfolioApi.remove(id);
      setHistory((prev) => prev.filter((b) => b._id !== id));
      toast.success('Deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <HubLayout
      icon={Github}
      title="GitHub-Powered Portfolio"
      description="Pull your repos, READMEs, languages and activity — AI generates a complete developer portfolio in seconds."
      color="foreground"
      breadcrumb="GitHub Portfolio"
    >
      <ToolCard
        to="/portfolio/github"
        icon={Sparkles}
        title="Build a Portfolio"
        description="Choose a username, pick your best repos, and AI drafts hero, about, projects and skills sections."
        badge="AI"
        color="foreground"
      />

      {/* Connection status card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5">
            <Github className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Connection</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {oauthConnected
                ? `Connected to @${oauthLogin} via OAuth. Private repos + 5000 req/hr unlocked.`
                : 'No GitHub connection. Public repos work with 60 req/hr limits. Add a token in Settings for the full experience.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to="/settings">
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                  <Key className="h-3.5 w-3.5" />
                  Manage GitHub settings
                </button>
              </Link>
              {!oauthConnected && (
                <Link to="/settings">
                  <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Connect with OAuth
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-bold">Recent Builds</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.slice(0, 6).map((b, i) => (
              <motion.div
                key={b._id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative group rounded-2xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <Link to={`/portfolio/github?build=${b._id}`} className="block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                      <Github className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">@{b.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.repoCount || 0} repos · {b.authMode || 'public'}
                      </p>
                    </div>
                  </div>
                  {b.sections?.hero?.headline && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {b.sections.hero.headline}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                </Link>
                <button type="button"
                  onClick={() => removeBuild(b._id)}
                  className="absolute top-3 right-3 text-xs text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </HubLayout>
  );
}