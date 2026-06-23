import { motion } from 'framer-motion';
import { Github, MapPin, Briefcase, Star, GitFork, ExternalLink, Code2 } from 'lucide-react';

/**
 * Read-only preview of the generated portfolio sections.
 * Mirrors the structure of the JSON returned by /api/portfolio/github/build.
 */
export default function PortfolioPreview({ data }) {
  if (!data) return null;

  const { sections, profile, aggregateStats } = data;
  const hero = sections?.hero || {};
  const about = sections?.about || '';
  const projects = Array.isArray(sections?.projects) ? sections.projects : [];
  const skills = sections?.skills || { languages: [], tools: [], domains: [] };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          {profile?.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt={profile.login}
              className="h-16 w-16 rounded-full border-2 border-border mb-3"
            />
          )}
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            {hero.headline || profile?.name || profile?.login || 'Your Portfolio'}
          </h1>
          {hero.subheadline && (
            <p className="mt-1 text-base text-muted-foreground">{hero.subheadline}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {profile?.login && (
              <a
                href={profile.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" /> @{profile.login}
              </a>
            )}
            {hero.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {hero.location}
              </span>
            )}
            {hero.availableFor && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Briefcase className="h-3.5 w-3.5" /> {hero.availableFor}
              </span>
            )}
          </div>
          {aggregateStats && (
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <span className="rounded-full bg-foreground/5 px-3 py-1">
                <strong>{aggregateStats.stars || 0}</strong> stars
              </span>
              <span className="rounded-full bg-foreground/5 px-3 py-1">
                <strong>{aggregateStats.forks || 0}</strong> forks
              </span>
              <span className="rounded-full bg-foreground/5 px-3 py-1">
                <strong>{aggregateStats.reposAnalyzed || projects.length}</strong> repos
              </span>
            </div>
          )}
        </div>
      </div>

      {/* About */}
      {about && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
            About
          </h2>
          {about.split(/\n{2,}/).map((p, i) => (
            <p key={i} className="text-sm leading-relaxed mb-2 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.name || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm">{p.title || p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3 w-3" /> {p.stars || 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3 w-3" /> {p.forks || 0}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-3">{p.summary}</p>
                {p.highlights?.length > 0 && (
                  <ul className="text-xs space-y-1 mb-2">
                    {p.highlights.slice(0, 3).map((h, j) => (
                      <li key={j} className="flex gap-1.5">
                        <span className="text-primary">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {p.tech?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tech.slice(0, 5).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View repo <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.languages?.length > 0 || skills.tools?.length > 0 || skills.domains?.length > 0) && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Skills
          </h2>
          {skills.languages?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold mb-2 inline-flex items-center gap-1">
                <Code2 className="h-3 w-3" /> Languages
              </h3>
              <div className="space-y-1.5">
                {skills.languages.map((l) => (
                  <div key={l.name} className="flex items-center gap-2">
                    <span className="text-xs font-mono w-24 truncate">{l.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60"
                        style={{ width: `${(l.level / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {l.level}/5
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.domains?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold mb-2">Domains</h3>
              <div className="flex flex-wrap gap-1">
                {skills.domains.map((d) => (
                  <span
                    key={d}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      {sections?.callToAction && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
          <p className="text-sm font-semibold text-primary">{sections.callToAction}</p>
        </div>
      )}
    </motion.div>
  );
}