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
  RefreshCw,
  Wifi,
  Save,
  Link2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { useAIConfigStore, PROVIDER_META } from '../../stores/useAIConfigStore';
import { aiApi } from '../../services/api';
import { decryptKey } from '../../utils/encryption';
import { generateRandomString, generateCodeChallenge } from '../../utils/pkce';

const MANUAL_MODEL = '__manual__';

export default function AIProviderCard({ providerId, isActive, onActivate }) {
  const meta = PROVIDER_META[providerId];
  const providerData = useAIConfigStore((s) => s.providers[providerId]);
  const setProviderKey = useAIConfigStore((s) => s.setProviderKey);
  const setProviderModel = useAIConfigStore((s) => s.setProviderModel);
  const setProviderBaseUrl = useAIConfigStore((s) => s.setProviderBaseUrl);
  const setProviderModels = useAIConfigStore((s) => s.setProviderModels);
  const markValidated = useAIConfigStore((s) => s.markValidated);
  const removeProvider = useAIConfigStore((s) => s.removeProvider);

  const [expanded, setExpanded] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null); // 'success' | 'error' | null
  const [testResult, setTestResult] = useState(null); // detailed result from the gateway
  const [fetchedModels, setFetchedModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelsInfo, setModelsInfo] = useState(null); // { count, source, warning }
  const cardRef = useRef(null);

  const hasKey = !!providerData?.apiKey;
  const isValidated = !!providerData?.validated;
  const isKeyless = meta.requiresKey === false;
  const showBaseUrl = Boolean(meta.showBaseUrl || meta.customEndpoint);
  const effectiveBaseUrl = (baseUrl || meta.baseUrl || '').trim();
  const isConfigured = hasKey || isValidated || (isKeyless && !!effectiveBaseUrl);
  const canTest = isKeyless ? !!effectiveBaseUrl : !!apiKey.trim();

  // Hydrate local state from the store when the card is expanded.
  useEffect(() => {
    if (!expanded) return;
    const entry = useAIConfigStore.getState().providers[providerId];
    setApiKey(entry?.apiKey ? decryptKey(entry.apiKey) : '');
    setSelectedModel(entry?.model || meta.defaultModel || '');
    setBaseUrl(entry?.baseUrl || meta.baseUrl || '');
    setFetchedModels(entry?.modelList || []);
    setManualMode(false);
    setManualModel('');
    setTestResult(null);
    setModelsInfo(null);
    setValidationResult(entry?.validated ? 'success' : null);
  }, [expanded, providerId, meta.defaultModel, meta.baseUrl]);

  // Auto-load OpenRouter's live catalog when expanded (it changes often).
  useEffect(() => {
    if (!expanded) return;
    if (providerId !== 'openrouter') return;
    if (fetchedModels.length > 0) return;
    const key = useAIConfigStore.getState().providers[providerId]?.apiKey;
    if (!key) return;

    let cancelled = false;
    setLoadingModels(true);
    aiApi
      .getModels('openrouter', { apiKey: decryptKey(key), baseUrl: '' })
      .then((res) => {
        if (cancelled) return;
        const models = Array.isArray(res?.models) ? res.models : [];
        if (models.length > 0) {
          setFetchedModels(models);
          setProviderModels('openrouter', models);
          setModelsInfo({ count: models.length, source: res.source || 'live' });
        }
      })
      .catch(() => {
        // Keep the static catalog on failure
      })
      .finally(() => {
        if (!cancelled) setLoadingModels(false);
      });

    return () => {
      cancelled = true;
    };
  }, [expanded, providerId, fetchedModels.length, setProviderModels]);

  const displayModels = useMemo(() => {
    if (fetchedModels.length > 0) return fetchedModels;
    if (providerData?.modelList?.length > 0) return providerData.modelList;
    return meta.models || [];
  }, [fetchedModels, providerData?.modelList, meta.models]);

  // Categorize models into Free and Paid with pricing metadata & ensure unique IDs
  const normalizedModels = useMemo(() => {
    const modelMap = new Map();

    for (const item of displayModels) {
      if (!item) continue;
      const isObj = typeof item === 'object' && item !== null && item.id;
      const id = isObj ? item.id : String(item);

      if (!modelMap.has(id) || isObj) {
        const isFree = isObj ? (item.isFree || id.endsWith(':free')) : id.endsWith(':free');
        const name = isObj ? (item.name || id) : id;
        const price = isObj ? (item.price || (isFree ? 'Free' : 'Paid')) : (isFree ? 'Free' : 'Paid');

        modelMap.set(id, { id, name, isFree, price });
      }
    }

    return Array.from(modelMap.values());
  }, [displayModels]);

  const freeModels = useMemo(() => normalizedModels.filter((m) => m.isFree), [normalizedModels]);
  const paidModels = useMemo(() => normalizedModels.filter((m) => !m.isFree), [normalizedModels]);

  const selectedModelObj = useMemo(
    () => normalizedModels.find((m) => m.id === selectedModel),
    [normalizedModels, selectedModel]
  );

  // ---- Handlers ----

  const handleHeaderClick = () => {
    if (isConfigured && !expanded) {
      onActivate(providerId);
    }
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
    // Reset validation indicator when collapsing
    if (expanded) setValidationResult(null);
  };

  /** Persist key / model / base URL without touching the network. */
  const persistConfig = ({ validated } = {}) => {
    if (apiKey.trim()) setProviderKey(providerId, apiKey.trim());
    setProviderModel(providerId, selectedModel || meta.defaultModel || '');
    if (showBaseUrl) setProviderBaseUrl(providerId, baseUrl.trim() || meta.baseUrl || '');
    if (validated !== undefined) markValidated(providerId, validated);
  };

  const handleSave = () => {
    const canSaveWithoutKey = providerId === 'cloudflare';
    if (!apiKey.trim() && !isKeyless && !canSaveWithoutKey) {
      toast.error('Please enter an API key');
      return;
    }
    if (isKeyless && !effectiveBaseUrl) {
      toast.error('Please enter a base URL');
      return;
    }
    persistConfig({ validated: isValidated });
    setValidationResult(isValidated ? 'success' : validationResult);
    toast.success(`${meta.name} configuration saved`);
  };

  /** Fetch the live model list from the provider (or the custom endpoint). */
  const handleFetchModels = async ({ silent = false } = {}) => {
    if (!canTest) {
      if (!silent) {
        toast.error(isKeyless ? 'Enter a base URL first' : 'Enter an API key first');
      }
      return;
    }

    setLoadingModels(true);
    setModelsInfo(null);
    try {
      const res = await aiApi.getModels(providerId, {
        apiKey: apiKey.trim(),
        baseUrl: effectiveBaseUrl,
        model: selectedModel,
      });
      const models = Array.isArray(res?.models) ? res.models : [];

      if (models.length > 0) {
        setFetchedModels(models);
        setProviderModels(providerId, models);
        setModelsInfo({ count: models.length, source: res.source || 'live', warning: res.warning });
        if (!selectedModel || !models.includes(selectedModel)) {
          setSelectedModel(models[0]);
        }
        if (!silent) {
          if (res.warning) {
            toast(`Using the built-in model list — ${res.warning}`, { icon: 'ℹ️' });
          } else {
            toast.success(`${models.length} models fetched from ${meta.name}`);
          }
        }
      } else {
        setModelsInfo({
          count: 0,
          source: res?.source || 'static',
          warning: res?.warning || 'The endpoint returned no models',
        });
        if (!silent) toast.error(res?.warning || 'No models returned by the endpoint');
      }
    } catch (err) {
      setModelsInfo({ count: 0, source: 'error', warning: err?.message || 'Failed to fetch models' });
      if (!silent) toast.error(err?.message || 'Failed to fetch models');
    } finally {
      setLoadingModels(false);
    }
  };

  /** Test the connection end to end and keep the result visible in the card. */
  const handleTestConnection = async () => {
    if (!canTest) {
      toast.error(isKeyless ? 'Enter a base URL first' : 'Please enter an API key');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setTestResult(null);

    try {
      const res = await aiApi.validateKey(providerId, apiKey.trim(), {
        baseUrl: effectiveBaseUrl,
        model: selectedModel,
      });

      if (res && res.valid) {
        const models = Array.isArray(res.models) ? res.models : [];
        if (models.length > 0) {
          setFetchedModels(models);
          setProviderModels(providerId, models);
          setModelsInfo({ count: models.length, source: res.source, warning: res.warning });
          if (!selectedModel || (res.modelAvailable === false && !models.includes(selectedModel))) {
            setSelectedModel(models[0]);
          }
        }
        persistConfig({ validated: true });
        setValidationResult('success');
        setTestResult(res);
        toast.success(`Connected to ${meta.name}`);
      } else {
        markValidated(providerId, false);
        setValidationResult('error');
        setTestResult(res || { error: 'Connection failed' });
        toast.error(res?.error || res?.warning || `Could not reach ${meta.name}`);
      }
    } catch (err) {
      markValidated(providerId, false);
      setValidationResult('error');
      setTestResult({ error: err?.message || 'Connection failed' });
      toast.error(err?.message || `Could not reach ${meta.name}`);
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
    } catch {
      toast.error('Failed to initiate OpenRouter OAuth connection');
    }
  };

  const handleDelete = () => {
    removeProvider(providerId);
    setApiKey('');
    setBaseUrl('');
    setFetchedModels([]);
    setModelsInfo(null);
    setValidationResult(null);
    setTestResult(null);
    toast.success(`${meta.name} key removed`);
  };

  // ---- Status dot ----
  const StatusDot = () => {
    if (isValidated || (providerId === 'cloudflare' && isActive))
      return (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
        </span>
      );
    if (isConfigured)
      return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500" />;
    return null;
  };

  const hasFreePaidSplit = freeModels.length > 0 && paidModels.length > 0;

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
          isConfigured && !expanded && 'hover:bg-white/[0.02]'
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
            {isKeyless && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                No key
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
              {/* Cloudflare AI Platform Banner */}
              {providerId === 'cloudflare' && (
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 dark:bg-orange-950/30 p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-300">⚡ Serverless Edge AI (Free Tier)</span>
                    <span className="rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 text-[10px] font-bold px-2 py-0.5">Platform Default</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Runs directly on Cloudflare Workers AI with free daily neurons. No API key required for standard platform usage! You can also optionally enter your own Cloudflare API Token below to connect your personal quotas.
                  </p>
                </div>
              )}

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

              {/* Provider hint */}
              {meta.hint && (
                <p className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
                  {meta.hint}
                </p>
              )}

              {/* API Key Input Header / Option 2 */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Key className="h-3.5 w-3.5" />
                    {providerId === 'openrouter' ? 'Option 2: Enter API Key Manually' : 'API Key'}
                    {isKeyless && (
                      <span className="text-[10px] font-normal text-muted-foreground/70">(optional)</span>
                    )}
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={isKeyless ? 'Optional — most local endpoints need no key' : `Enter your ${meta.name} API key`}
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

              {/* Base URL Input for Custom / Local / Azure endpoints */}
              {showBaseUrl && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Link2 className="h-3.5 w-3.5" />
                    Base URL
                    {meta.requiresBaseUrl ? (
                      <span className="text-[10px] font-bold text-amber-400">required</span>
                    ) : (
                      <span className="text-[10px] font-normal text-muted-foreground/70">(OpenAI-compatible /v1 root)</span>
                    )}
                  </label>
                  <input
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder={meta.baseUrl || 'https://your-endpoint.example.com/v1'}
                    className={cn(
                      'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50',
                      'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                      'transition-colors'
                    )}
                  />
                  <p className="text-[11px] text-muted-foreground/70">
                    Models are fetched from <code className="rounded bg-muted px-1 py-0.5">{`${effectiveBaseUrl || '…'}/models`}</code>
                  </p>
                </div>
              )}

              {/* Model Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    Selected Model
                  </label>
                  <div className="flex items-center gap-2">
                    {modelsInfo && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                          modelsInfo.count > 0
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        )}
                      >
                        {modelsInfo.count > 0
                          ? `${modelsInfo.count} ${modelsInfo.source === 'live' ? 'live' : ''} models`
                          : 'No models found'}
                      </span>
                    )}
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
                  <div className="space-y-2">
                    <select
                      value={manualMode ? MANUAL_MODEL : selectedModel}
                      onChange={(e) => {
                        if (e.target.value === MANUAL_MODEL) {
                          setManualMode(true);
                          return;
                        }
                        setManualMode(false);
                        setSelectedModel(e.target.value);
                        if (hasKey || isValidated) {
                          setProviderModel(providerId, e.target.value);
                        }
                      }}
                      className={cn(
                        'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground',
                        'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                        'appearance-none cursor-pointer transition-colors'
                      )}
                    >
                      {selectedModel && !normalizedModels.some((m) => m.id === selectedModel) && (
                        <option value={selectedModel}>{selectedModel} (current)</option>
                      )}
                      {hasFreePaidSplit ? (
                        <>
                          <optgroup label="🎁 Free Models (Zero Cost / $0)">
                            {freeModels.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.price})
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="💳 Paid Models (Credit Balance Required)">
                            {paidModels.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} — {m.price}
                              </option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        normalizedModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))
                      )}
                      <option value={MANUAL_MODEL}>✏️ Other — enter a model id manually</option>
                    </select>

                    {manualMode && (
                      <input
                        type="text"
                        value={manualModel}
                        onChange={(e) => setManualModel(e.target.value)}
                        onBlur={() => {
                          if (manualModel.trim()) {
                            setSelectedModel(manualModel.trim());
                            setProviderModel(providerId, manualModel.trim());
                          }
                        }}
                        placeholder="e.g. my-deployment-name or org/model-id"
                        autoFocus
                        className={cn(
                          'w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50',
                          'border-border focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30',
                          'transition-colors'
                        )}
                      />
                    )}
                  </div>
                ) : loadingModels ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Fetching models from {meta.name}…
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

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className="text-[11px] text-muted-foreground">
                    {meta.customEndpoint || meta.showBaseUrl
                      ? 'Models come straight from the endpoint. Test before saving if you want to verify reachability.'
                      : 'Fetched live from the provider when a key is present; static list otherwise.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleFetchModels()}
                    disabled={loadingModels || !canTest}
                    title={!canTest ? 'Add an API key or base URL to fetch live models' : 'Fetch models from the provider'}
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-[11px] font-semibold text-foreground/80 transition-colors',
                      'hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    <RefreshCw className={cn('h-3.5 w-3.5', loadingModels && 'animate-spin')} />
                    {loadingModels ? 'Fetching…' : 'Fetch models'}
                  </button>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                {/* Get Key Link */}
                {meta.keyUrl ? (
                  <a
                    href={meta.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary/80 transition-colors hover:text-primary"
                  >
                    Get API key
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Self-hosted endpoint</span>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {isConfigured && (
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                      title="Delete configuration"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isValidating || !canTest}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-semibold text-foreground/80 transition-colors',
                      'hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    {isValidating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Wifi className="h-3.5 w-3.5" />
                    )}
                    {isValidating ? 'Testing…' : 'Test connection'}
                  </button>

                  <button
                    onClick={handleSave}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200',
                      'bg-primary text-primary-foreground hover:bg-primary/90',
                      'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card'
                    )}
                  >
                    {validationResult === 'success' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Saved
                      </>
                    ) : validationResult === 'error' ? (
                      <>
                        <XCircle className="h-4 w-4 text-red-400" />
                        Save anyway
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Test result feedback */}
              <AnimatePresence>
                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      'rounded-lg border px-3 py-2.5 text-xs',
                      validationResult === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {validationResult === 'success' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 space-y-1">
                        {validationResult === 'success' ? (
                          <>
                            <p className="font-semibold">
                              Connection OK
                              {typeof testResult.latencyMs === 'number' && (
                                <span className="font-normal opacity-80"> · {testResult.latencyMs} ms</span>
                              )}
                              {typeof testResult.modelCount === 'number' && (
                                <span className="font-normal opacity-80"> · {testResult.modelCount} models</span>
                              )}
                            </p>
                            {testResult.modelAvailable === false && (
                              <p className="text-amber-400">
                                The selected model wasn't in the list returned by the endpoint — double-check the id.
                              </p>
                            )}
                            {testResult.warning && (
                              <p className="text-amber-400/90">{testResult.warning}</p>
                            )}
                            {!isActive && (
                              <button
                                type="button"
                                onClick={() => onActivate(providerId)}
                                className="mt-1 inline-flex items-center gap-1 rounded-md border border-green-500/30 bg-green-500/10 px-2 py-1 text-[11px] font-semibold text-green-300 hover:bg-green-500/20 transition-colors"
                              >
                                <Sparkles className="h-3 w-3" />
                                Use this provider
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-semibold">Connection failed</p>
                            <p className="break-words opacity-90">
                              {testResult.error || testResult.warning || 'The gateway could not reach this provider.'}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
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
