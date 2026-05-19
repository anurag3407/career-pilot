import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Copy, Check, ExternalLink, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const PROVIDERS = [
  { id: 'github', name: 'GitHub Pages', desc: 'Deploy to your GitHub account repository free.', icon: '⚡' },
  { id: 'cloudflare', name: 'Cloudflare Pages', desc: 'Fast, secure hosting with global CDN.', icon: '☁️' },
  { id: 'netlify', name: 'Netlify', desc: 'Instant serverless deploys and form handling.', icon: '◈' }
];

const LOADING_STATUSES = [
  "Initializing deployment environment...",
  "Compiling portfolio assets and templates...",
  "Generating sitemap and metadata...",
  "Uploading files to edge networks...",
  "Finalizing configuration..."
];

/**
 * DeployModal Component.
 * Renders a multi-state dialog supporting target provider selection,
 * build loading indicators, celebratory success confetti, and copy-link triggers.
 *
 * @param {Object} props - The component properties.
 * @param {boolean} props.isOpen - Dictates whether the modal is visible.
 * @param {Function} props.onClose - Triggered when closing the modal window.
 * @param {string} [props.portfolioTitle] - The stable target portfolio title.
 * @returns {JSX.Element|null} The rendered component node or null.
 */
export default function DeployModal({ isOpen, onClose, portfolioTitle = "My Portfolio" }) {
  const [step, setStep] = useState('select'); // 'select', 'loading', 'success', 'error'
  const [selectedProvider, setSelectedProvider] = useState('github');
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [deployedUrl, setDeployedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const statusTimerRef = useRef(null);
  const confettiIntervalRef = useRef(null);
  const deployTimeoutRef = useRef(null);

  // Clear timers/confetti on unmount
  useEffect(() => {
    return () => {
      if (statusTimerRef.current) clearInterval(statusTimerRef.current);
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
      if (deployTimeoutRef.current) clearTimeout(deployTimeoutRef.current);
      confetti.reset();
    };
  }, []);

  // Handle auto-updating status text during loading
  useEffect(() => {
    if (step === 'loading') {
      setLoadingStatusIndex(0);
      statusTimerRef.current = setInterval(() => {
        setLoadingStatusIndex((prev) => {
          if (prev < LOADING_STATUSES.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 800);
    } else {
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
        statusTimerRef.current = null;
      }
    }
  }, [step]);

  /**
   * Triggers a smooth, high-performance canvas-confetti burst animation.
   * Fires multi-directional bursts for exactly 3 seconds and clears cleanly.
   * @returns {void}
   */
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    confettiIntervalRef.current = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  /**
   * Initiates the portfolio deployment simulation sequence.
   * Updates state to loading and schedules success/error transitions.
   * @returns {void}
   */
  const handleDeploy = () => {
    setStep('loading');
    
    // Simulate deployment process (3.5 seconds)
    deployTimeoutRef.current = setTimeout(() => {
      // Simulate success/failure randomly (90% success rate for simulation)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        const username = "user" + Math.floor(Math.random() * 1000);
        const slug = portfolioTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const url = selectedProvider === 'github'
          ? `https://${username}.github.io/${slug}`
          : selectedProvider === 'cloudflare'
            ? `https://${slug}.pages.dev`
            : `https://${slug}.netlify.app`;
            
        setDeployedUrl(url);
        setStep('success');
        triggerConfetti();
        toast.success('Congratulations! Portfolio is live! 🎉');
      } else {
        setErrorMessage('Failed to establish connection to the deployment server. Please check your credentials or API keys.');
        setStep('error');
        toast.error('Deployment failed.');
      }
    }, 3500);
  };

  /**
   * Copies the generated deployed URL directly to the user's clipboard.
   * Triggers a success toast notification and manages copying animation state.
   * @returns {Promise<void>} Resolves when copying finishes.
   */
  const handleCopyLink = async () => {
    if (!deployedUrl) return;
    try {
      await navigator.clipboard.writeText(deployedUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy to clipboard.');
    }
  };

  /**
   * Handles resetting the state and closing the modal.
   * Cancels any active deployment timeouts, status timers, or confetti loops.
   * @returns {void}
   */
  const handleClose = () => {
    // Reset state on close
    setStep('select');
    setDeployedUrl('');
    setErrorMessage('');
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
    if (deployTimeoutRef.current) {
      clearTimeout(deployTimeoutRef.current);
      deployTimeoutRef.current = null;
    }
    confetti.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-5 flex items-center justify-between text-primary-foreground flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Deploy Portfolio</h3>
                <p className="text-xs text-primary-foreground/80 mt-0.5">{portfolioTitle}</p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors cursor-pointer"
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
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  <p className="text-sm text-muted-foreground">
                    Deploy your professionally generated portfolio to your favorite hosting platform with a single click.
                  </p>
                  
                  <div className="space-y-3">
                    {PROVIDERS.map((provider) => {
                      const isSelected = selectedProvider === provider.id;
                      return (
                        <button
                          type="button"
                          key={provider.id}
                          onClick={() => setSelectedProvider(provider.id)}
                          className={`w-full text-left flex items-start gap-4 p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                            isSelected 
                              ? 'bg-primary/5 border-primary shadow-sm' 
                              : 'bg-card border-border hover:border-muted-foreground/30 hover:bg-muted/30'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0 ${
                            isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                            {provider.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground">{provider.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{provider.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                            isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'
                          }`}>
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleDeploy}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-medium shadow-md hover:from-primary/95 hover:to-secondary/95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Deploy to {PROVIDERS.find(p => p.id === selectedProvider)?.name}
                  </button>
                </motion.div>
              )}

              {/* State 2: Loading State */}
              {step === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="py-8 flex flex-col items-center justify-center text-center space-y-5"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-muted border-t-primary animate-spin" />
                    <Loader2 className="w-6 h-6 text-primary absolute animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base text-foreground">Deploying Portfolio</h4>
                    <p className="text-sm text-muted-foreground min-h-6 animate-pulse">
                      {LOADING_STATUSES[loadingStatusIndex]}
                    </p>
                  </div>
                  
                  {/* Custom progress indicator */}
                  <div className="w-full max-w-[240px] bg-muted h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3.5, ease: 'easeInOut' }}
                      className="bg-primary h-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* State 3: Success State */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center space-y-6 py-4"
                >
                  {/* Decorative Sparkle Circle */}
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
                    <Sparkles className="w-8 h-8 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-foreground">Woohoo! Portfolio is Live! 🎉</h4>
                    <p className="text-sm text-muted-foreground px-2">
                      Your stunning personal portfolio has been successfully built and deployed online.
                    </p>
                  </div>

                  {/* URL Display Container */}
                  <div className="w-full bg-muted/60 border border-border/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-left">
                    <span className="text-sm font-medium text-foreground truncate select-all">{deployedUrl}</span>
                    <button
                      onClick={handleCopyLink}
                      className={`p-2 rounded-lg border transition-all flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        copied 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                          : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="w-full grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium shadow-md hover:bg-primary/90 flex items-center justify-center gap-2 select-none"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Portfolio
                    </a>
                    
                    <button
                      onClick={handleClose}
                      className="py-3 px-4 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors cursor-pointer"
                    >
                      Done
                    </button>
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
                  className="flex flex-col items-center text-center space-y-6 py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center text-destructive">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-foreground">Deployment Failed</h4>
                    <p className="text-sm text-muted-foreground px-4">
                      {errorMessage || "An unexpected error occurred while deploying your portfolio."}
                    </p>
                  </div>

                  <div className="w-full flex gap-3 pt-2">
                    <button
                      onClick={handleDeploy}
                      className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-md hover:bg-primary/95 transition-all cursor-pointer"
                    >
                      Retry Deployment
                    </button>
                    
                    <button
                      onClick={() => setStep('select')}
                      className="flex-1 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors cursor-pointer"
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
