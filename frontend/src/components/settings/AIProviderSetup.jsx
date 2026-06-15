import { motion } from 'framer-motion';
import { useAIConfigStore, PROVIDER_META } from '../../stores/useAIConfigStore';
import AIProviderCard from './AIProviderCard';

const PROVIDER_IDS = Object.keys(PROVIDER_META); // ['gemini', 'openai', 'openrouter', 'groq']

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function AIProviderSetup() {
  const activeProvider = useAIConfigStore((s) => s.activeProvider);
  const providers = useAIConfigStore((s) => s.providers);
  const setActiveProvider = useAIConfigStore((s) => s.setActiveProvider);

  // Derive active provider display info
  const activeMeta = activeProvider ? PROVIDER_META[activeProvider] : null;
  const activeEntry = activeProvider ? providers[activeProvider] : null;
  const activeModel =
    activeEntry?.model || activeMeta?.defaultModel || '';

  return (
    <div className="space-y-6">
      {/* ---- Summary Banner ---- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm px-5 py-4"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-transparent" />

        <div className="relative flex items-center gap-3">
          {/* Status dot */}
          {activeProvider ? (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
          ) : (
            <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-muted-foreground/40" />
          )}

          <p className="text-sm text-muted-foreground">
            {activeProvider ? (
              <>
                Currently using{' '}
                <span className="font-semibold text-foreground">
                  {activeMeta?.name}
                </span>{' '}
                <span className="text-muted-foreground/70">
                  ({activeModel})
                </span>
              </>
            ) : (
              <>
                No{' '}
                <span className="font-semibold text-foreground">
                  API Key Found
                </span>{' '}
                <span className="text-muted-foreground/70">(configure your own API keys to use AI features)</span>
              </>
            )}
          </p>
        </div>
      </motion.div>

      {/* ---- Provider Cards Grid ---- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {PROVIDER_IDS.map((id) => (
          <motion.div key={id} variants={cardVariants}>
            <AIProviderCard
              providerId={id}
              isActive={activeProvider === id}
              onActivate={setActiveProvider}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
