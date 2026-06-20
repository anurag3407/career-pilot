import React, { useState, useEffect } from 'react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import { GitPullRequest, Loader2, RefreshCw, Copy, Check, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

const ContributionGuide = () => {
  const { sessionId } = useProjectVisualizerStore();
  const [guide, setGuide] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchGuide = async () => {
    setIsLoading(true);
    try {
      const data = await projectVisualizerApi.getContributionGuide(sessionId);
      if (data && data.guide) {
        setGuide(data.guide);
      } else {
        toast.error('Invalid response format');
      }
    } catch (e) {
      toast.error('Failed to generate contribution guide');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!guide && !isLoading) {
      fetchGuide();
    }
  }, []);

  const handleCopy = () => {
    if (!guide) return;
    navigator.clipboard.writeText(guide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    if (!guide) return;
    const blob = new Blob([guide], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CONTRIBUTING.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Generating Contribution Guide</h2>
        <p className="text-slate-400 max-w-md text-center">
          Analyzing project architecture, README, and open issues to create a customized onboarding guide...
        </p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <GitPullRequest className="w-16 h-16 text-slate-500 mb-4" />
        <p className="text-slate-400 mb-4">No contribution guide available.</p>
        <button 
          onClick={fetchGuide}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Generate Guide
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-12">
      <div className="flex items-center justify-between bg-[#0a0f1c] border border-white/10 rounded-2xl p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <GitPullRequest className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Project Contribution Guide</h2>
            <p className="text-sm text-slate-400">AI-generated onboarding documentation</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchGuide}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-sm font-medium"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            Copy
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors text-sm font-bold"
          >
            <Download className="w-4 h-4" />
            Download .md
          </button>
        </div>
      </div>

      <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-8 prose prose-invert prose-emerald max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-headings:text-slate-200 prose-a:text-emerald-400">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {guide}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default ContributionGuide;
