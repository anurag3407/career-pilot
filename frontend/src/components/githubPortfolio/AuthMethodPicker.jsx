import { motion } from 'framer-motion';
import { Github, Key, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGithubConfigStore } from '../../stores/useGithubConfigStore';

const OPTIONS = [
  {
    id: 'pat',
    title: 'Personal Access Token',
    icon: Key,
    color: 'primary',
    description:
      'Paste a GitHub PAT. 5,000 req/hr, access to your private repos. Stored encrypted in your browser.',
    perk: 'Best for ongoing portfolio work',
  },
  {
    id: 'oauth',
    title: 'Connect with OAuth',
    icon: ShieldCheck,
    color: 'emerald',
    description:
      'One-click sign-in. Token is stored encrypted on the server, never in your browser. Revocable.',
    perk: 'Smoothest experience',
  },
  {
    id: 'public',
    title: 'Public profile only',
    icon: Github,
    color: 'foreground',
    description:
      'Just type a username. Public data only. Rate-limited to 60 requests/hour.',
    perk: 'Zero setup',
  },
];

/**
 * Three-way auth picker shown as the first step of /portfolio/github.
 */
export default function AuthMethodPicker({ value, onChange, onContinue }) {
  const oauthConnected = useGithubConfigStore((s) => s.oauthConnected);
  const validated = useGithubConfigStore((s) => s.validated);

  const effectiveSelection = (() => {
    if (value) return value;
    if (oauthConnected) return 'oauth';
    if (validated) return 'pat';
    return null;
  })();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const isSelected = effectiveSelection === opt.id;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'relative rounded-2xl border-2 p-4 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
                  isSelected ? 'bg-primary/15' : 'bg-foreground/5'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                />
              </div>
              <h3 className="text-sm font-bold">{opt.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {opt.description}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-wider font-bold text-primary">
                {opt.perk}
              </p>
            </motion.button>
          );
        })}
      </div>

      {effectiveSelection && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            type="button"
            onClick={() => onContinue(effectiveSelection)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}