import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Mail, CheckCircle2, AlertCircle, Globe, ArrowRight } from 'lucide-react';
import { getSocket } from '../services/socket';
import OutreachDraftCard from '../components/OutreachDraftCard';
import { useAuth } from '../hooks/useAuth';
import ReportBugModal from '../components/ReportBugModal';


const Outreach = () => {
    const [companyUrl, setCompanyUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle, processing, completed, failed
    const [statusMessage, setStatusMessage] = useState('');
    const [drafts, setDrafts] = useState([]);
    const [error, setError] = useState(null);
    const [isBugModalOpen, setIsBugModalOpen] = useState(false);
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


    const OutreachSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>

        <div className="space-y-4">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
    </div>
    );
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">AI Cold Outreach Assistant</h1>
                <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                    Submit a company website, and we'll research their mission and analyze your resume to craft personalized outreach messages.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-6 sm:p-8">
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
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'processing' || !companyUrl}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {status === 'processing' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Generate
                                    <ArrowRight className="ml-2 w-5 h-5" />
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
                        <OutreachSkeleton />
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
                        <p className="text-red-700">{error}</p>
                        <button 
                            onClick={() => setStatus('idle')}
                            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                                type="button"
                                onClick={() => setIsBugModalOpen(true)}
                               className="mt-4 ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Report Issue
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
                        <div className="flex items-center justify-center gap-2 text-green-600 mb-6 bg-green-50 py-3 rounded-lg border border-green-100">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-medium">Successfully generated personalized outreach drafts!</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <ReportBugModal
                    isOpen={isBugModalOpen}
                    onClose={() => setIsBugModalOpen(false)}
                />
        </div>
    );
};

export default Outreach;
