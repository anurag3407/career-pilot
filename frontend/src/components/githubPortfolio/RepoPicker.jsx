import { motion } from 'framer-motion';
import { Star, GitFork, Lock, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Repo selection list. Receives an array of repos and lets the user toggle
 * which ones to include in their generated portfolio.
 *
 * @param {Array} repos
 * @param {Set<string>} selected
 * @param {(fullName: string) => void} onToggle
 * @param {number} max - Soft cap (default 6)
 */
export default function RepoPicker({ repos, selected, onToggle, max = 6, loading = false }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-muted/30 animate-pulse"
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No public repos found. Add a token in Settings to unlock private repos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground">
          Showing top {Math.min(repos.length, max)} repos (sorted by stars). Toggle to customize.
        </p>
        <span className="text-xs font-semibold">
          {selected.size} selected
        </span>
      </div>
      {repos.slice(0, max).map((repo, i) => {
        const isSelected = selected.has(repo.fullName);
        return (
          <motion.button
            key={repo.id || repo.fullName}
            type="button"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onToggle(repo.fullName)}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
              )}
            >
              {isSelected && (
                <svg
                  className="h-3 w-3 text-primary-foreground"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 6l3 3 5-6" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold truncate">
                  {repo.name}
                </span>
                {repo.private && (
                  <Lock className="h-3 w-3 text-amber-500" aria-label="private" />
                )}
              </div>
              {repo.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {repo.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3" />
                {repo.stars || 0}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {repo.forks || 0}
              </span>
              {repo.language && (
                <span className="hidden md:inline rounded-full bg-foreground/5 px-2 py-0.5">
                  {repo.language}
                </span>
              )}
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Open on GitHub"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}