import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIConfigStore, PROVIDER_META } from '../stores/useAIConfigStore';
import { Sparkles, ChevronDown, Check, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIProviderSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const activeProviderId = useAIConfigStore((s) => s.activeProvider);
  const providers = useAIConfigStore((s) => s.providers);
  const setActiveProvider = useAIConfigStore((s) => s.setActiveProvider);
  const containerRef = useRef(null);

  // Get only validated providers
  const validatedProviders = Object.entries(providers)
    .filter(([_, data]) => data.validated)
    .map(([id]) => id);

  const activeMeta = activeProviderId ? PROVIDER_META[activeProviderId] : null;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border hover:bg-accent text-foreground transition-all"
        aria-label="Select AI Provider"
      >
        <span className="flex items-center justify-center w-5 h-5 text-indigo-400">
          {activeMeta ? activeMeta.icon : <Sparkles className="w-4 h-4" />}
        </span>
        <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">
          {activeMeta ? activeMeta.name : 'AI Setup'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+8px)] w-56 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active AI Provider
              </span>
            </div>

            <div className="py-1 max-h-[60vh] overflow-y-auto">
              {validatedProviders.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-20" />
                  No providers configured.
                </div>
              ) : (
                validatedProviders.map((id) => {
                  const meta = PROVIDER_META[id];
                  const isActive = id === activeProviderId;
                  
                  return (
                    <button type="button"
                      key={id}
                      onClick={() => {
                        setActiveProvider(id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg w-5 flex justify-center">{meta.icon}</span>
                        <span>{meta.name}</span>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>

            <div className="border-t border-border p-1 bg-muted/20">
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm rounded-lg"
              >
                <Settings className="w-4 h-4" />
                Manage API Keys
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
