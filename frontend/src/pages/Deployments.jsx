import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Globe, Search } from 'lucide-react';
import { portfolioApi } from '../services/api';

function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadDeployments() {
      try {
        setLoading(true);
        setError('');
        const response = await portfolioApi.getAll();
        if (cancelled) return;

        const items = response.portfolios || response.data?.portfolios || response.data || [];
        setDeployments(Array.isArray(items) ? items : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'We could not load your portfolios.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDeployments();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return deployments;

    return deployments.filter((deployment) =>
      [
        deployment.projectName,
        deployment.slug,
        deployment.deployedUrl,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized))
    );
  }, [deployments, query]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Deployments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your generated portfolio sites and their latest published URL.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by project or URL"
          aria-label="Search deployments"
          className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {loading ? (
        <div className="rounded-xl border border-border bg-card p-8 text-sm text-muted-foreground">
          Loading deployments…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8">
          <p className="text-sm font-medium text-foreground">Deployment history unavailable</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Your deployed sites remain available; only this history view could not load.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Globe className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-foreground">
            {query ? 'No matching deployments' : 'No deployments yet'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {query
              ? 'Try a different project name or clear the search.'
              : 'Generate a portfolio and publish it to see your live site here.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((deployment) => (
            <article
              key={deployment._id || deployment.slug}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <h2 className="text-lg font-semibold text-foreground">
                {deployment.projectName || deployment.slug || 'Untitled portfolio'}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {deployment.deployedUrl ? 'Live' : 'Saved draft'}
              </p>
              {deployment.deployedUrl ? (
                <a
                  href={deployment.deployedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {deployment.deployedUrl}
                </a>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  This portfolio has not been published yet.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Deployments;
