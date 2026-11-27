import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Sparkles, Key, ShieldCheck, History, Trash2 } from 'lucide-react';
import HubLayout from '../../components/HubLayout';
import ToolCard from '../../components/ToolCard';
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
    if (!window.confirm('Delete this portfolio build?')) return;
    try {
      await githubPortfolioApi.remove(id);
      setHistory((prev) => prev.filter((b) => (b._id || b.id) !== id));
      toast.success('Build deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <HubLayout
      icon={Github}
      title="GitHub Portfolio Builder"
      description="Pull your repositories, READMEs, languages, and commit activity to generate a structured developer portfolio."
      color="foreground"
      suite="04 Presence & Network"
      breadcrumb="GitHub Portfolio"
    >
      <ToolCard
        to="/github-portfolio/build"
        icon={Sparkles}
        title="Build from Repositories"
        description="Choose a GitHub username, pick your strongest repositories, and draft hero, projects, and skills sections."
        badge="AI"
        color="foreground"
      />
      <ToolCard
        to="/github"
        icon={Github}
        title="Open GitHub Suite"
        description="Access GitHub-to-resume, profile README generator, and codebase architecture visualizer."
        color="primary"
      />

      {/* Connection status card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
            <Github className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-foreground">GitHub Connection</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {oauthConnected
                ? `Connected to @${oauthLogin} via OAuth. Private repositories and higher API rate limits are active.`
                : 'Using public GitHub access (60 req/hr). Add a token in Settings for private repositories and 5,000 req/hr.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/settings"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
              >
                <Key className="h-3.5 w-3.5" aria-hidden="true" />
                Manage GitHub settings
              </Link>
              {!oauthConnected && (
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Connect token
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="col-span-full mt-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">Recent builds</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.slice(0, 6).map((b, i) => {
              const bid = b._id || b.id;
              return (
                <div
                  key={bid || i}
                  className="group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <Link to={`/github-portfolio/build?build=${bid}`} className="block pr-6">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Github className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">@{b.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.repoCount || 0} repos · {b.authMode || 'public'}
                        </p>
                      </div>
                    </div>
                    {b.sections?.hero?.headline && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {b.sections.hero.headline}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </Link>
                  {bid && (
                    <button
                      type="button"
                      onClick={() => removeBuild(bid)}
                      aria-label="Delete portfolio build"
                      className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </HubLayout>
  );
}
