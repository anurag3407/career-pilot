import { useState, useEffect, useRef, useMemo } from 'react';
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
import { generateRandomString, generateCodeChallenge } from '../../utils/pkce';

export default function AIProviderCard({ providerId, isActive, onActivate }) {
  const meta = PROVIDER_META[providerId];
  const providerData = useAIConfigStore((s) => s.providers[providerId]);
  const setProviderKey = useAIConfigStore((s) => s.setProviderKey);
  const setProviderModel = useAIConfigStore((s) => s.setProviderModel);
  const setProviderBaseUrl = useAIConfigStore((s) => s.setProviderBaseUrl);
  const markValidated = useAIConfigStore((s) => s.markValidated);
  const removeProvider = useAIConfigStore((s) => s.removeProvider);

  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
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
      setBaseUrl(providerData.baseUrl || '');
    }
  }, [expanded, providerData, meta.defaultModel]);

  // Fetch models for OpenRouter when expanded
  useEffect(() => {
    if (expanded && providerId === 'openrouter' && dynamicModels.length === 0) {
      setLoadingModels(true);
      aiApi
        .getModels('openrouter')
        .then((res) => {
          const fetched = res.models || res.data || [];
          const fetchedNames = Array.isArray(fetched)
            ? fetched.map((m) => (typeof m === 'string' ? m : m.id || m.name))
            : [];
          if (fetchedNames.length > 0) {
            const metaIds = new Set((meta.models || []).map((m) => (typeof m === 'object' && m !== null ? m.id : String(m))));
            const newNames = fetchedNames.filter((id) => !metaIds.has(id));
            const merged = [...(meta.models || []), ...newNames];
            setDynamicModels(merged);
          }
        })
        .catch(() => {
          // Fallback — keep meta.models
        })
        .finally(() => setLoadingModels(false));
    }
  }, [expanded, providerId, dynamicModels.length, meta.models]);

  const handleModelSelect = (newModel) => {
    setSelectedModel(newModel);
    if (hasKey || isValidated) {
      setProviderModel(providerId, newModel);
      toast.success(`${meta.name} model set to: ${newModel}`);
    }
  };

  // Categorize models into Free and Paid with pricing metadata & ensure unique IDs
  const normalizedModels = useMemo(() => {
    const rawList = providerId === 'openrouter' && dynamicModels.length > 0 ? dynamicModels : meta.models || [];
    const modelMap = new Map();

    for (const item of rawList) {
      if (!item) continue;
      const isObj = typeof item === 'object' && item !== null && item.id;
      const id = isObj ? item.id : String(item);

      if (!modelMap.has(id) || isObj) {
        const isFree = isObj ? (item.isFree || id.endsWith(':free')) : id.endsWith(':free');
        const name = isObj ? (item.name || id) : id;
        const price = isObj ? (item.price || (isFree ? 'Free' : 'Paid')) : (isFree ? 'Free' : 'Paid');

        modelMap.set(id, {
          id,
          name,
          isFree,
          price
        });
      }
    }

    return Array.from(modelMap.values());
  }, [providerId, dynamicModels, meta.models]);

  const freeModels = useMemo(() => normalizedModels.filter((m) => m.isFree), [normalizedModels]);
  const paidModels = useMemo(() => normalizedModels.filter((m) => !m.isFree), [normalizedModels]);

  const selectedModelObj = useMemo(() => {
    return normalizedModels.find((m) => m.id === selectedModel);
  }, [normalizedModels, selectedModel]);

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
      const res = await aiApi.validateKey(providerId, apiKey.trim(), { baseUrl: baseUrl.trim(), model: selectedModel });
      if (res && res.valid) {
        // Save to store
        setProviderKey(providerId, apiKey.trim());
        setProviderModel(providerId, selectedModel || meta.defaultModel);
        if (meta.customEndpoint) {
          setProviderBaseUrl(providerId, baseUrl.trim());
        }
        markValidated(providerId, true);
        setValidationResult('success');
        toast.success(`${meta.name} key validated & saved!`);
      } else {
        markValidated(providerId, false);
        setValidationResult('error');
        toast.error(res?.error || `Invalid ${meta.name} API key`);
      }
    } catch (err) {
      markValidated(providerId, false);
      setValidationResult('error');
      toast.error(err?.message || `Invalid ${meta.name} API key`);
    } finally {
      setIsValidating(false);
    }
  };

  const handleOpenRouterOAuth = async () => {
    try {
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      sessionStorage.setItem('or_code_verifier', codeVerifier);
      localStorage.setItem('or_code_verifier', codeVerifier);

      const callbackUrl = `${window.location.origin}/auth/openrouter/callback`;
      const authUrl = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(callbackUrl)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      
      window.location.href = authUrl;
    } catch (err) {
      toast.error('Failed to initiate OpenRouter OAuth connection');
    }
  };

  const handleDelete = () => {
    removeProvider(providerId);
    setApiKey('');
    setBaseUrl('');
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
        <button
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
              {/* OpenRouter OAuth Option */}
              {providerId === 'openrouter' && (
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 dark:bg-violet-950/30 p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-violet-600 dark:text-violet-300">Option 1: Quick OAuth Connect</span>
                        <span className="rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 text-[10px] font-bold px-2 py-0.5">Recommended</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Connect directly via OpenRouter OAuth PKCE without copying keys manually.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenRouterOAuth}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 transition-all shadow-sm shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Connect via OAuth
                    </button>
                  </div>
                </div>
              )}

              {/* API Key Input Header / Option 2 */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    {providerId === 'openrouter' ? 'Option 2: Enter API Key Manually' : 'API Key'}
                  </span>
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

              {/* Base URL Input for Custom Endpoints */}
              {meta.customEndpoint && (
                <div className="space-y-1.5 mt-4">
                  <label className="text-xs font-medium text-muted-foreground">
                    Base URL (e.g., http://localhost:11434/v1)
                  </label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="Enter custom endpoint base URL"
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'transition-colors'
                    )}
                  />
                </div>
              )}

              {/* Model Selector */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    Selected Model {providerId === 'openrouter' && '(OAuth & API Key)'}
                  </label>
                  <div className="flex items-center gap-2">
                    {selectedModelObj && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          selectedModelObj.isFree
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        )}
                      >
                        {selectedModelObj.isFree ? '🎁 FREE' : `💳 ${selectedModelObj.price}`}
                      </span>
                    )}
                    {(hasKey || isValidated) && (
                      <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        Auto-saved
                      </span>
                    )}
                  </div>
                </div>

                {normalizedModels.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelSelect(e.target.value)}
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'appearance-none cursor-pointer transition-colors'
                    )}
                  >
                    {freeModels.length > 0 && (
                      <optgroup label="🎁 Free Models (Zero Cost / $0)">
                        {freeModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.price})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {paidModels.length > 0 && (
                      <optgroup label="💳 Paid Models (Credit Balance Required)">
                        {paidModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} — {m.price}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                ) : loadingModels ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading OpenRouter models & pricings…
                  </div>
                ) : (
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => handleModelSelect(e.target.value)}
                    placeholder="e.g. openai/gpt-4o-mini"
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'transition-colors'
                    )}
                  />
                )}
                {providerId === 'openrouter' && (
                  <p className="text-[11px] text-muted-foreground pt-0.5">
                    Models are categorized into 🎁 <b>Free</b> models (e.g., Gemini 2.0 Flash Free, DeepSeek R1 Free) and 💳 <b>Paid</b> models with real-time pricing tags per 1M prompt tokens.
                  </p>
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
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                      title="Delete API Key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {/* Validate & Save Button */}
                  <button
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
