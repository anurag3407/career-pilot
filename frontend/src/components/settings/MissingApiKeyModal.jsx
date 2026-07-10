import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, X, Settings } from 'lucide-react';
import { apiEvents } from '../../services/api';

export default function MissingApiKeyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMissingKey = () => {
      setIsOpen(true);
    };

    apiEvents.addEventListener('missingApiKey', handleMissingKey);
    return () => {
      apiEvents.removeEventListener('missingApiKey', handleMissingKey);
    };
  }, []);

  const handleGoToSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3 text-primary">
                  <KeyRound className="w-6 h-6" />
                  <h2 className="text-lg font-bold">API Key Required</h2>
                </div>
                <button type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground mb-6">
                  It looks like you haven't configured an AI Provider. 
                  To use this feature, please configure your API key in the settings.
                </p>

                <div className="flex justify-end gap-3">
                  <button type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button type="button"
                    onClick={handleGoToSettings}
                    className="flex items-center gap-2 px-5 py-2 font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg hover:shadow-primary/25"
                  >
                    <Settings className="w-4 h-4" />
                    Go to Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
