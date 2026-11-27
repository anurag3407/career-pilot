import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, History, Trash2, ArrowRight } from 'lucide-react';
import HubLayout from '../../components/HubLayout';
import ToolCard from '../../components/ToolCard';
import { roastApi } from '../../services/api';
import { useRoastStore } from '../../stores/useRoastStore';
import toast from 'react-hot-toast';

export default function RoastHub() {
  const history = useRoastStore((s) => s.history);
  const setHistory = useRoastStore((s) => s.setHistory);

  useEffect(() => {
    if (history.length > 0) return;
    roastApi
      .getHistory()
      .then((res) => {
        const list = res?.data || res?.history || res;
        if (Array.isArray(list) && list.length > 0) {
          setHistory(list);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFromHistory = (id) => {
    setHistory(history.filter((r) => (r._id || r.id) !== id));
    roastApi.remove(id).catch(() => toast.error('Failed to delete roast'));
  };

  return (
    <HubLayout
      icon={Flame}
      title="Resume Roast"
      description="Get a direct, unfiltered AI critique of your resume in 30 seconds, then jump straight to the builder to fix weak spots."
      color="amber"
      suite="01 Career Studio"
      breadcrumb="Resume Roast"
      actions={
        <Link
          to="/resume-roast/analyze"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Roast a resume <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <ToolCard
        to="/resume-roast/analyze"
        icon={Flame}
        title="Roast a Resume"
        description="Paste your resume text or upload a PDF to get scored feedback, blunt takeaways, and quick fixes."
        badge="BYOK"
        color="amber"
      />
      <ToolCard
        to="/resume-builder/build"
        icon={ArrowRight}
        title="Open Resume Builder"
        description="Apply critique insights directly to your structured resume and export a clean PDF."
        color="primary"
      />

      {history.length > 0 && (
        <div className="col-span-full mt-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-foreground">Recent roasts</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.slice(0, 6).map((r, i) => {
              const rid = r._id || r.id;
              return (
                <div
                  key={rid || i}
                  className="group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-amber-500/40"
                >
                  <Link to="/resume-roast/analyze" className="block pr-6">
                    <div className="mb-2 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                        {r.overallScore}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">/ 100</span>
                    </div>
                    <p className="line-clamp-2 text-sm font-medium text-foreground">{r.tagline}</p>
                    {r.jobRole && (
                      <p className="mt-1 text-xs text-muted-foreground">{r.jobRole}</p>
                    )}
                    <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                    </p>
                  </Link>
                  {rid && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromHistory(rid);
                      }}
                      className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                      aria-label="Delete roast"
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
