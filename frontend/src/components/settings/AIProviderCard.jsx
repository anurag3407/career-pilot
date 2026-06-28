import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { useAIConfigStore, PROVIDER_META } from '../../stores/useAIConfigStore';
import { aiApi } from '../../services/api';
import { decryptKey } from '../../utils/encryption';

export default function AIProviderCard({ providerId, isActive, onActivate }) {
  const meta = PROVIDER_META[providerId];
  const providerData = useAIConfigStore((s) => s.providers[providerId]);
  const setProviderKey = useAIConfigStore((s) => s.setProviderKey);
  const setProviderModel = useAIConfigStore((s) => s.setProviderModel);
  const markValidated = useAIConfigStore((s) => s.markValidated);
  const removeProvider = useAIConfigStore((s) => s.removeProvider);

  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null); // 'success' | 'error' | null
  const [dynamicModels, setDynamicModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const cardRef = useRef(null);

  const hasKey = !!providerData?.apiKey;
  const isValidated = !!providerData?.validated;

  // Hydrate local state from store when expanding
  useEffect(() => {
    if (expanded && providerData) {
      const decrypted = providerData.apiKey ? decryptKey(providerData.apiKey) : '';
      setApiKey(decrypted);
      setSelectedModel(
        providerData.model || meta.defaultModel || ''
      );
    }
  }, [expanded, providerData, meta.defaultModel]);

  // Fetch models for OpenRouter when expanded
  useEffect(() => {
    if (expanded && providerId === 'openrouter' && dynamicModels.length === 0) {
      setLoadingModels(true);
      aiApi
        .getModels('openrouter')
        .then((res) => {
          const models = res.models || res.data || [];
          setDynamicModels(
            Array.isArray(models)
              ? models.map((m) => (typeof m === 'string' ? m : m.id || m.name))
              : []
          );
        })
        .catch(() => {
          // Fallback — keep empty so the user can still type
        })
        .finally(() => setLoadingModels(false));
    }
  }, [expanded, providerId, dynamicModels.length]);

  const models =
    providerId === 'openrouter' && dynamicModels.length > 0
      ? dynamicModels
      : meta.models;

  // ---- Handlers ----

  const handleHeaderClick = () => {
    if (hasKey && !expanded) {
      onActivate(providerId);
    }
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
    // Reset validation indicator when collapsing
    if (expanded) setValidationResult(null);
  };

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      await aiApi.validateKey(providerId, apiKey.trim());
      // Save to store
      setProviderKey(providerId, apiKey.trim());
      setProviderModel(providerId, selectedModel || meta.defaultModel);
      markValidated(providerId, true);
      setValidationResult('success');
      toast.success(`${meta.name} key validated & saved!`);
    } catch (err) {
      markValidated(providerId, false);
      setValidationResult('error');
      toast.error(err?.message || `Invalid ${meta.name} API key`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDelete = () => {
    removeProvider(providerId);
    setApiKey('');
    setValidationResult(null);
    toast.success(`${meta.name} key removed`);
  };

  // ---- Status dot ----
  const StatusDot = () => {
    if (isValidated)
      return (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
      );
    if (hasKey)
      return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500" />;
    return null;
  };

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        ...(validationResult === 'error'
          ? {
              x: [0, -6, 6, -4, 4, 0],
              transition: { duration: 0.4 },
            }
          : {}),
      }}
      className={cn(
        'group relative rounded-2xl border backdrop-blur-sm transition-all duration-300',
        'bg-card/80 border-border',
        isActive &&
          'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
        !isActive && 'hover:border-primary/30'
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />

      {/* ---- Header ---- */}
      <div
        onClick={handleHeaderClick}
        className={cn(
          'relative flex items-center gap-4 px-5 py-4 cursor-pointer select-none',
          hasKey && !expanded && 'hover:bg-white/[0.02]'
        )}
      >
        {/* Provider Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-2xl">
          {meta.icon}
        </div>

        {/* Name + Tagline + Status */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {meta.name}
            </h3>
            <StatusDot />
            {isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-cyan-500/20">
                <Sparkles className="h-3 w-3" />
                Active
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {meta.tagline}
          </p>
        </div>

        {/* Expand toggle */}
        <button type="button"
          onClick={toggleExpand}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
      </div>

      {/* ---- Expandable Section ---- */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border/60 px-5 pb-5 pt-4">
              {/* API Key Input */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Key className="h-3.5 w-3.5" />
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`Enter your ${meta.name} API key`}
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'transition-colors'
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Model
                </label>
                {models.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'appearance-none cursor-pointer transition-colors'
                    )}
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                ) : loadingModels ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading models…
                  </div>
                ) : (
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder="e.g. openai/gpt-4o-mini"
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'transition-colors'
                    )}
                  />
                )}
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {/* Get Key Link */}
                <a
                  href={meta.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary/80 transition-colors hover:text-primary"
                >
                  Get API key
                  <ExternalLink className="h-3 w-3" />
                </a>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {hasKey && (
                    <button type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                      title="Delete API Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {/* Validate & Save Button */}
                  <button type="button"
                    onClick={handleValidate}
                    disabled={isValidating || !apiKey.trim()}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200',
                      'bg-primary text-primary-foreground hover:bg-primary/90',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card'
                    )}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Validating…
                      </>
                    ) : validationResult === 'success' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Saved!
                      </>
                    ) : validationResult === 'error' ? (
                      <>
                        <XCircle className="h-4 w-4 text-red-400" />
                        Failed
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        Validate & Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Validation result feedback */}
              <AnimatePresence>
                {validationResult === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-xs text-green-400"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    API key is valid. You're all set!
                  </motion.div>
                )}
                {validationResult === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400"
                  >
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    Invalid key. Double-check and try again.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
