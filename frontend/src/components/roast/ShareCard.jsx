import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  Flame,
} from 'lucide-react';
import { Button } from '../ui/button';
import StarRating from './StarRating';

/**
 * Shareable roast card with built-in social actions.
 * Renders the OG-card-style display: ratings, tagline, roast text, silver linings, quick wins.
 */
export default function ShareCard({ result, jobRole }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const shareUrl =
    typeof window !== 'undefined' && result.shareToken
      ? `${window.location.origin}/roast/${result.shareToken}`
      : null;

  const shareText = result.emoji
    ? `${result.emoji} ${result.tagline}\n\nATS score: ${result.overallScore}/100\nGet your resume roasted at career-pilot/roast`
    : `${result.tagline}\n\nATS score: ${result.overallScore}/100`;

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const twitterUrl = shareUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : null;
  const linkedinUrl = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-8"
    >
      <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-3xl">
            <span aria-hidden>{result.emoji || '🔥'}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Resume Roast {jobRole ? `· ${jobRole}` : ''}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold leading-tight">
              {result.tagline}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ATS score:{' '}
              <span className="font-semibold text-foreground">
                {result.overallScore}/100
              </span>
            </p>
          </div>
        </div>

        {/* Star Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl bg-background/50 p-4 border border-border">
          <StarRating label="Buzzword Density" value={result.ratings.buzzwordDensity} />
          <StarRating label="Action Verbs" value={result.ratings.actionVerbs} />
          <StarRating
            label="Quantified Achievements"
            value={result.ratings.quantifiedAchievements}
          />
          <StarRating label="Formatting" value={result.ratings.formatting} />
        </div>

        {/* Roast text */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
            The Roast
          </h3>
          {result.roast
                ? result.roast.split(/\n{2,}/).map((p, i) => (
                    <p
                      key={i}
                      className="text-base leading-relaxed text-foreground mb-3 last:mb-0"
                    >
                      {p}
                    </p>
                  ))
                : (
                  <p className="text-muted-foreground italic">No roast text returned.</p>
                )}
        </div>

        {/* Silver linings */}
        {result.silverLinings?.length > 0 && (
          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              ✨ Silver Linings
            </h3>
            <ul className="space-y-1.5 text-sm">
              {result.silverLinings.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick wins */}
        {result.quickWins?.length > 0 && (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">
              🚀 Quick Wins
            </h3>
            <ol className="space-y-1.5 text-sm list-decimal list-inside">
              {result.quickWins.map((w, i) => (
                <li key={i} className="text-foreground">
                  {w}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Share row */}
        {shareUrl && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              onClick={copyLink}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy link
                </>
              )}
            </Button>
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Twitter className="h-4 w-4" /> Twitter
                </Button>
              </a>
            )}
            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </Button>
              </a>
            )}
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Share2 className="h-3.5 w-3.5" />
              Shareable & free
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}