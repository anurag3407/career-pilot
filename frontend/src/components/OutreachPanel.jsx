import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Mail, CheckCircle2, AlertCircle, Globe, ArrowRight } from 'lucide-react';
import { getSocket } from '../services/socket';
import OutreachDraftCard from './OutreachDraftCard';
import { useAuth } from '../hooks/useAuth';

export default function OutreachPanel({ companyName, companyUrl: initialCompanyUrl, onClose }) {
  const [companyUrl, setCompanyUrl] = useState(initialCompanyUrl || '');
  const [status, setStatus] = useState('idle'); // idle, processing, completed, failed
  const [statusMessage, setStatusMessage] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState(null);
  const [outreachId, setOutreachId] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const socket = getSocket();

    const handleOutreachProgress = (data) => {
      if (data.outreachId !== outreachId) return;

      setStatusMessage(data.status);

      if (data.status === 'completed') {
        setStatus('completed');
        setDrafts(data.drafts || []);
      } else if (data.status === 'failed') {
        setStatus('failed');
        setError(data.error || 'Failed to generate outreach');
      }
    };

    if (socket) {
      socket.on('outreach_progress', handleOutreachProgress);
    }

    let pollInterval;
    if (outreachId) {
      pollInterval = setInterval(async () => {
        try {
          const token = await getToken();
          const res = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/outreach/${outreachId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.data) {
              if (data.data.status === 'completed') {
                setStatus('completed');
                setDrafts(data.data.drafts || []);
                clearInterval(pollInterval);
              } else if (data.data.status === 'failed') {
                setStatus('failed');
                setError(data.data.error || 'Failed to generate outreach');
                clearInterval(pollInterval);
              } else if (data.data.status === 'analyzing') {
                setStatusMessage('Analyzing resume...');
              } else if (data.data.status === 'generating') {
                setStatusMessage('Generating outreach drafts...');
              } else if (data.data.status === 'researching') {
                setStatusMessage('Researching company...');
              }
            }
          }
        } catch (err) {
          console.error('Failed to poll outreach status:', err);
        }
      }, 2500);
    }

    return () => {
      if (socket) {
        socket.off('outreach_progress', handleOutreachProgress);
      }
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [outreachId, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyUrl) return;

    try {
      setStatus('processing');
      setStatusMessage('Initializing request...');
      setError(null);
      setDrafts([]);

      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE || '/api'}/outreach/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to initialize request');
      }

      setOutreachId(data.data._id);
    } catch (err) {
      setStatus('failed');
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Sidebar Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-3xl h-full bg-background border-l border-border shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">AI Cold Outreach</h3>
                <p className="text-xs text-muted-foreground">{companyName || 'Generate Outreach'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Submit the company website. We'll research their mission and analyze your resume to craft personalized outreach messages.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      required
                      value={companyUrl}
                      onChange={(e) => setCompanyUrl(e.target.value)}
                      disabled={status === 'processing'}
                      placeholder="https://example.com"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'processing' || !companyUrl}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {status === 'processing' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Generate
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {status === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 text-center"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-indigo-900 mb-2">Processing Request</h3>
                  <p className="text-indigo-700 text-sm">{statusMessage}</p>
                </motion.div>
              )}

              {status === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center"
                >
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-900 mb-2">Generation Failed</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {status === 'completed' && drafts.length > 0 && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-lg border border-green-100 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">Successfully generated personalized outreach drafts!</span>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {drafts.map((draft, idx) => (
                      <OutreachDraftCard
                        key={idx}
                        style={draft.style}
                        subjectLine={draft.subjectLine}
                        content={draft.content}
                      />
                    ))}
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
