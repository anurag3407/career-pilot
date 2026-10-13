import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Copy, Check, ExternalLink, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

import { portfolioApi } from '../../services/api';


// Hey there, code reviewer or fellow builder!
// We defined some custom metadata here for each hosting platform.
// Adding a "tag" adds that handcrafted touch that makes standard cards feel alive.
const PROVIDERS = [
  { id: 'github', name: 'GitHub Pages', desc: 'Deploy to your GitHub account repository free.', icon: '⚡', tag: 'EASY & FREE', needsToken: true },
  { id: 'cloudflare', name: 'Cloudflare Pages', desc: 'Fast, secure hosting with global CDN.', icon: '☁️', tag: 'RECOMMENDED', needsToken: false },
  { id: 'netlify', name: 'Netlify', desc: 'Instant serverless deploys and form handling.', icon: '◈', tag: 'STABLE', needsToken: true },
];

const DEPLOY_STAGES = [
  'Validating portfolio content',
  'Generating production files',
  'Uploading assets',
  'Publishing your site',
];

function TokenStatusChip({ status }) {
  if (!status) return null;
  if (status === 'checking') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400">
        <Loader2 className="w-2.5 h-2.5 animate-spin" /> checking…
      </span>
    );
  }
  if (status.valid) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        ✓ connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30" title={status.reason}>
      <AlertCircle className="w-2.5 h-2.5" /> failed
    </span>
  );
}

export default function DeployModal({ isOpen, onClose, portfolioTitle = "My Portfolio", templateId = "default", aiDraft, onDeploySuccess }) {
  // Step workflow: select -> loading -> success -> error
  const [step, setStep] = useState('select');
  const [selectedProvider, setSelectedProvider] = useState('cloudflare'); // default to recommended Cloudflare
  const [deployedUrl, setDeployedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Token validation state — one entry per provider that needs a user-supplied token
  const [tokenInputs, setTokenInputs] = useState({ github: '', netlify: '' });
  const [tokenStatuses, setTokenStatuses] = useState({});

  // Refs for tracking async operations.
  // Crucial UX fix: If a user closes the modal before the deployment simulator finishes,
  // we MUST cancel all timeouts to avoid state updates on unmounted components (memory leaks).
  const logTimerRef = useRef(null);
  const confettiIntervalRef = useRef(null);
  const deployRequestIdRef = useRef(0);

  // Clear timers/confetti on unmount to keep everything clean and prevent leakages
  useEffect(() => {
  return () => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }

    confetti.reset();
  };
}, []);

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    confettiIntervalRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
        return;
      }

      confetti({
        particleCount: 35 * (timeLeft / duration),
        spread: 65,
        startVelocity: 28,
        ticks: 70,
        origin: { x: 0.5, y: 0.25 },
      });
    }, 250);
  };

  /**
   * Validates a provider token against the backend before allowing deployment.
   * Never caches the result — each call makes a fresh API request.
   */
  const handleCheckToken = async (providerId) => {
    setTokenStatuses((prev) => ({ ...prev, [providerId]: 'checking' }));
    try {
      const provider = PROVIDERS.find((p) => p.id === providerId);
      const data = await portfolioApi.validateDeployToken(
        providerId,
        provider?.needsToken ? tokenInputs[providerId] : undefined,
      );
      setTokenStatuses((prev) => ({ ...prev, [providerId]: data }));

      if (data.valid) {
        toast.success(`${PROVIDERS.find((p) => p.id === providerId)?.name} token verified!`);
      } else {
        toast.error(data.reason || 'Token is invalid.');
      }
    } catch (err) {
      setTokenStatuses((prev) => ({ ...prev, [providerId]: { valid: false, reason: err.message } }));
      toast.error(err.message || 'Token check failed.');
    }
  };

  const handleDeploy = async () => {
    const requestId = ++deployRequestIdRef.current;
    setStep('loading');

    const slug =
      portfolioTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'portfolio';

    try {
      const result = await portfolioApi.deploy({
        slug,
        sections: aiDraft || {},
        templateId,
        title: portfolioTitle,
        provider: selectedProvider,
        token: tokenInputs[selectedProvider] || undefined,
      });

      if (deployRequestIdRef.current !== requestId) return;

      const liveUrl = result.data?.url;
      if (!liveUrl) throw new Error('The provider did not return a published URL.');

      setDeployedUrl(liveUrl);
      setStep('success');
      triggerConfetti();
      toast.success('Your portfolio is live.');
      if (onDeploySuccess) onDeploySuccess();
    } catch (err) {
      if (deployRequestIdRef.current !== requestId) return;
      setErrorMessage(err.message || 'Deployment failed. Please try again.');
      setStep('error');
      toast.error('Deployment failed.');
    }
  };

  const handleCopyLink = async () => {
    if (!deployedUrl) return;
    try {
      await navigator.clipboard.writeText(deployedUrl);
      setCopied(true);
      toast.success('Link copied.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard.');
    }
  };

  const handleCancelDeploy = () => {
    deployRequestIdRef.current += 1;
    setStep('select');
    toast('Deployment was closed. The publish request may continue if it already reached the provider.', {
      icon: 'ℹ️',
    });
  };

  const handleClose = () => {
  deployRequestIdRef.current += 1;
  setStep('select');
  setDeployedUrl('');
  setErrorMessage('');

  if (confettiIntervalRef.current) {
    clearInterval(confettiIntervalRef.current);
    confettiIntervalRef.current = null;
  }

  confetti.reset();
  onClose();
};

  // Deploy button is enabled only when the selected provider's token is validated
  const selectedProviderMeta = PROVIDERS.find((p) => p.id === selectedProvider);
  const isTokenValidated = !selectedProviderMeta?.needsToken || tokenStatuses[selectedProvider]?.valid === true;

  const seoChecks = [
  {
    label: "Portfolio Title",
    passed: portfolioTitle && portfolioTitle.trim().length > 5,
  },
  {
    label: "Template Selected",
    passed: templateId && templateId !== "default",
  },
  {
    label: "Portfolio Content",
    passed: aiDraft && Object.keys(aiDraft).length > 0,
  },
  {
    label: "SEO Friendly Title",
    passed: portfolioTitle?.length >= 10,
  },
];

const seoScore = Math.round(
  (seoChecks.filter((item) => item.passed).length / seoChecks.length) * 100
);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Modern Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md"
        />

        {/*
          Modal Window Container
          Added a gorgeous asymmetrical floating developer pipeline badge,
          custom premium box shadow, and sleek dark borders.
        */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Tilted Asymmetrical Hand-crafted Ribbon Stamp */}
          <div className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[9px] font-bold font-mono px-3 py-1 rounded-bl-xl shadow-md uppercase tracking-wider select-none rotate-1 border-b border-l border-amber-600">
            Production publish
          </div>

          {/* Header */}
          <div className="p-6 pb-4 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shadow-inner">
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-zinc-100 font-sans tracking-tight">Deploy Portfolio</h3>
                <p className="text-xs text-zinc-400 mt-0.5 max-w-[220px] truncate">
                  Configuring: <span className="font-mono text-indigo-400">{portfolioTitle}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              aria-label="Close Deploy Dialog"
              className="p-2 hover:bg-zinc-800/80 rounded-xl transition-colors cursor-pointer text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* State 1: Provider Selection */}
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-5"
                >
                  <p className="text-xs text-zinc-400 text-left leading-relaxed">
                    <div className="flex items-center gap-2">
  <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase">
    Readiness Score: {seoScore}%
  </span>
</div>
                    
                    Choose your publishing provider. CareerPilot generates a standalone portfolio site, then publishes it to your selected provider.
                  </p>

                  {/* Provider Cards */}
                  <div className="space-y-2.5">
                    {PROVIDERS.map((provider) => {
                      const isSelected = selectedProvider === provider.id;
                      const tokenStatus = tokenStatuses[provider.id];
                      return (
                        <div
                          key={provider.id}
                          className={`group w-full text-left rounded-2xl border transition-all duration-300 select-none ${
                            isSelected
                              ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-950/20'
                              : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
                          }`}
                        >
                          {/* Clickable header row */}
                          <button
                            type="button"
                            onClick={() => setSelectedProvider(provider.id)}
                            className="w-full flex items-start gap-4 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 transition-transform group-hover:scale-105 ${
                              isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                              {provider.icon}
                            </div>

                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-sm text-zinc-100">{provider.name}</h4>
                                {provider.tag && (
                                  <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    isSelected
                                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                      : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-400'
                                  }`}>
                                    {provider.tag}
                                  </span>
                                )}
                                <TokenStatusChip status={tokenStatus} />
                              </div>
                              <p className="text-xs text-zinc-400 mt-1 leading-normal group-hover:text-zinc-300 transition-colors">{provider.desc}</p>
                            </div>
                          </button>

                          {/* Token input + check button — shown only when this provider is selected and needs a token */}
                          {isSelected && provider.needsToken && (
                            <div className="px-4 pb-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="password"
                                placeholder={`Paste your ${provider.name} token…`}
                                value={tokenInputs[provider.id] ?? ''}
                                onChange={(e) =>
                                  setTokenInputs((prev) => ({ ...prev, [provider.id]: e.target.value }))
                                }
                                className="flex-1 text-xs rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                              />
                              <button
                                type="button"
                                disabled={!tokenInputs[provider.id] || tokenStatus === 'checking'}
                                onClick={() => handleCheckToken(provider.id)}
                                className="text-[10px] font-bold font-mono px-3 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                              >
                                Check
                              </button>
                            </div>
                          )}

                          {/* Cloudflare: server-side token — show check button with no input */}
                          {isSelected && !provider.needsToken && (
                            <div className="px-4 pb-4 flex justify-end" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                disabled={tokenStatus === 'checking'}
                                onClick={() => handleCheckToken(provider.id)}
                                className="text-[10px] font-bold font-mono px-3 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                {tokenStatus === 'checking' ? 'Checking…' : 'Check connection'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Dev Tip Alert Box */}
                  <div className="bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl p-4 text-left relative overflow-hidden select-none">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="flex gap-3">
                      <span className="text-amber-500 text-base shrink-0 select-none">💡</span>
                      <div className="space-y-1">
                        <h5 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                          Dev Insight
                        </h5>
                        <p className="text-[11px] text-amber-200/80 leading-relaxed font-sans">
                          GitHub Pages requires no custom configuration. If you need blazing fast global CDNs, <strong className="text-amber-400 font-medium">Cloudflare</strong> is our go-to!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SEO Optimization Assistant */}
<div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-3">
  <div className="flex items-center justify-between">
    <h4 className="text-sm font-semibold text-zinc-100">
      SEO Optimization Assistant
    </h4>

    <span className="text-xs font-bold text-indigo-400">
      {seoScore}/100
    </span>
  </div>

  <div className="space-y-2">
    {seoChecks.map((check, index) => (
      <div
        key={index}
        className="flex items-center justify-between text-xs"
      >
        <span className="text-zinc-300">{check.label}</span>

        <span
          className={
            check.passed
              ? "text-emerald-400"
              : "text-amber-400"
          }
        >
          {check.passed ? "✓" : "⚠"}
        </span>
      </div>
    ))}
  </div>

  <div className="pt-2 border-t border-zinc-800">
    <p className="text-[11px] text-zinc-400">
      Improve portfolio discoverability by using descriptive titles,
      complete content sections, and SEO-friendly metadata.
    </p>
  </div>
</div>

                  {/* Submit Action */}
                  <button
                    onClick={handleDeploy}
                    disabled={!isTokenValidated}
                    title={!isTokenValidated ? 'Verify your token first by clicking "Check"' : undefined}
                    className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-zinc-100 rounded-2xl font-semibold shadow-xl shadow-indigo-950/20 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    Deploy with {PROVIDERS.find(p => p.id === selectedProvider)?.name}
                  </button>

                  <div className="text-[10px] text-zinc-600 text-center italic font-mono pt-1">
                  </div>
                </motion.div>
              )}

              {/* State 2: Retro Terminal Console Loading State */}
              {step === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  className="space-y-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-400" aria-hidden="true" />
                    <p className="text-sm font-semibold text-zinc-100">Publishing your portfolio</p>
                  </div>

                  <ol className="space-y-3">
                    {DEPLOY_STAGES.map((stage, index) => (
                      <li key={stage} className="flex items-center gap-3 text-xs text-zinc-300">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-500/10 text-[10px] font-bold text-indigo-300">
                          {index + 1}
                        </span>
                        {stage}
                      </li>
                    ))}
                  </ol>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                    <p className="text-xs font-medium text-zinc-300">What is happening?</p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                      CareerPilot generates your production files and asks the selected provider to publish
                      them. Provider response time varies, so we show honest progress instead of fake logs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancelDeploy}
                    className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-700"
                  >
                    Close while publishing
                  </button>
                </motion.div>
              )}

              {/* State 3: Success State */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center space-y-6 py-2"
                >
                  {/* Crafted Seal of Deployment */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl relative z-10">
                      <Sparkles className="w-8 h-8 animate-pulse text-emerald-400" />
                    </div>
                    {/* Tiny asymmetrical label */}
                    <div className="absolute -bottom-1 -right-4 bg-emerald-500 text-zinc-950 font-bold font-mono text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider z-20 shadow-md">
                      VERIFIED
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-zinc-100 tracking-tight">Your portfolio is live</h4>
                    <p className="text-xs text-zinc-400 px-4 leading-relaxed font-sans">
                      We generated a standalone portfolio and published it to your selected provider.
                    </p>
                  </div>

                  {/* Handcrafted URL Container */}
                  <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">DEPLOYED SITE URL</div>
                      <span className="text-xs font-semibold text-indigo-400 truncate block mt-0.5 select-all font-mono">
                        {deployedUrl}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyLink}
                      aria-label="Copy deployed link to clipboard"
                      className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer ${
                        copied
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-inner'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Dynamic action options */}
                  <div className="w-full grid grid-cols-2 gap-3 pt-1">
                    <a
                      href={deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-4 bg-indigo-600 text-zinc-100 rounded-2xl font-semibold shadow-lg shadow-indigo-950/20 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 select-none active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Site
                    </a>

                    <button
                      onClick={handleClose}
                      className="py-3.5 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-200 rounded-2xl font-semibold transition-colors cursor-pointer select-none active:scale-95"
                    >
                      All Done
                    </button>
                  </div>

                  {/* Artisan Signature Badge */}
                  <div className="w-full flex items-center justify-between text-[9px] text-zinc-500 font-mono pt-4 border-t border-zinc-800 select-none">
                    <span>STATUS: PUBLISHED</span>
                    <span className="flex items-center gap-1">
                      <span>Built with</span>
                      <span className="font-bold text-zinc-300 underline decoration-indigo-500 decoration-2 underline-offset-2">CareerPilot</span>
                    </span>
                  </div>
                </motion.div>
              )}

              {/* State 4: Error State */}
              {step === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center space-y-6 py-2"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-8 h-8 text-rose-400" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-zinc-100 tracking-tight">Deployment failed</h4>
                    <p className="text-xs text-zinc-400 px-4 leading-relaxed font-sans">
                      {errorMessage || "The provider could not complete the publish request."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="w-full flex gap-3 pt-1">
                    <button
                      onClick={handleDeploy}
                      className="flex-1 py-3.5 bg-indigo-600 text-zinc-100 rounded-2xl font-semibold shadow-lg shadow-indigo-950/20 hover:bg-indigo-500 transition-all cursor-pointer active:scale-95"
                    >
                      Retry
                    </button>

                    <button
                      onClick={() => setStep('select')}
                      className="flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 text-zinc-200 rounded-2xl font-semibold transition-colors cursor-pointer active:scale-95"
                    >
                      Change Provider
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
